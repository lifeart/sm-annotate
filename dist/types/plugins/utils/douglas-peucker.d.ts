export declare class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
    distanceToLine(p1: Point, p2: Point): number;
}
export declare function douglasPeucker(points: Point[], epsilon: number): Point[];
