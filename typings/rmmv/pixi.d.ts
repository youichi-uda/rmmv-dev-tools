// Type definitions for PIXI.js v4 (minimal stub for RMMV)
// Only declares types used by RPG Maker MV core classes.
// MV uses PIXI v4, which differs from v5 in several ways:
// - No Application class (MV manages the renderer directly)
// - Separate WebGLRenderer / CanvasRenderer instead of unified Renderer
// - TilingSprite lives under PIXI.extras
// - No RenderTexture.create() factory

declare namespace PIXI {
  class DisplayObject {
    x: number;
    y: number;
    visible: boolean;
    alpha: number;
    rotation: number;
    scale: ObservablePoint;
    pivot: ObservablePoint;
    skew: ObservablePoint;
    worldVisible: boolean;
    worldAlpha: number;
    worldTransform: Matrix;
    parent: Container | null;
    filters: Filter[] | null;
    mask: DisplayObject | Graphics | null;
    filterArea: Rectangle | null;
    interactive: boolean;
    buttonMode: boolean;
    renderable: boolean;
    destroy(options?: { children?: boolean }): void;
    updateTransform(): void;
    getBounds(skipUpdate?: boolean, rect?: Rectangle): Rectangle;
    getLocalBounds(rect?: Rectangle): Rectangle;
    toGlobal(position: Point): Point;
    toLocal(position: Point, from?: DisplayObject): Point;
    setTransform(
      x?: number, y?: number,
      scaleX?: number, scaleY?: number,
      rotation?: number,
      skewX?: number, skewY?: number,
      pivotX?: number, pivotY?: number
    ): DisplayObject;
  }

  class Container extends DisplayObject {
    children: DisplayObject[];
    addChild<T extends DisplayObject>(child: T): T;
    addChildAt<T extends DisplayObject>(child: T, index: number): T;
    removeChild<T extends DisplayObject>(child: T): T;
    removeChildAt(index: number): DisplayObject;
    removeChildren(beginIndex?: number, endIndex?: number): DisplayObject[];
    getChildAt(index: number): DisplayObject;
    getChildIndex(child: DisplayObject): number;
    setChildIndex(child: DisplayObject, index: number): void;
    swapChildren(child: DisplayObject, child2: DisplayObject): void;
    width: number;
    height: number;
  }

  class Sprite extends Container {
    constructor(texture?: Texture);
    texture: Texture;
    anchor: ObservablePoint;
    blendMode: number;
    tint: number;
    width: number;
    height: number;
    pluginName: string;
    static from(source: string | Texture | HTMLCanvasElement): Sprite;
    static fromImage(imageUrl: string, crossorigin?: boolean, scaleMode?: number): Sprite;
  }

  class Graphics extends Container {
    beginFill(color?: number, alpha?: number): Graphics;
    endFill(): Graphics;
    lineStyle(lineWidth?: number, color?: number, alpha?: number): Graphics;
    moveTo(x: number, y: number): Graphics;
    lineTo(x: number, y: number): Graphics;
    drawRect(x: number, y: number, width: number, height: number): Graphics;
    drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): Graphics;
    drawCircle(x: number, y: number, radius: number): Graphics;
    drawEllipse(x: number, y: number, width: number, height: number): Graphics;
    drawPolygon(path: number[] | Point[]): Graphics;
    arc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): Graphics;
    bezierCurveTo(cpX: number, cpY: number, cpX2: number, cpY2: number, toX: number, toY: number): Graphics;
    quadraticCurveTo(cpX: number, cpY: number, toX: number, toY: number): Graphics;
    closePath(): Graphics;
    clear(): Graphics;
    clone(): Graphics;
    boundsPadding: number;
    tint: number;
    blendMode: number;
  }

  class Point {
    constructor(x?: number, y?: number);
    x: number;
    y: number;
    set(x?: number, y?: number): void;
    clone(): Point;
    copy(p: Point | ObservablePoint): void;
    equals(p: Point): boolean;
  }

  class ObservablePoint {
    constructor(cb: () => void, scope: unknown, x?: number, y?: number);
    x: number;
    y: number;
    set(x?: number, y?: number): void;
    copy(p: Point | ObservablePoint): void;
  }

  class Rectangle {
    constructor(x?: number, y?: number, width?: number, height?: number);
    x: number;
    y: number;
    width: number;
    height: number;
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly bottom: number;
    static readonly EMPTY: Rectangle;
    contains(x: number, y: number): boolean;
    clone(): Rectangle;
    copy(rectangle: Rectangle): Rectangle;
    fit(rectangle: Rectangle): void;
    pad(paddingX: number, paddingY: number): void;
  }

  class Matrix {
    a: number;
    b: number;
    c: number;
    d: number;
    tx: number;
    ty: number;
    static readonly IDENTITY: Matrix;
    set(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
    translate(x: number, y: number): Matrix;
    scale(x: number, y: number): Matrix;
    rotate(angle: number): Matrix;
    append(matrix: Matrix): Matrix;
    prepend(matrix: Matrix): Matrix;
    invert(): Matrix;
    identity(): Matrix;
    clone(): Matrix;
    copy(matrix: Matrix): Matrix;
    apply(pos: Point, newPos?: Point): Point;
    applyInverse(pos: Point, newPos?: Point): Point;
  }

  class Texture {
    static readonly EMPTY: Texture;
    static readonly WHITE: Texture;
    static fromImage(imageUrl: string, crossorigin?: boolean, scaleMode?: number): Texture;
    static fromCanvas(canvas: HTMLCanvasElement, scaleMode?: number): Texture;
    static fromFrame(frameId: string): Texture;
    static from(source: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | BaseTexture): Texture;
    baseTexture: BaseTexture;
    frame: Rectangle;
    orig: Rectangle;
    trim: Rectangle | null;
    width: number;
    height: number;
    valid: boolean;
    requiresUpdate: boolean;
    update(): void;
    destroy(destroyBase?: boolean): void;
    clone(): Texture;
    _updateUvs(): void;
  }

  class BaseTexture {
    static from(source: string | HTMLImageElement | HTMLCanvasElement): BaseTexture;
    static fromImage(imageUrl: string, crossorigin?: boolean, scaleMode?: number): BaseTexture;
    static fromCanvas(canvas: HTMLCanvasElement, scaleMode?: number): BaseTexture;
    width: number;
    height: number;
    realWidth: number;
    realHeight: number;
    resolution: number;
    scaleMode: number;
    hasLoaded: boolean;
    isLoading: boolean;
    source: HTMLImageElement | HTMLCanvasElement;
    premultipliedAlpha: boolean;
    mipmap: boolean;
    update(): void;
    destroy(): void;
    on(event: string, fn: Function, context?: unknown): this;
    once(event: string, fn: Function, context?: unknown): this;
    off(event: string, fn?: Function, context?: unknown): this;
  }

  class RenderTexture extends Texture {
    constructor(baseRenderTexture: BaseRenderTexture, frame?: Rectangle);
    resize(width: number, height: number, doNotResizeBaseTexture?: boolean): void;
  }

  class BaseRenderTexture extends BaseTexture {
    constructor(width?: number, height?: number, scaleMode?: number, resolution?: number);
  }

  class Filter {
    constructor(vertexSrc?: string, fragmentSrc?: string, uniforms?: Record<string, unknown>);
    uniforms: Record<string, unknown>;
    enabled: boolean;
    padding: number;
    resolution: number;
    blendMode: number;
    vertexSrc: string;
    fragmentSrc: string;
  }

  class ColorMatrixFilter extends Filter {
    brightness(b: number, multiply?: boolean): void;
    hue(rotation: number, multiply?: boolean): void;
    saturate(amount?: number, multiply?: boolean): void;
    reset(): void;
  }

  // ── Renderers (PIXI v4 has separate WebGL and Canvas renderers) ──

  interface RendererOptions {
    view?: HTMLCanvasElement;
    transparent?: boolean;
    autoResize?: boolean;
    antialias?: boolean;
    resolution?: number;
    clearBeforeRender?: boolean;
    backgroundColor?: number;
    roundPixels?: boolean;
    width?: number;
    height?: number;
  }

  class SystemRenderer {
    type: number;
    width: number;
    height: number;
    view: HTMLCanvasElement;
    resolution: number;
    transparent: boolean;
    autoResize: boolean;
    roundPixels: boolean;
    backgroundColor: number;
    resize(width: number, height: number): void;
    destroy(removeView?: boolean): void;
  }

  class WebGLRenderer extends SystemRenderer {
    constructor(width?: number, height?: number, options?: RendererOptions);
    constructor(options?: RendererOptions);
    gl: WebGLRenderingContext;
    render(displayObject: DisplayObject, renderTexture?: RenderTexture, clear?: boolean): void;
    generateTexture(displayObject: DisplayObject, scaleMode?: number, resolution?: number): RenderTexture;
  }

  class CanvasRenderer extends SystemRenderer {
    constructor(width?: number, height?: number, options?: RendererOptions);
    constructor(options?: RendererOptions);
    context: CanvasRenderingContext2D;
    render(displayObject: DisplayObject, renderTexture?: RenderTexture, clear?: boolean): void;
    generateTexture(displayObject: DisplayObject, scaleMode?: number, resolution?: number): RenderTexture;
  }

  // ── Ticker ──

  class Ticker {
    add(fn: (deltaTime: number) => void, context?: unknown): Ticker;
    remove(fn: (deltaTime: number) => void, context?: unknown): Ticker;
    start(): void;
    stop(): void;
    readonly FPS: number;
    readonly deltaTime: number;
    speed: number;
    started: boolean;
  }

  // In PIXI v4, there is a shared ticker instance
  namespace ticker {
    const shared: Ticker;
  }

  // ── extras namespace (PIXI v4 puts TilingSprite here) ──

  namespace extras {
    class TilingSprite extends Sprite {
      constructor(texture: Texture, width?: number, height?: number);
      tilePosition: ObservablePoint;
      tileScale: ObservablePoint;
      clampMargin: number;
      uvRespectAnchor: boolean;
      width: number;
      height: number;
    }

    class BitmapText extends Container {
      constructor(text: string, style?: { font?: string | { name?: string; size?: number }; align?: string; tint?: number });
      text: string;
      textWidth: number;
      textHeight: number;
      tint: number;
    }
  }

  // ── Utilities ──

  namespace utils {
    function rgb2hex(rgb: [number, number, number]): number;
    function hex2rgb(hex: number, out?: [number, number, number]): [number, number, number];
    function hex2string(hex: number): string;
    function string2hex(string: string): number;
    function isWebGLSupported(): boolean;
    const TextureCache: Record<string, Texture>;
    const BaseTextureCache: Record<string, BaseTexture>;
  }

  // ── Constants ──

  const BLEND_MODES: {
    NORMAL: number;
    ADD: number;
    MULTIPLY: number;
    SCREEN: number;
    OVERLAY: number;
    DARKEN: number;
    LIGHTEN: number;
    COLOR_DODGE: number;
    COLOR_BURN: number;
    HARD_LIGHT: number;
    SOFT_LIGHT: number;
    DIFFERENCE: number;
    EXCLUSION: number;
    HUE: number;
    SATURATION: number;
    COLOR: number;
    LUMINOSITY: number;
  };

  const SCALE_MODES: {
    NEAREST: number;
    LINEAR: number;
  };

  const RENDERER_TYPE: {
    UNKNOWN: number;
    WEBGL: number;
    CANVAS: number;
  };

  const WRAP_MODES: {
    CLAMP: number;
    REPEAT: number;
    MIRRORED_REPEAT: number;
  };

  // ── Auto-detect renderer factory ──

  function autoDetectRenderer(width: number, height: number, options?: RendererOptions): WebGLRenderer | CanvasRenderer;
  function autoDetectRenderer(options?: RendererOptions): WebGLRenderer | CanvasRenderer;
}
