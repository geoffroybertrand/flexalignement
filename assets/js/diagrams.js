/* ============================================================
   diagrams.js — moteur SVG pour les diagrammes systémiques.

   Chaque diagramme est un langage : nœuds + arêtes + état.
   - Hero : diagramme vivant, s'organise au scroll.
   - Cas clients : paires avant / après, hand-crafted.
   - Process : 3 étapes horizontales.
   - Approche : petites illustrations de concepts.
   ============================================================ */

(() => {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const el = (name, attrs = {}) => {
    const node = document.createElementNS(SVG_NS, name);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  };

  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => {
    // quasi cubic-bezier(.2,0,0,1)
    const c = Math.min(1, Math.max(0, t));
    return 1 - Math.pow(1 - c, 3);
  };

  /* ==========================================================
     HERO DIAGRAM — système vivant, 7 nœuds, boucle → flux
     ========================================================== */
  function renderHeroDiagram(container) {
    const W = 540, H = 540;
    const svg = el("svg", {
      viewBox: `0 0 ${W} ${H}`,
      role: "img",
      "aria-labelledby": "hero-diag-title hero-diag-desc",
    });
    svg.innerHTML = `
      <title id="hero-diag-title">Diagramme systémique</title>
      <desc id="hero-diag-desc">Un système de sept nœuds, initialement enchevêtré, se réorganise en flux clair.</desc>
    `;

    // Background grid
    const grid = el("g", { opacity: "0.22" });
    for (let i = 0; i <= 12; i++) {
      const pos = (i / 12) * W;
      grid.appendChild(el("line", {
        x1: pos, y1: 0, x2: pos, y2: H,
        stroke: "var(--c-grid)", "stroke-width": "1",
      }));
      grid.appendChild(el("line", {
        x1: 0, y1: pos, x2: W, y2: pos,
        stroke: "var(--c-grid)", "stroke-width": "1",
      }));
    }
    svg.appendChild(grid);

    // States — chaos (A) → flow (B)
    const stateA = [
      { id: "a", x: 140, y: 150 },
      { id: "b", x: 200, y: 230 },
      { id: "c", x: 150, y: 320 },
      { id: "d", x: 270, y: 170 },
      { id: "e", x: 320, y: 280 },
      { id: "f", x: 390, y: 200 },
      { id: "g", x: 400, y: 360 },
    ];
    const stateB = [
      { id: "a", x: 90,  y: 270 },
      { id: "b", x: 200, y: 160 },
      { id: "c", x: 200, y: 380 },
      { id: "d", x: 310, y: 270 },
      { id: "e", x: 400, y: 150 },
      { id: "f", x: 440, y: 290 },
      { id: "g", x: 400, y: 390 },
    ];

    // Edges — A (messy, with loops), B (clean directed flow)
    const edgesA = [
      ["a","b"], ["a","c"], ["b","d"], ["c","b"],
      ["b","c"], ["d","e"], ["e","b"], ["e","f"],
      ["f","g"], ["g","e"], ["c","e"], ["d","a"],
    ];
    const edgesB = [
      ["a","b"], ["a","c"], ["b","d"], ["c","d"],
      ["d","e"], ["d","f"], ["d","g"],
    ];

    // Drawing layers
    const gEdges = el("g", { id: "edges" });
    const gNodes = el("g", { id: "nodes" });
    const gLabels = el("g", { id: "labels" });
    svg.appendChild(gEdges);
    svg.appendChild(gNodes);
    svg.appendChild(gLabels);

    // Build node elements
    const nodes = {};
    stateA.forEach((n, i) => {
      const g = el("g", { class: "d-node-wrap" });
      const circle = el("circle", {
        cx: n.x, cy: n.y, r: 14,
        class: "d-node",
      });
      const inner = el("circle", {
        cx: n.x, cy: n.y, r: 4,
        fill: "var(--c-ink)",
      });
      g.appendChild(circle);
      g.appendChild(inner);
      gNodes.appendChild(g);
      nodes[n.id] = { circle, inner, x: n.x, y: n.y };
      // Label
      const lbl = el("text", {
        x: n.x, y: n.y - 22,
        "text-anchor": "middle",
        class: "d-node-label",
      });
      lbl.textContent = String(i + 1).padStart(2, "0");
      gLabels.appendChild(lbl);
      nodes[n.id].label = lbl;
    });

    // Function that renders edges for a given state
    const renderEdges = (positions, edgeSet, progress) => {
      gEdges.innerHTML = "";
      edgeSet.forEach(([from, to]) => {
        const f = positions[from];
        const t = positions[to];
        if (from === to) {
          // self-loop (shouldn't happen in our data, safeguard)
          const path = el("path", {
            d: `M ${f.x} ${f.y - 12} a 12 12 0 1 1 -0.1 0`,
            class: progress < 0.5 ? "d-edge d-edge--loop" : "d-edge",
            fill: "none",
          });
          gEdges.appendChild(path);
          return;
        }
        // Curved edge; curvature is bigger in chaos
        const mx = (f.x + t.x) / 2;
        const my = (f.y + t.y) / 2;
        const dx = t.x - f.x;
        const dy = t.y - f.y;
        const dist = Math.hypot(dx, dy);
        const chaos = 1 - progress;
        // Perpendicular offset
        const off = (chaos * 28) + 0;
        const nx = -dy / dist * off;
        const ny = dx / dist * off;
        const cx = mx + nx;
        const cy = my + ny;
        const cls = chaos > 0.4 ? "d-edge d-edge--dashed" : "d-edge";
        const path = el("path", {
          d: `M ${f.x} ${f.y} Q ${cx} ${cy} ${t.x} ${t.y}`,
          class: cls,
          fill: "none",
        });
        gEdges.appendChild(path);
      });
    };

    const positionsCurrent = Object.fromEntries(
      stateA.map((n) => [n.id, { x: n.x, y: n.y }])
    );

    // Interpolation function
    const positionsFor = (progress) => {
      const p = ease(progress);
      const res = {};
      stateA.forEach((a, i) => {
        const b = stateB[i];
        res[a.id] = {
          x: lerp(a.x, b.x, p),
          y: lerp(a.y, b.y, p),
        };
      });
      return res;
    };

    const edgesFor = (progress) => {
      if (progress < 0.5) return edgesA;
      return edgesB;
    };

    const update = (progress) => {
      const positions = positionsFor(progress);
      stateA.forEach((a, i) => {
        const { x, y } = positions[a.id];
        const { circle, inner, label } = nodes[a.id];
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        inner.setAttribute("cx", x);
        inner.setAttribute("cy", y);
        label.setAttribute("x", x);
        label.setAttribute("y", y - 22);
        if (progress > 0.6) {
          circle.classList.add("d-node--active");
        } else {
          circle.classList.remove("d-node--active");
        }
      });
      renderEdges(positions, edgesFor(progress), progress);
    };

    update(0);
    container.appendChild(svg);

    // Subtle intro pulse (2s), then scroll driven
    let heroProgress = 0;
    let introDone = reducedMotion;
    if (!reducedMotion) {
      let start = null;
      const pulseDuration = 2200;
      const pulse = (ts) => {
        if (!start) start = ts;
        const t = Math.min(1, (ts - start) / pulseDuration);
        // go 0 → 0.18 → 0
        const p = Math.sin(t * Math.PI) * 0.18;
        update(Math.max(heroProgress, p));
        if (t < 1) requestAnimationFrame(pulse);
        else { introDone = true; updateFromScroll(); }
      };
      requestAnimationFrame(pulse);
    }

    // Scroll-driven progress
    const updateFromScroll = () => {
      if (!introDone) return;
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress: 0 when diagram centered in view, 1 when user scrolls ~60% past it
      const relativeY = -rect.top;
      const progress = Math.min(1, Math.max(0, relativeY / (vh * 0.6)));
      heroProgress = progress;
      update(progress);
    };
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);
    if (reducedMotion) updateFromScroll();
  }

  /* ==========================================================
     CASE DIAGRAMS — "avant / après"
     Variants: conflict, team, board, fusion, turnover, prise-poste
     Each one is hand-crafted to tell a distinct story.
     ========================================================== */
  const CASE_SPECS = {
    "conflict-before": {
      W: 280, H: 280,
      nodes: [
        { x: 70,  y: 110, label: "A" },
        { x: 210, y: 110, label: "B" },
        { x: 140, y: 60,  label: "+", muted: true },
        { x: 80,  y: 210, label: "C" },
        { x: 200, y: 210, label: "D" },
      ],
      edges: [
        { from: 0, to: 1, loop: true, curve: -40 },
        { from: 1, to: 0, loop: true, curve: -40 },
        { from: 0, to: 3 },
        { from: 1, to: 4 },
        { from: 3, to: 4, dashed: true },
        { from: 2, to: 0, dashed: true },
        { from: 2, to: 1, dashed: true },
      ],
    },
    "conflict-after": {
      W: 280, H: 280,
      nodes: [
        { x: 70,  y: 140, label: "A", active: true },
        { x: 210, y: 140, label: "B", active: true },
        { x: 140, y: 220, label: "C" },
      ],
      edges: [
        { from: 0, to: 1, curve: -28 },
        { from: 1, to: 2 },
        { from: 0, to: 2 },
      ],
    },
    "team-before": {
      W: 280, H: 280,
      nodes: [
        { x: 140, y: 60,  label: "L" },
        { x: 60,  y: 140, label: "1" },
        { x: 220, y: 140, label: "2" },
        { x: 100, y: 220, label: "3" },
        { x: 180, y: 220, label: "4" },
      ],
      edges: [
        { from: 0, to: 1, dashed: true },
        { from: 0, to: 2, dashed: true },
        { from: 1, to: 3, dashed: true },
        { from: 2, to: 4, dashed: true },
        { from: 3, to: 4, loop: true, curve: 30 },
        { from: 4, to: 3, loop: true, curve: 30 },
        { from: 1, to: 2, dashed: true, curve: -40 },
      ],
    },
    "team-after": {
      W: 280, H: 280,
      nodes: [
        { x: 140, y: 60,  label: "L", active: true },
        { x: 70,  y: 150, label: "1" },
        { x: 140, y: 150, label: "2" },
        { x: 210, y: 150, label: "3" },
        { x: 100, y: 220, label: "4" },
        { x: 180, y: 220, label: "5" },
      ],
      edges: [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 0, to: 3 },
        { from: 1, to: 4 },
        { from: 3, to: 5 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
      ],
    },
    "board-before": {
      W: 280, H: 280,
      nodes: [
        { x: 70,  y: 80,  label: "1" },
        { x: 210, y: 80,  label: "2" },
        { x: 70,  y: 200, label: "3" },
        { x: 210, y: 200, label: "4" },
        { x: 140, y: 140, label: "?", muted: true },
      ],
      edges: [
        { from: 0, to: 1, dashed: true, curve: -24 },
        { from: 1, to: 0, dashed: true, curve: -24 },
        { from: 2, to: 3, dashed: true, curve: 24 },
        { from: 3, to: 2, dashed: true, curve: 24 },
        { from: 0, to: 3, dashed: true },
        { from: 1, to: 2, dashed: true },
      ],
    },
    "board-after": {
      W: 280, H: 280,
      nodes: [
        { x: 140, y: 60,  label: "▲", active: true },
        { x: 70,  y: 150, label: "1" },
        { x: 210, y: 150, label: "2" },
        { x: 70,  y: 230, label: "3" },
        { x: 210, y: 230, label: "4" },
      ],
      edges: [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 3, to: 4, curve: 18 },
      ],
    },
    "fusion-before": {
      W: 280, H: 280,
      nodes: [
        { x: 70,  y: 100, label: "A1" },
        { x: 130, y: 100, label: "A2" },
        { x: 100, y: 160, label: "A3" },
        { x: 180, y: 120, label: "B1", muted: true },
        { x: 230, y: 120, label: "B2", muted: true },
        { x: 200, y: 190, label: "B3", muted: true },
      ],
      edges: [
        { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 0, to: 2 },
        { from: 3, to: 4, dashed: true }, { from: 4, to: 5, dashed: true }, { from: 3, to: 5, dashed: true },
      ],
    },
    "fusion-after": {
      W: 280, H: 280,
      nodes: [
        { x: 70,  y: 140, label: "A1" },
        { x: 130, y: 100, label: "A2" },
        { x: 110, y: 200, label: "A3" },
        { x: 220, y: 140, label: "B1" },
        { x: 170, y: 100, label: "B2" },
        { x: 190, y: 200, label: "B3" },
      ],
      edges: [
        { from: 0, to: 1 }, { from: 1, to: 4 }, { from: 4, to: 3 },
        { from: 0, to: 2 }, { from: 2, to: 5 }, { from: 5, to: 3 },
        { from: 1, to: 2 }, { from: 4, to: 5 },
      ],
    },
  };

  function renderCaseDiagram(svg, variant) {
    const spec = CASE_SPECS[variant];
    if (!spec) return;
    const { W, H, nodes, edges } = spec;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", `Diagramme : ${variant.replace("-", " ")}`);

    // Edges first
    edges.forEach((e) => {
      const a = nodes[e.from], b = nodes[e.to];
      if (!a || !b) return;
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 1;
      const curve = e.curve || 0;
      const nx = -dy / dist * curve;
      const ny = dx / dist * curve;
      const cx = mx + nx, cy = my + ny;
      const d = `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
      const cls = ["d-edge"];
      if (e.dashed) cls.push("d-edge--dashed");
      if (e.loop) cls.push("d-edge--loop");
      svg.appendChild(el("path", { d, class: cls.join(" "), fill: "none" }));
    });

    // Nodes
    nodes.forEach((n) => {
      const cls = ["d-node"];
      if (n.active) cls.push("d-node--active");
      if (n.muted) cls.push("d-node--muted");
      const g = el("g", {});
      g.appendChild(el("circle", { cx: n.x, cy: n.y, r: 12, class: cls.join(" ") }));
      if (n.label) {
        const text = el("text", {
          x: n.x, y: n.y + 3,
          "text-anchor": "middle",
          class: "d-node-label" + (n.muted ? " d-node-label--muted" : ""),
          fill: n.active ? "var(--c-paper)" : "var(--c-ink)",
        });
        text.textContent = n.label;
        g.appendChild(text);
      }
      svg.appendChild(g);
    });
  }

  /* ==========================================================
     APPROCHE DIAGRAMS — concepts illustrés
     ========================================================== */
  function renderConceptDiagram(svg, variant) {
    const W = 380, H = 160;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-hidden", "true");

    if (variant === "loop") {
      // A tight recursive loop (tentatives de solution)
      const cx = 190, cy = 80;
      svg.appendChild(el("circle", { cx: cx - 60, cy, r: 14, class: "d-node" }));
      svg.appendChild(el("circle", { cx: cx + 60, cy, r: 14, class: "d-node" }));
      const up = el("path", {
        d: `M ${cx - 46} ${cy - 6} Q ${cx} ${cy - 50} ${cx + 46} ${cy - 6}`,
        class: "d-edge d-edge--loop", fill: "none",
      });
      const down = el("path", {
        d: `M ${cx + 46} ${cy + 6} Q ${cx} ${cy + 50} ${cx - 46} ${cy + 6}`,
        class: "d-edge d-edge--loop", fill: "none",
      });
      svg.appendChild(up);
      svg.appendChild(down);
      // arrows
      svg.appendChild(el("path", { d: `M ${cx + 40} ${cy - 14} l 6 4 l -6 4`, class: "d-edge d-edge--loop", fill: "none" }));
      svg.appendChild(el("path", { d: `M ${cx - 40} ${cy + 14} l -6 -4 l 6 -4`, class: "d-edge d-edge--loop", fill: "none" }));
      const t1 = el("text", { x: cx - 60, y: cy + 35, "text-anchor": "middle", class: "d-label-mono" });
      t1.textContent = "PROBLÈME";
      const t2 = el("text", { x: cx + 60, y: cy + 35, "text-anchor": "middle", class: "d-label-mono" });
      t2.textContent = "SOLUTION";
      svg.appendChild(t1); svg.appendChild(t2);
    }

    if (variant === "type12") {
      const y = 70;
      // Type 1: oscillates on the same axis
      svg.appendChild(el("line", { x1: 30, y1: y, x2: 170, y2: y, class: "d-edge d-edge--dashed" }));
      svg.appendChild(el("circle", { cx: 60, cy: y, r: 9, class: "d-node" }));
      svg.appendChild(el("circle", { cx: 140, cy: y, r: 9, class: "d-node" }));
      const t1 = el("text", { x: 100, y: y + 35, "text-anchor": "middle", class: "d-label-mono" });
      t1.textContent = "TYPE 1";
      svg.appendChild(t1);
      // Type 2: jump to a new plane
      svg.appendChild(el("line", { x1: 220, y1: y, x2: 360, y2: y - 30, class: "d-edge d-edge--active" }));
      svg.appendChild(el("circle", { cx: 220, cy: y, r: 9, class: "d-node" }));
      svg.appendChild(el("circle", { cx: 360, cy: y - 30, r: 9, class: "d-node d-node--active" }));
      const t2 = el("text", { x: 290, y: y + 35, "text-anchor": "middle", class: "d-label-mono" });
      t2.textContent = "TYPE 2";
      svg.appendChild(t2);
    }

    if (variant === "system-focus") {
      // individual vs. system focus
      const cx = 100, cy = 80;
      svg.appendChild(el("circle", { cx, cy, r: 18, class: "d-node" }));
      const t1 = el("text", { x: cx, y: cy + 40, "text-anchor": "middle", class: "d-label-mono" });
      t1.textContent = "INDIVIDU";
      svg.appendChild(t1);

      const positions = [
        { x: 250, y: 50 }, { x: 300, y: 80 }, { x: 270, y: 120 },
        { x: 220, y: 110 }, { x: 320, y: 40 }
      ];
      positions.forEach((p) => svg.appendChild(el("circle", { cx: p.x, cy: p.y, r: 10, class: "d-node" })));
      // Edges between them
      const edges = [[0,1],[1,2],[2,3],[3,0],[0,4],[4,1]];
      edges.forEach(([a, b]) => {
        const A = positions[a], B = positions[b];
        svg.appendChild(el("line", { x1: A.x, y1: A.y, x2: B.x, y2: B.y, class: "d-edge" }));
      });
      const t2 = el("text", { x: 275, y: 150, "text-anchor": "middle", class: "d-label-mono" });
      t2.textContent = "SYSTÈME";
      svg.appendChild(t2);
    }
  }

  /* ==========================================================
     INIT
     ========================================================== */
  document.querySelectorAll("[data-hero-diagram]").forEach(renderHeroDiagram);

  document.querySelectorAll("[data-case-diagram]").forEach((svg) => {
    const variant = svg.getAttribute("data-case-diagram");
    renderCaseDiagram(svg, variant);
  });

  document.querySelectorAll("[data-concept-diagram]").forEach((svg) => {
    const variant = svg.getAttribute("data-concept-diagram");
    renderConceptDiagram(svg, variant);
  });
})();
