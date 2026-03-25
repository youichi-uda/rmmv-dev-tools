// Type definitions for RPG Maker MV rpg_objects.js
// These are the runtime game object classes used by RPG Maker MV.

// ─── Game_Temp ───────────────────────────────────────────────────────────────
// The game object class for temporary data that is not included in save data.

declare class Game_Temp {
    constructor();

    initialize(): void;
    isPlaytest(): boolean;
    reserveCommonEvent(commonEventId: number): void;
    clearCommonEvent(): void;
    isCommonEventReserved(): boolean;
    reservedCommonEvent(): RPG_CommonEvent | null;
    setDestination(x: number, y: number): void;
    clearDestination(): void;
    isDestinationValid(): boolean;
    destinationX(): number | null;
    destinationY(): number | null;
}

// ─── Game_System ─────────────────────────────────────────────────────────────
// The game object class for the system data.

declare class Game_System {
    constructor();

    _saveEnabled: boolean;
    _menuEnabled: boolean;
    _encounterEnabled: boolean;
    _formationEnabled: boolean;
    _battleCount: number;
    _winCount: number;
    _escapeCount: number;
    _saveCount: number;
    _versionId: number;
    _framesOnSave: number;
    _bgmOnSave: RPG_AudioFile | null;
    _bgsOnSave: RPG_AudioFile | null;
    _windowTone: number[] | null;
    _battleBgm: RPG_AudioFile | null;
    _victoryMe: RPG_AudioFile | null;
    _defeatMe: RPG_AudioFile | null;

    initialize(): void;
    isJapanese(): boolean;
    isChinese(): boolean;
    isKorean(): boolean;
    isCJK(): boolean;
    isRussian(): boolean;
    isSideView(): boolean;
    isBattleEventRunning(): boolean;
    playtime(): number;
    playtimeText(): string;
    saveBgm(): void;
    replayBgm(): void;
    saveWalkingBgm(): void;
    replayWalkingBgm(): void;
    saveCount(): number;
    versionId(): number;
    windowTone(): number[];
    setBattleBgm(value: RPG_AudioFile): void;
    battleBgm(): RPG_AudioFile;
    setVictoryMe(value: RPG_AudioFile): void;
    victoryMe(): RPG_AudioFile;
    setDefeatMe(value: RPG_AudioFile): void;
    defeatMe(): RPG_AudioFile;
    onBattleStart(): void;
    onBattleWin(): void;
    onBattleEscape(): void;
    onBeforeSave(): void;
    onAfterLoad(): void;
    isMenuEnabled(): boolean;
    disableMenu(): void;
    enableMenu(): void;
    isSaveEnabled(): boolean;
    disableSave(): void;
    enableSave(): void;
    isEncounterEnabled(): boolean;
    disableEncounters(): void;
    enableEncounters(): void;
    isFormationEnabled(): boolean;
    disableFormation(): void;
    enableFormation(): void;
    battleCount(): number;
    winCount(): number;
    escapeCount(): number;
}

// ─── Game_Timer ──────────────────────────────────────────────────────────────
// The game object class for the timer.

declare class Game_Timer {
    constructor();

    _frames: number;
    _working: boolean;

    initialize(): void;
    update(sceneActive: boolean): void;
    start(count: number): void;
    stop(): void;
    isWorking(): boolean;
    seconds(): number;
    onExpire(): void;
}

// ─── Game_Message ────────────────────────────────────────────────────────────
// The game object class for the state of the message window.

declare class Game_Message {
    constructor();

    _texts: string[];
    _choices: string[];
    _faceName: string;
    _faceIndex: number;
    _background: number;
    _positionType: number;
    _choiceDefaultType: number;
    _choiceCancelType: number;
    _choiceCallback: ((n: number) => void) | null;
    _numInputVariableId: number;
    _numInputMaxDigits: number;
    _itemChoiceVariableId: number;
    _itemChoiceItypeId: number;
    _scrollMode: boolean;
    _scrollSpeed: number;
    _scrollNoFast: boolean;

    initialize(): void;
    clear(): void;
    choices(): string[];
    faceName(): string;
    faceIndex(): number;
    background(): number;
    positionType(): number;
    choiceDefaultType(): number;
    choiceCancelType(): number;
    choiceCallback(): ((n: number) => void) | null;
    add(text: string): void;
    setFaceImage(faceName: string, faceIndex: number): void;
    setBackground(background: number): void;
    setPositionType(positionType: number): void;
    setChoices(choices: string[], defaultType: number, cancelType: number): void;
    setChoiceCallback(callback: (n: number) => void): void;
    onChoice(n: number): void;
    hasText(): boolean;
    isChoice(): boolean;
    isBusy(): boolean;
    newPage(): void;
    allText(): string;
}

// ─── Game_Switches ───────────────────────────────────────────────────────────
// The game object class for switches.

declare class Game_Switches {
    constructor();

    _data: boolean[];

    initialize(): void;
    clear(): void;
    value(switchId: number): boolean;
    setValue(switchId: number, value: boolean): void;
    onChange(): void;
}

// ─── Game_Variables ──────────────────────────────────────────────────────────
// The game object class for variables.

declare class Game_Variables {
    constructor();

    _data: any[];

    initialize(): void;
    clear(): void;
    value(variableId: number): any;
    setValue(variableId: number, value: any): void;
    onChange(): void;
}

// ─── Game_SelfSwitches ───────────────────────────────────────────────────────
// The game object class for self switches.

declare class Game_SelfSwitches {
    constructor();

    _data: Record<string, boolean>;

    initialize(): void;
    clear(): void;
    value(key: [number, number, string]): boolean;
    setValue(key: [number, number, string], value: boolean): void;
    onChange(): void;
}

// ─── Game_Screen ─────────────────────────────────────────────────────────────
// The game object class for screen effect data, such as changes in color tone
// and flash.

declare class Game_Screen {
    constructor();

    initialize(): void;
    clear(): void;
    onBattleStart(): void;
    brightness(): number;
    tone(): number[];
    flashColor(): number[];
    shake(): number;
    zoomX(): number;
    zoomY(): number;
    zoomScale(): number;
    weatherType(): string;
    weatherPower(): number;
    picture(pictureId: number): Game_Picture | null;
    realPictureId(pictureId: number): number;
    clearFade(): void;
    clearTone(): void;
    clearFlash(): void;
    clearShake(): void;
    clearZoom(): void;
    clearWeather(): void;
    clearPictures(): void;
    eraseBattlePictures(): void;
    maxPictures(): number;
    startFadeOut(duration: number): void;
    startFadeIn(duration: number): void;
    startTint(tone: number[], duration: number): void;
    startFlash(color: number[], duration: number): void;
    startShake(power: number, speed: number, duration: number): void;
    startZoom(x: number, y: number, scale: number, duration: number): void;
    setZoom(x: number, y: number, scale: number): void;
    changeWeather(type: string, power: number, duration: number): void;
    update(): void;
    updateFadeOut(): void;
    updateFadeIn(): void;
    updateTone(): void;
    updateFlash(): void;
    updateShake(): void;
    updateZoom(): void;
    updateWeather(): void;
    showPicture(pictureId: number, name: string, origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: number): void;
    movePicture(pictureId: number, origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: number, duration: number): void;
    rotatePicture(pictureId: number, speed: number): void;
    tintPicture(pictureId: number, tone: number[], duration: number): void;
    erasePicture(pictureId: number): void;
}

// ─── Game_Picture ────────────────────────────────────────────────────────────
// The game object class for a picture.

declare class Game_Picture {
    constructor();

    _name: string;
    _origin: number;
    _x: number;
    _y: number;
    _scaleX: number;
    _scaleY: number;
    _opacity: number;
    _blendMode: number;
    _tone: number[] | null;
    _angle: number;

    initialize(): void;
    name(): string;
    origin(): number;
    x(): number;
    y(): number;
    scaleX(): number;
    scaleY(): number;
    opacity(): number;
    blendMode(): number;
    tone(): number[] | null;
    angle(): number;
    initBasic(pictureId: number): void;
    initTarget(): void;
    initTone(): void;
    initRotation(): void;
    show(name: string, origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: number): void;
    move(origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: number, duration: number): void;
    rotate(speed: number): void;
    tint(tone: number[], duration: number): void;
    erase(): void;
    update(): void;
    updateMove(): void;
    updateTone(): void;
    updateRotation(): void;
}

// ─── Game_Item ───────────────────────────────────────────────────────────────
// The game object class for handling skills, items, weapons, and armor.
// It is required because save data should not include the database object itself.

declare class Game_Item {
    constructor(item?: RPG_Skill | RPG_Item | RPG_Weapon | RPG_Armor | null);

    _dataClass: string;
    _itemId: number;

    initialize(item?: RPG_Skill | RPG_Item | RPG_Weapon | RPG_Armor | null): void;
    isSkill(): boolean;
    isItem(): boolean;
    isWeapon(): boolean;
    isArmor(): boolean;
    isNull(): boolean;
    itemId(): number;
    object(): RPG_Skill | RPG_Item | RPG_Weapon | RPG_Armor | null;
    setObject(item: RPG_Skill | RPG_Item | RPG_Weapon | RPG_Armor | null): void;
    setEquip(isWeapon: boolean, itemId: number): void;
}

// ─── Game_Action ─────────────────────────────────────────────────────────────
// The game object class for a battle action.

declare class Game_Action {
    constructor(subject: Game_Battler, forcing?: boolean);

    static EFFECT_RECOVER_HP: number;
    static EFFECT_RECOVER_MP: number;
    static EFFECT_GAIN_TP: number;
    static EFFECT_ADD_STATE: number;
    static EFFECT_REMOVE_STATE: number;
    static EFFECT_ADD_BUFF: number;
    static EFFECT_ADD_DEBUFF: number;
    static EFFECT_REMOVE_BUFF: number;
    static EFFECT_REMOVE_DEBUFF: number;
    static EFFECT_SPECIAL: number;
    static EFFECT_GROW: number;
    static EFFECT_LEARN_SKILL: number;
    static EFFECT_COMMON_EVENT: number;
    static SPECIAL_EFFECT_ESCAPE: number;
    static HITTYPE_CERTAIN: number;
    static HITTYPE_PHYSICAL: number;
    static HITTYPE_MAGICAL: number;

    _item: Game_Item;
    _targetIndex: number;
    _forcing: boolean;
    _subjectActorId: number;
    _subjectEnemyIndex: number;

    clear(): void;
    setSubject(subject: Game_Battler): void;
    subject(): Game_Battler;
    friendsUnit(): Game_Unit;
    opponentsUnit(): Game_Unit;
    setEnemyAction(action: RPG_EnemyAction | null): void;
    setAttack(): void;
    setGuard(): void;
    setSkill(skillId: number): void;
    setItem(itemId: number): void;
    setItemObject(object: RPG_Skill | RPG_Item): void;
    setTarget(targetIndex: number): void;
    item(): RPG_Skill | RPG_Item | null;
    isSkill(): boolean;
    isItem(): boolean;
    numRepeats(): number;
    checkItemScope(list: number[]): boolean;
    isForOpponent(): boolean;
    isForFriend(): boolean;
    isForDeadFriend(): boolean;
    isForUser(): boolean;
    isForAll(): boolean;
    isForRandom(): boolean;
    isForOne(): boolean;
    needsSelection(): boolean;
    numTargets(): number;
    checkDamageType(list: number[]): boolean;
    isHpEffect(): boolean;
    isMpEffect(): boolean;
    isDamage(): boolean;
    isRecover(): boolean;
    isDrain(): boolean;
    isHpRecover(): boolean;
    isMpRecover(): boolean;
    isCertainHit(): boolean;
    isPhysical(): boolean;
    isMagical(): boolean;
    isAttack(): boolean;
    isGuard(): boolean;
    isMagicSkill(): boolean;
    decideRandomTarget(): void;
    makeTargets(): Game_Battler[];
    repeatTargets(targets: Game_Battler[]): Game_Battler[];
    confusionTarget(): Game_Battler;
    targetsForOpponents(): Game_Battler[];
    targetsForFriends(): Game_Battler[];
    evaluate(): number;
    itemTargetCandidates(): (Game_Actor | Game_Enemy)[];
    evaluateWithTarget(target: Game_Battler): number;
    testApply(target: Game_Battler): boolean;
    hasItemAnyValidEffects(target: Game_Battler): boolean;
    testItemEffect(target: Game_Battler, effect: RPG_Effect): boolean;
    itemCnt(target: Game_Battler): number;
    itemMrf(target: Game_Battler): number;
    itemHit(target: Game_Battler): number;
    itemEva(target: Game_Battler): number;
    itemCri(target: Game_Battler): number;
    apply(target: Game_Battler): void;
    makeDamageValue(target: Game_Battler, critical: boolean): number;
    evalDamageFormula(target: Game_Battler): number;
    calcElementRate(target: Game_Battler): number;
    elementsMaxRate(target: Game_Battler, elements: number[]): number;
    applyCritical(damage: number): number;
    applyVariance(damage: number, variance: number): number;
    applyGuard(damage: number, target: Game_Battler): number;
    executeDamage(target: Game_Battler, value: number): void;
    executeHpDamage(target: Game_Battler, value: number): void;
    executeMpDamage(target: Game_Battler, value: number): void;
    gainDrainedHp(value: number): void;
    gainDrainedMp(value: number): void;
    applyItemEffect(target: Game_Battler, effect: RPG_Effect): void;
    itemEffectRecoverHp(target: Game_Battler, effect: RPG_Effect): void;
    itemEffectRecoverMp(target: Game_Battler, effect: RPG_Effect): void;
    itemEffectGainTp(target: Game_Battler, effect: RPG_Effect): void;
    itemEffectAddState(target: Game_Battler, effect: RPG_Effect): void;
    itemEffectRemoveState(target: Game_Battler, effect: RPG_Effect): void;
    itemEffectAddBuff(target: Game_Battler, effect: RPG_Effect): void;
    itemEffectAddDebuff(target: Game_Battler, effect: RPG_Effect): void;
    itemEffectRemoveBuff(target: Game_Battler, effect: RPG_Effect): void;
    itemEffectRemoveDebuff(target: Game_Battler, effect: RPG_Effect): void;
    itemEffectSpecial(target: Game_Battler, effect: RPG_Effect): void;
    itemEffectGrow(target: Game_Battler, effect: RPG_Effect): void;
    itemEffectLearnSkill(target: Game_Battler, effect: RPG_Effect): void;
    itemEffectCommonEvent(target: Game_Battler, effect: RPG_Effect): void;
    applyItemUserEffect(target: Game_Battler): void;
    lukEffectRate(target: Game_Battler): number;
    applyGlobal(): void;
    makeSuccess(target: Game_Battler): void;
    hasItem(): boolean;
    isValid(): boolean;
    speed(): number;
    makeSpeed(): number;
}

// ─── Game_ActionResult ───────────────────────────────────────────────────────
// The game object class for a result of a battle action.

declare class Game_ActionResult {
    constructor();

    used: boolean;
    missed: boolean;
    evaded: boolean;
    physical: boolean;
    drain: boolean;
    critical: boolean;
    success: boolean;
    hpAffected: boolean;
    hpDamage: number;
    mpDamage: number;
    tpDamage: number;
    addedStates: number[];
    removedStates: number[];
    addedBuffs: number[];
    addedDebuffs: number[];
    removedBuffs: number[];

    initialize(): void;
    clear(): void;
    isStatusAffected(): boolean;
    isHit(): boolean;
    isStateAdded(stateId: number): boolean;
    pushAddedState(stateId: number): void;
    isStateRemoved(stateId: number): boolean;
    pushRemovedState(stateId: number): void;
    isBuffAdded(paramId: number): boolean;
    pushAddedBuff(paramId: number): void;
    isDebuffAdded(paramId: number): boolean;
    pushAddedDebuff(paramId: number): void;
    isBuffRemoved(paramId: number): boolean;
    pushRemovedBuff(paramId: number): void;
}

// ─── Game_BattlerBase ────────────────────────────────────────────────────────
// The superclass of Game_Battler. It mainly contains parameters calculation.

interface Game_BattlerBase {
    [key: string]: any;
}

declare class Game_BattlerBase {
    constructor();

    // Trait constants
    static TRAIT_ELEMENT_RATE: number;
    static TRAIT_DEBUFF_RATE: number;
    static TRAIT_STATE_RATE: number;
    static TRAIT_STATE_RESIST: number;
    static TRAIT_PARAM: number;
    static TRAIT_XPARAM: number;
    static TRAIT_SPARAM: number;
    static TRAIT_ATTACK_ELEMENT: number;
    static TRAIT_ATTACK_STATE: number;
    static TRAIT_ATTACK_SPEED: number;
    static TRAIT_ATTACK_TIMES: number;
    static TRAIT_STYPE_ADD: number;
    static TRAIT_STYPE_SEAL: number;
    static TRAIT_SKILL_ADD: number;
    static TRAIT_SKILL_SEAL: number;
    static TRAIT_EQUIP_WTYPE: number;
    static TRAIT_EQUIP_ATYPE: number;
    static TRAIT_EQUIP_LOCK: number;
    static TRAIT_EQUIP_SEAL: number;
    static TRAIT_SLOT_TYPE: number;
    static TRAIT_ACTION_PLUS: number;
    static TRAIT_SPECIAL_FLAG: number;
    static TRAIT_COLLAPSE_TYPE: number;
    static TRAIT_PARTY_ABILITY: number;
    static FLAG_ID_AUTO_BATTLE: number;
    static FLAG_ID_GUARD: number;
    static FLAG_ID_SUBSTITUTE: number;
    static FLAG_ID_PRESERVE_TP: number;
    static ICON_BUFF_START: number;
    static ICON_DEBUFF_START: number;

    // Properties (getters defined via Object.defineProperties)
    readonly hp: number;
    readonly mp: number;
    readonly tp: number;
    readonly mhp: number;
    readonly mmp: number;
    readonly atk: number;
    readonly def: number;
    readonly mat: number;
    readonly mdf: number;
    readonly agi: number;
    readonly luk: number;
    readonly hit: number;
    readonly eva: number;
    readonly cri: number;
    readonly cev: number;
    readonly mev: number;
    readonly mrf: number;
    readonly cnt: number;
    readonly hrg: number;
    readonly mrg: number;
    readonly trg: number;
    readonly tgr: number;
    readonly grd: number;
    readonly rec: number;
    readonly pha: number;
    readonly mcr: number;
    readonly tcr: number;
    readonly pdr: number;
    readonly mdr: number;
    readonly fdr: number;
    readonly exr: number;

    _hp: number;
    _mp: number;
    _tp: number;
    _hidden: boolean;
    _paramPlus: number[];
    _states: number[];
    _stateTurns: Record<number, number>;
    _buffs: number[];
    _buffTurns: number[];

    initialize(): void;
    initMembers(): void;
    clearParamPlus(): void;
    clearStates(): void;
    eraseState(stateId: number): void;
    isStateAffected(stateId: number): boolean;
    isDeathStateAffected(): boolean;
    deathStateId(): number;
    resetStateCounts(stateId: number): void;
    isStateExpired(stateId: number): boolean;
    updateStateTurns(): void;
    clearBuffs(): void;
    eraseBuff(paramId: number): void;
    buffLength(): number;
    buff(paramId: number): number;
    isBuffAffected(paramId: number): boolean;
    isDebuffAffected(paramId: number): boolean;
    isBuffOrDebuffAffected(paramId: number): boolean;
    isMaxBuffAffected(paramId: number): boolean;
    isMaxDebuffAffected(paramId: number): boolean;
    increaseBuff(paramId: number): void;
    decreaseBuff(paramId: number): void;
    overwriteBuffTurns(paramId: number, turns: number): void;
    isBuffExpired(paramId: number): boolean;
    updateBuffTurns(): void;
    die(): void;
    revive(): void;
    states(): RPG_State[];
    stateIcons(): number[];
    buffIcons(): number[];
    buffIconIndex(buffLevel: number, paramId: number): number;
    allIcons(): number[];
    traitObjects(): (RPG_State | RPG_Actor | RPG_Class | RPG_Weapon | RPG_Armor | RPG_Enemy)[];
    allTraits(): RPG_Trait[];
    traits(code: number): RPG_Trait[];
    traitsWithId(code: number, id: number): RPG_Trait[];
    traitsPi(code: number, id: number): number;
    traitsSum(code: number, id: number): number;
    traitsSumAll(code: number): number;
    traitsSet(code: number): number[];
    paramBase(paramId: number): number;
    paramPlus(paramId: number): number;
    paramMin(paramId: number): number;
    paramMax(paramId: number): number;
    paramRate(paramId: number): number;
    paramBuffRate(paramId: number): number;
    param(paramId: number): number;
    xparam(xparamId: number): number;
    sparam(sparamId: number): number;
    elementRate(elementId: number): number;
    debuffRate(paramId: number): number;
    stateRate(stateId: number): number;
    stateResistSet(): number[];
    isStateResist(stateId: number): boolean;
    attackElements(): number[];
    attackStates(): number[];
    attackStatesRate(stateId: number): number;
    attackSpeed(): number;
    attackTimesAdd(): number;
    addedSkillTypes(): number[];
    addedSkills(): number[];
    isSkillTypeSealed(stTypeId: number): boolean;
    isSkillSealed(skillId: number): boolean;
    isEquipTypeSealed(etypeId: number): boolean;
    isEquipTypeLocked(etypeId: number): boolean;
    slotType(): number;
    isDualWield(): boolean;
    actionPlusSet(): number[];
    specialFlag(flagId: number): boolean;
    collapseType(): number;
    partyAbility(abilityId: number): boolean;
    isAutoBattle(): boolean;
    isGuard(): boolean;
    isSubstitute(): boolean;
    isPreserveTp(): boolean;
    canPaySkillCost(skill: RPG_Skill): boolean;
    paySkillCost(skill: RPG_Skill): void;
    isOccasionOk(item: RPG_Skill | RPG_Item): boolean;
    meetsUsableItemConditions(item: RPG_Skill | RPG_Item): boolean;
    meetsSkillConditions(skill: RPG_Skill): boolean;
    meetsItemConditions(item: RPG_Item): boolean;
    canUse(item: RPG_Skill | RPG_Item | null): boolean;
    canEquip(item: RPG_Weapon | RPG_Armor | null): boolean;
    canEquipWeapon(item: RPG_Weapon): boolean;
    canEquipArmor(item: RPG_Armor): boolean;
    attackSkillId(): number;
    guardSkillId(): number;
    canAttack(): boolean;
    canGuard(): boolean;
    isAlive(): boolean;
    isDead(): boolean;
    isDeathStateAffected(): boolean;
    isAppeared(): boolean;
    isHidden(): boolean;
    appear(): void;
    hide(): void;
    isActor(): boolean;
    isEnemy(): boolean;
    sortReference(): number;
    restriction(): number;
    canMove(): boolean;
    canInput(): boolean;
    isConfused(): boolean;
    confusionLevel(): number;
    friendsUnit(): Game_Unit;
    opponentsUnit(): Game_Unit;
    index(): number;
    isBattleMember(): boolean;
    name(): string;
    refresh(): void;
    addNewState(stateId: number): void;
    currentClass(): RPG_Class;
    equipSlots(): number[];
}

// ─── Game_Battler ────────────────────────────────────────────────────────────
// The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
// and actions.

declare class Game_Battler extends Game_BattlerBase {
    constructor();

    _actions: Game_Action[];
    _speed: number;
    _result: Game_ActionResult;
    _actionState: string;
    _lastTargetIndex: number;
    _animations: { animationId: number; mirror: boolean; delay: number }[];
    _damagePopup: boolean;
    _effectType: string | null;
    _motionType: string | null;
    _weaponImageId: number;
    _motionRefresh: boolean;
    _selected: boolean;

    initMembers(): void;
    clearAnimations(): void;
    clearDamagePopup(): void;
    isDamagePopupRequested(): boolean;
    requestDamagePopup(): void;
    clearWeaponAnimation(): void;
    weaponImageId(): number;
    requestWeaponAnimation(): void;
    isWeaponAnimationRequested(): boolean;
    clearEffect(): void;
    requestEffect(effectType: string): void;
    isEffectRequested(): boolean;
    effectType(): string | null;
    startDamagePopup(): void;
    shouldPopupDamage(): boolean;
    startWeaponAnimation(weaponImageId: number): void;
    action(index: number): Game_Action;
    setAction(index: number, action: Game_Action): void;
    numActions(): number;
    clearActions(): void;
    result(): Game_ActionResult;
    clearResult(): void;
    refresh(): void;
    addState(stateId: number): void;
    removeState(stateId: number): void;
    escape(): void;
    addBuff(paramId: number, turns: number): void;
    addDebuff(paramId: number, turns: number): void;
    removeBuff(paramId: number): void;
    removeBattleStates(): void;
    removeAllBuffs(): void;
    removeStatesAuto(timing: number): void;
    removeBuffsAuto(): void;
    removeStatesByDamage(): void;
    makeActionTimes(): number;
    makeActions(): void;
    speed(): number;
    makeSpeed(): void;
    currentAction(): Game_Action | null;
    removeCurrentAction(): void;
    setLastTarget(target: Game_Battler): void;
    forceAction(skillId: number, targetIndex: number): void;
    useItem(item: RPG_Skill | RPG_Item): void;
    consumeItem(item: RPG_Item): void;
    gainHp(value: number): void;
    gainMp(value: number): void;
    gainTp(value: number): void;
    gainSilentTp(value: number): void;
    initTp(): void;
    clearTp(): void;
    chargeTpByDamage(damageRate: number): void;
    regenerateHp(): void;
    maxSlipDamage(): number;
    regenerateMp(): void;
    regenerateTp(): void;
    regenerateAll(): void;
    onBattleStart(): void;
    onAllActionsEnd(): void;
    onTurnEnd(): void;
    onBattleEnd(): void;
    onDamage(value: number): void;
    setActionState(actionState: string): void;
    isUndecided(): boolean;
    isInputting(): boolean;
    isWaiting(): boolean;
    isActing(): boolean;
    isChanting(): boolean;
    isGuardWaiting(): boolean;
    performActionStart(action: Game_Action): void;
    performAction(action: Game_Action): void;
    performActionEnd(): void;
    performDamage(): void;
    performMiss(): void;
    performRecovery(): void;
    performEvasion(): void;
    performMagicEvasion(): void;
    performCounter(): void;
    performCollapse(): void;
    performReflection(): void;
    isAnimationRequested(): boolean;
    shiftAnimation(): { animationId: number; mirror: boolean; delay: number } | undefined;
    startAnimation(animationId: number, mirror: boolean, delay: number): void;
    isSelected(): boolean;
    select(): void;
    deselect(): void;
}

// ─── Game_Actor ──────────────────────────────────────────────────────────────
// The game object class for an actor.

declare class Game_Actor extends Game_Battler {
    constructor(actorId: number);

    _actorId: number;
    _name: string;
    _nickname: string;
    _profile: string;
    _classId: number;
    _level: number;
    _characterName: string;
    _characterIndex: number;
    _faceName: string;
    _faceIndex: number;
    _battlerName: string;
    _exp: Record<number, number>;
    _skills: number[];
    _equips: Game_Item[];
    _actionInputIndex: number;
    _lastMenuSkill: Game_Item;
    _lastBattleSkill: Game_Item;
    _lastCommandSymbol: string;
    _stateSteps: Record<number, number>;

    setup(actorId: number): void;
    actorId(): number;
    actor(): RPG_Actor;
    name(): string;
    setName(name: string): void;
    nickname(): string;
    setNickname(nickname: string): void;
    profile(): string;
    setProfile(profile: string): void;
    characterName(): string;
    characterIndex(): number;
    faceName(): string;
    faceIndex(): number;
    battlerName(): string;
    clearStates(): void;
    eraseState(stateId: number): void;
    resetStateCounts(stateId: number): void;
    initImages(): void;
    exp(): number;
    currentExp(): number;
    currentLevelExp(): number;
    nextLevelExp(): number;
    nextRequiredExp(): number;
    maxLevel(): number;
    isMaxLevel(): boolean;
    initExp(): void;
    currentClass(): RPG_Class;
    isLearnedSkill(skillId: number): boolean;
    hasNoWeapons(): boolean;
    bareHandsElementId(): number;
    bareHandsAnimationId(): number;
    changeExp(exp: number, show: boolean): void;
    levelUp(): void;
    levelDown(): void;
    findNewSkills(lastSkills: RPG_Skill[]): RPG_Skill[];
    displayLevelUp(newSkills: RPG_Skill[]): void;
    gainExp(exp: number): void;
    finalExpRate(): number;
    benchMembersExpRate(): number;
    shouldDisplayLevelUp(): boolean;
    changeLevel(level: number, show: boolean): void;
    learnSkill(skillId: number): void;
    forgetSkill(skillId: number): void;
    hasSkill(skillId: number): boolean;
    skills(): RPG_Skill[];
    usableSkills(): RPG_Skill[];
    traitObjects(): (RPG_State | RPG_Actor | RPG_Class | RPG_Weapon | RPG_Armor)[];
    attackElements(): number[];
    animationId1(): number;
    animationId2(): number;
    attackAnimationId1(): number;
    attackAnimationId2(): number;
    changeEquip(slotId: number, item: RPG_Weapon | RPG_Armor | null): void;
    forceChangeEquip(slotId: number, item: RPG_Weapon | RPG_Armor | null): void;
    tradeItemWithParty(newItem: RPG_Weapon | RPG_Armor | null, oldItem: RPG_Weapon | RPG_Armor | null): boolean;
    changeEquipById(etypeId: number, itemId: number): void;
    isEquipped(item: RPG_Weapon | RPG_Armor): boolean;
    releaseUnequippableItems(forcing: boolean): void;
    clearEquipments(): void;
    optimizeEquipments(): void;
    bestEquipItem(slotId: number): RPG_Weapon | RPG_Armor | null;
    calcEquipItemPerformance(item: RPG_Weapon | RPG_Armor): number;
    isSkillWtypeOk(skill: RPG_Skill): boolean;
    isWtypeEquipped(wtypeId: number): boolean;
    refresh(): void;
    isActor(): boolean;
    friendsUnit(): Game_Party;
    opponentsUnit(): Game_Troop;
    index(): number;
    isBattleMember(): boolean;
    isFormationChangeOk(): boolean;
    currentClassId(): number;
    changeClass(classId: number, keepExp: boolean): void;
    equips(): (RPG_Weapon | RPG_Armor | null)[];
    weapons(): RPG_Weapon[];
    armors(): RPG_Armor[];
    hasWeapon(weapon: RPG_Weapon): boolean;
    hasArmor(armor: RPG_Armor): boolean;
    isEquipChangeOk(slotId: number): boolean;
    isEquipTypeLocked(etypeId: number): boolean;
    isEquipTypeSealed(etypeId: number): boolean;
    equipSlots(): number[];
    performAttack(): void;
    performDamage(): void;
    performEvasion(): void;
    performMagicEvasion(): void;
    performCounter(): void;
    performCollapse(): void;
    performVictory(): void;
    performEscape(): void;
    makeActionList(): Game_Action[];
    makeAutoBattleActions(): void;
    makeConfusionActions(): void;
    makeActions(): void;
    onPlayerWalk(): void;
    updateStateSteps(): void;
    showAddedStates(): void;
    showRemovedStates(): void;
    stepsForTurn(): number;
    turnEndOnMap(): void;
    checkFloorEffect(): void;
    executeFloorDamage(): void;
    basicFloorDamage(): number;
    maxFloorDamage(): number;
    performMapDamage(): void;
    inputtingAction(): Game_Action | null;
    selectNextCommand(): boolean;
    selectPreviousCommand(): boolean;
    lastMenuSkill(): RPG_Skill | null;
    setLastMenuSkill(skill: RPG_Skill): void;
    lastBattleSkill(): RPG_Skill | null;
    setLastBattleSkill(skill: RPG_Skill): void;
    lastCommandSymbol(): string;
    setLastCommandSymbol(symbol: string): void;
    testEscape(item: RPG_Item): boolean;
}

// ─── Game_Enemy ──────────────────────────────────────────────────────────────
// The game object class for an enemy.

declare class Game_Enemy extends Game_Battler {
    constructor(enemyId: number, x: number, y: number);

    _enemyId: number;
    _letter: string;
    _plural: boolean;
    _screenX: number;
    _screenY: number;

    setup(enemyId: number, x: number, y: number): void;
    isEnemy(): boolean;
    friendsUnit(): Game_Troop;
    opponentsUnit(): Game_Party;
    index(): number;
    isBattleMember(): boolean;
    enemyId(): number;
    enemy(): RPG_Enemy;
    traitObjects(): (RPG_State | RPG_Enemy)[];
    paramBase(paramId: number): number;
    exp(): number;
    gold(): number;
    makeDropItems(): (RPG_Item | RPG_Weapon | RPG_Armor)[];
    dropItemRate(): number;
    itemObject(kind: number, dataId: number): RPG_Item | RPG_Weapon | RPG_Armor | null;
    isSpriteVisible(): boolean;
    screenX(): number;
    screenY(): number;
    battlerName(): string;
    battlerHue(): number;
    originalName(): string;
    name(): string;
    isLetterEmpty(): boolean;
    setLetter(letter: string): void;
    setPlural(value: boolean): void;
    performActionStart(action: Game_Action): void;
    performAction(action: Game_Action): void;
    performActionEnd(): void;
    performDamage(): void;
    performCollapse(): void;
    transform(enemyId: number): void;
    meetsCondition(action: RPG_EnemyAction): boolean;
    isConditionMet(param1: number, param2: number): boolean;
    selectAction(actionList: RPG_EnemyAction[], ratingZero: number): RPG_EnemyAction | null;
    selectAllActions(actionList: RPG_EnemyAction[]): void;
    makeActions(): void;
}

// ─── Game_Actors ─────────────────────────────────────────────────────────────
// The wrapper class for an actor array.

declare class Game_Actors {
    constructor();

    _data: Game_Actor[];

    initialize(): void;
    actor(actorId: number): Game_Actor | null;
}

// ─── Game_Unit ───────────────────────────────────────────────────────────────
// The superclass of Game_Party and Game_Troop.

declare class Game_Unit {
    constructor();

    _inBattle: boolean;

    initialize(): void;
    inBattle(): boolean;
    members(): Game_Battler[];
    aliveMembers(): Game_Battler[];
    deadMembers(): Game_Battler[];
    movableMembers(): Game_Battler[];
    clearActions(): void;
    agility(): number;
    tgrSum(): number;
    randomTarget(): Game_Battler;
    randomDeadTarget(): Game_Battler;
    smoothTarget(index: number): Game_Battler;
    smoothDeadTarget(index: number): Game_Battler;
    clearResults(): void;
    onBattleStart(): void;
    onBattleEnd(): void;
    makeActions(): void;
    select(activeMember: Game_Battler): void;
    isAllDead(): boolean;
    substituteBattler(): Game_Battler | null;
}

// ─── Game_Party ──────────────────────────────────────────────────────────────
// The game object class for the party. Information such as gold and items is
// included.

declare class Game_Party extends Game_Unit {
    constructor();

    static ABILITY_ENCOUNTER_HALF: number;
    static ABILITY_ENCOUNTER_NONE: number;
    static ABILITY_CANCEL_SURPRISE: number;
    static ABILITY_RAISE_PREEMPTIVE: number;
    static ABILITY_GOLD_DOUBLE: number;
    static ABILITY_DROP_ITEM_DOUBLE: number;

    _gold: number;
    _steps: number;
    _lastItem: Game_Item;
    _menuActorId: number;
    _targetActorId: number;
    _actors: number[];
    _items: Record<number, number>;
    _weapons: Record<number, number>;
    _armors: Record<number, number>;

    initialize(): void;
    initAllItems(): void;
    exists(): boolean;
    size(): number;
    isEmpty(): boolean;
    members(): Game_Actor[];
    allMembers(): Game_Actor[];
    battleMembers(): Game_Actor[];
    maxBattleMembers(): number;
    leader(): Game_Actor;
    reviveBattleMembers(): void;
    items(): RPG_Item[];
    weapons(): RPG_Weapon[];
    armors(): RPG_Armor[];
    equipItems(): (RPG_Weapon | RPG_Armor)[];
    allItems(): (RPG_Item | RPG_Weapon | RPG_Armor)[];
    itemContainer(item: RPG_Item | RPG_Weapon | RPG_Armor): Record<number, number> | null;
    setupStartingMembers(): void;
    name(): string;
    setupBattleTest(): void;
    setupBattleTestMembers(): void;
    setupBattleTestItems(): void;
    highestLevel(): number;
    addActor(actorId: number): void;
    removeActor(actorId: number): void;
    gold(): number;
    gainGold(amount: number): void;
    loseGold(amount: number): void;
    maxGold(): number;
    steps(): number;
    increaseSteps(): void;
    numItems(item: RPG_Item | RPG_Weapon | RPG_Armor): number;
    maxItems(item: RPG_Item | RPG_Weapon | RPG_Armor): number;
    hasMaxItems(item: RPG_Item | RPG_Weapon | RPG_Armor): boolean;
    hasItem(item: RPG_Item | RPG_Weapon | RPG_Armor, includeEquip?: boolean): boolean;
    isAnyMemberEquipped(item: RPG_Weapon | RPG_Armor): boolean;
    gainItem(item: RPG_Item | RPG_Weapon | RPG_Armor, amount: number, includeEquip?: boolean): void;
    discardMembersEquip(item: RPG_Weapon | RPG_Armor, amount: number): void;
    loseItem(item: RPG_Item | RPG_Weapon | RPG_Armor, amount: number, includeEquip?: boolean): void;
    consumeItem(item: RPG_Item): void;
    canUse(item: RPG_Skill | RPG_Item | null): boolean;
    canInput(): boolean;
    isAllDead(): boolean;
    onPlayerWalk(): void;
    menuActor(): Game_Actor;
    setMenuActor(actor: Game_Actor): void;
    makeMenuActorNext(): void;
    makeMenuActorPrevious(): void;
    targetActor(): Game_Actor;
    setTargetActor(actor: Game_Actor): void;
    lastItem(): RPG_Item | RPG_Weapon | RPG_Armor | null;
    setLastItem(item: RPG_Item | RPG_Weapon | RPG_Armor): void;
    swapOrder(index1: number, index2: number): void;
    charactersForSavefile(): [string, number][];
    facesForSavefile(): [string, number][];
    partyAbility(abilityId: number): boolean;
    hasEncounterHalf(): boolean;
    hasEncounterNone(): boolean;
    hasCancelSurprise(): boolean;
    hasRaisePreemptive(): boolean;
    hasGoldDouble(): boolean;
    hasDoubleItemNumber(): boolean;
    performVictory(): void;
    performEscape(): void;
    removeBattleStates(): void;
    requestMotionRefresh(): void;
}

// ─── Game_Troop ──────────────────────────────────────────────────────────────
// The game object class for a troop and the battle-related data.

declare class Game_Troop extends Game_Unit {
    constructor();

    static LETTER_TABLE_HALF: string[];
    static LETTER_TABLE_FULL: string[];

    _interpreter: Game_Interpreter;
    _troopId: number;
    _eventFlags: Record<number, boolean>;
    _enemies: Game_Enemy[];
    _turnCount: number;
    _namesCount: Record<string, number>;

    members(): Game_Enemy[];
    clear(): void;
    troop(): RPG_Troop;
    setup(troopId: number): void;
    makeUniqueNames(): void;
    letterTable(): string[];
    enemyNames(): string[];
    meetsConditions(page: RPG_BattleEventPage): boolean;
    setupBattleEvent(): void;
    increaseTurn(): void;
    isEventRunning(): boolean;
    updateInterpreter(): void;
    turnCount(): number;
    expTotal(): number;
    goldTotal(): number;
    goldRate(): number;
    makeDropItems(): (RPG_Item | RPG_Weapon | RPG_Armor)[];
}

// ─── Game_Map ────────────────────────────────────────────────────────────────
// The game object class for a map. It contains scrolling and passage
// determination functions.

declare class Game_Map {
    constructor();

    _interpreter: Game_Interpreter;
    _mapId: number;
    _tilesetId: number;
    _events: Game_Event[];
    _commonEvents: Game_CommonEvent[];
    _vehicles: Game_Vehicle[];
    _displayX: number;
    _displayY: number;
    _nameDisplay: boolean;
    _scrollDirection: number;
    _scrollRest: number;
    _scrollSpeed: number;
    _parallaxName: string;
    _parallaxZero: boolean;
    _parallaxLoopX: boolean;
    _parallaxLoopY: boolean;
    _parallaxSx: number;
    _parallaxSy: number;
    _parallaxX: number;
    _parallaxY: number;
    _battleback1Name: string | null;
    _battleback2Name: string | null;
    _needsRefresh: boolean;

    initialize(): void;
    setup(mapId: number): void;
    isEventRunning(): boolean;
    tileWidth(): number;
    tileHeight(): number;
    mapId(): number;
    tilesetId(): number;
    displayX(): number;
    displayY(): number;
    parallaxName(): string;
    battleback1Name(): string | null;
    battleback2Name(): string | null;
    requestRefresh(mapId?: number): void;
    isNameDisplayEnabled(): boolean;
    disableNameDisplay(): void;
    enableNameDisplay(): void;
    createVehicles(): void;
    refereshVehicles(): void;
    vehicles(): Game_Vehicle[];
    vehicle(type: number | string): Game_Vehicle | null;
    boat(): Game_Vehicle;
    ship(): Game_Vehicle;
    airship(): Game_Vehicle;
    setupEvents(): void;
    events(): Game_Event[];
    event(eventId: number): Game_Event | undefined;
    eraseEvent(eventId: number): void;
    parallelCommonEvents(): RPG_CommonEvent[];
    setupScroll(): void;
    setupParallax(): void;
    setupBattleback(): void;
    setDisplayPos(x: number, y: number): void;
    parallaxOx(): number;
    parallaxOy(): number;
    tileset(): RPG_Tileset;
    tilesetFlags(): number[];
    displayName(): string;
    width(): number;
    height(): number;
    data(): number[];
    isLoopHorizontal(): boolean;
    isLoopVertical(): boolean;
    isDashDisabled(): boolean;
    encounterList(): RPG_Map_Encounter[];
    encounterStep(): number;
    isOverworld(): boolean;
    screenTileX(): number;
    screenTileY(): number;
    adjustX(x: number): number;
    adjustY(y: number): number;
    roundX(x: number): number;
    roundY(y: number): number;
    xWithDirection(x: number, d: number): number;
    yWithDirection(y: number, d: number): number;
    roundXWithDirection(x: number, d: number): number;
    roundYWithDirection(y: number, d: number): number;
    deltaX(x1: number, x2: number): number;
    deltaY(y1: number, y2: number): number;
    distance(x1: number, y1: number, x2: number, y2: number): number;
    canvasToMapX(x: number): number;
    canvasToMapY(y: number): number;
    autoplay(): void;
    refreshIfNeeded(): void;
    refresh(): void;
    refreshTileEvents(): void;
    eventsXy(x: number, y: number): Game_Event[];
    eventsXyNt(x: number, y: number): Game_Event[];
    tileEventsXy(x: number, y: number): Game_Event[];
    eventIdXy(x: number, y: number): number;
    scrollDown(distance: number): void;
    scrollLeft(distance: number): void;
    scrollRight(distance: number): void;
    scrollUp(distance: number): void;
    isValid(x: number, y: number): boolean;
    checkPassage(x: number, y: number, bit: number): boolean;
    tileId(x: number, y: number, z: number): number;
    layeredTiles(x: number, y: number): number[];
    allTiles(x: number, y: number): number[];
    autotileType(x: number, y: number, z: number): number;
    isPassable(x: number, y: number, d: number): boolean;
    isBoatPassable(x: number, y: number): boolean;
    isShipPassable(x: number, y: number): boolean;
    isAirshipLandOk(x: number, y: number): boolean;
    checkLayeredTilesFlags(x: number, y: number, bit: number): boolean;
    isLadder(x: number, y: number): boolean;
    isBush(x: number, y: number): boolean;
    isCounter(x: number, y: number): boolean;
    isDamageFloor(x: number, y: number): boolean;
    terrainTag(x: number, y: number): number;
    regionId(x: number, y: number): number;
    startScroll(direction: number, distance: number, speed: number): void;
    isScrolling(): boolean;
    update(sceneActive: boolean): void;
    updateScroll(): void;
    scrollDistance(): number;
    doScroll(direction: number, distance: number): void;
    updateEvents(): void;
    updateVehicles(): void;
    updateParallax(): void;
    changeTileset(tilesetId: number): void;
    changeBattleback(battleback1Name: string, battleback2Name: string): void;
    changeParallax(name: string, loopX: boolean, loopY: boolean, sx: number, sy: number): void;
    updateInterpreter(): void;
    unlockEvent(eventId: number): void;
    setupStartingEvent(): boolean;
    setupTestEvent(): boolean;
    setupStartingMapEvent(): boolean;
    setupAutorunCommonEvent(): boolean;
    isAnyEventStarting(): boolean;
    interpreter(): Game_Interpreter;
}

// ─── Game_CommonEvent ────────────────────────────────────────────────────────
// The game object class for a common event. It contains functionality for
// running parallel process events.

declare class Game_CommonEvent {
    constructor(commonEventId: number);

    _commonEventId: number;
    _interpreter: Game_Interpreter | null;

    event(): RPG_CommonEvent;
    list(): RPG_EventCommand[];
    refresh(): void;
    isActive(): boolean;
    update(): void;
}

// ─── Game_CharacterBase ──────────────────────────────────────────────────────
// The superclass of Game_Character. It handles basic information, such as
// coordinates and images, shared by all characters.

declare class Game_CharacterBase {
    constructor();

    _x: number;
    _y: number;
    _realX: number;
    _realY: number;
    _moveSpeed: number;
    _moveFrequency: number;
    _opacity: number;
    _blendMode: number;
    _direction: number;
    _pattern: number;
    _priorityType: number;
    _tileId: number;
    _characterName: string;
    _characterIndex: number;
    _isObjectCharacter: boolean;
    _walkAnime: boolean;
    _stepAnime: boolean;
    _directionFix: boolean;
    _through: boolean;
    _transparent: boolean;
    _bushDepth: number;
    _animationId: number;
    _balloonId: number;
    _animationPlaying: boolean;
    _balloonPlaying: boolean;
    _animationCount: number;
    _stopCount: number;
    _jumpCount: number;
    _jumpPeak: number;
    _movementSuccess: boolean;

    initialize(): void;
    initMembers(): void;
    pos(x: number, y: number): boolean;
    posNt(x: number, y: number): boolean;
    moveSpeed(): number;
    setMoveSpeed(moveSpeed: number): void;
    moveFrequency(): number;
    setMoveFrequency(moveFrequency: number): void;
    opacity(): number;
    setOpacity(opacity: number): void;
    blendMode(): number;
    setBlendMode(blendMode: number): void;
    isNormalPriority(): boolean;
    setPriorityType(priorityType: number): void;
    isMoving(): boolean;
    isJumping(): boolean;
    jumpHeight(): number;
    jumpPeak(): number;
    isStop(): boolean;
    checkStop(threshold: number): boolean;
    resetStopCount(): void;
    animationWait(): number;
    updateAnimationCount(): void;
    update(): void;
    updateStop(): void;
    updateJump(): void;
    updateMove(): void;
    updateAnimation(): void;
    animationId(): number;
    setAnimationId(animationId: number): void;
    isBalloonPlaying(): boolean;
    startBalloon(): void;
    setBalloonId(balloonId: number): void;
    direction(): number;
    setDirection(d: number): void;
    hasWalkAnime(): boolean;
    setWalkAnime(walkAnime: boolean): void;
    hasStepAnime(): boolean;
    setStepAnime(stepAnime: boolean): void;
    isTransparent(): boolean;
    setTransparent(transparent: boolean): void;
    requestAnimation(animationId: number): void;
    requestBalloon(balloonId: number): void;
    bushDepth(): number;
    setImage(characterName: string, characterIndex: number): void;
    setTileImage(tileId: number): void;
    checkEventTriggerTouchFront(d: number): void;
    checkEventTriggerTouch(x: number, y: number): boolean;
    isMovementSucceeded(): boolean;
    setMovementSuccess(success: boolean): void;
    moveStraight(d: number): void;
    moveDiagonally(horz: number, vert: number): void;
    jump(xPlus: number, yPlus: number): void;
    isMapPassable(x: number, y: number, d: number): boolean;
    canPass(x: number, y: number, d: number): boolean;
    canPassDiagonally(x: number, y: number, horz: number, vert: number): boolean;
    isCollidedWithCharacters(x: number, y: number): boolean;
    isCollidedWithEvents(x: number, y: number): boolean;
    isCollidedWithVehicles(x: number, y: number): boolean;
    screenX(): number;
    screenY(): number;
    screenZ(): number;
    scrolledX(): number;
    scrolledY(): number;
    distancePerFrame(): number;
    realMoveSpeed(): number;
    increaseSteps(): void;
    tileId(): number;
    characterName(): string;
    characterIndex(): number;
    setPosition(x: number, y: number): void;
    copyPosition(character: Game_CharacterBase): void;
    locate(x: number, y: number): void;
    setDirectionFix(directionFix: boolean): void;
    isDirectionFixed(): boolean;
    setThrough(through: boolean): void;
    isThrough(): boolean;
    pattern(): number;
    setPattern(pattern: number): void;
    maxPattern(): number;
    isOriginalPattern(): boolean;
    resetPattern(): void;
    straighten(): void;
    reverseDir(d: number): number;
    turnTowardCharacter(character: Game_CharacterBase): void;
    turnAwayFromCharacter(character: Game_CharacterBase): void;
    turnTowardPlayer(): void;
    turnAwayFromPlayer(): void;
    moveTowardCharacter(character: Game_CharacterBase): void;
    moveAwayFromCharacter(character: Game_CharacterBase): void;
    moveTowardPlayer(): void;
    moveAwayFromPlayer(): void;
    moveForward(): void;
    moveBackward(): void;
    processRouteEnd(): void;
    advanceMoveRouteIndex(): void;
    turnRight90(): void;
    turnLeft90(): void;
    turn180(): void;
    turnRightOrLeft90(): void;
    turnRandom(): void;
}

// ─── Game_Character ──────────────────────────────────────────────────────────
// The superclass of Game_Player, Game_Follower, Game_Vehicle, and Game_Event.

declare class Game_Character extends Game_CharacterBase {
    constructor();

    _moveRouteForcing: boolean;
    _moveRoute: RPG_MoveRoute | null;
    _moveRouteIndex: number;
    _originalMoveRoute: RPG_MoveRoute | null;
    _originalMoveRouteIndex: number;
    _waitCount: number;

    initMembers(): void;
    memorizeMoveRoute(): void;
    restoreMoveRoute(): void;
    isMoveRouteForcing(): boolean;
    setMoveRoute(moveRoute: RPG_MoveRoute): void;
    forceMoveRoute(moveRoute: RPG_MoveRoute): void;
    updateRoutineMove(): void;
    processMoveCommand(command: RPG_MoveCommand): void;
    deltaXFrom(x: number): number;
    deltaYFrom(y: number): number;
    moveRandom(): void;
    moveTowardCharacter(character: Game_CharacterBase): void;
    moveAwayFromCharacter(character: Game_CharacterBase): void;
    turnTowardCharacter(character: Game_CharacterBase): void;
    turnAwayFromCharacter(character: Game_CharacterBase): void;
    turnTowardPlayer(): void;
    turnAwayFromPlayer(): void;
    moveTowardPlayer(): void;
    moveAwayFromPlayer(): void;
    moveForward(): void;
    moveBackward(): void;
    processRouteEnd(): void;
    advanceMoveRouteIndex(): void;
    turnRight90(): void;
    turnLeft90(): void;
    turn180(): void;
    turnRightOrLeft90(): void;
    turnRandom(): void;
    swap(character: Game_Character): void;
    findDirectionTo(goalX: number, goalY: number): number;
    searchLimit(): number;
}

// ─── Game_Player ─────────────────────────────────────────────────────────────
// The game object class for the player. It contains event starting
// determinants and map scrolling functions.

declare class Game_Player extends Game_Character {
    constructor();

    _vehicleType: string;
    _vehicleGettingOn: boolean;
    _vehicleGettingOff: boolean;
    _dashing: boolean;
    _needsMapReload: boolean;
    _transferring: boolean;
    _newMapId: number;
    _newX: number;
    _newY: number;
    _newDirection: number;
    _fadeType: number;
    _followers: Game_Followers;
    _encounterCount: number;

    initialize(): void;
    initMembers(): void;
    clearTransferInfo(): void;
    followers(): Game_Followers;
    isAnimationPlaying(): boolean;
    performTransfer(): void;
    isTransferring(): boolean;
    newMapId(): number;
    fadeType(): number;
    relocate(mapId: number, x: number, y: number, d?: number): void;
    setupForNewGame(): void;
    requestMapReload(): void;
    isMapPassable(x: number, y: number, d: number): boolean;
    vehicle(): Game_Vehicle | null;
    isInBoat(): boolean;
    isInShip(): boolean;
    isInAirship(): boolean;
    isInVehicle(): boolean;
    isNormal(): boolean;
    isDashing(): boolean;
    isDebugThrough(): boolean;
    isCollided(x: number, y: number): boolean;
    centerX(): number;
    centerY(): number;
    center(x: number, y: number): void;
    locate(x: number, y: number): void;
    increaseSteps(): void;
    makeEncounterCount(): void;
    makeEncounterTroopId(): number;
    meetsEncounterConditions(encounter: RPG_Map_Encounter): boolean;
    executeEncounter(): boolean;
    startMapEvent(x: number, y: number, triggers: number[], normal: boolean): void;
    moveByInput(): void;
    canMove(): boolean;
    getInputDirection(): number;
    executeMove(direction: number): void;
    update(sceneActive?: boolean): void;
    updateDashing(): void;
    updateVehicle(): void;
    updateVehicleGetOn(): void;
    updateVehicleGetOff(): void;
    updateNonmoving(wasMoving: boolean): void;
    triggerAction(): boolean;
    triggerTouchAction(): boolean;
    triggerTouchActionD1(x1: number, y1: number): boolean;
    triggerTouchActionD2(x2: number, y2: number): boolean;
    triggerTouchActionD3(destX: number, destY: number): boolean;
    updateEncounterCount(): void;
    canEncounter(): boolean;
    encounterProgressValue(): number;
    checkEventTriggerHere(triggers: number[]): void;
    checkEventTriggerThere(triggers: number[]): void;
    checkEventTriggerTouch(x: number, y: number): boolean;
    canStartLocalEvents(): boolean;
    getOnOffVehicle(): boolean;
    getOnVehicle(): boolean;
    getOffVehicle(): boolean;
    forceMoveForward(): void;
    isOnDamageFloor(): boolean;
    moveStraight(d: number): void;
    moveDiagonally(horz: number, vert: number): void;
    jump(xPlus: number, yPlus: number): void;
    showFollowers(): void;
    hideFollowers(): void;
    gatherFollowers(): void;
    areFollowersGathering(): boolean;
    areFollowersGathered(): boolean;
}

// ─── Game_Follower ───────────────────────────────────────────────────────────
// The game object class for a follower. A follower is an allied character,
// other than the front character, displayed in the party.

declare class Game_Follower extends Game_Character {
    constructor(memberIndex: number);

    _memberIndex: number;

    refresh(): void;
    actor(): Game_Actor | null;
    isVisible(): boolean;
    update(): void;
    chaseCharacter(character: Game_CharacterBase): void;
}

// ─── Game_Followers ──────────────────────────────────────────────────────────
// The wrapper class for a follower array.

declare class Game_Followers {
    constructor();

    _visible: boolean;
    _gathering: boolean;
    _data: Game_Follower[];

    initialize(): void;
    isVisible(): boolean;
    show(): void;
    hide(): void;
    follower(index: number): Game_Follower;
    forEach(callback: (follower: Game_Follower) => void): void;
    reverseEach(callback: (follower: Game_Follower) => void): void;
    refresh(): void;
    update(): void;
    updateMove(): void;
    jumpAll(): void;
    synchronize(x: number, y: number, d: number): void;
    gather(): void;
    areGathering(): boolean;
    areGathered(): boolean;
    isSomeoneCollided(x: number, y: number): boolean;
}

// ─── Game_Vehicle ────────────────────────────────────────────────────────────
// The game object class for a vehicle.

declare class Game_Vehicle extends Game_Character {
    constructor(type: string);

    _type: string;
    _mapId: number;
    _altitude: number;
    _driving: boolean;
    _bgm: RPG_AudioFile | null;

    initMembers(): void;
    isBoat(): boolean;
    isShip(): boolean;
    isAirship(): boolean;
    resetDirection(): void;
    initMoveSpeed(): void;
    vehicle(): RPG_System_Vehicle | null;
    loadSystemSettings(): void;
    refresh(): void;
    setLocation(mapId: number, x: number, y: number): void;
    pos(x: number, y: number): boolean;
    isMapPassable(x: number, y: number, d: number): boolean;
    getOn(): void;
    getOff(): void;
    setBgm(bgm: RPG_AudioFile): void;
    playBgm(): void;
    syncWithPlayer(): void;
    screenY(): number;
    shadowX(): number;
    shadowY(): number;
    shadowOpacity(): number;
    canMove(): boolean;
    update(): void;
    updateAirship(): void;
    updateAirshipAltitude(): void;
    maxAltitude(): number;
    isLowest(): boolean;
    isHighest(): boolean;
    isTakeoffOk(): boolean;
    isLandOk(x: number, y: number, d: number): boolean;
}

// ─── Game_Event ──────────────────────────────────────────────────────────────
// The game object class for an event. It contains functionality for event page
// switching and running parallel process events.

declare class Game_Event extends Game_Character {
    constructor(mapId: number, eventId: number);

    _mapId: number;
    _eventId: number;
    _moveType: number;
    _trigger: number | null;
    _starting: boolean;
    _erased: boolean;
    _pageIndex: number;
    _originalPattern: number;
    _originalDirection: number;
    _prelockDirection: number;
    _locked: boolean;
    _interpreter: Game_Interpreter | null;

    initMembers(): void;
    eventId(): number;
    event(): RPG_Event;
    page(): RPG_EventPage | null;
    list(): RPG_EventCommand[] | null;
    isCollidedWithCharacters(x: number, y: number): boolean;
    isCollidedWithEvents(x: number, y: number): boolean;
    isCollidedWithPlayerCharacters(x: number, y: number): boolean;
    lock(): void;
    unlock(): void;
    updateStop(): void;
    updateSelfMovement(): void;
    stopCountThreshold(): number;
    isNearTheScreen(): boolean;
    isMoveRouteForcing(): boolean;
    isNearThePlayer(): boolean;
    locate(x: number, y: number): void;
    forceMoveRoute(moveRoute: RPG_MoveRoute): void;
    eraseEvent(): void;
    refresh(): void;
    findProperPageIndex(): number;
    meetsConditions(page: RPG_EventPage): boolean;
    setupPage(): void;
    clearPageSettings(): void;
    setupPageSettings(): void;
    isOriginalPattern(): boolean;
    updatePattern(): void;
    checkEventTriggerAuto(): void;
    update(): void;
    updateParallel(): void;
    start(): void;
    clearStartingFlag(): void;
    isStarting(): boolean;
    checkEventTriggerTouch(x: number, y: number): boolean;
    isTriggerIn(triggers: number[]): boolean;
}

// ─── Game_Interpreter ────────────────────────────────────────────────────────
// The interpreter for running event commands.

declare class Game_Interpreter {
    constructor(depth?: number);

    _depth: number;
    _branch: Record<number, number | boolean>;
    _params: any[];
    _indent: number;
    _frameCount: number;
    _freezeChecker: number;
    _mapId: number;
    _eventId: number;
    _list: RPG_EventCommand[] | null;
    _index: number;
    _waitCount: number;
    _waitMode: string;
    _comments: string;
    _character: Game_Event | null;
    _childInterpreter: Game_Interpreter | null;
    _imageReservationId: number;

    checkOverflow(): void;
    clear(): void;
    setup(list: RPG_EventCommand[], eventId?: number): void;
    eventId(): number;
    isOnCurrentMap(): boolean;
    setupReservedCommonEvent(): boolean;
    isRunning(): boolean;
    update(): void;
    updateChild(): boolean;
    updateWait(): boolean;
    updateWaitCount(): boolean;
    updateWaitMode(): boolean;
    setWaitMode(waitMode: string): void;
    wait(duration: number): void;
    fadeSpeed(): number;
    setupChoices(params: any[]): void;
    pluginCommand(command: string, args: string[]): void;
    currentCommand(): RPG_EventCommand | null;
    nextEventCode(): number;
    iterateActorId(param: number, callback: (actor: Game_Actor) => void): void;
    iterateActorEx(param1: number, param2: number, callback: (actor: Game_Actor) => void): void;
    iterateActorIndex(param: number, callback: (actor: Game_Actor) => void): void;
    iterateEnemyIndex(param: number, callback: (enemy: Game_Enemy) => void): void;
    iterateBattler(param1: number, param2: number, callback: (battler: Game_Battler) => void): void;
    character(param: number): Game_Character | null;
    operateValue(operation: number, operandType: number, operand: number): number;
    changeHp(target: Game_Battler, value: number, allowDeath: boolean): void;
    gameDataOperand(type: number, param1: number, param2: number): number;

    // Event commands (command101 through command355+)
    // Show Text
    command101(): boolean;
    // Show Choices
    command102(): boolean;
    // Input Number
    command103(): boolean;
    // Select Item
    command104(): boolean;
    // Show Scrolling Text
    command105(): boolean;
    // Comment
    command108(): boolean;
    // Conditional Branch
    command111(): boolean;
    // Loop
    command112(): boolean;
    // Break Loop
    command113(): boolean;
    // Exit Event Processing
    command115(): boolean;
    // Common Event
    command117(): boolean;
    // Label
    command118(): boolean;
    // Jump to Label
    command119(): boolean;
    // Control Switches
    command121(): boolean;
    // Control Variables
    command122(): boolean;
    // Control Self Switch
    command123(): boolean;
    // Control Timer
    command124(): boolean;
    // Change Gold
    command125(): boolean;
    // Change Items
    command126(): boolean;
    // Change Weapons
    command127(): boolean;
    // Change Armors
    command128(): boolean;
    // Change Party Member
    command129(): boolean;
    // Change Battle BGM
    command132(): boolean;
    // Change Victory ME
    command133(): boolean;
    // Change Save Access
    command134(): boolean;
    // Change Menu Access
    command135(): boolean;
    // Change Encounter Disable
    command136(): boolean;
    // Change Formation Access
    command137(): boolean;
    // Change Window Color
    command138(): boolean;
    // Change Defeat ME
    command139(): boolean;
    // Change Vehicle BGM
    command140(): boolean;
    // Transfer Player
    command201(): boolean;
    // Set Vehicle Location
    command202(): boolean;
    // Set Event Location
    command203(): boolean;
    // Scroll Map
    command204(): boolean;
    // Set Movement Route
    command205(): boolean;
    // Get On/Off Vehicle
    command206(): boolean;
    // Change Transparency
    command211(): boolean;
    // Show Animation
    command212(): boolean;
    // Show Balloon Icon
    command213(): boolean;
    // Erase Event
    command214(): boolean;
    // Change Player Followers
    command216(): boolean;
    // Gather Followers
    command217(): boolean;
    // Fadeout Screen
    command221(): boolean;
    // Fadein Screen
    command222(): boolean;
    // Tint Screen
    command223(): boolean;
    // Flash Screen
    command224(): boolean;
    // Shake Screen
    command225(): boolean;
    // Wait
    command230(): boolean;
    // Show Picture
    command231(): boolean;
    // Move Picture
    command232(): boolean;
    // Rotate Picture
    command233(): boolean;
    // Tint Picture
    command234(): boolean;
    // Erase Picture
    command235(): boolean;
    // Set Weather Effect
    command236(): boolean;
    // Play BGM
    command241(): boolean;
    // Fadeout BGM
    command242(): boolean;
    // Save BGM
    command243(): boolean;
    // Resume BGM
    command244(): boolean;
    // Play BGS
    command245(): boolean;
    // Fadeout BGS
    command246(): boolean;
    // Play ME
    command249(): boolean;
    // Play SE
    command250(): boolean;
    // Stop SE
    command251(): boolean;
    // Play Movie
    command261(): boolean;
    // Change Map Name Display
    command281(): boolean;
    // Change Tileset
    command282(): boolean;
    // Change Battle Back
    command283(): boolean;
    // Change Parallax
    command284(): boolean;
    // Get Location Info
    command285(): boolean;
    // Battle Processing
    command301(): boolean;
    // Shop Processing
    command302(): boolean;
    // Name Input Processing
    command303(): boolean;
    // Change HP
    command311(): boolean;
    // Change MP
    command312(): boolean;
    // Change TP
    command326(): boolean;
    // Change State
    command313(): boolean;
    // Recover All
    command314(): boolean;
    // Change EXP
    command315(): boolean;
    // Change Level
    command316(): boolean;
    // Change Parameter
    command317(): boolean;
    // Change Skill
    command318(): boolean;
    // Change Equipment
    command319(): boolean;
    // Change Name
    command320(): boolean;
    // Change Class
    command321(): boolean;
    // Change Actor Images
    command322(): boolean;
    // Change Vehicle Image
    command323(): boolean;
    // Change Nickname
    command324(): boolean;
    // Change Profile
    command325(): boolean;
    // Change Enemy HP
    command331(): boolean;
    // Change Enemy MP
    command332(): boolean;
    // Change Enemy TP
    command342(): boolean;
    // Change Enemy State
    command333(): boolean;
    // Enemy Recover All
    command334(): boolean;
    // Enemy Appear
    command335(): boolean;
    // Enemy Transform
    command336(): boolean;
    // Show Battle Animation
    command337(): boolean;
    // Force Action
    command339(): boolean;
    // Abort Battle
    command340(): boolean;
    // Open Menu Screen
    command351(): boolean;
    // Open Save Screen
    command352(): boolean;
    // Game Over
    command353(): boolean;
    // Return to Title Screen
    command354(): boolean;
    // Script
    command355(): boolean;
    // Plugin Command
    command356(): boolean;
}
