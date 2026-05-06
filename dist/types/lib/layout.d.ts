/**
 * Per-Cluster Direction Architecture (feature/per-cluster-direction-architecture)
 *
 * This refactor introduces true per-cluster (per-subgraph) direction support in Dagre.
 *
 * Key concepts:
 * - Each cluster/subgraph can specify its own rankdir and layout settings.
 * - The layout pipeline is recursive: each cluster is laid out in isolation, then positioned as a unit in its parent.
 * - Edges crossing cluster boundaries are routed and transformed between coordinate systems.
 * - Node positions are recursively transformed to global coordinates.
 * - Backward compatibility: if no clusters specify rankdir, layout is unchanged.
 *
 * Implementation steps:
 * 1. Introduce LayoutContext to encapsulate direction/settings for each cluster/subgraph.
 * 2. Refactor layout pipeline to be recursive, passing LayoutContext at each level.
 * 3. Isolate subgraph layout, transform node/edge positions into parent context.
 * 4. Implement edge routing and coordinate transformation for cross-cluster edges.
 * 5. Add/expand tests for all per-cluster direction scenarios.
 * 6. Update documentation.
 */
interface LayoutContext {
    rankdir: string;
    ranksep?: number;
    nodesep?: number;
    align?: string;
    parent?: LayoutContext;
}
export declare function layoutWithContext(g: Graph<GraphLabel, NodeLabel, EdgeLabel>, context: LayoutContext, opts?: LayoutOptions): Graph<GraphLabel, NodeLabel, EdgeLabel>;
/**
 * ARCHITECTURAL PLAN: Per-Cluster Direction Support (feature/per-cluster-direction-architecture)
 *
 * This refactor introduces true per-cluster (per-subgraph) direction support in Dagre.
 *
 * Key concepts:
 * - Each cluster/subgraph can specify its own rankdir and layout settings.
 * - The layout pipeline is recursive: each cluster is laid out in isolation, then positioned as a unit in its parent.
 * - Edges crossing cluster boundaries are routed and transformed between coordinate systems.
 * - Node positions are recursively transformed to global coordinates.
 * - Backward compatibility: if no clusters specify rankdir, layout is unchanged.
 *
 * Implementation steps:
 * 1. Introduce LayoutContext to encapsulate direction/settings for each cluster/subgraph.
 * 2. Refactor layout pipeline to be recursive, passing LayoutContext at each level.
 * 3. Isolate subgraph layout, transform node/edge positions into parent context.
 * 4. Implement edge routing and coordinate transformation for cross-cluster edges.
 * 5. Add/expand tests for all per-cluster direction scenarios.
 * 6. Update documentation.
 */
interface LayoutContext {
    rankdir: string;
    ranksep?: number;
    nodesep?: number;
    align?: string;
    parent?: LayoutContext;
}
import { Graph } from "./graph-lib";
import type { EdgeLabel, GraphLabel, LayoutOptions, NodeLabel } from "./types";
export declare function layout(g: Graph<GraphLabel, NodeLabel, EdgeLabel>, opts?: LayoutOptions): Graph<GraphLabel, NodeLabel, EdgeLabel>;
export {};
//# sourceMappingURL=layout.d.ts.map