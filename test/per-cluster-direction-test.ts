describe('Per-Cluster Direction Architecture', () => {
  it('should layout nested clusters with different rankdirs', () => {
    // TODO: Implement test for nested clusters with per-cluster rankdir
  });

  it('should route cross-cluster edges correctly', () => {
    // TODO: Implement test for cross-cluster edge routing
  });

  it('should support all rankdir combinations (TB, BT, LR, RL)', () => {
    // TODO: Implement test for all rankdir combinations in clusters
  });
});
import {Graph} from "@dagrejs/graphlib";
import {layout} from "../lib/layout";

describe("per-cluster direction support", () => {
  it("lays out two clusters with different directions", () => {
    const g = new Graph({multigraph: true, compound: true})
      .setGraph({rankdir: "TB"})
      .setDefaultEdgeLabel(() => ({}));

    // Cluster 1: LR
    g.setNode("c1", {label: "Cluster1", rankdir: "LR"});
    g.setNode("a1", {width: 40, height: 40});
    g.setNode("a2", {width: 40, height: 40});
    g.setParent("a1", "c1");
    g.setParent("a2", "c1");
    g.setEdge("a1", "a2");

    // Cluster 2: TB
    g.setNode("c2", {label: "Cluster2", rankdir: "TB"});
    g.setNode("b1", {width: 40, height: 40});
    g.setNode("b2", {width: 40, height: 40});
    g.setParent("b1", "c2");
    g.setParent("b2", "c2");
    g.setEdge("b1", "b2");

    // Edge between clusters
    g.setEdge("a2", "b1");

    layout(g);

    // Cluster 1 should be horizontal (a1 left of a2)
    expect(g.node("a1").y).toBeCloseTo(g.node("a2").y, 1);
    expect(g.node("a1").x).toBeLessThan(g.node("a2").x);
    // Cluster 2 should be vertical (b1 above b2)
    expect(g.node("b1").x).toBeCloseTo(g.node("b2").x, 1);
    expect(g.node("b1").y).toBeLessThan(g.node("b2").y);
    // Edge between clusters should connect right of a2 to top of b1 (roughly)
    expect(g.node("a2").x).toBeLessThan(g.node("b1").x + 100); // not too far apart
  });

  it("lays out nested clusters with different directions", () => {
    const g = new Graph({multigraph: true, compound: true})
      .setGraph({rankdir: "LR"})
      .setDefaultEdgeLabel(() => ({}));

    // Outer cluster: LR
    g.setNode("outer", {label: "Outer", rankdir: "LR"});
    // Inner cluster: TB
    g.setNode("inner", {label: "Inner", rankdir: "TB"});
    g.setNode("n1", {width: 40, height: 40});
    g.setNode("n2", {width: 40, height: 40});
    g.setParent("n1", "inner");
    g.setParent("n2", "inner");
    g.setParent("inner", "outer");
    g.setNode("n3", {width: 40, height: 40});
    g.setParent("n3", "outer");
    g.setEdge("n1", "n2");
    g.setEdge("n2", "n3");

    layout(g);

    // Inner cluster should be vertical
    expect(g.node("n1").x).toBeCloseTo(g.node("n2").x, 1);
    expect(g.node("n1").y).toBeLessThan(g.node("n2").y);
    // Outer cluster should be horizontal (inner left of n3)
    expect(g.node("inner").y).toBeCloseTo(g.node("n3").y, 1);
    expect(g.node("inner").x).toBeLessThan(g.node("n3").x);
  });

  it("inherits direction for clusters without explicit rankdir", () => {
    const g = new Graph({multigraph: true, compound: true})
      .setGraph({rankdir: "RL"})
      .setDefaultEdgeLabel(() => ({}));

    g.setNode("c1", {label: "Cluster1"}); // no rankdir
    g.setNode("a1", {width: 40, height: 40});
    g.setNode("a2", {width: 40, height: 40});
    g.setParent("a1", "c1");
    g.setParent("a2", "c1");
    g.setEdge("a1", "a2");

    layout(g);

    // Should be right-to-left (a1 right of a2)
    expect(g.node("a1").y).toBeCloseTo(g.node("a2").y, 1);
    expect(g.node("a1").x).toBeGreaterThan(g.node("a2").x);
  });

  it("lays out a BT cluster correctly inside a TB graph", () => {
    // Main graph: TB. Cluster: BT (bottom-to-top).
    // In a BT cluster, the SOURCE is at the BOTTOM and SINK at the TOP.
    const g = new Graph({multigraph: true, compound: true})
      .setGraph({rankdir: "TB"})
      .setDefaultEdgeLabel(() => ({}));

    g.setNode("start", {width: 40, height: 40});
    g.setNode("c1", {label: "Cluster", rankdir: "BT"});
    g.setNode("n1", {width: 40, height: 40}); // source → should end up at BOTTOM
    g.setNode("n2", {width: 40, height: 40});
    g.setNode("n3", {width: 40, height: 40}); // sink   → should end up at TOP
    g.setParent("n1", "c1");
    g.setParent("n2", "c1");
    g.setParent("n3", "c1");
    g.setNode("end", {width: 40, height: 40});
    g.setEdge("start", "n1");
    g.setEdge("n1", "n2");
    g.setEdge("n2", "n3");
    g.setEdge("n3", "end");

    layout(g);

    // BT: n3 (sink) should be above n1 (source) — smaller y means higher
    expect(g.node("n3").y).toBeLessThan(g.node("n1").y);
    // All three cluster nodes share the same x (vertical stack)
    expect(g.node("n1").x).toBeCloseTo(g.node("n2").x, 1);
    expect(g.node("n2").x).toBeCloseTo(g.node("n3").x, 1);
    // The overall TB graph: start is above c1, c1 is above end
    expect(g.node("start").y).toBeLessThan(g.node("c1").y);
    expect(g.node("c1").y).toBeLessThan(g.node("end").y);
  });
});
