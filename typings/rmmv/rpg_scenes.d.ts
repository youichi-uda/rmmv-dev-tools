// Type definitions for RPG Maker MV
// RPG Maker MV scene classes (rpg_scenes.js)

// ---------------------------------------------------------------------------
// Scene_Base
// The superclass of all scenes within the game.
// ---------------------------------------------------------------------------

declare class Scene_Base extends Stage {
    constructor();
    initialize(): void;

    // Lifecycle
    create(): void;
    isActive(): boolean;
    isReady(): boolean;
    start(): void;
    update(): void;
    stop(): void;
    isBusy(): boolean;
    terminate(): void;

    // Window layer
    createWindowLayer(): void;
    addWindow(window: Window_Base): void;

    // Fade
    startFadeIn(duration?: number, white?: boolean): void;
    startFadeOut(duration?: number, white?: boolean): void;
    createFadeSprite(white?: boolean): void;
    updateFade(): void;
    updateChildren(): void;
    fadeSpeed(): number;
    slowFadeSpeed(): number;

    // Navigation
    popScene(): void;
    checkGameover(): void;
    fadeOutAll(): void;

    // Layout
    isBottomHelpMode(): boolean;
    isBottomButtonMode(): boolean;
    mainCommandWidth(): number;

    // Private fields
    _active: boolean;
    _fadeSign: number;
    _fadeDuration: number;
    _fadeSprite: ScreenSprite | null;
    _windowLayer: WindowLayer;
}

// ---------------------------------------------------------------------------
// Scene_Boot
// The scene class for initializing the entire game.
// ---------------------------------------------------------------------------

declare class Scene_Boot extends Scene_Base {
    constructor();
    initialize(): void;
    create(): void;
    loadSystemWindowImage(): void;
    loadSystemImages(): void;
    isGameFontLoaded(): boolean;
    start(): void;
    updateDocumentTitle(): void;
    checkPlayerLocation(): void;
}

// ---------------------------------------------------------------------------
// Scene_Title
// The scene class of the title screen.
// ---------------------------------------------------------------------------

declare class Scene_Title extends Scene_Base {
    constructor();
    initialize(): void;
    create(): void;
    start(): void;
    update(): void;
    isBusy(): boolean;
    terminate(): void;

    createBackground(): void;
    createForeground(): void;
    drawGameTitle(): void;
    createCommandWindow(): void;
    commandNewGame(): void;
    commandContinue(): void;
    commandOptions(): void;
    playTitleMusic(): void;

    // Private fields
    _commandWindow: Window_TitleCommand;
    _backSprite1: Sprite;
    _backSprite2: Sprite;
    _gameTitleSprite: Sprite;
}

// ---------------------------------------------------------------------------
// Scene_Map
// The scene class of the map screen.
// ---------------------------------------------------------------------------

declare class Scene_Map extends Scene_Base {
    constructor();
    initialize(): void;
    create(): void;
    isReady(): boolean;
    onMapLoaded(): void;
    start(): void;
    update(): void;
    updateMain(): void;
    updateMainMultiply(): void;
    isFastForward(): boolean;
    stop(): void;
    isBusy(): boolean;
    terminate(): void;
    needsFadeIn(): boolean;
    needsSlowFadeOut(): boolean;
    updateWaitCount(): boolean;
    updateDestination(): void;
    isMapTouchOk(): boolean;
    processMapTouch(): void;
    isSceneChangeOk(): boolean;
    updateScene(): void;
    createDisplayObjects(): void;
    createSpriteset(): void;
    createMapNameWindow(): void;
    createAllWindows(): void;
    createMenuButton(): void;
    updateTransferPlayer(): void;
    updateEncounter(): void;
    updateCallMenu(): void;
    isMenuEnabled(): boolean;
    isMenuCalled(): boolean;
    callMenu(): void;
    updateCallDebug(): void;
    isDebugCalled(): boolean;
    fadeInForTransfer(): void;
    fadeOutForTransfer(): void;
    launchBattle(): void;
    stopAudioOnBattleStart(): void;
    startEncounterEffect(): void;
    encounterEffectSpeed(): number;

    // Private fields
    _waitCount: number;
    _encounterEffectDuration: number;
    _mapLoaded: boolean;
    _touchCount: number;
    _transfer: boolean;
    _spriteset: Spriteset_Map;
    _mapNameWindow: Window_MapName;
}

// ---------------------------------------------------------------------------
// Scene_MenuBase
// The superclass of all the menu-type scenes.
// ---------------------------------------------------------------------------

declare class Scene_MenuBase extends Scene_Base {
    constructor();
    initialize(): void;
    create(): void;
    actor(): Game_Actor;
    updateActor(): void;
    createBackground(): void;
    setBackgroundOpacity(opacity: number): void;
    createHelpWindow(): void;
    nextActor(): void;
    previousActor(): void;
    onActorChange(): void;

    // Private fields
    _actor: Game_Actor;
    _backgroundSprite: Sprite;
    _helpWindow: Window_Help;
}

// ---------------------------------------------------------------------------
// Scene_Menu
// The scene class of the menu screen.
// ---------------------------------------------------------------------------

declare class Scene_Menu extends Scene_MenuBase {
    constructor();
    initialize(): void;
    create(): void;
    start(): void;
    createCommandWindow(): void;
    createGoldWindow(): void;
    createStatusWindow(): void;
    commandItem(): void;
    commandPersonal(): void;
    personalIsActive(): boolean;
    onPersonalOk(): void;
    onPersonalCancel(): void;
    onFormationOk(): void;
    onFormationCancel(): void;
    commandFormation(): void;
    commandOptions(): void;
    commandSave(): void;
    commandGameEnd(): void;

    // Private fields
    _commandWindow: Window_MenuCommand;
    _goldWindow: Window_Gold;
    _statusWindow: Window_MenuStatus;
}

// ---------------------------------------------------------------------------
// Scene_ItemBase
// The superclass of Scene_Item and Scene_Skill.
// ---------------------------------------------------------------------------

declare class Scene_ItemBase extends Scene_MenuBase {
    constructor();
    initialize(): void;
    create(): void;
    createActorWindow(): void;
    item(): RPG_Item | RPG_Skill | null;
    user(): Game_Actor;
    isCursorLeft(): boolean;
    showSubWindow(window: Window_Base): void;
    hideSubWindow(window: Window_Base): void;
    onActorOk(): void;
    onActorCancel(): void;
    determineItem(): void;
    useItem(): void;
    activateItemWindow(): void;
    itemTargetActors(): Game_Actor[];
    canUse(): boolean;
    isItemEffectsValid(): boolean;
    applyItem(): void;
    checkCommonEvent(): void;

    // Private fields
    _actorWindow: Window_MenuStatus;
    _itemWindow: Window_Selectable;
}

// ---------------------------------------------------------------------------
// Scene_Item
// The scene class of the item screen.
// ---------------------------------------------------------------------------

declare class Scene_Item extends Scene_ItemBase {
    constructor();
    initialize(): void;
    create(): void;
    createCategoryWindow(): void;
    createItemWindow(): void;
    user(): Game_Actor;
    onCategoryOk(): void;
    onItemOk(): void;
    onItemCancel(): void;
    playSeForItem(): void;
    helpWindowText(): string;

    // Private fields
    _categoryWindow: Window_ItemCategory;
    _itemWindow: Window_ItemList;
}

// ---------------------------------------------------------------------------
// Scene_Skill
// The scene class of the skill screen.
// ---------------------------------------------------------------------------

declare class Scene_Skill extends Scene_ItemBase {
    constructor();
    initialize(): void;
    create(): void;
    start(): void;
    createSkillTypeWindow(): void;
    createStatusWindow(): void;
    createItemWindow(): void;
    refreshActor(): void;
    user(): Game_Actor;
    commandSkill(): void;
    onItemOk(): void;
    onItemCancel(): void;
    playSeForItem(): void;
    useItem(): void;
    onActorChange(): void;

    // Private fields
    _skillTypeWindow: Window_SkillType;
    _statusWindow: Window_SkillStatus;
    _itemWindow: Window_SkillList;
}

// ---------------------------------------------------------------------------
// Scene_Equip
// The scene class of the equipment screen.
// ---------------------------------------------------------------------------

declare class Scene_Equip extends Scene_MenuBase {
    constructor();
    initialize(): void;
    create(): void;
    createStatusWindow(): void;
    createCommandWindow(): void;
    createSlotWindow(): void;
    createItemWindow(): void;
    refreshActor(): void;
    commandEquip(): void;
    commandOptimize(): void;
    commandClear(): void;
    onSlotOk(): void;
    onSlotCancel(): void;
    onItemOk(): void;
    onItemCancel(): void;
    onActorChange(): void;

    // Private fields
    _statusWindow: Window_EquipStatus;
    _commandWindow: Window_EquipCommand;
    _slotWindow: Window_EquipSlot;
    _itemWindow: Window_EquipItem;
}

// ---------------------------------------------------------------------------
// Scene_Status
// The scene class of the status screen.
// ---------------------------------------------------------------------------

declare class Scene_Status extends Scene_MenuBase {
    constructor();
    initialize(): void;
    create(): void;
    refreshActor(): void;
    onActorChange(): void;

    // Private fields
    _statusWindow: Window_Status;
}

// ---------------------------------------------------------------------------
// Scene_Options
// The scene class of the options screen.
// ---------------------------------------------------------------------------

declare class Scene_Options extends Scene_MenuBase {
    constructor();
    initialize(): void;
    create(): void;
    terminate(): void;
    createOptionsWindow(): void;

    // Private fields
    _optionsWindow: Window_Options;
}

// ---------------------------------------------------------------------------
// Scene_File
// The superclass of Scene_Save and Scene_Load.
// ---------------------------------------------------------------------------

declare class Scene_File extends Scene_MenuBase {
    constructor();
    initialize(): void;
    create(): void;
    start(): void;
    savefileId(): number;
    createHelpWindow(): void;
    createListWindow(): void;
    mode(): string;
    activateListWindow(): void;
    helpWindowText(): string;
    firstSavefileIndex(): number;
    onSavefileOk(): void;

    // Private fields
    _listWindow: Window_SavefileList;
}

// ---------------------------------------------------------------------------
// Scene_Save
// The scene class of the save screen.
// ---------------------------------------------------------------------------

declare class Scene_Save extends Scene_File {
    constructor();
    initialize(): void;
    mode(): string;
    helpWindowText(): string;
    firstSavefileIndex(): number;
    onSavefileOk(): void;
    onSaveSuccess(): void;
}

// ---------------------------------------------------------------------------
// Scene_Load
// The scene class of the load screen.
// ---------------------------------------------------------------------------

declare class Scene_Load extends Scene_File {
    constructor();
    initialize(): void;
    mode(): string;
    helpWindowText(): string;
    firstSavefileIndex(): number;
    onSavefileOk(): void;
    onLoadSuccess(): void;
    reloadMapIfUpdated(): void;
}

// ---------------------------------------------------------------------------
// Scene_GameEnd
// The scene class of the game end screen.
// ---------------------------------------------------------------------------

declare class Scene_GameEnd extends Scene_MenuBase {
    constructor();
    initialize(): void;
    create(): void;
    stop(): void;
    createBackground(): void;
    createCommandWindow(): void;
    commandToTitle(): void;
    commandCancel(): void;

    // Private fields
    _commandWindow: Window_GameEnd;
}

// ---------------------------------------------------------------------------
// Scene_Shop
// The scene class of the shop screen.
// ---------------------------------------------------------------------------

declare class Scene_Shop extends Scene_MenuBase {
    constructor();
    initialize(): void;
    create(): void;
    createGoldWindow(): void;
    createCommandWindow(): void;
    createDummyWindow(): void;
    createNumberWindow(): void;
    createStatusWindow(): void;
    createBuyWindow(): void;
    createCategoryWindow(): void;
    createSellWindow(): void;
    activateBuyWindow(): void;
    activateSellWindow(): void;
    commandBuy(): void;
    commandSell(): void;
    onBuyOk(): void;
    onBuyCancel(): void;
    onCategoryOk(): void;
    onCategoryCancel(): void;
    onSellOk(): void;
    onSellCancel(): void;
    onNumberOk(): void;
    onNumberCancel(): void;
    doBuy(number: number): void;
    doSell(number: number): void;
    endNumberInput(): void;
    maxBuy(): number;
    maxSell(): number;
    money(): number;
    currencyUnit(): string;
    buyingPrice(): number;
    sellingPrice(): number;
    prepare(goods: any[][], purchaseOnly: boolean): void;

    // Private fields
    _goods: any[][];
    _purchaseOnly: boolean;
    _item: any;
    _goldWindow: Window_Gold;
    _commandWindow: Window_ShopCommand;
    _dummyWindow: Window_Base;
    _numberWindow: Window_ShopNumber;
    _statusWindow: Window_ShopStatus;
    _buyWindow: Window_ShopBuy;
    _categoryWindow: Window_ItemCategory;
    _sellWindow: Window_ShopSell;
}

// ---------------------------------------------------------------------------
// Scene_Name
// The scene class of the name input screen.
// ---------------------------------------------------------------------------

declare class Scene_Name extends Scene_MenuBase {
    constructor();
    initialize(): void;
    create(): void;
    prepare(actorId: number, maxLength: number): void;
    createEditWindow(): void;
    createInputWindow(): void;
    onInputOk(): void;

    // Private fields
    _actorId: number;
    _maxLength: number;
    _editWindow: Window_NameEdit;
    _inputWindow: Window_NameInput;
}

// ---------------------------------------------------------------------------
// Scene_Debug
// The scene class of the debug screen.
// ---------------------------------------------------------------------------

declare class Scene_Debug extends Scene_MenuBase {
    constructor();
    initialize(): void;
    create(): void;
    createRangeWindow(): void;
    createEditWindow(): void;
    createDebugHelpWindow(): void;
    onRangeOk(): void;
    onEditCancel(): void;
    refreshHelpWindow(): void;

    // Private fields
    _rangeWindow: Window_DebugRange;
    _editWindow: Window_DebugEdit;
    _debugHelpWindow: Window_Base;
}

// ---------------------------------------------------------------------------
// Scene_Battle
// The scene class of the battle screen.
// ---------------------------------------------------------------------------

declare class Scene_Battle extends Scene_Base {
    constructor();
    initialize(): void;
    create(): void;
    start(): void;
    update(): void;
    updateBattleProcess(): void;
    isAnyInputWindowActive(): boolean;
    changeInputWindow(): void;
    stop(): void;
    terminate(): void;
    needsSlowFadeOut(): boolean;
    updateStatusWindow(): void;
    updateWindowPositions(): void;
    createDisplayObjects(): void;
    createSpriteset(): void;
    createAllWindows(): void;
    createLogWindow(): void;
    createStatusWindow(): void;
    createPartyCommandWindow(): void;
    createActorCommandWindow(): void;
    createHelpWindow(): void;
    createSkillWindow(): void;
    createItemWindow(): void;
    createActorWindow(): void;
    createEnemyWindow(): void;
    refreshStatus(): void;
    startPartyCommandSelection(): void;
    commandFight(): void;
    commandEscape(): void;
    startActorCommandSelection(): void;
    commandAttack(): void;
    commandSkill(): void;
    commandGuard(): void;
    commandItem(): void;
    selectNextCommand(): void;
    selectPreviousCommand(): void;
    selectActorSelection(): void;
    onActorOk(): void;
    onActorCancel(): void;
    selectEnemySelection(): void;
    onEnemyOk(): void;
    onEnemyCancel(): void;
    onSkillOk(): void;
    onSkillCancel(): void;
    onItemOk(): void;
    onItemCancel(): void;
    endCommandSelection(): void;
    isEscapeCompatible(): boolean;

    // Private fields
    _spriteset: Spriteset_Battle;
    _logWindow: Window_BattleLog;
    _statusWindow: Window_BattleStatus;
    _partyCommandWindow: Window_PartyCommand;
    _actorCommandWindow: Window_ActorCommand;
    _helpWindow: Window_Help;
    _skillWindow: Window_BattleSkill;
    _itemWindow: Window_BattleItem;
    _actorWindow: Window_BattleActor;
    _enemyWindow: Window_BattleEnemy;
}

// ---------------------------------------------------------------------------
// Scene_Gameover
// The scene class of the game over screen.
// ---------------------------------------------------------------------------

declare class Scene_Gameover extends Scene_Base {
    constructor();
    initialize(): void;
    create(): void;
    start(): void;
    update(): void;
    stop(): void;
    terminate(): void;
    playGameoverMusic(): void;
    createBackground(): void;
    isTriggered(): boolean;
    gotoTitle(): void;

    // Private fields
    _backSprite: Sprite;
}
