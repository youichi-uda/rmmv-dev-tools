// Type definitions for RPG Maker MV
// RPG Maker MV sprite classes (rpg_sprites.js)

// ---------------------------------------------------------------------------
// Sprite_Base
// The sprite class with a feature which displays animations.
// ---------------------------------------------------------------------------

declare class Sprite_Base extends Sprite {
    constructor();
    initialize(): void;
    update(): void;
    hide(): void;
    show(): void;
    updateVisibility(): void;
    updateAnimationSprites(): void;
    startAnimation(animation: RPG_Animation, mirror: boolean, delay: number): void;
    isAnimationPlaying(): boolean;

    _animationSprites: Sprite_Animation[];
    _effectTarget: Sprite_Base;
    _hiding: boolean;
}

// ---------------------------------------------------------------------------
// Sprite_Button
// The sprite for displaying a button.
// ---------------------------------------------------------------------------

declare class Sprite_Button extends Sprite {
    constructor();
    initialize(): void;
    update(): void;
    updateFrame(): void;
    setColdFrame(x: number, y: number, width: number, height: number): void;
    setHotFrame(x: number, y: number, width: number, height: number): void;
    setClickHandler(method: (() => void) | null): void;
    callClickHandler(): void;
    processTouch(): void;
    isActive(): boolean;
    isButtonTouched(): boolean;
    canvasToLocalX(x: number): number;
    canvasToLocalY(y: number): number;

    _clickHandler: (() => void) | null;
    _coldFrame: Rectangle | null;
    _hotFrame: Rectangle | null;
    _touching: boolean;
}

// ---------------------------------------------------------------------------
// Sprite_Character
// The sprite for displaying a character.
// ---------------------------------------------------------------------------

declare class Sprite_Character extends Sprite_Base {
    constructor(character?: Game_Character);
    initialize(character?: Game_Character): void;
    initMembers(): void;
    setCharacter(character: Game_Character): void;
    update(): void;
    updateVisibility(): void;
    isTile(): boolean;
    tilesetBitmap(tileId: number): Bitmap;
    updateBitmap(): void;
    isImageChanged(): boolean;
    setTileBitmap(): void;
    setCharacterBitmap(): void;
    updateFrame(): void;
    updateTileFrame(): void;
    updateCharacterFrame(): void;
    characterBlockX(): number;
    characterBlockY(): number;
    characterPatternX(): number;
    characterPatternY(): number;
    patternWidth(): number;
    patternHeight(): number;
    updateHalfBodySprites(): void;
    createHalfBodySprites(): void;
    updatePosition(): void;
    updateAnimation(): void;
    updateOther(): void;
    setupAnimation(): void;
    setupBalloon(): void;
    startBalloon(): void;
    updateBalloon(): void;
    endBalloon(): void;
    isBalloonPlaying(): boolean;

    _character: Game_Character | null;
    _balloonDuration: number;
    _tilesetId: number;
    _upperBody: Sprite | null;
    _lowerBody: Sprite | null;
    _tileId: number;
    _characterName: string;
    _characterIndex: number;
    _isBigCharacter: boolean;
    _bushDepth: number;
}

// ---------------------------------------------------------------------------
// Sprite_Battler
// The superclass of Sprite_Actor and Sprite_Enemy.
// ---------------------------------------------------------------------------

declare class Sprite_Battler extends Sprite_Base {
    constructor(battler?: Game_Actor | Game_Enemy);
    initialize(battler?: Game_Actor | Game_Enemy): void;
    initMembers(): void;
    setBattler(battler: Game_Actor | Game_Enemy): void;
    update(): void;
    updateVisibility(): void;
    updateMain(): void;
    updateBitmap(): void;
    updateFrame(): void;
    updateMove(): void;
    updatePosition(): void;
    updateAnimation(): void;
    updateDamagePopup(): void;
    updateSelectionEffect(): void;
    setupAnimation(): void;
    setupDamagePopup(): void;
    damageOffsetX(): number;
    damageOffsetY(): number;
    startMove(x: number, y: number, duration: number): void;
    onMoveEnd(): void;
    isEffecting(): boolean;
    isMoving(): boolean;
    inHomePosition(): boolean;

    _battler: Game_Actor | Game_Enemy | null;
    _damages: Sprite_Damage[];
    _homeX: number;
    _homeY: number;
    _offsetX: number;
    _offsetY: number;
    _targetOffsetX: number;
    _targetOffsetY: number;
    _movementDuration: number;
    _selectionEffectCount: number;
}

// ---------------------------------------------------------------------------
// Sprite_Actor
// The sprite for displaying an actor.
// ---------------------------------------------------------------------------

declare class Sprite_Actor extends Sprite_Battler {
    constructor(battler?: Game_Actor);
    initialize(battler?: Game_Actor): void;
    initMembers(): void;
    createMainSprite(): void;
    createShadowSprite(): void;
    createWeaponSprite(): void;
    createStateSprite(): void;
    setBattler(battler: Game_Actor): void;
    moveToStartPosition(): void;
    setActorHome(index: number): void;
    update(): void;
    updateShadow(): void;
    updateMain(): void;
    setupMotion(): void;
    setupWeaponAnimation(): void;
    startMotion(motionType: string): void;
    updateTargetPosition(): void;
    updateBitmap(): void;
    updateFrame(): void;
    updateMove(): void;
    updateMotionCount(): void;
    motionSpeed(): number;
    refreshMotion(): void;
    startEntryMotion(): void;
    stepForward(): void;
    stepBack(): void;
    retreat(): void;
    onMoveEnd(): void;
    damageOffsetX(): number;
    damageOffsetY(): number;

    static MOTIONS: { [key: string]: { index: number; loop: boolean } };

    _battlerName: string;
    _motion: { index: number; loop: boolean } | null;
    _motionCount: number;
    _pattern: number;
    _mainSprite: Sprite_Base;
    _shadowSprite: Sprite;
    _weaponSprite: Sprite_Weapon;
    _stateSprite: Sprite_StateOverlay;
}

// ---------------------------------------------------------------------------
// Sprite_Enemy
// The sprite for displaying an enemy.
// ---------------------------------------------------------------------------

declare class Sprite_Enemy extends Sprite_Battler {
    constructor(battler?: Game_Enemy);
    initialize(battler?: Game_Enemy): void;
    initMembers(): void;
    createStateIconSprite(): void;
    setBattler(battler: Game_Enemy): void;
    update(): void;
    updateBitmap(): void;
    loadBitmap(name: string, hue: number): void;
    updateFrame(): void;
    updatePosition(): void;
    updateStateSprite(): void;
    initVisibility(): void;
    setupEffect(): void;
    startEffect(effectType: string): void;
    startAppear(): void;
    startDisappear(): void;
    startWhiten(): void;
    startBlink(): void;
    startCollapse(): void;
    startBossCollapse(): void;
    startInstantCollapse(): void;
    updateEffect(): void;
    isEffecting(): boolean;
    revertToNormal(): void;
    updateWhiten(): void;
    updateBlink(): void;
    updateAppear(): void;
    updateDisappear(): void;
    updateCollapse(): void;
    updateBossCollapse(): void;
    updateInstantCollapse(): void;
    damageOffsetX(): number;
    damageOffsetY(): number;

    _enemy: Game_Enemy | null;
    _appeared: boolean;
    _battlerName: string;
    _battlerHue: number;
    _effectType: string | null;
    _effectDuration: number;
    _shake: number;
    _stateIconSprite: Sprite_StateIcon;
}

// ---------------------------------------------------------------------------
// Sprite_Animation
// The sprite for displaying an animation.
// ---------------------------------------------------------------------------

declare class Sprite_Animation extends Sprite_Base {
    constructor();
    initMembers(): void;
    setup(target: Sprite_Base, animation: RPG_Animation, mirror: boolean, delay: number): void;
    remove(): void;
    setupRate(): void;
    setupDuration(): void;
    update(): void;
    updateFlash(): void;
    updateScreenFlash(): void;
    absoluteX(): number;
    absoluteY(): number;
    updateHiding(): void;
    isPlaying(): boolean;
    loadBitmaps(): void;
    isReady(): boolean;
    createSprites(): void;
    createCellSprite(): Sprite;
    updateMain(): void;
    updatePosition(): void;
    updateFrame(): void;
    currentFrameIndex(): number;
    updateAllCellSprites(frame: any[]): void;
    updateCellSprite(sprite: Sprite, cell: any[]): void;
    processTimingData(timing: any): void;
    startFlash(color: number[], duration: number): void;
    startScreenFlash(color: number[], duration: number): void;
    startHiding(duration: number): void;

    _target: Sprite_Base | null;
    _animation: RPG_Animation | null;
    _mirror: boolean;
    _delay: number;
    _rate: number;
    _duration: number;
    _flashColor: number[];
    _flashDuration: number;
    _screenFlashDuration: number;
    _hidingDuration: number;
    _bitmap1: Bitmap | null;
    _bitmap2: Bitmap | null;
    _cellSprites: Sprite[];
    _screenFlashSprite: ScreenSprite | null;
    _duplicated: boolean;
}

// ---------------------------------------------------------------------------
// Sprite_Damage
// The sprite for displaying a popup damage.
// ---------------------------------------------------------------------------

declare class Sprite_Damage extends Sprite {
    constructor();
    initialize(): void;
    setup(target: Game_Actor | Game_Enemy): void;
    setupCriticalEffect(): void;
    digitWidth(): number;
    digitHeight(): number;
    createMiss(): void;
    createDigits(baseRow: number, value: number): void;
    createChildSprite(): Sprite;
    update(): void;
    updateChild(sprite: Sprite): void;
    updateFlash(): void;
    updateOpacity(): void;
    isPlaying(): boolean;

    _duration: number;
    _flashColor: number[];
    _flashDuration: number;
    _damageBitmap: Bitmap;
}

// ---------------------------------------------------------------------------
// Sprite_StateIcon
// The sprite for displaying state icons.
// ---------------------------------------------------------------------------

declare class Sprite_StateIcon extends Sprite {
    constructor();
    initialize(): void;
    initMembers(): void;
    setup(battler: Game_Actor | Game_Enemy): void;
    update(): void;
    animationWait(): number;
    updateIcon(): void;
    updateFrame(): void;

    static _iconWidth: number;
    static _iconHeight: number;

    _battler: Game_Actor | Game_Enemy | null;
    _iconIndex: number;
    _animationIndex: number;
    _animationCount: number;
}

// ---------------------------------------------------------------------------
// Sprite_StateOverlay
// The sprite for displaying an overlay image for a state.
// ---------------------------------------------------------------------------

declare class Sprite_StateOverlay extends Sprite_Base {
    constructor();
    initialize(): void;
    initMembers(): void;
    loadBitmap(): void;
    setup(battler: Game_Actor | Game_Enemy): void;
    update(): void;
    animationWait(): number;
    updatePattern(): void;
    updateFrame(): void;

    _battler: Game_Actor | Game_Enemy | null;
    _overlayIndex: number;
    _animationCount: number;
    _pattern: number;
}

// ---------------------------------------------------------------------------
// Sprite_Weapon
// The sprite for displaying a weapon image for attacking.
// ---------------------------------------------------------------------------

declare class Sprite_Weapon extends Sprite_Base {
    constructor();
    initMembers(): void;
    setup(weaponImageId: number): void;
    update(): void;
    animationWait(): number;
    updatePattern(): void;
    loadBitmap(): void;
    updateFrame(): void;
    isPlaying(): boolean;

    _weaponImageId: number;
    _animationCount: number;
    _pattern: number;
}

// ---------------------------------------------------------------------------
// Sprite_Balloon
// The sprite for displaying a balloon icon.
// ---------------------------------------------------------------------------

declare class Sprite_Balloon extends Sprite_Base {
    constructor();
    initMembers(): void;
    setup(balloonId: number): void;
    update(): void;
    updateFrame(): void;
    speed(): number;
    waitTime(): number;
    frameIndex(): number;
    isPlaying(): boolean;

    _balloonId: number;
    _duration: number;
}

// ---------------------------------------------------------------------------
// Sprite_Picture
// The sprite for displaying a picture.
// ---------------------------------------------------------------------------

declare class Sprite_Picture extends Sprite {
    constructor(pictureId: number);
    initialize(pictureId: number): void;
    picture(): Game_Picture;
    update(): void;
    updateBitmap(): void;
    updateOrigin(): void;
    updatePosition(): void;
    updateScale(): void;
    updateTone(): void;
    updateOther(): void;
    loadBitmap(): void;

    _pictureId: number;
    _pictureName: string;
    _isPicture: boolean;
}

// ---------------------------------------------------------------------------
// Sprite_Timer
// The sprite for displaying the timer.
// ---------------------------------------------------------------------------

declare class Sprite_Timer extends Sprite {
    constructor();
    initialize(): void;
    createBitmap(): void;
    update(): void;
    updateBitmap(): void;
    redraw(): void;
    timerText(): string;
    updatePosition(): void;
    updateVisibility(): void;

    _seconds: number;
}

// ---------------------------------------------------------------------------
// Sprite_Destination
// The sprite for displaying the destination place of the touch input.
// ---------------------------------------------------------------------------

declare class Sprite_Destination extends Sprite {
    constructor();
    initialize(): void;
    update(): void;
    createBitmap(): void;
    updatePosition(): void;
    updateAnimation(): void;

    _frameCount: number;
}

// ---------------------------------------------------------------------------
// Spriteset_Base
// The superclass of Spriteset_Map and Spriteset_Battle.
// ---------------------------------------------------------------------------

declare class Spriteset_Base extends Sprite {
    constructor();
    initialize(): void;
    createLowerLayer(): void;
    createUpperLayer(): void;
    update(): void;
    createBaseSprite(): void;
    createToneChanger(): void;
    createWebGLToneChanger(): void;
    createCanvasToneChanger(): void;
    createPictures(): void;
    createTimer(): void;
    updateScreenSprites(): void;
    updateToneChanger(): void;
    updateWebGLToneChanger(): void;
    updateCanvasToneChanger(): void;
    updatePosition(): void;

    _baseSprite: Sprite;
    _blackScreen: ScreenSprite;
    _toneFilter: ToneFilter;
    _canvasToneChanger: ToneSprite;
    _pictureContainer: Sprite;
    _timerSprite: Sprite_Timer;
}

// ---------------------------------------------------------------------------
// Spriteset_Map
// The set of sprites on the map screen.
// ---------------------------------------------------------------------------

declare class Spriteset_Map extends Spriteset_Base {
    constructor();
    initialize(): void;
    createLowerLayer(): void;
    update(): void;
    hideCharacters(): void;
    createParallax(): void;
    createTilemap(): void;
    loadTileset(): void;
    createCharacters(): void;
    createShadow(): void;
    createDestination(): void;
    createWeather(): void;
    updateTileset(): void;
    updateParallax(): void;
    updateTilemap(): void;
    updateShadow(): void;
    updateWeather(): void;

    _parallax: TilingSprite;
    _tilemap: Tilemap | ShaderTilemap;
    _tileset: RPG_Tileset;
    _characterSprites: Sprite_Character[];
    _shadowSprite: Sprite;
    _destinationSprite: Sprite_Destination;
    _weather: Weather;
}

// ---------------------------------------------------------------------------
// Spriteset_Battle
// The set of sprites on the battle screen.
// ---------------------------------------------------------------------------

declare class Spriteset_Battle extends Spriteset_Base {
    constructor();
    initialize(): void;
    createBackground(): void;
    update(): void;
    createBattleField(): void;
    createBattleback(): void;
    updateBattleback(): void;
    locateBattleback(): void;
    battleback1Bitmap(): Bitmap;
    battleback2Bitmap(): Bitmap;
    battleback1Name(): string;
    battleback2Name(): string;
    overworldBattleback1Name(): string;
    overworldBattleback2Name(): string;
    normalBattleback1Name(): string;
    normalBattleback2Name(): string;
    terrainBattleback1Name(type: number): string;
    terrainBattleback2Name(type: number): string;
    defaultBattleback1Name(): string;
    defaultBattleback2Name(): string;
    shipBattleback1Name(): string;
    shipBattleback2Name(): string;
    autotileType(z: number): number;
    createEnemies(): void;
    compareEnemySprite(a: Sprite_Enemy, b: Sprite_Enemy): number;
    createActors(): void;
    updateActors(): void;
    battlerSprites(): Sprite_Battler[];
    isAnimationPlaying(): boolean;
    isEffecting(): boolean;
    isAnyoneMoving(): boolean;
    isBusy(): boolean;

    _backgroundSprite: Sprite;
    _battleField: Sprite;
    _back1Sprite: TilingSprite;
    _back2Sprite: TilingSprite;
    _enemySprites: Sprite_Enemy[];
    _actorSprites: Sprite_Actor[];
}
