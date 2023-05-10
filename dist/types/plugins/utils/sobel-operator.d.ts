export declare class HistogramFrame extends Array<number> {
    id: number;
    constructor();
}
export declare function sobelOperator(imgData: ImageData): HistogramFrame;
export declare function calculateSimilarity(edges1: HistogramFrame, edges2: HistogramFrame): number;
