import {alg, Graph as GraphLibGraph} from "@dagrejs/graphlib";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Graph<G = any, N = any, E = any> extends GraphLibGraph<G, N, E> {}
export {alg};