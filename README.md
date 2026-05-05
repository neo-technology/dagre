## Per-Cluster Direction Support (Experimental)

This version of Dagre supports per-cluster (subgraph) direction, allowing each cluster to specify its own `rankdir`, `ranksep`, `nodesep`, and alignment settings. The layout engine is now recursive and context-aware, enabling robust support for complex, nested cluster hierarchies and cross-cluster edge routing.

### Key Features
- Recursive, context-aware layout pipeline
- Each cluster/subgraph can specify its own direction and settings
- Cross-cluster edge routing with coordinate system transforms
- Backward compatible with global `rankdir` and legacy layouts

### Usage
Specify `rankdir`, `ranksep`, `nodesep`, or `align` on any cluster node to override the parent context. The layout engine will recursively apply these settings and route edges appropriately.

### Status
This feature is experimental and under active development. Please report issues and contribute test cases for complex cluster scenarios.
# dagre - Graph layout for JavaScript

[![Build Status](https://github.com/dagrejs/dagre/workflows/Build%20Status/badge.svg?branch=master)](https://github.com/dagrejs/dagre/actions?query=workflow%3A%22Build+Status%22)
[![npm](https://img.shields.io/npm/v/@dagrejs/dagre.svg)](https://www.npmjs.com/package/@dagrejs/dagre)


Dagre is a JavaScript library that makes it easy to lay out directed graphs on the client-side.

For more details, including examples and configuration options, please see our [wiki](https://github.com/dagrejs/dagre/wiki).

There are 2 versions on NPM, but only [the one in the DagreJs org](https://www.npmjs.com/package/@dagrejs/dagre) is receiving updates right now.

## License

dagre is licensed under the terms of the MIT License. See the LICENSE file for details.
