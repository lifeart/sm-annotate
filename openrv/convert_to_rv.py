#!/usr/bin/env python3
"""
OpenRV GTO Exporter for sm-annotate

Converts sm-annotate JSON annotation files to OpenRV .rv (GTO text format).

Usage:
    python convert_to_rv.py input.json output.rv --media /path/to/video.mp4 --width 1920 --height 1080

The input JSON should be an array of FrameAnnotationV1 objects:
[
    {
        "frame": 1,
        "fps": 25,
        "version": 1,
        "shapes": [...]
    },
    ...
]

Supported shape types:
- curve: Freehand strokes with points array
- line: Two-point lines (x1, y1, x2, y2)
- arrow: Lines with arrowheads
- rectangle: Rectangular shapes (x, y, width, height)
- circle: Circular shapes (x, y, radius)
- text: Text annotations (x, y, text)

Coordinate conversion:
- sm-annotate: (0,0) top-left, X: 0-1, Y: 0-1 (Y+ down)
- OpenRV NDC: (0,0) center, X: -1 to +1, Y: -1 to +1 (Y+ up)
"""

import argparse
import json
import math
import sys
from typing import Any, Dict, List, Optional, Tuple


def hex_to_rgba(hex_color: str, opacity: float = 1.0) -> Tuple[float, float, float, float]:
    """Convert hex color string to RGBA float tuple [r, g, b, a]."""
    clean_hex = hex_color.lstrip('#')

    r, g, b = 0.0, 0.0, 0.0

    if len(clean_hex) == 3:
        # Short form #RGB
        r = int(clean_hex[0] * 2, 16) / 255
        g = int(clean_hex[1] * 2, 16) / 255
        b = int(clean_hex[2] * 2, 16) / 255
    elif len(clean_hex) == 6:
        # Full form #RRGGBB
        r = int(clean_hex[0:2], 16) / 255
        g = int(clean_hex[2:4], 16) / 255
        b = int(clean_hex[4:6], 16) / 255
    elif len(clean_hex) == 8:
        # With alpha #RRGGBBAA
        r = int(clean_hex[0:2], 16) / 255
        g = int(clean_hex[2:4], 16) / 255
        b = int(clean_hex[4:6], 16) / 255
        opacity = int(clean_hex[6:8], 16) / 255

    return (r, g, b, opacity)


def extract_color(style: str, opacity: float = 1.0) -> Tuple[float, float, float, float]:
    """Extract color from strokeStyle/fillStyle string."""
    if style.startswith('rgb'):
        # Handle rgb/rgba format
        import re
        match = re.match(r'rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)', style)
        if match:
            return (
                int(match.group(1)) / 255,
                int(match.group(2)) / 255,
                int(match.group(3)) / 255,
                float(match.group(4)) if match.group(4) else opacity
            )
    return hex_to_rgba(style, opacity)


def convert_sm_to_openrv(sm_x: float, sm_y: float) -> Tuple[float, float]:
    """
    Convert sm-annotate coordinates to OpenRV NDC.

    sm-annotate: (0,0) top-left, X: 0-1, Y: 0-1 (Y+ down)
    OpenRV NDC: (0,0) center, X: -1 to +1, Y: -1 to +1 (Y+ up)
    """
    return (
        sm_x * 2 - 1,
        1 - sm_y * 2
    )


def rotate_point(x: float, y: float, center_x: float, center_y: float, angle: float) -> Tuple[float, float]:
    """Rotate a point around a center by given angle (radians)."""
    cos_a = math.cos(angle)
    sin_a = math.sin(angle)
    dx = x - center_x
    dy = y - center_y
    return (
        center_x + dx * cos_a - dy * sin_a,
        center_y + dx * sin_a + dy * cos_a
    )


def apply_rotation(points: List[Dict[str, float]], shape: Dict, default_center_x: float, default_center_y: float) -> List[Dict[str, float]]:
    """Apply rotation to points if shape has rotation."""
    rotation = shape.get('rotation', 0)
    if not rotation:
        return points

    center_x = shape.get('rotationCenterX', default_center_x)
    center_y = shape.get('rotationCenterY', default_center_y)

    result = []
    for p in points:
        rx, ry = rotate_point(p['x'], p['y'], center_x, center_y, rotation)
        result.append({'x': rx, 'y': ry})
    return result


def format_number(n: float) -> str:
    """Format a number for GTO output."""
    if n == int(n):
        return str(int(n))
    # Use reasonable precision
    formatted = f"{n:.9f}".rstrip('0').rstrip('.')
    return formatted if formatted else '0'


def format_float_array(arr: List[float]) -> str:
    """Format a float array for GTO output (nested format)."""
    return f"[ [ {' '.join(format_number(n) for n in arr)} ] ]"


def format_flat_array(arr: List[float]) -> str:
    """Format a simple flat array for GTO output."""
    return f"[ {' '.join(format_number(n) for n in arr)} ]"


def format_points(points: List[Dict[str, float]]) -> str:
    """Format points array for GTO (nested array of x y pairs)."""
    pairs = []
    for p in points:
        ox, oy = convert_sm_to_openrv(p['x'], p['y'])
        pairs.append(f"[ {format_number(ox)} {format_number(oy)} ]")
    return f"[ {' '.join(pairs)} ]"


class GTOComponent:
    """Represents a GTO component (pen or text annotation)."""

    def __init__(self, name: str, properties: List[Dict[str, Any]]):
        self.name = name
        self.properties = properties

    def format(self) -> str:
        """Format component to GTO string."""
        lines = [f'    {self.name}', '    {']
        for prop in self.properties:
            type_str = f"{prop['type']}[{prop['dimensions']}]" if 'dimensions' in prop else prop['type']
            value_str = prop['value'] if isinstance(prop['value'], str) else str(prop['value'])
            lines.append(f"        {type_str} {prop['name']} = {value_str}")
        lines.append('    }')
        return '\n'.join(lines)


def curve_to_component(shape: Dict, id: int, frame: int, width: int, height: int) -> GTOComponent:
    """Convert curve shape to OpenRV pen component."""
    color = extract_color(shape.get('strokeStyle', '#000000'), shape.get('opacity', 1))
    points = shape.get('points', [])

    if not points:
        return None

    # Calculate center for rotation
    center_x = sum(p['x'] for p in points) / len(points)
    center_y = sum(p['y'] for p in points) / len(points)

    points = apply_rotation(points, shape, center_x, center_y)

    # Normalized width (relative to height)
    line_width = shape.get('lineWidth', 2)
    normalized_width = line_width / height
    width_array = [normalized_width] * len(points)

    return GTOComponent(
        f'"pen:{id}:{frame}:User"',
        [
            {'type': 'float', 'dimensions': 4, 'name': 'color', 'value': format_float_array(list(color))},
            {'type': 'float', 'name': 'width', 'value': format_flat_array(width_array)},
            {'type': 'string', 'name': 'brush', 'value': '"circle"'},
            {'type': 'float', 'dimensions': 2, 'name': 'points', 'value': format_points(points)},
            {'type': 'int', 'name': 'debug', 'value': 0},
            {'type': 'int', 'name': 'join', 'value': 3},
            {'type': 'int', 'name': 'cap', 'value': 1},
            {'type': 'int', 'name': 'splat', 'value': 0},
        ]
    )


def line_to_component(shape: Dict, id: int, frame: int, width: int, height: int) -> GTOComponent:
    """Convert line shape to OpenRV pen component (2-point curve)."""
    color = extract_color(shape.get('strokeStyle', '#000000'), shape.get('opacity', 1))

    # Center is midpoint of line
    center_x = (shape['x1'] + shape['x2']) / 2
    center_y = (shape['y1'] + shape['y2']) / 2

    points = [
        {'x': shape['x1'], 'y': shape['y1']},
        {'x': shape['x2'], 'y': shape['y2']}
    ]
    points = apply_rotation(points, shape, center_x, center_y)

    line_width = shape.get('lineWidth', 2)
    normalized_width = line_width / height
    width_array = [normalized_width] * len(points)

    return GTOComponent(
        f'"pen:{id}:{frame}:User"',
        [
            {'type': 'float', 'dimensions': 4, 'name': 'color', 'value': format_float_array(list(color))},
            {'type': 'float', 'name': 'width', 'value': format_flat_array(width_array)},
            {'type': 'string', 'name': 'brush', 'value': '"circle"'},
            {'type': 'float', 'dimensions': 2, 'name': 'points', 'value': format_points(points)},
            {'type': 'int', 'name': 'debug', 'value': 0},
            {'type': 'int', 'name': 'join', 'value': 3},
            {'type': 'int', 'name': 'cap', 'value': 1},
            {'type': 'int', 'name': 'splat', 'value': 0},
        ]
    )


def arrow_to_components(shape: Dict, id: int, frame: int, width: int, height: int) -> List[GTOComponent]:
    """Convert arrow shape to OpenRV pen components (line + arrowhead strokes)."""
    color = extract_color(shape.get('strokeStyle', '#000000'), shape.get('opacity', 1))
    color_str = format_float_array(list(color))

    # Center is midpoint of arrow line
    center_x = (shape['x1'] + shape['x2']) / 2
    center_y = (shape['y1'] + shape['y2']) / 2

    line_width = shape.get('lineWidth', 2)

    # Main line
    line_points = [
        {'x': shape['x1'], 'y': shape['y1']},
        {'x': shape['x2'], 'y': shape['y2']}
    ]

    # Arrowhead calculation - normalize to coordinate system (0-1)
    # head_length in pixels, normalize by average of width/height
    head_length_px = 10 + 2.5 * line_width
    head_length = head_length_px / ((width + height) / 2)
    head_angle = math.pi / 6
    angle = math.atan2(shape['y2'] - shape['y1'], shape['x2'] - shape['x1'])

    arrow_head1 = [
        {'x': shape['x2'], 'y': shape['y2']},
        {
            'x': shape['x2'] - head_length * math.cos(angle + head_angle),
            'y': shape['y2'] - head_length * math.sin(angle + head_angle)
        }
    ]

    arrow_head2 = [
        {'x': shape['x2'], 'y': shape['y2']},
        {
            'x': shape['x2'] - head_length * math.cos(angle - head_angle),
            'y': shape['y2'] - head_length * math.sin(angle - head_angle)
        }
    ]

    # Apply rotation
    line_points = apply_rotation(line_points, shape, center_x, center_y)
    arrow_head1 = apply_rotation(arrow_head1, shape, center_x, center_y)
    arrow_head2 = apply_rotation(arrow_head2, shape, center_x, center_y)

    normalized_width = line_width / height
    width_array2 = [normalized_width, normalized_width]

    return [
        GTOComponent(
            f'"pen:{id}:{frame}:User"',
            [
                {'type': 'float', 'dimensions': 4, 'name': 'color', 'value': color_str},
                {'type': 'float', 'name': 'width', 'value': format_flat_array(width_array2)},
                {'type': 'string', 'name': 'brush', 'value': '"circle"'},
                {'type': 'float', 'dimensions': 2, 'name': 'points', 'value': format_points(line_points)},
                {'type': 'int', 'name': 'debug', 'value': 0},
                {'type': 'int', 'name': 'join', 'value': 3},
                {'type': 'int', 'name': 'cap', 'value': 1},
                {'type': 'int', 'name': 'splat', 'value': 0},
            ]
        ),
        GTOComponent(
            f'"pen:{id + 1}:{frame}:User"',
            [
                {'type': 'float', 'dimensions': 4, 'name': 'color', 'value': color_str},
                {'type': 'float', 'name': 'width', 'value': format_flat_array(width_array2)},
                {'type': 'string', 'name': 'brush', 'value': '"circle"'},
                {'type': 'float', 'dimensions': 2, 'name': 'points', 'value': format_points(arrow_head1)},
                {'type': 'int', 'name': 'debug', 'value': 0},
                {'type': 'int', 'name': 'join', 'value': 3},
                {'type': 'int', 'name': 'cap', 'value': 1},
                {'type': 'int', 'name': 'splat', 'value': 0},
            ]
        ),
        GTOComponent(
            f'"pen:{id + 2}:{frame}:User"',
            [
                {'type': 'float', 'dimensions': 4, 'name': 'color', 'value': color_str},
                {'type': 'float', 'name': 'width', 'value': format_flat_array(width_array2)},
                {'type': 'string', 'name': 'brush', 'value': '"circle"'},
                {'type': 'float', 'dimensions': 2, 'name': 'points', 'value': format_points(arrow_head2)},
                {'type': 'int', 'name': 'debug', 'value': 0},
                {'type': 'int', 'name': 'join', 'value': 3},
                {'type': 'int', 'name': 'cap', 'value': 1},
                {'type': 'int', 'name': 'splat', 'value': 0},
            ]
        )
    ]


def rectangle_to_component(shape: Dict, id: int, frame: int, width: int, height: int) -> GTOComponent:
    """Convert rectangle shape to OpenRV pen component (5-point closed path)."""
    color = extract_color(shape.get('strokeStyle', '#000000'), shape.get('opacity', 1))

    # Center is center of rectangle
    center_x = shape['x'] + shape['width'] / 2
    center_y = shape['y'] + shape['height'] / 2

    # Convert rectangle to 5 points (closed path)
    points = [
        {'x': shape['x'], 'y': shape['y']},
        {'x': shape['x'] + shape['width'], 'y': shape['y']},
        {'x': shape['x'] + shape['width'], 'y': shape['y'] + shape['height']},
        {'x': shape['x'], 'y': shape['y'] + shape['height']},
        {'x': shape['x'], 'y': shape['y']},  # Close the path
    ]
    points = apply_rotation(points, shape, center_x, center_y)

    line_width = shape.get('lineWidth', 2)
    normalized_width = line_width / height
    width_array = [normalized_width] * len(points)

    return GTOComponent(
        f'"pen:{id}:{frame}:User"',
        [
            {'type': 'float', 'dimensions': 4, 'name': 'color', 'value': format_float_array(list(color))},
            {'type': 'float', 'name': 'width', 'value': format_flat_array(width_array)},
            {'type': 'string', 'name': 'brush', 'value': '"circle"'},
            {'type': 'float', 'dimensions': 2, 'name': 'points', 'value': format_points(points)},
            {'type': 'int', 'name': 'debug', 'value': 0},
            {'type': 'int', 'name': 'join', 'value': 3},
            {'type': 'int', 'name': 'cap', 'value': 1},
            {'type': 'int', 'name': 'splat', 'value': 0},
        ]
    )


def circle_to_component(shape: Dict, id: int, frame: int, width: int, height: int, segments: int = 32) -> GTOComponent:
    """Convert circle shape to OpenRV pen component (approximated as polygon)."""
    color = extract_color(shape.get('strokeStyle', '#000000'), shape.get('opacity', 1))

    # Center is center of circle
    center_x = shape['x']
    center_y = shape['y']
    radius = shape['radius']

    # Approximate circle with polygon
    points = []
    for i in range(segments + 1):
        angle = (i / segments) * math.pi * 2
        points.append({
            'x': center_x + math.cos(angle) * radius,
            'y': center_y + math.sin(angle) * radius
        })

    points = apply_rotation(points, shape, center_x, center_y)

    line_width = shape.get('lineWidth', 2)
    normalized_width = line_width / height
    width_array = [normalized_width] * len(points)

    return GTOComponent(
        f'"pen:{id}:{frame}:User"',
        [
            {'type': 'float', 'dimensions': 4, 'name': 'color', 'value': format_float_array(list(color))},
            {'type': 'float', 'name': 'width', 'value': format_flat_array(width_array)},
            {'type': 'string', 'name': 'brush', 'value': '"circle"'},
            {'type': 'float', 'dimensions': 2, 'name': 'points', 'value': format_points(points)},
            {'type': 'int', 'name': 'debug', 'value': 0},
            {'type': 'int', 'name': 'join', 'value': 3},
            {'type': 'int', 'name': 'cap', 'value': 1},
            {'type': 'int', 'name': 'splat', 'value': 0},
        ]
    )


def text_to_component(shape: Dict, id: int, frame: int, width: int, height: int) -> GTOComponent:
    """Convert text shape to OpenRV text component."""
    color = extract_color(shape.get('fillStyle', '#000000'), shape.get('opacity', 1))

    # Apply rotation to position if set
    pos_x = shape['x']
    pos_y = shape['y']
    text_rotation = 0

    rotation = shape.get('rotation', 0)
    if rotation:
        center_x = shape.get('rotationCenterX', shape['x'])
        center_y = shape.get('rotationCenterY', shape['y'])
        pos_x, pos_y = rotate_point(pos_x, pos_y, center_x, center_y, rotation)
        # OpenRV text rotation is in degrees
        text_rotation = rotation * 180 / math.pi

    # Convert position to OpenRV coordinates
    openrv_x, openrv_y = convert_sm_to_openrv(pos_x, pos_y)

    # Font size: OpenRV uses normalized size (relative to height)
    line_width = shape.get('lineWidth', 1)
    font_size = 16 + line_width * 0.5
    normalized_size = font_size / height

    # Escape text content
    text_content = shape.get('text', '').replace('"', '\\"').replace('\n', '\\n')

    return GTOComponent(
        f'"text:{id}:{frame}:User"',
        [
            {'type': 'float', 'dimensions': 2, 'name': 'position', 'value': format_float_array([openrv_x, openrv_y])},
            {'type': 'float', 'dimensions': 4, 'name': 'color', 'value': format_float_array(list(color))},
            {'type': 'float', 'name': 'spacing', 'value': 0.8},
            {'type': 'float', 'name': 'size', 'value': normalized_size},
            {'type': 'float', 'name': 'scale', 'value': 1},
            {'type': 'float', 'name': 'rotation', 'value': text_rotation},
            {'type': 'string', 'name': 'font', 'value': '""'},
            {'type': 'string', 'name': 'text', 'value': f'"{text_content}"'},
            {'type': 'string', 'name': 'origin', 'value': '""'},
            {'type': 'int', 'name': 'debug', 'value': 0},
        ]
    )


def shape_to_components(shape: Dict, id: int, frame: int, width: int, height: int) -> List[GTOComponent]:
    """Convert a shape to GTO components."""
    shape_type = shape.get('type', '')

    if shape_type == 'curve':
        comp = curve_to_component(shape, id, frame, width, height)
        return [comp] if comp else []
    elif shape_type == 'line':
        return [line_to_component(shape, id, frame, width, height)]
    elif shape_type == 'arrow':
        return arrow_to_components(shape, id, frame, width, height)
    elif shape_type == 'rectangle':
        return [rectangle_to_component(shape, id, frame, width, height)]
    elif shape_type == 'circle':
        return [circle_to_component(shape, id, frame, width, height)]
    elif shape_type == 'text':
        return [text_to_component(shape, id, frame, width, height)]
    # Skip non-visual shapes
    elif shape_type in ('eraser', 'move', 'image', 'compare', 'audio-peaks', 'selection'):
        return []
    else:
        return []


def export_to_openrv(frames: List[Dict], media_path: str, width: int, height: int, session_name: str = 'sm-annotate-session') -> str:
    """Export annotations to OpenRV GTO format string."""
    lines = []

    # GTO Header
    lines.append('GTOa (4)')
    lines.append('')
    lines.append('# Generated by sm-annotate OpenRV exporter (Python)')
    lines.append(f'# Media: {media_path}')
    lines.append(f'# Resolution: {width}x{height}')
    lines.append('')

    # RVSession object
    lines.append('RVSession : RVSession (4)')
    lines.append('{')
    lines.append('    session')
    lines.append('    {')
    lines.append(f'        string name = "{session_name}"')
    lines.append('        int version = 4')
    lines.append('    }')
    lines.append('}')
    lines.append('')

    # RVSourceGroup for media
    lines.append('sourceGroup000000_source : RVFileSource (1)')
    lines.append('{')
    lines.append('    media')
    lines.append('    {')
    lines.append(f'        string movie = "{media_path}"')
    lines.append('    }')
    lines.append('    request')
    lines.append('    {')
    lines.append(f'        int width = {width}')
    lines.append(f'        int height = {height}')
    lines.append('    }')
    lines.append('}')
    lines.append('')

    # Collect all paint components
    components: List[GTOComponent] = []
    next_id = 0

    for frame_data in frames:
        frame = frame_data.get('frame', 1)
        shapes = frame_data.get('shapes', [])

        for shape in shapes:
            shape_components = shape_to_components(shape, next_id, frame, width, height)
            components.extend(shape_components)
            next_id += len(shape_components)

    if components:
        # Build frame order map
        frame_orders: Dict[int, List[str]] = {}
        for comp in components:
            # Extract frame number from component name: "type:ID:FRAME:User"
            import re
            match = re.search(r':(\d+):(\d+):', comp.name)
            if match:
                frame = int(match.group(2))
                if frame not in frame_orders:
                    frame_orders[frame] = []
                # Store inner name without outer quotes
                inner_name = comp.name.strip('"')
                frame_orders[frame].append(inner_name)

        # RVPaint node
        lines.append('sourceGroup000000_paint : RVPaint (3)')
        lines.append('{')
        lines.append('    paint')
        lines.append('    {')
        lines.append(f'        int nextId = {next_id}')
        lines.append('        int nextAnnotationId = 0')
        lines.append('        int show = 1')
        lines.append('        string exclude = [ ]')
        lines.append('        string include = [ ]')
        lines.append('    }')

        # Add all shape components
        for component in components:
            lines.append(component.format())

        # Add frame order components
        for frame, order in sorted(frame_orders.items()):
            lines.append(f'    "frame:{frame}"')
            lines.append('    {')
            order_str = ' '.join(f'"{o}"' for o in order)
            lines.append(f'        string order = [ {order_str} ]')
            lines.append('    }')

        lines.append('}')

    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(
        description='Convert sm-annotate JSON annotations to OpenRV .rv format',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Example:
    python convert_to_rv.py annotations.json output.rv --media /path/to/video.mp4 --width 1920 --height 1080

The input JSON should be an array of frame annotations:
[
    {
        "frame": 1,
        "fps": 25,
        "version": 1,
        "shapes": [
            {"type": "curve", "points": [...], "strokeStyle": "#ff0000", "lineWidth": 2},
            {"type": "text", "x": 0.5, "y": 0.5, "text": "Hello", "fillStyle": "#ffffff"}
        ]
    }
]
'''
    )

    parser.add_argument('input', help='Input JSON file with sm-annotate annotations')
    parser.add_argument('output', help='Output .rv file path')
    parser.add_argument('--media', '-m', required=True, help='Path to source media file (used in .rv file)')
    parser.add_argument('--width', '-W', type=int, default=1920, help='Media width in pixels (default: 1920)')
    parser.add_argument('--height', '-H', type=int, default=1080, help='Media height in pixels (default: 1080)')
    parser.add_argument('--session', '-s', default='sm-annotate-session', help='Session name (default: sm-annotate-session)')

    args = parser.parse_args()

    # Read input JSON
    try:
        with open(args.input, 'r', encoding='utf-8') as f:
            frames = json.load(f)
    except FileNotFoundError:
        print(f"Error: Input file '{args.input}' not found", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in input file: {e}", file=sys.stderr)
        sys.exit(1)

    # Validate input
    if not isinstance(frames, list):
        print("Error: Input JSON must be an array of frame annotations", file=sys.stderr)
        sys.exit(1)

    # Convert to OpenRV format
    rv_content = export_to_openrv(
        frames,
        args.media,
        args.width,
        args.height,
        args.session
    )

    # Write output
    try:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(rv_content)
        print(f"Successfully converted {len(frames)} frames to {args.output}")
    except IOError as e:
        print(f"Error: Could not write output file: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
