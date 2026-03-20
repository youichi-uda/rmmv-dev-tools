import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { requirePro } from '../license/gumroad';
import { t } from '../i18n';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PluginMeta {
  name: string;
}

interface GraphData {
  plugins: PluginMeta[];
  loadOrder: string[];
}

// ---------------------------------------------------------------------------
// Annotation parsing
// ---------------------------------------------------------------------------

/**
 * Parses a single plugin JS file and extracts basic metadata.
 * MV has no @base/@orderAfter/@orderBefore, so we only collect names.
 */
function parsePluginFile(filePath: string): PluginMeta | undefined {
  const content = fs.readFileSync(filePath, 'utf-8');
  const name = path.basename(filePath, '.js');

  // Only look at the first annotation block (/*: ... */)
  const blockMatch = content.match(/\/\*:([\s\S]*?)\*\//);
  if (!blockMatch) return undefined;

  return { name };
}

/**
 * Reads the load order from `js/plugins.js`.
 */
function readLoadOrder(pluginsJsPath: string): string[] {
  if (!fs.existsSync(pluginsJsPath)) return [];

  const content = fs.readFileSync(pluginsJsPath, 'utf-8');
  // plugins.js defines `var $plugins = [ ... ];`
  const match = content.match(/\$plugins\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) return [];

  try {
    const arr: { name: string }[] = JSON.parse(match[1]);
    return arr.map((p) => p.name);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Graph analysis
// ---------------------------------------------------------------------------

/**
 * Builds the graph data from a project folder.
 * MV version shows load order only (no dependency edges).
 */
function buildGraphData(projectRoot: string): GraphData {
  const pluginsDir = path.join(projectRoot, 'js', 'plugins');
  const pluginsJsPath = path.join(projectRoot, 'js', 'plugins.js');

  const plugins: PluginMeta[] = [];

  if (fs.existsSync(pluginsDir)) {
    for (const file of fs.readdirSync(pluginsDir)) {
      if (!file.endsWith('.js')) continue;
      const meta = parsePluginFile(path.join(pluginsDir, file));
      if (meta) {
        plugins.push(meta);
      }
    }
  }

  const loadOrder = readLoadOrder(pluginsJsPath);

  return { plugins, loadOrder };
}

// ---------------------------------------------------------------------------
// Webview
// ---------------------------------------------------------------------------

let currentPanel: vscode.WebviewPanel | undefined;

/**
 * Creates or reveals the plugin load order webview panel.
 */
export function showDependencyGraph(context: vscode.ExtensionContext): void {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    vscode.window.showErrorMessage(t('noWorkspaceFolder'));
    return;
  }

  const projectRoot = folders[0].uri.fsPath;
  const data = buildGraphData(projectRoot);

  if (currentPanel) {
    currentPanel.reveal(vscode.ViewColumn.One);
    currentPanel.webview.html = getWebviewContent(data);
    return;
  }

  currentPanel = vscode.window.createWebviewPanel(
    'rmmvDependencyGraph',
    t('graph.panelTitle'),
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  currentPanel.webview.html = getWebviewContent(data);

  currentPanel.onDidDispose(() => {
    currentPanel = undefined;
  }, null, context.subscriptions);
}

/**
 * Registers the dependency graph command.
 */
export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('rmmv.showDependencyGraph', () => {
      if (!requirePro('Dependency Graph')) return;
      showDependencyGraph(context);
    })
  );
}

// ---------------------------------------------------------------------------
// HTML generation
// ---------------------------------------------------------------------------

function getWebviewContent(data: GraphData): string {
  const graphJson = JSON.stringify(data);

  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Plugin Load Order</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #1e1e2e;
      color: #cdd6f4;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      overflow: hidden;
    }
    #header {
      padding: 12px 20px;
      background: #181825;
      border-bottom: 1px solid #313244;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    #header h1 {
      font-size: 14px;
      font-weight: 600;
    }
    #header .stat {
      font-size: 12px;
      color: #a6adc8;
    }
    #graph-container {
      width: 100vw;
      height: calc(100vh - 48px);
      overflow: hidden;
      cursor: grab;
    }
    #graph-container.panning {
      cursor: grabbing;
    }
    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
    #zoom-controls {
      position: fixed;
      bottom: 16px;
      left: 16px;
      display: flex;
      gap: 4px;
      z-index: 10;
    }
    #zoom-controls button {
      width: 32px;
      height: 32px;
      border: 1px solid #313244;
      border-radius: 6px;
      background: #181825;
      color: #cdd6f4;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #zoom-controls button:hover {
      background: #313244;
    }
    #zoom-level {
      font-size: 11px;
      color: #6c7086;
      line-height: 32px;
      padding: 0 6px;
    }
    .node rect {
      fill: #313244;
      stroke: #45475a;
      stroke-width: 1;
      rx: 6;
      ry: 6;
      cursor: default;
    }
    .node text {
      fill: #cdd6f4;
      font-size: 13px;
      font-family: inherit;
      pointer-events: none;
    }
    .node .order-label {
      fill: #6c7086;
      font-size: 10px;
    }
    .no-plugins {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80vh;
      color: #6c7086;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div id="header">
    <h1>Plugin Load Order</h1>
    <span class="stat" id="stat"></span>
  </div>
  <div id="graph-container">
    <svg id="graph"></svg>
  </div>
  <div id="zoom-controls">
    <button id="zoom-in" title="Zoom In">+</button>
    <button id="zoom-out" title="Zoom Out">\u2212</button>
    <button id="zoom-fit" title="Fit to View">\u229E</button>
    <span id="zoom-level">100%</span>
  </div>

  <script>
  (function() {
    const data = ${graphJson};
    const plugins = data.plugins;
    const loadOrder = data.loadOrder;

    // Stats
    document.getElementById('stat').textContent =
      plugins.length + ' plugins in load order';

    if (plugins.length === 0) {
      document.getElementById('graph-container').innerHTML =
        '<div class="no-plugins">No plugins with annotation blocks found in js/plugins/</div>';
      return;
    }

    // Use load order for display, add any plugins not in load order at the end
    const allNames = new Set();
    for (const p of plugins) allNames.add(p.name);
    const nameList = [...loadOrder.filter(n => allNames.has(n))];
    for (const p of plugins) {
      if (!nameList.includes(p.name)) nameList.push(p.name);
    }

    // Layout parameters
    const nodeW = 180;
    const nodeH = 44;
    const padY = 16;
    const marginTop = 30;
    const marginLeft = 30;

    // Compute positions (single column, load order)
    const positions = {};
    const loadOrderIdx = {};
    loadOrder.forEach((n, i) => { loadOrderIdx[n] = i; });

    let svgW = marginLeft + nodeW + marginLeft;
    let svgH = marginTop;

    for (let i = 0; i < nameList.length; i++) {
      const x = marginLeft;
      const y = marginTop + i * (nodeH + padY);
      positions[nameList[i]] = { x, y };
      svgH = Math.max(svgH, y + nodeH + marginTop);
    }

    svgW = Math.max(svgW, 400);
    svgH = Math.max(svgH, 200);

    // Render SVG
    const svg = document.getElementById('graph');
    svg.setAttribute('width', svgW);
    svg.setAttribute('height', svgH);

    const ns = 'http://www.w3.org/2000/svg';

    // Draw nodes
    for (const name of nameList) {
      const pos = positions[name];
      if (!pos) continue;

      const g = document.createElementNS(ns, 'g');
      g.setAttribute('class', 'node');
      g.setAttribute('transform', 'translate(' + pos.x + ',' + pos.y + ')');

      const rect = document.createElementNS(ns, 'rect');
      rect.setAttribute('width', nodeW);
      rect.setAttribute('height', nodeH);
      g.appendChild(rect);

      const text = document.createElementNS(ns, 'text');
      text.setAttribute('x', nodeW / 2);
      text.setAttribute('y', nodeH / 2 + (loadOrderIdx[name] !== undefined ? -2 : 4));
      text.setAttribute('text-anchor', 'middle');
      text.textContent = name;
      g.appendChild(text);

      if (loadOrderIdx[name] !== undefined) {
        const orderText = document.createElementNS(ns, 'text');
        orderText.setAttribute('class', 'order-label');
        orderText.setAttribute('x', nodeW / 2);
        orderText.setAttribute('y', nodeH / 2 + 14);
        orderText.setAttribute('text-anchor', 'middle');
        orderText.textContent = '#' + (loadOrderIdx[name] + 1) + ' in load order';
        g.appendChild(orderText);
      }

      svg.appendChild(g);
    }

    // ── Zoom & Pan ──────────────────────────────────────────────────
    const container = document.getElementById('graph-container');
    const zoomLevelEl = document.getElementById('zoom-level');
    let scale = 1;
    let panX = 0;
    let panY = 0;
    let isPanning = false;
    let startX = 0;
    let startY = 0;

    function updateViewBox() {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      const vw = cw / scale;
      const vh = ch / scale;
      svg.setAttribute('viewBox', panX + ' ' + panY + ' ' + vw + ' ' + vh);
      zoomLevelEl.textContent = Math.round(scale * 100) + '%';
    }

    function zoomAt(factor, cx, cy) {
      const svgX = panX + cx / scale;
      const svgY = panY + cy / scale;
      const newScale = Math.max(0.1, Math.min(5, scale * factor));
      panX = svgX - cx / newScale;
      panY = svgY - cy / newScale;
      scale = newScale;
      updateViewBox();
    }

    function fitToView() {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (svgW <= 0 || svgH <= 0) return;
      scale = Math.min(cw / svgW, ch / svgH, 2);
      panX = -(cw / scale - svgW) / 2;
      panY = 0;
      updateViewBox();
    }

    container.addEventListener('wheel', function(e) {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      zoomAt(factor, cx, cy);
    }, { passive: false });

    container.addEventListener('mousedown', function(e) {
      if (e.button !== 0) return;
      isPanning = true;
      startX = e.clientX;
      startY = e.clientY;
      container.classList.add('panning');
    });

    window.addEventListener('mousemove', function(e) {
      if (!isPanning) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      panX -= dx / scale;
      panY -= dy / scale;
      startX = e.clientX;
      startY = e.clientY;
      updateViewBox();
    });

    window.addEventListener('mouseup', function() {
      isPanning = false;
      container.classList.remove('panning');
    });

    document.getElementById('zoom-in').addEventListener('click', function() {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      zoomAt(1.3, cw / 2, ch / 2);
    });
    document.getElementById('zoom-out').addEventListener('click', function() {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      zoomAt(1 / 1.3, cw / 2, ch / 2);
    });
    document.getElementById('zoom-fit').addEventListener('click', fitToView);

    fitToView();
  })();
  </script>
</body>
</html>`;
}
