// Type definitions for RPG Maker MV rpg_core.js
// RPG Maker MV core module
// Definitions for rpg_core.js (MV 1.6.x)

// ---------------------------------------------------------------------------
// JsExtensions - augment standard prototypes
// ---------------------------------------------------------------------------

interface Array<T> {
    clone(): T[];
    contains(element: T): boolean;
    equals(array: T[]): boolean;
    remove(element: T): T[];
}

interface Math {
    randomInt(max: number): number;
}

interface Number {
    clamp(min: number, max: number): number;
    mod(n: number): number;
    padZero(length: number): string;
}

interface String {
    contains(string: string): boolean;
    format(...args: unknown[]): string;
    padZero(length: number): string;
}

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------

declare class Utils {
    private constructor();

    static readonly RPGMAKER_NAME: string;
    static readonly RPGMAKER_VERSION: string;

    static isOptionValid(name: string): boolean;
    static isNwjs(): boolean;
    static isMobileDevice(): boolean;
    static isMobileSafari(): boolean;
    static isAndroidChrome(): boolean;
    static canReadGameFiles(): boolean;
    static rgbToCssColor(r: number, g: number, b: number): string;
    static generateRuntimeId(): number;
    static isSupportPassiveEvent(): boolean;
}

// ---------------------------------------------------------------------------
// CacheEntry
// ---------------------------------------------------------------------------

declare class CacheEntry {
    constructor(cache: CacheMap, key: string, item: any);

    free: boolean;
    reservationId: number;
    touch: number;
    cached: boolean;
    key: string;
    item: any;

    allocate(reservationId: number): CacheEntry;
    setTimeToLive(ticks: number, seconds: number): CacheEntry;
    isStillAlive(): boolean;
}

// ---------------------------------------------------------------------------
// CacheMap
// ---------------------------------------------------------------------------

declare class CacheMap {
    constructor(manager: ImageManager);

    _inner: { [key: string]: CacheEntry };
    _lastCheckTTL: number;
    _delayCheckTTL: number;
    _updateTicks: number;
    _updateSeconds: number;

    checkTTL(): void;
    getItem(key: string): any;
    clear(): void;
    setItem(key: string, item: any): CacheEntry;
    update(ticks: number, delta?: number): void;
    isReady(): boolean;
}

// ---------------------------------------------------------------------------
// ImageCache
// ---------------------------------------------------------------------------

declare class ImageCache {
    constructor();

    static limit: number;

    _items: { [key: string]: { bitmap: Bitmap; touch: number; key: string } };

    initialize(): void;
    add(key: string, value: Bitmap): void;
    get(key: string): Bitmap | null;
    reserve(key: string, value: Bitmap, reservationId: number): void;
    releaseReservation(reservationId: number): void;
    isReady(): boolean;
    getErrorBitmap(): Bitmap | null;
}

// ---------------------------------------------------------------------------
// RequestQueue
// ---------------------------------------------------------------------------

declare class RequestQueue {
    constructor();

    _queue: any[];

    initialize(): void;
    enqueue(key: string, value: Bitmap): void;
    update(): void;
    rpiority(): void;
    clear(): void;
}

// ---------------------------------------------------------------------------
// Point
// ---------------------------------------------------------------------------

declare class Point extends PIXI.Point {
    constructor(x?: number, y?: number);
    initialize(x?: number, y?: number): void;
}

// ---------------------------------------------------------------------------
// Rectangle
// ---------------------------------------------------------------------------

declare class Rectangle extends PIXI.Rectangle {
    constructor(x?: number, y?: number, width?: number, height?: number);
    initialize(x?: number, y?: number, width?: number, height?: number): void;
}

// ---------------------------------------------------------------------------
// Bitmap
// ---------------------------------------------------------------------------

declare class Bitmap {
    constructor(width?: number, height?: number);
    initialize(width?: number, height?: number): void;

    fontFace: string;
    fontSize: number;
    fontBold: boolean;
    fontItalic: boolean;
    textColor: string;
    outlineColor: string;
    outlineWidth: number;

    readonly url: string;
    readonly baseTexture: PIXI.BaseTexture;
    readonly canvas: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;
    readonly width: number;
    readonly height: number;

    smooth: boolean;
    paintOpacity: number;

    static load(url: string): Bitmap;
    static snap(stage: Stage): Bitmap;
    static request(url: string): Bitmap;

    isReady(): boolean;
    isError(): boolean;
    touch(): void;
    destroy(): void;
    resize(width: number, height: number): void;
    blt(source: Bitmap, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw?: number, dh?: number): void;
    getPixel(x: number, y: number): string;
    getAlphaPixel(x: number, y: number): number;
    clearRect(x: number, y: number, width: number, height: number): void;
    clear(): void;
    fillRect(x: number, y: number, width: number, height: number, color: string): void;
    fillAll(color: string): void;
    gradientFillRect(x: number, y: number, width: number, height: number, color1: string, color2: string, vertical?: boolean): void;
    drawCircle(x: number, y: number, radius: number, color: string): void;
    drawText(text: string, x: number, y: number, maxWidth: number, lineHeight: number, align?: string): void;
    measureTextWidth(text: string): number;
    addLoadListener(listener: (bitmap: Bitmap) => void): void;
    rotateHue(offset: number): void;
    blur(): void;

    _canvas: HTMLCanvasElement | null;
    _context: CanvasRenderingContext2D | null;
    _baseTexture: PIXI.BaseTexture | null;
    _image: HTMLImageElement | null;
    _url: string;
    _paintOpacity: number;
    _smooth: boolean;
    _loadListeners: Array<(bitmap: Bitmap) => void>;
    _loadingState: "none" | "pending" | "purged" | "requesting" | "requestCompleted" | "decrypting" | "decryptCompleted" | "loaded" | "error";
    _decodeAfterRequest: boolean;

    _makeFontNameText(): string;
    _drawTextOutline(text: string, tx: number, ty: number, maxWidth: number): void;
    _drawTextBody(text: string, tx: number, ty: number, maxWidth: number): void;
    _onLoad(): void;
    _callLoadListeners(): void;
    _onError(): void;
    _setDirty(): void;
    decode(): void;
}

// ---------------------------------------------------------------------------
// Graphics
// ---------------------------------------------------------------------------

declare class Graphics {
    private constructor();

    static frameCount: number;
    static boxWidth: number;
    static boxHeight: number;
    static width: number;
    static height: number;
    static _scale: number;

    static _renderer: PIXI.SystemRenderer | null;
    static _canvas: HTMLCanvasElement | null;
    static _app: PIXI.Application | null;
    static _realScale: number;

    static initialize(width?: number, height?: number, type?: string): void;
    static render(stage?: Stage): void;
    static isWebGL(): boolean;
    static callGC(): void;
    static canUseDifferenceBlend(): boolean;
    static canUseSaturationBlend(): boolean;
    static hasWebGL(): boolean;

    static setLoadingImage(src: string): void;
    static startLoading(): void;
    static updateLoading(): void;
    static endLoading(): void;
    static printLoadingError(url: string): void;
    static eraseLoadingError(): void;
    static printError(name: string, message: string): void;

    static showFps(): void;
    static hideFps(): void;
    static loadFont(name: string, url: string): void;
    static isFontLoaded(name: string): boolean;
    static playVideo(src: string): void;
    static isVideoPlaying(): boolean;
    static canPlayVideoType(type: string): boolean;
    static setVideoVolume(value: number): void;

    static pageToCanvasX(x: number): number;
    static pageToCanvasY(y: number): number;
    static isInsideCanvas(x: number, y: number): boolean;

    static _switchFPSMeter(): void;
    static _switchStretchMode(): void;
    static _switchFullScreen(): void;
    static _isFullScreen(): boolean;
    static _requestFullScreen(): void;
    static _cancelFullScreen(): void;
    static _createAllElements(): void;
    static _updateAllElements(): void;
    static _updateRealScale(): void;
    static _makeErrorHtml(name: string, message: string): string;
    static _defaultStretchMode(): boolean;
    static _testCanvasBlendModes(): void;
    static _modifyExistingElements(): void;
    static _createErrorPrinter(): void;
    static _updateErrorPrinter(): void;
    static _createCanvas(): void;
    static _updateCanvas(): void;
    static _createVideo(): void;
    static _updateVideo(): void;
    static _createUpperCanvas(): void;
    static _updateUpperCanvas(): void;
    static _clearUpperCanvas(): void;
    static _paintUpperCanvas(): void;
    static _createRenderer(): void;
    static _updateRenderer(): void;
    static _createFPSMeter(): void;
    static _createModeBox(): void;
    static _createGameFontLoader(): void;
    static _createFontLoader(name: string): void;
    static _centerElement(element: HTMLElement): void;
    static _disableTextSelection(): void;
    static _disableContextMenu(): void;
    static _applyCanvasFilter(): void;
    static _clearCanvasFilter(): void;
    static _setupEventHandlers(): void;
    static _onWindowResize(): void;
    static _onKeyDown(event: KeyboardEvent): void;
    static _onTouchEnd(event: TouchEvent): void;
    static _stretchWidth(): number;
    static _stretchHeight(): number;
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

declare class Input {
    private constructor();

    static keyRepeatWait: number;
    static keyRepeatInterval: number;
    static keyMapper: Record<number, string>;
    static gamepadMapper: Record<number, string>;

    static readonly dir4: number;
    static readonly dir8: number;
    static readonly date: number;

    static initialize(): void;
    static clear(): void;
    static update(): void;
    static isPressed(keyName: string): boolean;
    static isTriggered(keyName: string): boolean;
    static isRepeated(keyName: string): boolean;
    static isLongPressed(keyName: string): boolean;

    static _currentState: Record<string, boolean>;
    static _previousState: Record<string, boolean>;
    static _gamepadStates: boolean[][];
    static _latestButton: string | null;
    static _pressedTime: number;
    static _dir4: number;
    static _dir8: number;
    static _preferredAxis: string;
    static _date: number;

    static _setupEventHandlers(): void;
    static _onKeyDown(event: KeyboardEvent): void;
    static _shouldPreventDefault(keyCode: number): boolean;
    static _onKeyUp(event: KeyboardEvent): void;
    static _onLostFocus(): void;
    static _pollGamepads(): void;
    static _updateGamepadState(gamepad: Gamepad): void;
    static _updateDirection(): void;
    static _signX(): number;
    static _signY(): number;
    static _makeNumpadDirection(x: number, y: number): number;
    static _isEscapeCompatible(keyName: string): boolean;
}

// ---------------------------------------------------------------------------
// TouchInput
// ---------------------------------------------------------------------------

declare class TouchInput {
    private constructor();

    static keyRepeatWait: number;
    static keyRepeatInterval: number;

    static readonly wheelX: number;
    static readonly wheelY: number;
    static readonly x: number;
    static readonly y: number;
    static readonly date: number;

    static initialize(): void;
    static clear(): void;
    static update(): void;
    static isPressed(): boolean;
    static isTriggered(): boolean;
    static isRepeated(): boolean;
    static isLongPressed(): boolean;
    static isCancelled(): boolean;
    static isMoved(): boolean;
    static isReleased(): boolean;

    static _mousePressed: boolean;
    static _screenPressed: boolean;
    static _pressedTime: number;
    static _events: {
        triggered: boolean;
        cancelled: boolean;
        moved: boolean;
        released: boolean;
        wheelX: number;
        wheelY: number;
    };
    static _x: number;
    static _y: number;
    static _date: number;

    static _setupEventHandlers(): void;
    static _onMouseDown(event: MouseEvent): void;
    static _onLeftButtonDown(event: MouseEvent): void;
    static _onMiddleButtonDown(event: MouseEvent): void;
    static _onRightButtonDown(event: MouseEvent): void;
    static _onMouseMove(event: MouseEvent): void;
    static _onMouseUp(event: MouseEvent): void;
    static _onWheel(event: WheelEvent): void;
    static _onTouchStart(event: TouchEvent): void;
    static _onTouchMove(event: TouchEvent): void;
    static _onTouchEnd(event: TouchEvent): void;
    static _onTouchCancel(event: TouchEvent): void;
    static _onPointerDown(event: PointerEvent): void;
    static _onTrigger(x: number, y: number): void;
    static _onCancel(x: number, y: number): void;
    static _onMove(x: number, y: number): void;
    static _onRelease(x: number, y: number): void;
}

// ---------------------------------------------------------------------------
// Sprite
// ---------------------------------------------------------------------------

declare class Sprite extends PIXI.Sprite {
    constructor(bitmap?: Bitmap);
    initialize(bitmap?: Bitmap): void;

    spriteId: number;

    dy: number;
    ry: number;

    bitmap: Bitmap | null;
    width: number;
    height: number;
    opacity: number;

    static _counter: number;
    static _emptyBaseTexture: PIXI.BaseTexture | null;

    update(): void;
    move(x: number, y: number): void;
    setFrame(x: number, y: number, width: number, height: number): void;
    getBlendColor(): [number, number, number, number];
    setBlendColor(color: [number, number, number, number]): void;
    getColorTone(): [number, number, number, number];
    setColorTone(tone: [number, number, number, number]): void;

    _bitmap: Bitmap | null;
    _frame: Rectangle;
    _realFrame: Rectangle;
    _blendColor: [number, number, number, number];
    _colorTone: [number, number, number, number];
    _isPicture: boolean;

    _onBitmapLoad(bitmapLoaded: Bitmap): void;
    _refresh(): void;
    _isInBitmapRect(x: number, y: number, w: number, h: number): boolean;
    _needsTint(): boolean;
    _createTinter(w: number, h: number): void;
    _executeTint(x: number, y: number, w: number, h: number): void;
    _updateTransform(): void;
}

// ---------------------------------------------------------------------------
// Tilemap
// ---------------------------------------------------------------------------

declare class Tilemap extends PIXI.Container {
    constructor();
    initialize(): void;

    tileWidth: number;
    tileHeight: number;
    origin: Point;
    flags: number[];
    animationCount: number;
    animationFrame: number;
    horizontalWrap: boolean;
    verticalWrap: boolean;

    width: number;
    height: number;

    bitmaps: Bitmap[];

    static readonly TILE_ID_B: number;
    static readonly TILE_ID_C: number;
    static readonly TILE_ID_D: number;
    static readonly TILE_ID_E: number;
    static readonly TILE_ID_A5: number;
    static readonly TILE_ID_A1: number;
    static readonly TILE_ID_A2: number;
    static readonly TILE_ID_A3: number;
    static readonly TILE_ID_A4: number;
    static readonly TILE_ID_MAX: number;

    static readonly FLOOR_AUTOTILE_TABLE: number[][][][];
    static readonly WALL_AUTOTILE_TABLE: number[][][][];
    static readonly WATERFALL_AUTOTILE_TABLE: number[][][][];

    static isVisibleTile(tileId: number): boolean;
    static isAutotile(tileId: number): boolean;
    static getAutotileKind(tileId: number): number;
    static getAutotileShape(tileId: number): number;
    static makeAutotileId(kind: number, shape: number): number;
    static isSameKindTile(tileID1: number, tileID2: number): boolean;
    static isTileA1(tileId: number): boolean;
    static isTileA2(tileId: number): boolean;
    static isTileA3(tileId: number): boolean;
    static isTileA4(tileId: number): boolean;
    static isTileA5(tileId: number): boolean;
    static isWaterTile(tileId: number): boolean;
    static isWaterfallTile(tileId: number): boolean;
    static isGroundTile(tileId: number): boolean;
    static isShadowingTile(tileId: number): boolean;
    static isRoofTile(tileId: number): boolean;
    static isWallTopTile(tileId: number): boolean;
    static isWallSideTile(tileId: number): boolean;
    static isWallTile(tileId: number): boolean;
    static isFloorTypeAutotile(tileId: number): boolean;
    static isWallTypeAutotile(tileId: number): boolean;
    static isWaterfallTypeAutotile(tileId: number): boolean;

    setData(width: number, height: number, data: number[]): void;
    isReady(): boolean;
    update(): void;
    refresh(): void;
    refreshTileset(): void;
    updateTransform(): void;

    _mapWidth: number;
    _mapHeight: number;
    _mapData: number[] | null;
    _layerWidth: number;
    _layerHeight: number;
    _lastTiles: number[][][];
    _lowerBitmap: Bitmap | null;
    _upperBitmap: Bitmap | null;
    _lowerLayer: Sprite | null;
    _upperLayer: Sprite | null;
    _needsRepaint: boolean;
    _lastAnimationFrame: number;
    _lastStartX: number;
    _lastStartY: number;

    _createLayers(): void;
    _updateLayerPositions(startX: number, startY: number): void;
    _paintAllTiles(startX: number, startY: number): void;
    _paintTiles(startX: number, startY: number, x: number, y: number): void;
    _readLastTiles(i: number, x: number, y: number): number[];
    _writeLastTiles(i: number, x: number, y: number, tiles: number[]): void;
    _drawTile(bitmap: Bitmap, tileId: number, dx: number, dy: number): void;
    _drawNormalTile(bitmap: Bitmap, tileId: number, dx: number, dy: number): void;
    _drawAutotile(bitmap: Bitmap, tileId: number, dx: number, dy: number): void;
    _drawTableEdge(bitmap: Bitmap, tileId: number, dx: number, dy: number): void;
    _drawShadow(bitmap: Bitmap, shadowBits: number, dx: number, dy: number): void;
    _readMapData(x: number, y: number, z: number): number;
    _isHigherTile(tileId: number): boolean;
    _isTableTile(tileId: number): boolean;
    _isOverpassPosition(mx: number, my: number): boolean;
    _sortChildren(): void;
    _compareChildOrder(a: PIXI.DisplayObject, b: PIXI.DisplayObject): number;
}

// ---------------------------------------------------------------------------
// ShaderTilemap
// ---------------------------------------------------------------------------

declare class ShaderTilemap extends Tilemap {
    constructor();

    roundPixels: boolean;

    _createLayers(): void;
    _updateLayerPositions(startX: number, startY: number): void;
    _paintAllTiles(startX: number, startY: number): void;
    _paintTiles(startX: number, startY: number, x: number, y: number): void;
    _drawTile(layer: any, tileId: number, dx: number, dy: number): void;
    _drawNormalTile(layer: any, tileId: number, dx: number, dy: number): void;
    _drawAutotile(layer: any, tileId: number, dx: number, dy: number): void;
    _drawTableEdge(layer: any, tileId: number, dx: number, dy: number): void;
    _drawShadow(layer: any, shadowBits: number, dx: number, dy: number): void;
}

// ---------------------------------------------------------------------------
// TilingSprite
// ---------------------------------------------------------------------------

declare class TilingSprite extends PIXI.extras.PictureTilingSprite {
    constructor(bitmap?: Bitmap);
    initialize(bitmap?: Bitmap): void;

    origin: Point;

    bitmap: Bitmap | null;
    opacity: number;

    update(): void;
    move(x: number, y: number, width: number, height: number): void;
    setFrame(x: number, y: number, width: number, height: number): void;
    updateTransform(): void;

    _bitmap: Bitmap | null;
    _width: number;
    _height: number;
    _frame: Rectangle;

    _onBitmapLoad(): void;
    _refresh(): void;
}

// ---------------------------------------------------------------------------
// ScreenSprite
// ---------------------------------------------------------------------------

declare class ScreenSprite extends PIXI.Container {
    constructor();
    initialize(): void;

    opacity: number;

    setBlack(): void;
    setWhite(): void;
    setColor(r: number, g: number, b: number): void;

    _red: number;
    _green: number;
    _blue: number;
    _colorText: string;
    _graphics: PIXI.Graphics;
}

// ---------------------------------------------------------------------------
// Window
// ---------------------------------------------------------------------------

declare class Window extends PIXI.Container {
    constructor();
    initialize(...args: any[]): void;

    origin: Point;
    active: boolean;
    downArrowVisible: boolean;
    upArrowVisible: boolean;
    pause: boolean;

    windowskin: Bitmap;
    contents: Bitmap;
    width: number;
    height: number;
    padding: number;
    margin: number;
    opacity: number;
    backOpacity: number;
    contentsOpacity: number;
    openness: number;

    update(): void;
    move(x: number, y: number, width: number, height: number): void;
    isOpen(): boolean;
    isClosed(): boolean;
    setCursorRect(x: number, y: number, width: number, height: number): void;
    setTone(r: number, g: number, b: number): void;
    addChildToBack(child: PIXI.DisplayObject): PIXI.DisplayObject;
    updateTransform(): void;

    _isWindow: boolean;
    _windowskin: Bitmap | null;
    _width: number;
    _height: number;
    _cursorRect: Rectangle;
    _openness: number;
    _animationCount: number;
    _padding: number;
    _margin: number;
    _colorTone: [number, number, number];
    _windowSpriteContainer: PIXI.Container;
    _windowBackSprite: Sprite;
    _windowCursorSprite: Sprite;
    _windowFrameSprite: Sprite;
    _windowContentsSprite: Sprite;
    _windowArrowSprites: Sprite[];
    _windowPauseSignSprite: Sprite;
    _downArrowSprite: Sprite;
    _upArrowSprite: Sprite;

    _createAllParts(): void;
    _onWindowskinLoad(): void;
    _refreshAllParts(): void;
    _refreshBack(): void;
    _refreshFrame(): void;
    _refreshCursor(): void;
    _refreshContents(): void;
    _refreshArrows(): void;
    _refreshPauseSign(): void;
    _updateCursor(): void;
    _updateContents(): void;
    _updateArrows(): void;
    _updatePauseSign(): void;
}

// ---------------------------------------------------------------------------
// WindowLayer
// ---------------------------------------------------------------------------

declare class WindowLayer extends PIXI.Container {
    constructor();
    initialize(): void;

    move(x: number, y: number, width: number, height: number): void;
    update(): void;
    render(renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer): void;

    _width: number;
    _height: number;

    _renderCanvas(renderer: PIXI.CanvasRenderer): void;
    _renderWebGL(renderer: PIXI.WebGLRenderer): void;
}

// ---------------------------------------------------------------------------
// Weather
// ---------------------------------------------------------------------------

declare class Weather extends PIXI.Container {
    constructor();
    initialize(): void;

    type: "none" | "rain" | "storm" | "snow";
    power: number;
    origin: Point;

    update(): void;

    _width: number;
    _height: number;
    _sprites: Sprite[];
    _rainBitmap: Bitmap;
    _stormBitmap: Bitmap;
    _snowBitmap: Bitmap;
    _dimmerSprite: ScreenSprite;

    _createBitmaps(): void;
    _createDimmer(): void;
    _updateDimmer(): void;
    _updateAllSprites(): void;
    _addSprite(): void;
    _removeSprite(): void;
    _updateSprite(sprite: Sprite): void;
    _updateRainSprite(sprite: Sprite): void;
    _updateStormSprite(sprite: Sprite): void;
    _updateSnowSprite(sprite: Sprite): void;
    _rebornSprite(sprite: Sprite): void;
}

// ---------------------------------------------------------------------------
// ToneFilter
// ---------------------------------------------------------------------------

declare class ToneFilter extends PIXI.Filter {
    constructor();
    initialize(): void;

    adjustHue(value: number): void;
    adjustSaturation(value?: number): void;
    adjustTone(r: number, g: number, b: number, gray?: number): void;
    reset(): void;
}

// ---------------------------------------------------------------------------
// ToneSprite
// ---------------------------------------------------------------------------

declare class ToneSprite extends PIXI.Container {
    constructor();
    initialize(): void;

    setTone(r: number, g: number, b: number, gray: number): void;

    _red: number;
    _green: number;
    _blue: number;
    _gray: number;

    _renderCanvas(renderer: PIXI.CanvasRenderer): void;
    _renderWebGL(renderer: PIXI.WebGLRenderer): void;
}

// ---------------------------------------------------------------------------
// Stage
// ---------------------------------------------------------------------------

declare class Stage extends PIXI.Container {
    constructor();
    initialize(): void;
}

// ---------------------------------------------------------------------------
// WebAudio
// ---------------------------------------------------------------------------

declare class WebAudio {
    constructor(url: string);
    initialize(url: string): void;

    readonly url: string;
    volume: number;
    pitch: number;
    pan: number;

    static initialize(noAudio?: boolean): boolean;
    static canPlayOgg(): boolean;
    static canPlayM4a(): boolean;
    static setMasterVolume(value: number): void;

    static _context: AudioContext | null;
    static _masterGainNode: GainNode | null;
    static _masterVolume: number;
    static _initialized: boolean;
    static _unlocked: boolean;

    static _createContext(): void;
    static _detectCodecs(): void;
    static _createMasterGainNode(): void;
    static _setupEventHandlers(): void;
    static _onTouchStart(): void;
    static _onVisibilityChange(): void;
    static _onHide(): void;
    static _onShow(): void;
    static _shouldMuteOnHide(): boolean;
    static _fadeIn(duration: number): void;
    static _fadeOut(duration: number): void;

    clear(): void;
    isReady(): boolean;
    isError(): boolean;
    isPlaying(): boolean;
    play(loop: boolean, offset?: number): void;
    stop(): void;
    seek(): number;
    fadeIn(duration: number): void;
    fadeOut(duration: number): void;
    addLoadListener(listener: () => void): void;
    addStopListener(listener: () => void): void;

    _buffer: AudioBuffer | null;
    _sourceNode: AudioBufferSourceNode | null;
    _gainNode: GainNode | null;
    _pannerNode: PannerNode | null;
    _totalTime: number;
    _sampleRate: number;
    _loopStart: number;
    _loopLength: number;
    _startTime: number;
    _volume: number;
    _pitch: number;
    _pan: number;
    _endTimer: number | null;
    _loadListeners: Array<() => void>;
    _stopListeners: Array<() => void>;
    _hasError: boolean;
    _autoPlay: boolean;
    _isLoaded: boolean;
    _url: string;
    _loop: boolean;

    _load(url: string): void;
    _onXhrLoad(xhr: XMLHttpRequest): void;
    _startPlaying(loop: boolean, offset: number): void;
    _createNodes(): void;
    _connectNodes(): void;
    _removeNodes(): void;
    _createEndTimer(): void;
    _removeEndTimer(): void;
    _updatePanner(): void;
    _onLoad(): void;
    _readLoopComments(arrayBuffer: ArrayBuffer): void;
    _readOgg(array: Uint8Array): void;
    _readMp4(array: Uint8Array): void;
    _readMetaData(view: DataView, index: number, size: number): void;
    _readFourCharacters(view: DataView, index: number): string;
}

// ---------------------------------------------------------------------------
// Html5Audio
// ---------------------------------------------------------------------------

declare class Html5Audio {
    private constructor();

    static url: string;
    static volume: number;

    static _initialized: boolean;
    static _unlocked: boolean;
    static _audioElement: HTMLAudioElement | null;
    static _gainTweenInterval: number | null;
    static _tweenGain: number;
    static _tweenTargetGain: number;
    static _tweenGainStep: number;
    static _staticSePath: string | null;
    static _volume: number;
    static _loadListeners: Array<() => void>;
    static _hasError: boolean;
    static _autoPlay: boolean;
    static _isLoading: boolean;
    static _buffered: boolean;

    static initialize(): boolean;
    static clear(): void;
    static setup(url: string): void;
    static play(loop: boolean, offset?: number): void;
    static stop(): void;
    static seek(): number;
    static fadeIn(duration: number): void;
    static fadeOut(duration: number): void;
    static isReady(): boolean;
    static isError(): boolean;
    static isPlaying(): boolean;
    static setStaticSe(url: string): void;
    static addLoadListener(listener: () => void): void;

    static _setupEventHandlers(): void;
    static _onTouchStart(): void;
    static _onVisibilityChange(): void;
    static _onLoadedData(): void;
    static _onError(): void;
    static _onEnded(): void;
    static _onHide(): void;
    static _onShow(): void;
    static _load(url: string): void;
    static _startPlaying(loop: boolean, offset: number): void;
    static _onLoad(): void;
    static _startGainTween(duration: number): void;
    static _applyTweenValue(volume: number): void;
}

// ---------------------------------------------------------------------------
// JsonEx
// ---------------------------------------------------------------------------

declare class JsonEx {
    private constructor();

    static maxDepth: number;
    static _maxDepth: number;

    static stringify(object: unknown): string;
    static parse(json: string): any;
    static makeDeepCopy<T>(object: T): T;

    static _encode(value: unknown, depth: number): unknown;
    static _decode(value: unknown): unknown;
    static _getConstructorName(value: object): string;
    static _resetPrototype(value: object, prototype: object): object;
}

// ---------------------------------------------------------------------------
// Decrypter
// ---------------------------------------------------------------------------

declare class Decrypter {
    private constructor();

    static hasEncryptedImages: boolean;
    static hasEncryptedAudio: boolean;

    static SIGNATURE: string;
    static VER: string;
    static REMAIN: string;
    static _headerlength: number;
    static _xhrOk: number;
    static _encryptionKey: string | null;
    static _ignoreList: string[];

    static ENCRYPTION_KEY: string;

    static checkImgIgnore(url: string): boolean;
    static decryptImg(url: string, bitmap: Bitmap): void;
    static decryptHTML5Audio(url: string, bgm: any, pos?: number): void;
    static cutArrayHeader(arrayBuffer: ArrayBuffer, length: number): ArrayBuffer;
    static decryptArrayBuffer(source: ArrayBuffer): ArrayBuffer;
    static createBlobUrl(arrayBuffer: ArrayBuffer): string;
    static extToEncryptExt(url: string): string;
    static readEncryptionKey(): void;

    static _requestImgFile(url: string, bitmap: Bitmap): void;
}

// ---------------------------------------------------------------------------
// ResourceHandler
// ---------------------------------------------------------------------------

declare class ResourceHandler {
    private constructor();

    static _reloaders: Array<() => void>;
    static _defaultRetryInterval: number[];

    static createLoader(
        resourceName: string,
        loadMethod: (...args: any[]) => void,
        args?: any[]
    ): () => void;

    static exists(): boolean;
    static update(): void;
    static setDefaultRetryInterval(retryInterval: number[]): void;
}

// ---------------------------------------------------------------------------
// PIXI.extras augmentation for MV compatibility
// ---------------------------------------------------------------------------

declare namespace PIXI {
    namespace extras {
        class PictureTilingSprite extends PIXI.Sprite {
            constructor(texture: PIXI.Texture);
        }
    }
    class WebGLRenderer {
        gl: WebGLRenderingContext;
    }
    class CanvasRenderer {
        context: CanvasRenderingContext2D;
    }
    type SystemRenderer = WebGLRenderer | CanvasRenderer;
}
