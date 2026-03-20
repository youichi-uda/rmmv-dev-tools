// Type definitions for RPG Maker MV
// RPG Maker MV window classes (rpg_windows.js)
// Note: MV windows use (x, y, width, height) constructors, not (rect).
// MV has no Window_Scrollable or Window_StatusBase.

// ---------------------------------------------------------------------------
// Window_Base
// The superclass of all windows within the game.
// ---------------------------------------------------------------------------

declare class Window_Base extends Window {
    constructor(x: number, y: number, width: number, height: number);
    initialize(x: number, y: number, width: number, height: number): void;

    // Metrics
    lineHeight(): number;
    standardFontFace(): string;
    standardFontSize(): number;
    standardPadding(): number;
    textPadding(): number;
    standardBackOpacity(): number;

    // Setup
    loadWindowskin(): void;
    updatePadding(): void;
    updateBackOpacity(): void;
    contentsWidth(): number;
    contentsHeight(): number;
    fittingHeight(numLines: number): number;
    updateTone(): void;
    createContents(): void;
    resetFontSettings(): void;
    resetTextColor(): void;

    // Update
    update(): void;
    updateOpen(): void;
    updateClose(): void;

    // Open/Close
    open(): void;
    close(): void;
    isOpening(): boolean;
    isClosing(): boolean;

    // Visibility
    show(): void;
    hide(): void;
    activate(): void;
    deactivate(): void;

    // Colors
    textColor(n: number): string;
    normalColor(): string;
    systemColor(): string;
    crisisColor(): string;
    deathColor(): string;
    gaugeBackColor(): string;
    hpGaugeColor1(): string;
    hpGaugeColor2(): string;
    mpGaugeColor1(): string;
    mpGaugeColor2(): string;
    mpCostColor(): string;
    powerUpColor(): string;
    powerDownColor(): string;
    tpGaugeColor1(): string;
    tpGaugeColor2(): string;
    tpCostColor(): string;
    pendingColor(): string;
    translucentOpacity(): number;
    changeTextColor(color: string): void;
    changePaintOpacity(enabled: boolean): void;

    // Drawing - text
    drawText(text: string | number, x: number, y: number, maxWidth?: number, align?: string): void;
    textWidth(text: string): number;
    drawTextEx(text: string, x: number, y: number): number;
    convertEscapeCharacters(text: string): string;
    actorName(n: number): string;
    partyMemberName(n: number): string;
    processCharacter(textState: any): void;
    processNormalCharacter(textState: any): void;
    processNewLine(textState: any): void;
    processNewPage(textState: any): void;
    obtainEscapeCode(textState: any): string;
    obtainEscapeParam(textState: any): number | string;
    processEscapeCharacter(code: string, textState: any): void;
    processDrawIcon(iconIndex: number, textState: any): void;
    makeFontBigger(): void;
    makeFontSmaller(): void;
    calcTextHeight(textState: any, all: boolean): number;

    // Drawing - icons, faces, characters
    drawIcon(iconIndex: number, x: number, y: number): void;
    drawFace(faceName: string, faceIndex: number, x: number, y: number, width?: number, height?: number): void;
    drawCharacter(characterName: string, characterIndex: number, x: number, y: number): void;
    drawGauge(x: number, y: number, width: number, rate: number, color1: string, color2: string): void;

    // Drawing - actor
    hpColor(actor: Game_Actor): string;
    mpColor(actor: Game_Actor): string;
    tpColor(actor: Game_Actor): string;
    drawActorCharacter(actor: Game_Actor, x: number, y: number): void;
    drawActorFace(actor: Game_Actor, x: number, y: number, width?: number, height?: number): void;
    drawActorName(actor: Game_Actor, x: number, y: number, width?: number): void;
    drawActorClass(actor: Game_Actor, x: number, y: number, width?: number): void;
    drawActorNickname(actor: Game_Actor, x: number, y: number, width?: number): void;
    drawActorLevel(actor: Game_Actor, x: number, y: number): void;
    drawActorIcons(actor: Game_Actor, x: number, y: number, width?: number): void;
    drawCurrentAndMax(current: number, max: number, x: number, y: number, width: number, color1: string, color2: string): void;
    drawActorHp(actor: Game_Actor, x: number, y: number, width?: number): void;
    drawActorMp(actor: Game_Actor, x: number, y: number, width?: number): void;
    drawActorTp(actor: Game_Actor, x: number, y: number, width?: number): void;
    drawActorSimpleStatus(actor: Game_Actor, x: number, y: number, width: number): void;

    // Drawing - items
    drawItemName(item: any, x: number, y: number, width?: number): void;
    drawCurrencyValue(value: number, unit: string, x: number, y: number, width: number): void;
    paramchangeTextColor(change: number): string;

    // Background
    setBackgroundType(type: number): void;
    showBackgroundDimmer(): void;
    hideBackgroundDimmer(): void;
    updateBackgroundDimmer(): void;
    refreshDimmerBitmap(): void;
    dimColor1(): string;
    dimColor2(): string;

    // Coordinates
    canvasToLocalX(x: number): number;
    canvasToLocalY(y: number): number;

    // Preload
    reserveFaceImages(): void;

    // Private fields
    _opening: boolean;
    _closing: boolean;
    _dimmerSprite: Sprite | null;
}

// ---------------------------------------------------------------------------
// Window_Selectable
// The window class with cursor movement and scroll functions.
// ---------------------------------------------------------------------------

declare class Window_Selectable extends Window_Base {
    constructor(x: number, y: number, width: number, height: number);
    initialize(x: number, y: number, width: number, height: number): void;

    // Selection
    index(): number;
    cursorFixed(): boolean;
    setCursorFixed(cursorFixed: boolean): void;
    cursorAll(): boolean;
    setCursorAll(cursorAll: boolean): void;
    maxCols(): number;
    maxItems(): number;
    spacing(): number;
    itemWidth(): number;
    itemHeight(): number;
    maxRows(): number;

    // Activation
    activate(): void;
    deactivate(): void;
    select(index: number): void;
    deselect(): void;
    reselect(): void;

    // Scrolling
    row(): number;
    topRow(): number;
    maxTopRow(): number;
    setTopRow(row: number): void;
    resetScroll(): void;
    maxPageRows(): number;
    maxPageItems(): number;
    isHorizontal(): boolean;
    bottomRow(): number;
    setBottomRow(row: number): void;
    topIndex(): number;

    // Rects
    itemRect(index: number): Rectangle;
    itemRectForText(index: number): Rectangle;

    // Help
    setHelpWindow(helpWindow: Window_Help): void;
    showHelpWindow(): void;
    hideHelpWindow(): void;

    // Handlers
    setHandler(symbol: string, method: () => void): void;
    isHandled(symbol: string): boolean;
    callHandler(symbol: string): void;

    // State
    isOpenAndActive(): boolean;
    isCursorMovable(): boolean;

    // Cursor movement
    cursorDown(wrap: boolean): void;
    cursorUp(wrap: boolean): void;
    cursorRight(wrap: boolean): void;
    cursorLeft(wrap: boolean): void;
    cursorPagedown(): void;
    cursorPageup(): void;
    scrollDown(): void;
    scrollUp(): void;

    // Update
    update(): void;
    updateArrows(): void;
    processCursorMove(): void;
    processHandling(): void;
    processWheel(): void;
    processTouch(): void;

    // Input
    isTouchOkEnabled(): boolean;
    isOkEnabled(): boolean;
    isCancelEnabled(): boolean;
    isOkTriggered(): boolean;
    isCancelTriggered(): boolean;
    processOk(): void;
    playOkSound(): void;
    playBuzzerSound(): void;
    callOkHandler(): void;
    callCancelHandler(): void;
    processCancel(): void;

    // Symbol
    selectSymbol(symbol: string): void;
    findSymbol(symbol: string): number;

    // Drawing
    drawAllItems(): void;
    drawItem(index: number): void;
    clearItem(index: number): void;
    redrawItem(index: number): void;
    redrawCurrentItem(): void;
    refresh(): void;

    // Cursor
    updateCursor(): void;
    isCursorVisible(): boolean;
    ensureCursorVisible(): void;

    // Help update
    callUpdateHelp(): void;
    updateHelp(): void;
    setHelpWindowItem(item: any): void;
    isCurrentItemEnabled(): boolean;

    // Pending
    pendingIndex(): number;
    setPendingIndex(index: number): void;

    // Private fields
    _index: number;
    _cursorFixed: boolean;
    _cursorAll: boolean;
    _stayCount: number;
    _helpWindow: Window_Help | null;
    _handlers: { [symbol: string]: () => void };
    _touching: boolean;
    _scrollX: number;
    _scrollY: number;
    _pendingIndex: number;
}

// ---------------------------------------------------------------------------
// Window_Command
// The window class for general command selections.
// ---------------------------------------------------------------------------

declare class Window_Command extends Window_Selectable {
    constructor(x: number, y: number);
    initialize(x: number, y: number): void;

    windowWidth(): number;
    windowHeight(): number;
    numVisibleRows(): number;
    maxItems(): number;
    clearCommandList(): void;
    makeCommandList(): void;
    addCommand(name: string, symbol: string, enabled?: boolean, ext?: any): void;
    commandName(index: number): string;
    commandSymbol(index: number): string;
    isCommandEnabled(index: number): boolean;
    currentData(): CommandItem | null;
    isCurrentItemEnabled(): boolean;
    currentSymbol(): string;
    currentExt(): any;
    findSymbol(symbol: string): number;
    selectSymbol(symbol: string): void;
    findExt(ext: any): number;
    selectExt(ext: any): void;
    drawItem(index: number): void;
    itemTextAlign(): string;
    isOkEnabled(): boolean;
    callOkHandler(): void;
    refresh(): void;

    // Private fields
    _list: CommandItem[];
}

// ---------------------------------------------------------------------------
// Window_HorzCommand
// The command window for horizontal selections.
// ---------------------------------------------------------------------------

declare class Window_HorzCommand extends Window_Command {
    constructor(x: number, y: number);
    numVisibleRows(): number;
    maxCols(): number;
    itemTextAlign(): string;
}

// ---------------------------------------------------------------------------
// Window_Help
// The window for displaying the description of the selected item.
// ---------------------------------------------------------------------------

declare class Window_Help extends Window_Base {
    constructor(numLines?: number);
    initialize(numLines?: number): void;

    setText(text: string): void;
    clear(): void;
    setItem(item: any): void;
    refresh(): void;

    _text: string;
}

// ---------------------------------------------------------------------------
// Window_Gold
// The window for displaying the party's gold.
// ---------------------------------------------------------------------------

declare class Window_Gold extends Window_Base {
    constructor(x: number, y: number);
    initialize(x: number, y: number): void;

    windowWidth(): number;
    windowHeight(): number;
    refresh(): void;
    value(): number;
    currencyUnit(): string;
    open(): void;
}

// ---------------------------------------------------------------------------
// Window_MenuCommand
// The window for selecting a command on the menu screen.
// ---------------------------------------------------------------------------

declare class Window_MenuCommand extends Window_Command {
    constructor(x: number, y: number);
    initialize(x: number, y: number): void;

    static initCommandPosition(): void;
    static _lastCommandSymbol: string | null;

    initCommandPosition(): void;
    makeCommandList(): void;
    addMainCommands(): void;
    addFormationCommand(): void;
    addOriginalCommands(): void;
    addOptionsCommand(): void;
    addSaveCommand(): void;
    addGameEndCommand(): void;
    needsCommand(name: string): boolean;
    areMainCommandsEnabled(): boolean;
    isFormationEnabled(): boolean;
    isOptionsEnabled(): boolean;
    isSaveEnabled(): boolean;
    isGameEndEnabled(): boolean;
    processOk(): void;
    selectLast(): void;
}

// ---------------------------------------------------------------------------
// Window_MenuStatus
// The window for displaying party members' status on the menu screen.
// ---------------------------------------------------------------------------

declare class Window_MenuStatus extends Window_Selectable {
    constructor(x: number, y: number);
    initialize(x: number, y: number): void;

    windowWidth(): number;
    windowHeight(): number;
    maxItems(): number;
    itemHeight(): number;
    numVisibleRows(): number;
    loadImages(): void;
    drawItem(index: number): void;
    drawItemBackground(index: number): void;
    drawItemImage(index: number): void;
    drawItemStatus(index: number): void;
    processOk(): void;
    isCurrentItemEnabled(): boolean;
    selectLast(): void;
    formationMode(): boolean;
    setFormationMode(formationMode: boolean): void;
    pendingIndex(): number;
    setPendingIndex(index: number): void;

    _formationMode: boolean;
    _pendingIndex: number;
}

// ---------------------------------------------------------------------------
// Window_ItemList
// The window for selecting an item on the item screen.
// ---------------------------------------------------------------------------

declare class Window_ItemList extends Window_Selectable {
    constructor(x: number, y: number, width: number, height: number);
    initialize(x: number, y: number, width: number, height: number): void;

    setCategory(category: string): void;
    maxCols(): number;
    spacing(): number;
    maxItems(): number;
    item(): any;
    isCurrentItemEnabled(): boolean;
    includes(item: any): boolean;
    needsNumber(): boolean;
    isEnabled(item: any): boolean;
    makeItemList(): void;
    selectLast(): void;
    drawItem(index: number): void;
    numberWidth(): number;
    drawItemNumber(item: any, x: number, y: number, width: number): void;
    updateHelp(): void;
    refresh(): void;

    _category: string;
    _data: any[];
}

// ---------------------------------------------------------------------------
// Window_SkillType
// The window for selecting a skill type on the skill screen.
// ---------------------------------------------------------------------------

declare class Window_SkillType extends Window_Command {
    constructor(x: number, y: number);
    initialize(x: number, y: number): void;

    windowWidth(): number;
    setActor(actor: Game_Actor): void;
    numVisibleRows(): number;
    makeCommandList(): void;
    update(): void;
    setSkillWindow(skillWindow: Window_SkillList): void;
    selectLast(): void;

    _actor: Game_Actor | null;
    _skillWindow: Window_SkillList | null;
}

// ---------------------------------------------------------------------------
// Window_SkillStatus
// The window for displaying the skill user's status on the skill screen.
// ---------------------------------------------------------------------------

declare class Window_SkillStatus extends Window_Base {
    constructor(x: number, y: number, width: number, height: number);
    initialize(x: number, y: number, width: number, height: number): void;

    setActor(actor: Game_Actor): void;
    refresh(): void;

    _actor: Game_Actor | null;
}

// ---------------------------------------------------------------------------
// Window_SkillList
// The window for selecting a skill on the skill screen.
// ---------------------------------------------------------------------------

declare class Window_SkillList extends Window_Selectable {
    constructor(x: number, y: number, width: number, height: number);
    initialize(x: number, y: number, width: number, height: number): void;

    setActor(actor: Game_Actor): void;
    setStypeId(stypeId: number): void;
    maxCols(): number;
    spacing(): number;
    maxItems(): number;
    item(): any;
    isCurrentItemEnabled(): boolean;
    includes(item: any): boolean;
    isEnabled(item: any): boolean;
    makeItemList(): void;
    selectLast(): void;
    drawItem(index: number): void;
    costWidth(): number;
    drawSkillCost(skill: any, x: number, y: number, width: number): void;
    updateHelp(): void;
    refresh(): void;

    _actor: Game_Actor | null;
    _stypeId: number;
    _data: any[];
}

// ---------------------------------------------------------------------------
// Window_EquipStatus
// The window for displaying parameter changes on the equipment screen.
// ---------------------------------------------------------------------------

declare class Window_EquipStatus extends Window_Base {
    constructor(x: number, y: number);
    initialize(x: number, y: number): void;

    windowWidth(): number;
    windowHeight(): number;
    numVisibleRows(): number;
    setActor(actor: Game_Actor): void;
    refresh(): void;
    setTempActor(tempActor: Game_Actor): void;
    clearTempActor(): void;
    drawItem(x: number, y: number, paramId: number): void;
    drawParamName(x: number, y: number, paramId: number): void;
    drawCurrentParam(x: number, y: number, paramId: number): void;
    drawRightArrow(x: number, y: number): void;
    drawNewParam(x: number, y: number, paramId: number): void;

    _actor: Game_Actor | null;
    _tempActor: Game_Actor | null;
}

// ---------------------------------------------------------------------------
// Window_EquipCommand
// The window for selecting a command on the equipment screen.
// ---------------------------------------------------------------------------

declare class Window_EquipCommand extends Window_HorzCommand {
    constructor(x: number, y: number);
    initialize(x: number, y: number): void;

    windowWidth(): number;
    maxCols(): number;
    makeCommandList(): void;
}

// ---------------------------------------------------------------------------
// Window_EquipSlot
// The window for selecting an equipment slot on the equipment screen.
// ---------------------------------------------------------------------------

declare class Window_EquipSlot extends Window_Selectable {
    constructor(x: number, y: number, width: number, height: number);
    initialize(x: number, y: number, width: number, height: number): void;

    setActor(actor: Game_Actor): void;
    update(): void;
    slotName(index: number): string;
    isEnabled(index: number): boolean;
    maxItems(): number;
    item(): any;
    drawItem(index: number): void;
    slotNameWidth(): number;
    isCurrentItemEnabled(): boolean;
    setStatusWindow(statusWindow: Window_EquipStatus): void;
    setItemWindow(itemWindow: Window_EquipItem): void;
    updateHelp(): void;

    _actor: Game_Actor | null;
    _statusWindow: Window_EquipStatus | null;
    _itemWindow: Window_EquipItem | null;
}

// ---------------------------------------------------------------------------
// Window_EquipItem
// The window for selecting an equipment item on the equipment screen.
// ---------------------------------------------------------------------------

declare class Window_EquipItem extends Window_ItemList {
    constructor(x: number, y: number, width: number, height: number);
    initialize(x: number, y: number, width: number, height: number): void;

    setActor(actor: Game_Actor): void;
    setSlotId(slotId: number): void;
    includes(item: any): boolean;
    isEnabled(item: any): boolean;
    selectLast(): void;
    setStatusWindow(statusWindow: Window_EquipStatus): void;
    updateHelp(): void;

    _actor: Game_Actor | null;
    _slotId: number;
    _statusWindow: Window_EquipStatus | null;
}

// ---------------------------------------------------------------------------
// Window_Status
// The window for displaying full status on the status screen.
// ---------------------------------------------------------------------------

declare class Window_Status extends Window_Selectable {
    constructor();
    initialize(): void;

    setActor(actor: Game_Actor): void;
    refresh(): void;
    drawBlock1(y: number): void;
    drawBlock2(y: number): void;
    drawBlock3(y: number): void;
    drawBlock4(y: number): void;
    drawHorzLine(y: number): void;
    lineColor(): string;
    drawBasicInfo(x: number, y: number): void;
    drawParameters(x: number, y: number): void;
    drawExpInfo(x: number, y: number): void;
    drawEquipments(x: number, y: number): void;
    drawProfile(x: number, y: number): void;
    maxEquipmentLines(): number;

    _actor: Game_Actor | null;
}

// ---------------------------------------------------------------------------
// Window_Options
// The window for changing various settings on the options screen.
// ---------------------------------------------------------------------------

declare class Window_Options extends Window_Command {
    constructor();
    initialize(): void;

    windowWidth(): number;
    windowHeight(): number;
    updatePlacement(): void;
    makeCommandList(): void;
    addGeneralOptions(): void;
    addVolumeOptions(): void;
    drawItem(index: number): void;
    statusWidth(): number;
    statusText(index: number): string;
    isVolumeSymbol(symbol: string): boolean;
    booleanStatusText(value: boolean): string;
    volumeStatusText(value: number): string;
    processOk(): void;
    cursorRight(wrap: boolean): void;
    cursorLeft(wrap: boolean): void;
    volumeOffset(): number;
    changeValue(symbol: string, value: any): void;

    // Note: getConfigValue and setConfigValue are also present in MV
    getConfigValue(symbol: string): any;
    setConfigValue(symbol: string, volume: any): void;
}

// ---------------------------------------------------------------------------
// Window_SavefileList
// The window for selecting a save file on the save/load screen.
// ---------------------------------------------------------------------------

declare class Window_SavefileList extends Window_Selectable {
    constructor(x: number, y: number, width: number, height: number);
    initialize(x: number, y: number, width: number, height: number): void;

    setMode(mode: string): void;
    maxItems(): number;
    maxVisibleItems(): number;
    itemHeight(): number;
    drawItem(index: number): void;
    drawFileId(id: number, x: number, y: number): void;
    drawContents(info: any, rect: Rectangle, valid: boolean): void;
    drawGameTitle(info: any, x: number, y: number, width: number): void;
    drawPartyCharacters(info: any, x: number, y: number): void;
    playOkSound(): void;

    _mode: string;
}

// ---------------------------------------------------------------------------
// Window_ShopCommand
// The window for selecting buy/sell on the shop screen.
// ---------------------------------------------------------------------------

declare class Window_ShopCommand extends Window_HorzCommand {
    constructor(width: number, purchaseOnly: boolean);
    initialize(width: number, purchaseOnly: boolean): void;

    windowWidth(): number;
    maxCols(): number;
    makeCommandList(): void;

    _windowWidth: number;
    _purchaseOnly: boolean;
}

// ---------------------------------------------------------------------------
// Window_ShopBuy
// The window for selecting an item to buy on the shop screen.
// ---------------------------------------------------------------------------

declare class Window_ShopBuy extends Window_Selectable {
    constructor(x: number, y: number, height: number, shopGoods: any[][]);
    initialize(x: number, y: number, height: number, shopGoods: any[][]): void;

    windowWidth(): number;
    maxItems(): number;
    item(): any;
    setMoney(money: number): void;
    isCurrentItemEnabled(): boolean;
    price(item: any): number;
    isEnabled(item: any): boolean;
    refresh(): void;
    makeItemList(): void;
    drawItem(index: number): void;
    setStatusWindow(statusWindow: Window_ShopStatus): void;
    updateHelp(): void;

    _shopGoods: any[][];
    _money: number;
    _data: any[];
    _price: number[];
    _statusWindow: Window_ShopStatus | null;
}

// ---------------------------------------------------------------------------
// Window_ShopSell
// The window for selecting an item to sell on the shop screen.
// ---------------------------------------------------------------------------

declare class Window_ShopSell extends Window_ItemList {
    constructor(x: number, y: number, width: number, height: number);

    isEnabled(item: any): boolean;
}

// ---------------------------------------------------------------------------
// Window_ShopNumber
// The window for inputting quantity of items to buy or sell on the shop screen.
// ---------------------------------------------------------------------------

declare class Window_ShopNumber extends Window_Selectable {
    constructor(x: number, y: number, height: number);
    initialize(x: number, y: number, height: number): void;

    setup(item: any, max: number, price: number): void;
    windowWidth(): number;
    number(): number;
    maxDigits(): number;
    update(): void;
    isOkTriggered(): boolean;
    processNumberChange(): void;
    changeNumber(amount: number): void;
    updateButtonsVisiblity(): void;
    placeButtons(): void;
    updateCursor(): void;
    totalPrice(): number;
    cursorWidth(): number;
    cursorX(): number;
    drawMultiplicationSign(): void;
    drawNumber(): void;
    drawTotalPrice(): void;
    itemY(): number;
    priceY(): number;
    buttonY(): number;
    createButtons(): void;
    onButtonUp(): void;
    onButtonUp2(): void;
    onButtonDown(): void;
    onButtonDown2(): void;
    onButtonOk(): void;

    _item: any;
    _max: number;
    _price: number;
    _number: number;
    _currencyUnit: string;
    _buttons: Sprite_Button[];
}

// ---------------------------------------------------------------------------
// Window_ShopStatus
// The window for displaying the status of items in the shop.
// ---------------------------------------------------------------------------

declare class Window_ShopStatus extends Window_Base {
    constructor(x: number, y: number, width: number, height: number);
    initialize(x: number, y: number, width: number, height: number): void;

    refresh(): void;
    setItem(item: any): void;
    isEquipItem(): boolean;
    drawPossession(x: number, y: number): void;
    drawEquipInfo(x: number, y: number): void;

    _item: any;
    _pageIndex: number;
}

// ---------------------------------------------------------------------------
// Window_NameEdit
// The window for editing an actor's name on the name input screen.
// ---------------------------------------------------------------------------

declare class Window_NameEdit extends Window_Base {
    constructor(actor: Game_Actor, maxLength: number);
    initialize(actor: Game_Actor, maxLength: number): void;

    windowWidth(): number;
    windowHeight(): number;
    restoreDefault(): boolean;
    add(ch: string): boolean;
    back(): boolean;
    faceWidth(): number;
    charWidth(): number;
    left(): number;
    itemRect(index: number): Rectangle;
    underlineRect(index: number): Rectangle;
    underlineColor(): string;
    drawUnderline(index: number): void;
    drawChar(index: number): void;
    refresh(): void;

    _actor: Game_Actor;
    _name: string;
    _index: number;
    _maxLength: number;
    _defaultName: string;
}

// ---------------------------------------------------------------------------
// Window_NameInput
// The window for selecting text characters on the name input screen.
// ---------------------------------------------------------------------------

declare class Window_NameInput extends Window_Selectable {
    constructor(editWindow: Window_NameEdit);
    initialize(editWindow: Window_NameEdit): void;

    static LATIN1: string[];
    static LATIN2: string[];
    static RUSSIA: string[];
    static JAPAN1: string[];
    static JAPAN2: string[];
    static JAPAN3: string[];

    windowHeight(): number;
    table(): string[][];
    maxCols(): number;
    maxItems(): number;
    character(): string;
    isPageChange(): boolean;
    isOk(): boolean;
    itemRect(index: number): Rectangle;
    refresh(): void;
    updateCursor(): void;
    isCursorMovable(): boolean;
    cursorDown(wrap: boolean): void;
    cursorUp(wrap: boolean): void;
    cursorRight(wrap: boolean): void;
    cursorLeft(wrap: boolean): void;
    cursorPagedown(): void;
    cursorPageup(): void;
    processJump(): void;
    processBack(): void;
    processOk(): void;
    onNameAdd(): void;
    onNameOk(): void;

    _editWindow: Window_NameEdit;
    _page: number;
}

// ---------------------------------------------------------------------------
// Window_Message
// The window for displaying text messages.
// ---------------------------------------------------------------------------

declare class Window_Message extends Window_Base {
    constructor();
    initialize(): void;

    initMembers(): void;
    subWindows(): Window_Base[];
    createSubWindows(): void;
    windowWidth(): number;
    windowHeight(): number;
    clearFlags(): void;
    numVisibleRows(): number;
    update(): void;
    checkToNotClose(): void;
    canStart(): boolean;
    startMessage(): void;
    updatePlacement(): void;
    updateBackground(): void;
    terminateMessage(): void;
    updateWait(): boolean;
    updateLoading(): boolean;
    updateInput(): boolean;
    isAnySubWindowActive(): boolean;
    updateMessage(): boolean;
    onEndOfText(): void;
    startInput(): boolean;
    isTriggered(): boolean;
    doesContinue(): boolean;
    areSettingsChanged(): boolean;
    updateShowFast(): void;
    newPage(textState: any): void;
    loadMessageFace(): void;
    drawMessageFace(): void;
    newLineX(): number;
    processNewLine(textState: any): void;
    processNewPage(textState: any): void;
    isEndOfText(textState: any): boolean;
    needsNewPage(textState: any): boolean;
    processEscapeCharacter(code: string, textState: any): void;
    startWait(count: number): void;
    startPause(): void;

    _goldWindow: Window_Gold;
    _choiceWindow: Window_ChoiceList;
    _numberWindow: Window_NumberInput;
    _itemWindow: Window_EventItem;
    _showFast: boolean;
    _lineShowFast: boolean;
    _pauseSkip: boolean;
    _waitCount: number;
    _faceBitmap: Bitmap | null;
    _textState: any;
    _background: number;
    _positionType: number;
}

// ---------------------------------------------------------------------------
// Window_ChoiceList
// The window used for the event command [Show Choices].
// ---------------------------------------------------------------------------

declare class Window_ChoiceList extends Window_Command {
    constructor(messageWindow: Window_Message);
    initialize(messageWindow: Window_Message): void;

    start(): void;
    selectDefault(): void;
    updatePlacement(): void;
    updateBackground(): void;
    windowWidth(): number;
    numVisibleRows(): number;
    maxChoiceWidth(): number;
    textWidthEx(text: string): number;
    contentsHeight(): number;
    makeCommandList(): void;
    drawItem(index: number): void;
    isCancelEnabled(): boolean;
    isOkEnabled(): boolean;
    callOkHandler(): void;
    callCancelHandler(): void;

    _messageWindow: Window_Message;
    _background: number;
}

// ---------------------------------------------------------------------------
// Window_NumberInput
// The window used for the event command [Input Number].
// ---------------------------------------------------------------------------

declare class Window_NumberInput extends Window_Selectable {
    constructor(messageWindow: Window_Message);
    initialize(messageWindow: Window_Message): void;

    start(): void;
    updatePlacement(): void;
    windowWidth(): number;
    windowHeight(): number;
    maxCols(): number;
    maxItems(): number;
    spacing(): number;
    itemWidth(): number;
    createButtons(): void;
    placeButtons(): void;
    update(): void;
    processDigitChange(): void;
    changeDigit(up: boolean): void;
    isTouchOkEnabled(): boolean;
    isOkEnabled(): boolean;
    isCancelEnabled(): boolean;
    processOk(): void;
    drawItem(index: number): void;
    onButtonUp(): void;
    onButtonDown(): void;
    onButtonOk(): void;

    _messageWindow: Window_Message;
    _number: number;
    _maxDigits: number;
    _buttons: Sprite_Button[];
}

// ---------------------------------------------------------------------------
// Window_EventItem
// The window used for the event command [Select Item].
// ---------------------------------------------------------------------------

declare class Window_EventItem extends Window_ItemList {
    constructor(messageWindow: Window_Message);
    initialize(messageWindow: Window_Message): void;

    windowHeight(): number;
    numVisibleRows(): number;
    start(): void;
    updatePlacement(): void;
    includes(item: any): boolean;
    isEnabled(item: any): boolean;
    onOk(): void;
    onCancel(): void;

    _messageWindow: Window_Message;
}

// ---------------------------------------------------------------------------
// Window_ScrollText
// The window for displaying scrolling text.
// ---------------------------------------------------------------------------

declare class Window_ScrollText extends Window_Base {
    constructor();
    initialize(): void;

    update(): void;
    startMessage(): void;
    refresh(): void;
    contentsHeight(): number;
    updateMessage(): void;
    scrollSpeed(): number;
    isFastForward(): boolean;
    fastForwardRate(): number;
    terminateMessage(): void;

    _text: string;
    _allTextHeight: number;
}

// ---------------------------------------------------------------------------
// Window_MapName
// The window for displaying the map name on the map screen.
// ---------------------------------------------------------------------------

declare class Window_MapName extends Window_Base {
    constructor();
    initialize(): void;

    windowWidth(): number;
    windowHeight(): number;
    update(): void;
    updateFadeIn(): void;
    updateFadeOut(): void;
    open(): void;
    close(): void;
    refresh(): void;
    drawBackground(x: number, y: number, width: number, height: number): void;

    _showCount: number;
}

// ---------------------------------------------------------------------------
// Window_BattleLog
// The window for displaying battle progress.
// ---------------------------------------------------------------------------

declare class Window_BattleLog extends Window_Selectable {
    constructor();
    initialize(): void;

    setSpriteset(spriteset: Spriteset_Battle): void;
    windowWidth(): number;
    windowHeight(): number;
    maxLines(): number;
    createBackBitmap(): void;
    createBackSprite(): void;
    numLines(): number;
    messageSpeed(): number;
    isBusy(): boolean;
    update(): void;
    updateWait(): boolean;
    updateWaitCount(): boolean;
    updateWaitMode(): boolean;
    setWaitMode(waitMode: string): void;
    callNextMethod(): void;
    isFastForward(): boolean;
    push(methodName: string, ...args: any[]): void;
    clear(): void;
    wait(): void;
    waitForEffect(): void;
    waitForMovement(): void;
    addText(text: string): void;
    pushBaseLine(): void;
    popBaseLine(): void;
    waitForNewLine(): void;
    popupDamage(target: Game_Battler): void;
    performActionStart(subject: Game_Battler, action: Game_Action): void;
    performAction(subject: Game_Battler, action: Game_Action): void;
    performActionEnd(subject: Game_Battler): void;
    performDamage(target: Game_Battler): void;
    performMiss(target: Game_Battler): void;
    performRecovery(target: Game_Battler): void;
    performEvasion(target: Game_Battler): void;
    performMagicEvasion(target: Game_Battler): void;
    performCounter(target: Game_Battler): void;
    performReflection(target: Game_Battler): void;
    performSubstitute(substitute: Game_Battler, target: Game_Battler): void;
    performCollapse(target: Game_Battler): void;
    showAnimation(subject: Game_Battler, targets: Game_Battler[], animationId: number): void;
    showAttackAnimation(subject: Game_Battler, targets: Game_Battler[]): void;
    showActorAttackAnimation(subject: Game_Battler, targets: Game_Battler[]): void;
    showEnemyAttackAnimation(subject: Game_Battler, targets: Game_Battler[]): void;
    showNormalAnimation(targets: Game_Battler[], animationId: number, mirror: boolean): void;
    animationBaseDelay(): number;
    animationNextDelay(): number;
    refresh(): void;
    drawBackground(): void;
    backRect(): Rectangle;
    backColor(): string;
    lineRect(index: number): Rectangle;
    drawLineText(index: number): void;
    startTurn(): void;
    startAction(subject: Game_Battler, action: Game_Action, targets: Game_Battler[]): void;
    endAction(subject: Game_Battler): void;
    currentAction(): Game_Action;
    displayAction(subject: Game_Battler, item: any): void;
    displayCounter(target: Game_Battler): void;
    displayReflection(target: Game_Battler): void;
    displaySubstitute(substitute: Game_Battler, target: Game_Battler): void;
    displayActionResults(subject: Game_Battler, target: Game_Battler): void;
    displayFailure(target: Game_Battler): void;
    displayCritical(target: Game_Battler): void;
    displayDamage(target: Game_Battler): void;
    displayMiss(target: Game_Battler): void;
    displayEvasion(target: Game_Battler): void;
    displayHpDamage(target: Game_Battler): void;
    displayMpDamage(target: Game_Battler): void;
    displayTpDamage(target: Game_Battler): void;
    displayAffectedStatus(target: Game_Battler): void;
    displayAutoAffectedStatus(target: Game_Battler): void;
    displayChangedStates(target: Game_Battler): void;
    displayAddedStates(target: Game_Battler): void;
    displayRemovedStates(target: Game_Battler): void;
    displayChangedBuffs(target: Game_Battler): void;
    displayBuffs(target: Game_Battler, buffs: number[], fmt: string): void;
    makeHpDamageText(target: Game_Battler): string;
    makeMpDamageText(target: Game_Battler): string;
    makeTpDamageText(target: Game_Battler): string;

    _lines: string[];
    _methods: { name: string; params: any[] }[];
    _waitCount: number;
    _waitMode: string;
    _baseLine: number;
    _spriteset: Spriteset_Battle | null;
    _backBitmap: Bitmap;
    _backSprite: Sprite;
    _baseLineStack: number[];
}

// ---------------------------------------------------------------------------
// Window_PartyCommand
// The window for selecting whether to fight or escape on the battle screen.
// ---------------------------------------------------------------------------

declare class Window_PartyCommand extends Window_Command {
    constructor();
    initialize(): void;

    makeCommandList(): void;
    setup(): void;
}

// ---------------------------------------------------------------------------
// Window_ActorCommand
// The window for selecting an actor's action on the battle screen.
// ---------------------------------------------------------------------------

declare class Window_ActorCommand extends Window_Command {
    constructor();
    initialize(): void;

    makeCommandList(): void;
    addAttackCommand(): void;
    addSkillCommands(): void;
    addGuardCommand(): void;
    addItemCommand(): void;
    setup(actor: Game_Actor): void;
    processOk(): void;
    selectLast(): void;

    _actor: Game_Actor | null;
}

// ---------------------------------------------------------------------------
// Window_BattleStatus
// The window for displaying the status of party members on the battle screen.
// ---------------------------------------------------------------------------

declare class Window_BattleStatus extends Window_Selectable {
    constructor();
    initialize(): void;

    windowWidth(): number;
    windowHeight(): number;
    maxItems(): number;
    refresh(): void;
    drawItem(index: number): void;
    basicAreaRect(index: number): Rectangle;
    gaugeAreaRect(index: number): Rectangle;
    gaugeAreaWidth(): number;
    drawBasicArea(rect: Rectangle, actor: Game_Actor): void;
    drawGaugeArea(rect: Rectangle, actor: Game_Actor): void;
    drawGaugeAreaWithTp(rect: Rectangle, actor: Game_Actor): void;
    drawGaugeAreaWithoutTp(rect: Rectangle, actor: Game_Actor): void;
}

// ---------------------------------------------------------------------------
// Window_BattleActor
// The window for selecting a target actor on the battle screen.
// ---------------------------------------------------------------------------

declare class Window_BattleActor extends Window_BattleStatus {
    constructor(x: number, y: number);
    initialize(x: number, y: number): void;

    show(): void;
    hide(): void;
    select(index: number): void;
    actor(): Game_Actor;
}

// ---------------------------------------------------------------------------
// Window_BattleEnemy
// The window for selecting a target enemy on the battle screen.
// ---------------------------------------------------------------------------

declare class Window_BattleEnemy extends Window_Selectable {
    constructor(x: number, y: number);
    initialize(x: number, y: number): void;

    windowWidth(): number;
    windowHeight(): number;
    maxItems(): number;
    enemy(): Game_Enemy;
    enemyIndex(): number;
    drawItem(index: number): void;
    show(): void;
    hide(): void;
    refresh(): void;
    select(index: number): void;

    _enemies: Game_Enemy[];
}

// ---------------------------------------------------------------------------
// Window_BattleSkill
// The window for selecting a skill to use on the battle screen.
// ---------------------------------------------------------------------------

declare class Window_BattleSkill extends Window_SkillList {
    constructor(x: number, y: number, width: number, height: number);

    show(): void;
    hide(): void;
}

// ---------------------------------------------------------------------------
// Window_BattleItem
// The window for selecting an item to use on the battle screen.
// ---------------------------------------------------------------------------

declare class Window_BattleItem extends Window_ItemList {
    constructor(x: number, y: number, width: number, height: number);

    includes(item: any): boolean;
    show(): void;
    hide(): void;
}

// ---------------------------------------------------------------------------
// Window_TitleCommand
// The window for selecting New Game/Continue on the title screen.
// ---------------------------------------------------------------------------

declare class Window_TitleCommand extends Window_Command {
    constructor();
    initialize(): void;

    static initCommandPosition(): void;
    static _lastCommandSymbol: string | null;

    updatePlacement(): void;
    makeCommandList(): void;
    isContinueEnabled(): boolean;
    processOk(): void;
    selectLast(): void;
}

// ---------------------------------------------------------------------------
// Window_GameEnd
// The window for selecting "Go to Title" on the game end screen.
// ---------------------------------------------------------------------------

declare class Window_GameEnd extends Window_Command {
    constructor();
    initialize(): void;

    updatePlacement(): void;
    makeCommandList(): void;
}

// ---------------------------------------------------------------------------
// Window_DebugRange
// The window for selecting a block of switches/variables on the debug screen.
// ---------------------------------------------------------------------------

declare class Window_DebugRange extends Window_Selectable {
    constructor(x: number, y: number);
    initialize(x: number, y: number): void;

    static lastTopRow: number;
    static lastIndex: number;

    windowWidth(): number;
    windowHeight(): number;
    maxItems(): number;
    update(): void;
    mode(): string;
    topId(): number;
    refresh(): void;
    drawItem(index: number): void;
    isCancelTriggered(): boolean;
    processCancel(): void;
    setEditWindow(editWindow: Window_DebugEdit): void;

    _editWindow: Window_DebugEdit | null;
}

// ---------------------------------------------------------------------------
// Window_DebugEdit
// The window for displaying switches/variables on the debug screen.
// ---------------------------------------------------------------------------

declare class Window_DebugEdit extends Window_Selectable {
    constructor(x: number, y: number, width: number);
    initialize(x: number, y: number, width: number): void;

    maxItems(): number;
    refresh(): void;
    drawItem(index: number): void;
    itemName(dataId: number): string;
    itemStatus(dataId: number): string;
    setMode(mode: string): void;
    setTopId(id: number): void;
    update(): void;
    updateSwitch(): void;
    updateVariable(): void;

    _mode: string;
    _topId: number;
}

// ---------------------------------------------------------------------------
// Window_ItemCategory
// The window for selecting a category of items on the item screen.
// ---------------------------------------------------------------------------

declare class Window_ItemCategory extends Window_HorzCommand {
    constructor();
    initialize(): void;

    windowWidth(): number;
    maxCols(): number;
    update(): void;
    makeCommandList(): void;
    setItemWindow(itemWindow: Window_ItemList): void;

    _itemWindow: Window_ItemList | null;
}
