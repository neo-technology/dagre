import {alg, Graph as GraphLibGraph} from "@dagrejs/graphlib";

// Re-export Graph with default generic type parameters defaulting to any instead of Label
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Graph<G = any, N = any, E = any> = GraphLibGraph<G, N, E>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Graph: new <G = any, N = any, E = any>(opts?: any) => GraphLibGraph<G, N, E> = GraphLibGraph as any;
export type {Edge} from "@dagrejs/graphlib";
export {alg};