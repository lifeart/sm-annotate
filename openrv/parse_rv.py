#!/usr/bin/env python3
"""
OpenRV GTO Parser for sm-annotate

Parses OpenRV .rv (GTO text format) files and converts annotations
to sm-annotate JSON format.

Usage:
    python parse_rv.py input.rv output.json [--fps 25] [--width 1920] [--height 1080]

Supported component types:
- pen:N:F:user - Freehand strokes (curves)
- text:N:F:user - Text annotations

Coordinate conversion:
- OpenRV NDC: (0,0) center, X: -1 to +1, Y: -1 to +1 (Y+ up)
- sm-annotate: (0,0) top-left, X: 0-1, Y: 0-1 (Y+ down)
"""

import argparse
import json
import re
import sys
from typing import Any, Dict, List, Optional, Tuple


def rgba_to_hex(rgba: List[float]) -> str:
    """Convert RGBA float array [r, g, b, a] to hex color string."""
    if len(rgba) < 3:
        return '#000000'

    r = round(rgba[0] * 255)
    g = round(rgba[1] * 255)
    b = round(rgba[2] * 255)

    return f'#{r:02x}{g:02x}{b:02x}'


def parse_property_value(value_str: str, prop_type: str) -> Any:
    """Parse a GTO property value from string."""
    value_str = value_str.strip()

    # Handle array values [ ... ]
    if value_str.startswith('[') and value_str.endswith(']'):
        inner = value_str[1:-1].strip()

        # Empty array
        if inner == '':
            return []

        # Handle string arrays
        if prop_type == 'string':
            matches = re.findall(r'"([^"\\]|\\.)*"', inner)
            if matches:
                result = []
                for s in matches:
                    # Remove quotes and unescape
                    unescaped = s[1:-1].replace('\\"', '"').replace('\\n', '\n')
                    result.append(unescaped)
                return result
            return []

        # Check for nested arrays format: [ [ x y ] [ x y ] ]
        if '[' in inner:
            # Extract all numbers from nested structure
            numbers = []
            num_matches = re.findall(r'-?\d+\.?\d*(?:e[+-]?\d+)?', inner, re.IGNORECASE)
            for num in num_matches:
                numbers.append(float(num))
            return numbers

        # Handle flat numeric arrays
        parts = inner.split()
        numbers = []
        for part in parts:
            try:
                numbers.append(float(part))
            except ValueError:
                pass
        return numbers

    # Handle string values "..."
    if value_str.startswith('"') and value_str.endswith('"'):
        return value_str[1:-1].replace('\\"', '"').replace('\\n', '\n')

    # Handle numeric values
    try:
        if '.' in value_str or 'e' in value_str.lower():
            return float(value_str)
        return int(value_str)
    except ValueError:
        return value_str


class GTOObject:
    """Represents a GTO object with components."""

    def __init__(self, name: str, protocol: str, version: int):
        self.name = name
        self.protocol = protocol
        self.version = version
        self.components: Dict[str, Dict[str, Any]] = {}


def parse_gto_text(content: str) -> List[GTOObject]:
    """Parse GTO text content into objects."""
    objects: List[GTOObject] = []
    lines = content.split('\n')
    current_object: Optional[GTOObject] = None
    current_component: Optional[str] = None
    brace_depth = 0

    for line in lines:
        line = line.strip()

        # Skip empty lines and comments
        if line == '' or line.startswith('#') or line == 'GTOa (4)':
            continue

        # Object declaration: ObjectName : Protocol (Version)
        object_match = re.match(r'^(\S+)\s*:\s*(\S+)\s*\((\d+)\)\s*$', line)
        if object_match and brace_depth == 0:
            current_object = GTOObject(
                object_match.group(1),
                object_match.group(2),
                int(object_match.group(3))
            )
            objects.append(current_object)
            continue

        # Opening brace
        if line == '{':
            brace_depth += 1
            continue

        # Closing brace
        if line == '}':
            brace_depth -= 1
            if brace_depth == 1:
                current_component = None
            if brace_depth == 0:
                current_object = None
            continue

        # Inside an object
        if current_object and brace_depth >= 1:
            # Component name - can be quoted or unquoted
            if brace_depth == 1:
                # Check for quoted component name: "something"
                quoted_match = re.match(r'^"([^"]+)"$', line)
                if quoted_match:
                    current_component = quoted_match.group(1)
                    if current_component not in current_object.components:
                        current_object.components[current_component] = {}
                    continue

                # Unquoted component name (no assignment, no brackets)
                if '=' not in line and '[' not in line:
                    current_component = line
                    if current_component not in current_object.components:
                        current_object.components[current_component] = {}
                    continue

            # Property assignment: type[dims] name = value
            prop_match = re.match(r'^(\w+)(?:\[([^\]]*)\])?\s+(\w+)\s*=\s*(.+)$', line)
            if prop_match and current_component:
                prop_type = prop_match.group(1)
                prop_name = prop_match.group(3)
                value_str = prop_match.group(4)
                value = parse_property_value(value_str, prop_type)
                current_object.components[current_component][prop_name] = value

    return objects


def convert_openrv_to_sm(openrv_x: float, openrv_y: float) -> Tuple[float, float]:
    """
    Convert OpenRV NDC coordinates to sm-annotate coordinates.

    OpenRV NDC: (0,0) center, X: -1 to +1, Y: -1 to +1 (Y+ up)
    sm-annotate: (0,0) top-left, X: 0-1, Y: 0-1 (Y+ down)
    """
    return (
        (openrv_x + 1) / 2,
        (1 - openrv_y) / 2
    )


def pen_component_to_curve(props: Dict[str, Any], width: int, height: int) -> Optional[Dict[str, Any]]:
    """Convert pen component to curve shape."""
    points_data = props.get('points', [])
    color_data = props.get('color', [])
    width_data = props.get('width')

    if not points_data or len(points_data) < 4:
        return None

    # Convert flat points array to point objects
    points = []
    for i in range(0, len(points_data), 2):
        if i + 1 < len(points_data):
            sm_x, sm_y = convert_openrv_to_sm(points_data[i], points_data[i + 1])
            points.append({'x': sm_x, 'y': sm_y})

    color = rgba_to_hex(color_data) if color_data else '#000000'
    opacity = color_data[3] if len(color_data) >= 4 else 1

    # Handle width - can be a single number or an array
    line_width = 2
    if isinstance(width_data, (int, float)):
        line_width = width_data * height
    elif isinstance(width_data, list) and len(width_data) > 0:
        first_width = width_data[0]
        if isinstance(first_width, (int, float)):
            line_width = first_width * height

    # Clamp to reasonable range
    line_width = max(1, min(line_width, 50))

    return {
        'type': 'curve',
        'points': points,
        'strokeStyle': color,
        'fillStyle': color,
        'lineWidth': line_width,
        'opacity': opacity
    }


def text_component_to_text(props: Dict[str, Any], width: int, height: int) -> Optional[Dict[str, Any]]:
    """Convert text component to text shape."""
    position_data = props.get('position', [])
    color_data = props.get('color', [])
    text_content = props.get('text', '')
    size = props.get('size')

    if not position_data or len(position_data) < 2 or not text_content:
        return None

    # Convert OpenRV NDC to sm-annotate coordinates
    sm_x, sm_y = convert_openrv_to_sm(position_data[0], position_data[1])

    color = rgba_to_hex(color_data) if color_data else '#000000'
    opacity = color_data[3] if len(color_data) >= 4 else 1

    # Convert size (normalized to height) back to lineWidth
    normalized_size = size if size else 0.01
    font_size = normalized_size * height
    line_width = max(1, (font_size - 16) / 0.5)

    return {
        'type': 'text',
        'x': sm_x,
        'y': sm_y,
        'text': text_content,
        'strokeStyle': color,
        'fillStyle': color,
        'lineWidth': line_width,
        'opacity': opacity
    }


def parse_openrv(content: str, width: int = 1920, height: int = 1080, fps: int = 25) -> Dict[str, Any]:
    """
    Parse OpenRV GTO file content and convert to sm-annotate format.

    Returns a dict with:
    - frames: List of FrameAnnotationV1 objects
    - mediaPath: Media path from file (if found)
    - dimensions: {width, height} from file (if found)
    - sessionName: Session name (if found)
    - fps: FPS value
    """
    result = {
        'frames': [],
        'fps': fps
    }

    objects = parse_gto_text(content)

    # Extract session info
    for obj in objects:
        if obj.protocol == 'RVSession':
            session_comp = obj.components.get('session', {})
            name = session_comp.get('name')
            if isinstance(name, str):
                result['sessionName'] = name
            break

    # Extract media info
    for obj in objects:
        if obj.protocol == 'RVFileSource':
            media_comp = obj.components.get('media', {})
            movie = media_comp.get('movie')
            if isinstance(movie, str):
                result['mediaPath'] = movie

            # Try to get dimensions from proxy component
            proxy_comp = obj.components.get('proxy', {})
            size = proxy_comp.get('size', [])
            if len(size) >= 2:
                result['dimensions'] = {'width': int(size[0]), 'height': int(size[1])}
                width = int(size[0])
                height = int(size[1])

            # Fallback: try request component
            if 'dimensions' not in result:
                request_comp = obj.components.get('request', {})
                w = request_comp.get('width')
                h = request_comp.get('height')
                if isinstance(w, (int, float)) and isinstance(h, (int, float)):
                    result['dimensions'] = {'width': int(w), 'height': int(h)}
                    width = int(w)
                    height = int(h)
            break

    # Fallback: try to get dimensions from RVStack or RVSequence
    if 'dimensions' not in result:
        for obj in objects:
            if obj.protocol in ('RVStack', 'RVSequence'):
                output_comp = obj.components.get('output', {})
                size = output_comp.get('size', [])
                if len(size) >= 2:
                    result['dimensions'] = {'width': int(size[0]), 'height': int(size[1])}
                    width = int(size[0])
                    height = int(size[1])
                    break

    # Extract paint annotations from ALL RVPaint blocks
    paint_objects = [obj for obj in objects if obj.protocol == 'RVPaint']

    if not paint_objects:
        return result

    # Group shapes by frame
    frame_shapes: Dict[int, List[Dict[str, Any]]] = {}

    for paint_obj in paint_objects:
        for comp_name, props in paint_obj.components.items():
            # Parse pen components: pen:ID:FRAME:user (case-insensitive)
            pen_match = re.match(r'^pen:\d+:(\d+):', comp_name, re.IGNORECASE)
            if pen_match:
                frame = int(pen_match.group(1))
                shape = pen_component_to_curve(props, width, height)
                if shape:
                    if frame not in frame_shapes:
                        frame_shapes[frame] = []
                    frame_shapes[frame].append(shape)
                continue

            # Parse text components: text:ID:FRAME:user (case-insensitive)
            text_match = re.match(r'^text:\d+:(\d+):', comp_name, re.IGNORECASE)
            if text_match:
                frame = int(text_match.group(1))
                shape = text_component_to_text(props, width, height)
                if shape:
                    if frame not in frame_shapes:
                        frame_shapes[frame] = []
                    frame_shapes[frame].append(shape)

    # Convert to FrameAnnotationV1 array
    for frame, shapes in sorted(frame_shapes.items()):
        result['frames'].append({
            'frame': frame,
            'fps': fps,
            'version': 1,
            'shapes': shapes
        })

    return result


def main():
    parser = argparse.ArgumentParser(
        description='Parse OpenRV .rv files and convert to sm-annotate JSON format',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Example:
    python parse_rv.py annotations.rv output.json --fps 25

Output JSON format:
{
    "frames": [
        {
            "frame": 1,
            "fps": 25,
            "version": 1,
            "shapes": [...]
        }
    ],
    "mediaPath": "/path/to/video.mp4",
    "dimensions": {"width": 1920, "height": 1080},
    "sessionName": "my-session"
}
'''
    )

    parser.add_argument('input', help='Input .rv file')
    parser.add_argument('output', help='Output JSON file path')
    parser.add_argument('--fps', '-f', type=int, default=25, help='Frames per second (default: 25)')
    parser.add_argument('--width', '-W', type=int, default=1920, help='Fallback width if not in file (default: 1920)')
    parser.add_argument('--height', '-H', type=int, default=1080, help='Fallback height if not in file (default: 1080)')
    parser.add_argument('--frames-only', '-F', action='store_true', help='Output only the frames array (for direct use with sm-annotate)')

    args = parser.parse_args()

    # Read input file
    try:
        with open(args.input, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: Input file '{args.input}' not found", file=sys.stderr)
        sys.exit(1)
    except IOError as e:
        print(f"Error: Could not read input file: {e}", file=sys.stderr)
        sys.exit(1)

    # Parse OpenRV file
    result = parse_openrv(content, args.width, args.height, args.fps)

    # Output result
    output_data = result['frames'] if args.frames_only else result

    try:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2)

        frame_count = len(result['frames'])
        shape_count = sum(len(f['shapes']) for f in result['frames'])
        print(f"Successfully parsed {frame_count} frames with {shape_count} shapes to {args.output}")

        if result.get('mediaPath'):
            print(f"Media path: {result['mediaPath']}")
        if result.get('dimensions'):
            print(f"Dimensions: {result['dimensions']['width']}x{result['dimensions']['height']}")

    except IOError as e:
        print(f"Error: Could not write output file: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
