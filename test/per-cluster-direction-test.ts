import {Graph} from "../lib/graph-lib";
import {layout} from "../lib/layout";

describe('Per-Cluster Direction Architecture', () => {
    it('should layout nested clusters with different rankdirs', () => {
        const g = new Graph({multigraph: true, compound: true})
            .setGraph({rankdir: 'TB'})
            .setDefaultEdgeLabel(() => ({}));

        // Outer cluster: TB (vertical flow)
        g.setNode('outer', {label: 'Outer', rankdir: 'TB'});
        // Inner cluster: LR (horizontal flow)
        g.setNode('inner', {label: 'Inner', rankdir: 'LR'});
        g.setNode('x1', {width: 40, height: 40});
        g.setNode('x2', {width: 40, height: 40});
        g.setParent('x1', 'inner');
        g.setParent('x2', 'inner');
        g.setParent('inner', 'outer');
        g.setNode('x3', {width: 40, height: 40});
        g.setParent('x3', 'outer');
        g.setEdge('x1', 'x2'); // horizontal inside inner cluster
        g.setEdge('x2', 'x3'); // inner → sibling in outer cluster (vertical)

        layout(g);

        // Inner cluster (LR): x1 should be to the left of x2 (same y)
        expect(g.node('x1').y).toBeCloseTo(g.node('x2').y, 1);
        expect(g.node('x1').x).toBeLessThan(g.node('x2').x);
        // Outer cluster (TB): inner cluster centre should be above x3
        expect(g.node('inner').y).toBeLessThan(g.node('x3').y);
    });

    it('should route cross-cluster edges correctly', () => {
        const g = new Graph({multigraph: true, compound: true})
            .setGraph({rankdir: 'TB'})
            .setDefaultEdgeLabel(() => ({}));

        // Source cluster (LR)
        g.setNode('src', {label: 'Source', rankdir: 'LR'});
        g.setNode('s1', {width: 40, height: 40});
        g.setNode('s2', {width: 40, height: 40});
        g.setParent('s1', 'src');
        g.setParent('s2', 'src');
        g.setEdge('s1', 's2');

        // Target cluster (LR)
        g.setNode('tgt', {label: 'Target', rankdir: 'LR'});
        g.setNode('t1', {width: 40, height: 40});
        g.setNode('t2', {width: 40, height: 40});
        g.setParent('t1', 'tgt');
        g.setParent('t2', 'tgt');
        g.setEdge('t1', 't2');

        // Cross-cluster edge
        g.setEdge('s2', 't1');

        layout(g);

        // Both clusters receive valid positions
        expect(g.node('src').x).toBeDefined();
        expect(g.node('src').y).toBeDefined();
        expect(g.node('tgt').x).toBeDefined();
        expect(g.node('tgt').y).toBeDefined();
        // Global TB: source cluster should appear above target cluster
        expect(g.node('src').y).toBeLessThan(g.node('tgt').y);
        // Each cluster's internal LR order is preserved
        expect(g.node('s1').x).toBeLessThan(g.node('s2').x);
        expect(g.node('t1').x).toBeLessThan(g.node('t2').x);
    });

    it('should support all rankdir combinations (TB, BT, LR, RL)', () => {
        const g = new Graph({multigraph: true, compound: true})
            .setGraph({rankdir: 'TB'})
            .setDefaultEdgeLabel(() => ({}));

        // TB cluster: source above sink
        g.setNode('ctb', {label: 'TB', rankdir: 'TB'});
        g.setNode('tb1', {width: 40, height: 40});
        g.setNode('tb2', {width: 40, height: 40});
        g.setParent('tb1', 'ctb');
        g.setParent('tb2', 'ctb');
        g.setEdge('tb1', 'tb2');

        // BT cluster: source below sink
        g.setNode('cbt', {label: 'BT', rankdir: 'BT'});
        g.setNode('bt1', {width: 40, height: 40});
        g.setNode('bt2', {width: 40, height: 40});
        g.setParent('bt1', 'cbt');
        g.setParent('bt2', 'cbt');
        g.setEdge('bt1', 'bt2');

        // LR cluster: source left of sink
        g.setNode('clr', {label: 'LR', rankdir: 'LR'});
        g.setNode('lr1', {width: 40, height: 40});
        g.setNode('lr2', {width: 40, height: 40});
        g.setParent('lr1', 'clr');
        g.setParent('lr2', 'clr');
        g.setEdge('lr1', 'lr2');

        // RL cluster: source right of sink
        g.setNode('crl', {label: 'RL', rankdir: 'RL'});
        g.setNode('rl1', {width: 40, height: 40});
        g.setNode('rl2', {width: 40, height: 40});
        g.setParent('rl1', 'crl');
        g.setParent('rl2', 'crl');
        g.setEdge('rl1', 'rl2');

        // Chain clusters so they all participate in the global layout
        g.setEdge('ctb', 'cbt');
        g.setEdge('cbt', 'clr');
        g.setEdge('clr', 'crl');

        layout(g);

        // TB: tb1 (source) above tb2 (sink) — same x
        expect(g.node('tb1').x).toBeCloseTo(g.node('tb2').x, 1);
        expect(g.node('tb1').y).toBeLessThan(g.node('tb2').y);

        // BT: bt2 (sink) above bt1 (source) — same x
        expect(g.node('bt1').x).toBeCloseTo(g.node('bt2').x, 1);
        expect(g.node('bt2').y).toBeLessThan(g.node('bt1').y);

        // LR: lr1 (source) left of lr2 (sink) — same y
        expect(g.node('lr1').y).toBeCloseTo(g.node('lr2').y, 1);
        expect(g.node('lr1').x).toBeLessThan(g.node('lr2').x);

        // RL: rl1 (source) right of rl2 (sink) — same y
        expect(g.node('rl1').y).toBeCloseTo(g.node('rl2').y, 1);
        expect(g.node('rl1').x).toBeGreaterThan(g.node('rl2').x);
    });
});

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
