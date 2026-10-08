export interface Point { x: number; y: number; z: number; r: number; object?: string }
export interface Box { id: string; label: 'Car' | 'Pedestrian' | 'Cyclist'; x: number; y: number; z: number; w: number; l: number; h: number; theta: number; confidence?: number }
export interface Scene { name: string; points: Point[]; boxes: Box[] }
export interface Bounds { xmin: number; xmax: number; ymin: number; ymax: number; zmin: number; zmax: number }
export interface Pillar { key: string; ix: number; iy: number; cx: number; cy: number; indices: number[]; sampled: number[]; mean: [number, number, number] }
export interface PillarSet { pillars: Pillar[]; lookup: Map<string, Pillar>; pointKeys: Map<number, string>; width: number; height: number; bounds: Bounds; size: number; totalNonempty: number; validPointCount: number }
export interface PredictionData { schemaVersion: 1; points: Point[]; predictions: Box[]; metadata?: { model?: string; checkpoint?: string; sample?: string }; bounds: Bounds }
export const DEMO_BOUNDS: Bounds = { xmin: -12, xmax: 12, ymin: -8, ymax: 8, zmin: -0.15, zmax: 5 };
export const MAX_PILLARS = 6000;
export const MAX_POINTS = 32;
