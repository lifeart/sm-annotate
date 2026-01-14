#!/usr/bin/env python3
"""
Round-trip test for OpenRV conversion.

Tests that: JSON → .rv → JSON produces consistent results.

Note: Due to format limitations, some information is lost in round-trip:
- All shapes become 'curve' type (OpenRV doesn't distinguish shape types)
- Arrows become 3 separate curves (line + 2 arrowhead strokes)
- Rectangles become 5-point closed curves
- Circles become ~33-point polygon curves

What should be preserved:
- Frame numbers
- Point positions (within floating-point tolerance)
- Colors
- Line widths (approximately)
- Opacity values
- Text content and positions
"""

import json
import math
import os
import sys
import tempfile
from typing import Any, Dict, List, Tuple

# Import our conversion modules
from convert_to_rv import export_to_openrv
from parse_rv import parse_openrv


def points_equal(p1: Dict[str, float], p2: Dict[str, float], tolerance: float = 0.001) -> bool:
    """Check if two points are equal within tolerance."""
    return (
        abs(p1.get('x', 0) - p2.get('x', 0)) < tolerance and
        abs(p1.get('y', 0) - p2.get('y', 0)) < tolerance
    )


def colors_equal(c1: str, c2: str) -> bool:
    """Check if two hex colors are equal (case-insensitive)."""
    return c1.lower() == c2.lower()


def compare_curve_shapes(original: Dict, roundtrip: Dict, tolerance: float = 0.001) -> Tuple[bool, List[str]]:
    """Compare two curve shapes and return (equal, differences)."""
    differences = []

    # Compare points
    orig_points = original.get('points', [])
    rt_points = roundtrip.get('points', [])

    if len(orig_points) != len(rt_points):
        differences.append(f"Point count: {len(orig_points)} vs {len(rt_points)}")
    else:
        for i, (op, rp) in enumerate(zip(orig_points, rt_points)):
            if not points_equal(op, rp, tolerance):
                differences.append(f"Point {i}: ({op.get('x', 0):.4f}, {op.get('y', 0):.4f}) vs ({rp.get('x', 0):.4f}, {rp.get('y', 0):.4f})")

    # Compare colors
    orig_color = original.get('strokeStyle', '#000000')
    rt_color = roundtrip.get('strokeStyle', '#000000')
    if not colors_equal(orig_color, rt_color):
        differences.append(f"Color: {orig_color} vs {rt_color}")

    # Compare opacity
    orig_opacity = original.get('opacity', 1)
    rt_opacity = roundtrip.get('opacity', 1)
    if abs(orig_opacity - rt_opacity) > 0.01:
        differences.append(f"Opacity: {orig_opacity} vs {rt_opacity}")

    # Compare line width (with larger tolerance due to normalization)
    orig_width = original.get('lineWidth', 2)
    rt_width = roundtrip.get('lineWidth', 2)
    width_tolerance = max(1, orig_width * 0.1)  # 10% tolerance
    if abs(orig_width - rt_width) > width_tolerance:
        differences.append(f"Line width: {orig_width} vs {rt_width}")

    return len(differences) == 0, differences


def compare_text_shapes(original: Dict, roundtrip: Dict, tolerance: float = 0.001) -> Tuple[bool, List[str]]:
    """Compare two text shapes and return (equal, differences)."""
    differences = []

    # Compare position
    orig_x, orig_y = original.get('x', 0), original.get('y', 0)
    rt_x, rt_y = roundtrip.get('x', 0), roundtrip.get('y', 0)

    if abs(orig_x - rt_x) > tolerance or abs(orig_y - rt_y) > tolerance:
        differences.append(f"Position: ({orig_x:.4f}, {orig_y:.4f}) vs ({rt_x:.4f}, {rt_y:.4f})")

    # Compare text content
    orig_text = original.get('text', '')
    rt_text = roundtrip.get('text', '')
    if orig_text != rt_text:
        differences.append(f"Text: '{orig_text}' vs '{rt_text}'")

    # Compare colors
    orig_color = original.get('fillStyle', '#000000')
    rt_color = roundtrip.get('fillStyle', '#000000')
    if not colors_equal(orig_color, rt_color):
        differences.append(f"Color: {orig_color} vs {rt_color}")

    # Compare opacity
    orig_opacity = original.get('opacity', 1)
    rt_opacity = roundtrip.get('opacity', 1)
    if abs(orig_opacity - rt_opacity) > 0.01:
        differences.append(f"Opacity: {orig_opacity} vs {rt_opacity}")

    return len(differences) == 0, differences


def run_roundtrip_test(frames: List[Dict], width: int = 1920, height: int = 1080, fps: int = 25) -> Tuple[bool, Dict[str, Any]]:
    """
    Run round-trip test on frames.

    Returns (success, report) where report contains details about the test.
    """
    report = {
        'input_frames': len(frames),
        'input_shapes': sum(len(f.get('shapes', [])) for f in frames),
        'output_frames': 0,
        'output_shapes': 0,
        'differences': [],
        'warnings': []
    }

    # Step 1: Export to OpenRV format
    rv_content = export_to_openrv(frames, '/test/video.mp4', width, height, 'roundtrip-test')

    # Step 2: Parse back to JSON
    parsed = parse_openrv(rv_content, width, height, fps)
    roundtrip_frames = parsed.get('frames', [])

    report['output_frames'] = len(roundtrip_frames)
    report['output_shapes'] = sum(len(f.get('shapes', [])) for f in roundtrip_frames)

    # Step 3: Compare frames
    # Build frame maps for comparison
    orig_frame_map = {f['frame']: f for f in frames}
    rt_frame_map = {f['frame']: f for f in roundtrip_frames}

    # Check that same frames exist
    orig_frames_set = set(orig_frame_map.keys())
    rt_frames_set = set(rt_frame_map.keys())

    if orig_frames_set != rt_frames_set:
        missing = orig_frames_set - rt_frames_set
        extra = rt_frames_set - orig_frames_set
        if missing:
            report['differences'].append(f"Missing frames after round-trip: {missing}")
        if extra:
            report['differences'].append(f"Extra frames after round-trip: {extra}")

    # Compare shapes in each frame
    for frame_num in orig_frames_set & rt_frames_set:
        orig_frame = orig_frame_map[frame_num]
        rt_frame = rt_frame_map[frame_num]

        orig_shapes = orig_frame.get('shapes', [])
        rt_shapes = rt_frame.get('shapes', [])

        # Count shapes by type
        orig_curves = [s for s in orig_shapes if s.get('type') == 'curve']
        orig_texts = [s for s in orig_shapes if s.get('type') == 'text']
        orig_lines = [s for s in orig_shapes if s.get('type') == 'line']
        orig_arrows = [s for s in orig_shapes if s.get('type') == 'arrow']
        orig_rectangles = [s for s in orig_shapes if s.get('type') == 'rectangle']
        orig_circles = [s for s in orig_shapes if s.get('type') == 'circle']

        rt_curves = [s for s in rt_shapes if s.get('type') == 'curve']
        rt_texts = [s for s in rt_shapes if s.get('type') == 'text']

        # Expected curve count after round-trip:
        # - curves stay as curves
        # - lines become curves
        # - arrows become 3 curves each
        # - rectangles become curves
        # - circles become curves
        expected_curves = len(orig_curves) + len(orig_lines) + len(orig_arrows) * 3 + len(orig_rectangles) + len(orig_circles)

        if len(rt_curves) != expected_curves:
            report['warnings'].append(f"Frame {frame_num}: Expected {expected_curves} curves after round-trip, got {len(rt_curves)}")

        if len(rt_texts) != len(orig_texts):
            report['differences'].append(f"Frame {frame_num}: Text count mismatch: {len(orig_texts)} vs {len(rt_texts)}")

        # Compare curves (only original curves, not converted shapes)
        for i, (orig, rt) in enumerate(zip(orig_curves, rt_curves[:len(orig_curves)])):
            equal, diffs = compare_curve_shapes(orig, rt)
            if not equal:
                report['differences'].append(f"Frame {frame_num}, Curve {i}: {'; '.join(diffs)}")

        # Compare texts
        for i, (orig, rt) in enumerate(zip(orig_texts, rt_texts)):
            equal, diffs = compare_text_shapes(orig, rt)
            if not equal:
                report['differences'].append(f"Frame {frame_num}, Text {i}: {'; '.join(diffs)}")

    success = len(report['differences']) == 0
    return success, report


def main():
    print("=" * 60)
    print("OpenRV Round-Trip Test")
    print("=" * 60)
    print()

    # Test 1: Basic curve
    print("Test 1: Basic curve...")
    test1_frames = [{
        'frame': 1,
        'fps': 25,
        'version': 1,
        'shapes': [{
            'type': 'curve',
            'points': [
                {'x': 0.1, 'y': 0.1},
                {'x': 0.2, 'y': 0.15},
                {'x': 0.3, 'y': 0.1},
                {'x': 0.4, 'y': 0.2}
            ],
            'strokeStyle': '#ff0000',
            'fillStyle': '#ff0000',
            'lineWidth': 3,
            'opacity': 1
        }]
    }]
    success, report = run_roundtrip_test(test1_frames)
    print(f"  Result: {'PASS' if success else 'FAIL'}")
    if report['differences']:
        for diff in report['differences']:
            print(f"    - {diff}")
    print()

    # Test 2: Text annotation
    print("Test 2: Text annotation...")
    test2_frames = [{
        'frame': 5,
        'fps': 25,
        'version': 1,
        'shapes': [{
            'type': 'text',
            'x': 0.5,
            'y': 0.5,
            'text': 'Hello World',
            'strokeStyle': '#ffffff',
            'fillStyle': '#ffffff',
            'lineWidth': 2,
            'opacity': 1
        }]
    }]
    success2, report2 = run_roundtrip_test(test2_frames)
    print(f"  Result: {'PASS' if success2 else 'FAIL'}")
    if report2['differences']:
        for diff in report2['differences']:
            print(f"    - {diff}")
    print()

    # Test 3: Multiple frames with mixed shapes
    print("Test 3: Multiple frames with mixed shapes...")
    test3_frames = [
        {
            'frame': 1,
            'fps': 25,
            'version': 1,
            'shapes': [{
                'type': 'text',
                'x': 0.1,
                'y': 0.1,
                'text': 'Frame 1',
                'fillStyle': '#ffffff',
                'strokeStyle': '#ffffff',
                'lineWidth': 2,
                'opacity': 1
            }]
        },
        {
            'frame': 10,
            'fps': 25,
            'version': 1,
            'shapes': [
                {
                    'type': 'curve',
                    'points': [
                        {'x': 0.2, 'y': 0.2},
                        {'x': 0.3, 'y': 0.3},
                        {'x': 0.4, 'y': 0.25}
                    ],
                    'strokeStyle': '#00ff00',
                    'fillStyle': '#00ff00',
                    'lineWidth': 2,
                    'opacity': 0.8
                },
                {
                    'type': 'text',
                    'x': 0.5,
                    'y': 0.8,
                    'text': 'Annotation',
                    'fillStyle': '#ffff00',
                    'strokeStyle': '#ffff00',
                    'lineWidth': 4,
                    'opacity': 1
                }
            ]
        }
    ]
    success3, report3 = run_roundtrip_test(test3_frames)
    print(f"  Result: {'PASS' if success3 else 'FAIL'}")
    if report3['differences']:
        for diff in report3['differences']:
            print(f"    - {diff}")
    if report3['warnings']:
        print("  Warnings (expected):")
        for warn in report3['warnings']:
            print(f"    - {warn}")
    print()

    # Test 4: Edge cases - special characters in text
    print("Test 4: Special characters in text...")
    test4_frames = [{
        'frame': 1,
        'fps': 25,
        'version': 1,
        'shapes': [{
            'type': 'text',
            'x': 0.3,
            'y': 0.3,
            'text': 'Line1\nLine2',
            'fillStyle': '#ff00ff',
            'strokeStyle': '#ff00ff',
            'lineWidth': 2,
            'opacity': 1
        }]
    }]
    success4, report4 = run_roundtrip_test(test4_frames)
    print(f"  Result: {'PASS' if success4 else 'FAIL'}")
    if report4['differences']:
        for diff in report4['differences']:
            print(f"    - {diff}")
    print()

    # Test 5: Coordinate extremes
    print("Test 5: Coordinate extremes (corners)...")
    test5_frames = [{
        'frame': 1,
        'fps': 25,
        'version': 1,
        'shapes': [{
            'type': 'curve',
            'points': [
                {'x': 0.0, 'y': 0.0},  # top-left
                {'x': 1.0, 'y': 0.0},  # top-right
                {'x': 1.0, 'y': 1.0},  # bottom-right
                {'x': 0.0, 'y': 1.0},  # bottom-left
            ],
            'strokeStyle': '#0000ff',
            'fillStyle': '#0000ff',
            'lineWidth': 2,
            'opacity': 1
        }]
    }]
    success5, report5 = run_roundtrip_test(test5_frames)
    print(f"  Result: {'PASS' if success5 else 'FAIL'}")
    if report5['differences']:
        for diff in report5['differences']:
            print(f"    - {diff}")
    print()

    # Summary
    print("=" * 60)
    all_pass = all([success, success2, success3, success4, success5])
    print(f"Overall: {'ALL TESTS PASSED' if all_pass else 'SOME TESTS FAILED'}")
    print("=" * 60)

    return 0 if all_pass else 1


if __name__ == '__main__':
    sys.exit(main())
