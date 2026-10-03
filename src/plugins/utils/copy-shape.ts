import type { IShape } from "..";

/**
 * Copy a shape for undo history. Top-level fields and point arrays are
 * copied so in-place edits don't leak into history; non-plain values
 * (e.g. an image element) are shared by reference.
 */
export function copyShapeForUndo<T extends IShape>(shape: T): T {
  const copy = { ...shape } as T & { points?: { x: number; y: number }[] };
  const points = (shape as { points?: { x: number; y: number }[] }).points;
  if (Array.isArray(points)) {
    copy.points = points.map((p) => ({ ...p }));
  }
  return copy;
}
