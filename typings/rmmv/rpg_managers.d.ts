// Type definitions for RPG Maker MV rpg_managers.js
// All RMMV manager classes — static-only, declared as namespaces.

// ---------------------------------------------------------------------------
// DataManager
//
// The static class that manages the database and game objects.
// ---------------------------------------------------------------------------

interface DataManagerDatabaseFile {
  name: string;
  src: string;
}

interface DataManagerSavefileInfo {
  title: string;
  characters: [string, number][];
  faces: [string, number][];
  playtime: string;
  timestamp: number;
}

interface DataManagerSaveContents {
  system: Game_System;
  screen: Game_Screen;
  timer: Game_Timer;
  switches: Game_Switches;
  variables: Game_Variables;
  selfSwitches: Game_SelfSwitches;
  actors: Game_Actors;
  party: Game_Party;
  map: Game_Map;
  player: Game_Player;
}

declare namespace DataManager {
  let _globalId: string;
  let _lastAccessedId: number;
  let _errorUrl: string | null;
  const _databaseFiles: DataManagerDatabaseFile[];

  function loadDatabase(): void;
  function loadDataFile(name: string, src: string): void;
  function isDatabaseLoaded(): boolean;
  function loadMapData(mapId: number): void;
  function isMapLoaded(): boolean;
  function onLoad(object: Record<string, unknown>): void;
  function extractMetadata(data: { note: string; meta: Record<string, unknown> }): void;
  function checkError(): void;
  function isBattleTest(): boolean;
  function isEventTest(): boolean;
  function isSkill(item: unknown): item is RPG_Skill;
  function isItem(item: unknown): item is RPG_Item;
  function isWeapon(item: unknown): item is RPG_Weapon;
  function isArmor(item: unknown): item is RPG_Armor;
  function createGameObjects(): void;
  function setupNewGame(): void;
  function setupBattleTest(): void;
  function setupEventTest(): void;
  function loadGame(savefileId: number): boolean;
  function saveGame(savefileId: number): boolean;
  function loadSavefileInfo(savefileId: number): DataManagerSavefileInfo | null;
  function isThisGameFile(savefileId: number): boolean;
  function isAnySavefileExists(): boolean;
  function latestSavefileId(): number;
  function loadAllSavefileImages(): void;
  function loadSavefileImages(info: DataManagerSavefileInfo): void;
  function maxSavefiles(): number;
  function savefileInfo(savefileId: number): DataManagerSavefileInfo | null;
  function makeSavefileInfo(): DataManagerSavefileInfo;
  function makeSaveContents(): DataManagerSaveContents;
  function extractSaveContents(contents: DataManagerSaveContents): void;
}

// ---------------------------------------------------------------------------
// ConfigManager
//
// The static class that manages the configuration data.
// ---------------------------------------------------------------------------

interface ConfigData {
  alwaysDash: boolean;
  commandRemember: boolean;
  bgmVolume: number;
  bgsVolume: number;
  meVolume: number;
  seVolume: number;
}

declare namespace ConfigManager {
  let alwaysDash: boolean;
  let commandRemember: boolean;
  let bgmVolume: number;
  let bgsVolume: number;
  let meVolume: number;
  let seVolume: number;

  function load(): void;
  function save(): void;
  function makeData(): ConfigData;
  function applyData(config: Partial<ConfigData>): void;
  function readFlag(config: Record<string, unknown>, name: string): boolean;
  function readVolume(config: Record<string, unknown>, name: string): number;
}

// ---------------------------------------------------------------------------
// StorageManager
//
// The static class that manages storage for saving game data.
// ---------------------------------------------------------------------------

declare namespace StorageManager {
  function save(savefileId: number, json: string): void;
  function load(savefileId: number): string;
  function exists(savefileId: number): boolean;
  function remove(savefileId: number): void;
  function backup(savefileId: number): void;
  function backupExists(savefileId: number): boolean;
  function cleanBackup(savefileId: number): void;
  function restoreBackup(savefileId: number): void;
  function isLocalMode(): boolean;
  function saveToLocalFile(savefileId: number, json: string): void;
  function loadFromLocalFile(savefileId: number): string;
  function localFileExists(savefileId: number): boolean;
  function removeLocalFile(savefileId: number): void;
  function saveToWebStorage(savefileId: number, json: string): void;
  function loadFromWebStorage(savefileId: number): string;
  function webStorageExists(savefileId: number): boolean;
  function removeWebStorage(savefileId: number): void;
  function localFileDirectoryPath(): string;
  function localFilePath(savefileId: number): string;
  function webStorageKey(savefileId: number): string;
}

// ---------------------------------------------------------------------------
// ImageManager
//
// The static class that loads images, creates bitmap objects and retains them.
// MV uses hue parameter on all load methods and CacheMap/ImageCache for caching.
// ---------------------------------------------------------------------------

declare namespace ImageManager {
  let _imageCache: ImageCache;
  let _requestQueue: RequestQueue;
  let _systemReservationId: number;
  let cache: CacheMap;

  function loadAnimation(filename: string, hue?: number): Bitmap;
  function loadBattleback1(filename: string, hue?: number): Bitmap;
  function loadBattleback2(filename: string, hue?: number): Bitmap;
  function loadEnemy(filename: string, hue?: number): Bitmap;
  function loadCharacter(filename: string, hue?: number): Bitmap;
  function loadFace(filename: string, hue?: number): Bitmap;
  function loadParallax(filename: string, hue?: number): Bitmap;
  function loadPicture(filename: string, hue?: number): Bitmap;
  function loadSvActor(filename: string, hue?: number): Bitmap;
  function loadSvEnemy(filename: string, hue?: number): Bitmap;
  function loadSystem(filename: string, hue?: number): Bitmap;
  function loadTileset(filename: string, hue?: number): Bitmap;
  function loadTitle1(filename: string, hue?: number): Bitmap;
  function loadTitle2(filename: string, hue?: number): Bitmap;
  function loadBitmap(folder: string, filename: string, hue?: number, smooth?: boolean): Bitmap;
  function loadEmptyBitmap(): Bitmap;
  function loadNormalBitmap(path: string, hue?: number): Bitmap;
  function clear(): void;
  function isReady(): boolean;
  function isBigCharacter(filename: string): boolean;
  function isObjectCharacter(filename: string): boolean;
  function isZeroParallax(filename: string): boolean;

  function reserveAnimation(filename: string, hue?: number, reservationId?: number): Bitmap;
  function reserveBattleback1(filename: string, hue?: number, reservationId?: number): Bitmap;
  function reserveBattleback2(filename: string, hue?: number, reservationId?: number): Bitmap;
  function reserveEnemy(filename: string, hue?: number, reservationId?: number): Bitmap;
  function reserveCharacter(filename: string, hue?: number, reservationId?: number): Bitmap;
  function reserveFace(filename: string, hue?: number, reservationId?: number): Bitmap;
  function reserveParallax(filename: string, hue?: number, reservationId?: number): Bitmap;
  function reservePicture(filename: string, hue?: number, reservationId?: number): Bitmap;
  function reserveSvActor(filename: string, hue?: number, reservationId?: number): Bitmap;
  function reserveSvEnemy(filename: string, hue?: number, reservationId?: number): Bitmap;
  function reserveSystem(filename: string, hue?: number, reservationId?: number): Bitmap;
  function reserveTileset(filename: string, hue?: number, reservationId?: number): Bitmap;
  function reserveTitle1(filename: string, hue?: number, reservationId?: number): Bitmap;
  function reserveTitle2(filename: string, hue?: number, reservationId?: number): Bitmap;
  function reserveBitmap(folder: string, filename: string, hue?: number, smooth?: boolean, reservationId?: number): Bitmap;
  function reserveNormalBitmap(path: string, hue?: number, reservationId?: number): Bitmap;

  function requestAnimation(filename: string, hue?: number): Bitmap;
  function requestBattleback1(filename: string, hue?: number): Bitmap;
  function requestBattleback2(filename: string, hue?: number): Bitmap;
  function requestEnemy(filename: string, hue?: number): Bitmap;
  function requestCharacter(filename: string, hue?: number): Bitmap;
  function requestFace(filename: string, hue?: number): Bitmap;
  function requestParallax(filename: string, hue?: number): Bitmap;
  function requestPicture(filename: string, hue?: number): Bitmap;
  function requestSvActor(filename: string, hue?: number): Bitmap;
  function requestSvEnemy(filename: string, hue?: number): Bitmap;
  function requestSystem(filename: string, hue?: number): Bitmap;
  function requestTileset(filename: string, hue?: number): Bitmap;
  function requestTitle1(filename: string, hue?: number): Bitmap;
  function requestTitle2(filename: string, hue?: number): Bitmap;
  function requestBitmap(folder: string, filename: string, hue?: number, smooth?: boolean): Bitmap;
  function requestNormalBitmap(path: string, hue?: number): Bitmap;

  function releaseReservation(reservationId: number): void;
  function setDefaultReservationId(reservationId: number): void;
}

// ---------------------------------------------------------------------------
// AudioManager
//
// The static class that handles BGM, BGS, ME and SE.
// ---------------------------------------------------------------------------

declare namespace AudioManager {
  let _bgmVolume: number;
  let _bgsVolume: number;
  let _meVolume: number;
  let _seVolume: number;
  let _currentBgm: RPG_AudioFile | null;
  let _currentBgs: RPG_AudioFile | null;
  let _bgmBuffer: WebAudio | Html5Audio | null;
  let _bgsBuffer: WebAudio | Html5Audio | null;
  let _meBuffer: WebAudio | Html5Audio | null;
  let _seBuffers: WebAudio[];
  let _staticBuffers: WebAudio[];
  let _replayFadeTime: number;
  let _path: string;
  let bgmVolume: number;
  let bgsVolume: number;
  let meVolume: number;
  let seVolume: number;

  function playBgm(bgm: RPG_AudioFile, pos?: number): void;
  function replayBgm(bgm: RPG_AudioFile): void;
  function isCurrentBgm(bgm: RPG_AudioFile): boolean;
  function updateBgmParameters(bgm: RPG_AudioFile): void;
  function updateCurrentBgm(bgm: RPG_AudioFile, pos: number): void;
  function stopBgm(): void;
  function fadeOutBgm(duration: number): void;
  function fadeInBgm(duration: number): void;
  function playBgs(bgs: RPG_AudioFile, pos?: number): void;
  function replayBgs(bgs: RPG_AudioFile): void;
  function isCurrentBgs(bgs: RPG_AudioFile): boolean;
  function updateBgsParameters(bgs: RPG_AudioFile): void;
  function stopBgs(): void;
  function fadeOutBgs(duration: number): void;
  function fadeInBgs(duration: number): void;
  function playMe(me: RPG_AudioFile): void;
  function updateMeParameters(me: RPG_AudioFile): void;
  function fadeOutMe(duration: number): void;
  function stopMe(): void;
  function playSe(se: RPG_AudioFile): void;
  function updateSeParameters(buffer: WebAudio, se: RPG_AudioFile): void;
  function stopSe(): void;
  function playStaticSe(se: RPG_AudioFile): void;
  function loadStaticSe(se: RPG_AudioFile): void;
  function isStaticSe(se: RPG_AudioFile): boolean;
  function saveBgm(): RPG_AudioFile;
  function saveBgs(): RPG_AudioFile;
  function makeEmptyAudioObject(): RPG_AudioFile;
  function createBuffer(folder: string, name: string): WebAudio | Html5Audio;
  function updateBufferParameters(buffer: WebAudio | Html5Audio, configVolume: number, audio: RPG_AudioFile): void;
  function audioFileExt(): string;
  function shouldUseHtml5Audio(): boolean;
  function checkErrors(): void;
  function checkWebAudioError(webAudio: WebAudio): void;
}

// ---------------------------------------------------------------------------
// SoundManager
//
// The static class that plays sound effects defined in the database.
// ---------------------------------------------------------------------------

declare namespace SoundManager {
  function preloadImportantSounds(): void;
  function loadSystemSound(n: number): void;
  function playSystemSound(n: number): void;
  function playCursor(): void;
  function playOk(): void;
  function playCancel(): void;
  function playBuzzer(): void;
  function playEquip(): void;
  function playSave(): void;
  function playLoad(): void;
  function playBattleStart(): void;
  function playEscape(): void;
  function playEnemyAttack(): void;
  function playEnemyDamage(): void;
  function playEnemyCollapse(): void;
  function playBossCollapse1(): void;
  function playBossCollapse2(): void;
  function playActorDamage(): void;
  function playActorCollapse(): void;
  function playRecovery(): void;
  function playMiss(): void;
  function playEvasion(): void;
  function playMagicEvasion(): void;
  function playReflection(): void;
  function playShop(): void;
  function playUseItem(): void;
  function playUseSkill(): void;
}

// ---------------------------------------------------------------------------
// TextManager
//
// The static class that handles terms and messages.
// ---------------------------------------------------------------------------

declare namespace TextManager {
  function basic(basicId: number): string;
  function param(paramId: number): string;
  function command(commandId: number): string;
  function message(messageId: string): string;
  function getter(method: string, param: number | string): PropertyDescriptor;

  // Currency
  const currencyUnit: string;

  // Basic terms (from $dataSystem.terms.basic)
  const level: string;
  const levelA: string;
  const hp: string;
  const hpA: string;
  const mp: string;
  const mpA: string;
  const tp: string;
  const tpA: string;
  const exp: string;
  const expA: string;

  // Command terms (from $dataSystem.terms.commands)
  const fight: string;
  const escape: string;
  const attack: string;
  const guard: string;
  const item: string;
  const skill: string;
  const equip: string;
  const status: string;
  const formation: string;
  const save: string;
  const gameEnd: string;
  const options: string;
  const weapon: string;
  const armor: string;
  const keyItem: string;
  const equip2: string;
  const optimize: string;
  const clear: string;
  const newGame: string;
  const continue_: string;
  const commandRemember: string;
  const touchUI: string;
  const alwaysDash: string;
  const bgmVolume: string;
  const bgsVolume: string;
  const meVolume: string;
  const seVolume: string;
  const possession: string;
  const expTotal: string;
  const expNext: string;
  const saveMessage: string;
  const loadMessage: string;
  const file: string;
  const partyName: string;
  const emerge: string;
  const preemptive: string;
  const surprise: string;
  const escapeStart: string;
  const escapeFailure: string;
  const victory: string;
  const defeat: string;
  const obtainExp: string;
  const obtainGold: string;
  const obtainItem: string;
  const levelUp: string;
  const obtainSkill: string;
  const useItem: string;
  const criticalToEnemy: string;
  const criticalToActor: string;
  const actorDamage: string;
  const actorRecovery: string;
  const actorGain: string;
  const actorLoss: string;
  const actorDrain: string;
  const actorNoDamage: string;
  const actorNoHit: string;
  const enemyDamage: string;
  const enemyRecovery: string;
  const enemyGain: string;
  const enemyLoss: string;
  const enemyDrain: string;
  const enemyNoDamage: string;
  const enemyNoHit: string;
  const evasion: string;
  const magicEvasion: string;
  const magicReflection: string;
  const counterAttack: string;
  const substitute: string;
  const buffAdd: string;
  const debuffAdd: string;
  const buffRemove: string;
  const actionFailure: string;
}

// ---------------------------------------------------------------------------
// SceneManager
//
// The static class that manages scene transitions.
// ---------------------------------------------------------------------------

interface SceneConstructor {
  new (): Scene_Base;
}

declare namespace SceneManager {
  let _scene: Scene_Base | null;
  let _nextScene: Scene_Base | null;
  let _stack: SceneConstructor[];
  let _stopped: boolean;
  let _sceneStarted: boolean;
  let _exiting: boolean;
  let _previousClass: SceneConstructor | null;
  let _backgroundBitmap: Bitmap | null;
  let _screenWidth: number;
  let _screenHeight: number;
  let _boxWidth: number;
  let _boxHeight: number;
  let _deltaTime: number;
  let _currentTime: number;
  let _accumulator: number;

  function run(sceneClass: SceneConstructor): void;
  function initialize(): void;
  function initGraphics(): void;
  function preferableRendererType(): string;
  function shouldUseCanvasRenderer(): boolean;
  function checkWebGL(): void;
  function checkFileAccess(): void;
  function initAudio(): void;
  function initInput(): void;
  function initNwjs(): void;
  function checkPluginErrors(): void;
  function setupErrorHandlers(): void;
  function requestUpdate(): void;
  function update(): void;
  function terminate(): void;
  function onError(e: Event): void;
  function onKeyDown(event: KeyboardEvent): void;
  function catchException(e: unknown): void;
  function tickStart(): void;
  function tickEnd(): void;
  function updateInputData(): void;
  function updateMain(): void;
  function updateManagers(): void;
  function changeScene(): void;
  function isSceneChanging(): boolean;
  function isCurrentSceneStarted(): boolean;
  function isNextScene(sceneClass: SceneConstructor): boolean;
  function isPreviousScene(sceneClass: SceneConstructor): boolean;
  function goto(sceneClass: SceneConstructor | null): void;
  function push(sceneClass: SceneConstructor): void;
  function pop(): void;
  function exit(): void;
  function clearStack(): void;
  function stop(): void;
  function prepareNextScene(...args: unknown[]): void;
  function snap(): Bitmap;
  function snapForBackground(): void;
  function backgroundBitmap(): Bitmap | null;
  function resume(): void;
}

// ---------------------------------------------------------------------------
// BattleManager
//
// The static class that manages battle progress.
// MV uses turn-based battle by default (no TPB system).
// ---------------------------------------------------------------------------

interface BattleRewards {
  gold: number;
  exp: number;
  items: (RPG_Item | RPG_Weapon | RPG_Armor)[];
}

declare namespace BattleManager {
  let _phase: string;
  let _canEscape: boolean;
  let _canLose: boolean;
  let _battleTest: boolean;
  let _eventCallback: ((result: number) => void) | null;
  let _preemptive: boolean;
  let _surprise: boolean;
  let _actorIndex: number;
  let _actionForcedBattler: Game_Battler | null;
  let _mapBgm: RPG_AudioFile | null;
  let _mapBgs: RPG_AudioFile | null;
  let _actionBattlers: Game_Battler[];
  let _subject: Game_Battler | null;
  let _action: Game_Action | null;
  let _targets: Game_Battler[];
  let _logWindow: Window_BattleLog | null;
  let _statusWindow: Window_BattleStatus | null;
  let _spriteset: Spriteset_Battle | null;
  let _escapeRatio: number;
  let _escaped: boolean;
  let _rewards: BattleRewards;

  function setup(troopId: number, canEscape: boolean, canLose: boolean): void;
  function initMembers(): void;
  function isBattleTest(): boolean;
  function isTurnEnd(): boolean;
  function isAborting(): boolean;
  function isInputting(): boolean;
  function isInTurn(): boolean;
  function canEscape(): boolean;
  function canLose(): boolean;
  function actor(): Game_Actor | null;
  function clearActor(): void;
  function changeActor(newActorIndex: number, lastActorActionState: string): void;
  function startBattle(): void;
  function displayStartMessages(): void;
  function startInput(): void;
  function inputtingAction(): Game_Action | null;
  function selectNextCommand(): void;
  function selectPreviousCommand(): void;
  function refreshStatus(): void;
  function startTurn(): void;
  function updateTurn(): void;
  function processTurn(): void;
  function endTurn(): void;
  function updateTurnEnd(): void;
  function getNextSubject(): Game_Battler | null;
  function allBattleMembers(): Game_Battler[];
  function makeActionOrders(): void;
  function startAction(): void;
  function updateAction(): void;
  function endAction(): void;
  function invokeAction(subject: Game_Battler, target: Game_Battler): void;
  function invokeNormalAction(subject: Game_Battler, target: Game_Battler): void;
  function invokeCounterAttack(subject: Game_Battler, target: Game_Battler): void;
  function invokeMagicReflection(subject: Game_Battler, target: Game_Battler): void;
  function applySubstitute(target: Game_Battler): Game_Battler;
  function checkSubstitute(target: Game_Battler): boolean;
  function isActionForced(): boolean;
  function forceAction(battler: Game_Battler): void;
  function processForcedAction(): void;
  function abort(): void;
  function checkBattleEnd(): boolean;
  function checkAbort(): boolean;
  function processVictory(): void;
  function processEscape(): boolean;
  function onEscapeSuccess(): void;
  function onEscapeFailure(): void;
  function processAbort(): void;
  function processDefeat(): void;
  function endBattle(result: number): void;
  function updateBattleEnd(): void;
  function makeRewards(): void;
  function displayEscapeSuccessMessage(): void;
  function displayEscapeFailureMessage(): void;
  function displayRewards(): void;
  function displayExp(): void;
  function displayGold(): void;
  function displayDropItems(): void;
  function gainRewards(): void;
  function gainExp(): void;
  function gainGold(): void;
  function gainDropItems(): void;
  function makeEscapeRatio(): void;

  function setEventCallback(callback: (result: number) => void): void;
  function setLogWindow(logWindow: Window_BattleLog): void;
  function setStatusWindow(statusWindow: Window_BattleStatus): void;
  function setSpriteset(spriteset: Spriteset_Battle): void;
  function onEncounter(): void;
  function ratePreemptive(): number;
  function rateSurprise(): number;
  function saveBgmAndBgs(): void;
  function playBattleBgm(): void;
  function playVictoryMe(): void;
  function playDefeatMe(): void;
  function replayBgmAndBgs(): void;
  function updateEvent(): boolean;
  function updateEventMain(): boolean;
  function isBusy(): boolean;
  function isEscaped(): boolean;
  function displayVictoryMessage(): void;
  function displayDefeatMessage(): void;
}

// ---------------------------------------------------------------------------
// PluginManager
//
// The static class that manages the plugins.
// MV does NOT have PluginManager.registerCommand (that is MZ only).
// ---------------------------------------------------------------------------

interface PluginInfo {
  name: string;
  status: string;
  description: string;
  parameters: Record<string, string>;
}

declare namespace PluginManager {
  let _scripts: string[];
  let _errorUrls: string[];
  let _parameters: Record<string, Record<string, string>>;

  function setup(plugins: PluginInfo[]): void;
  function checkErrors(): void;
  function parameters(name: string): Record<string, string>;
  function setStatus(name: string, status: boolean): void;
  function loadScript(name: string): void;
  function onError(e: Event): void;
}
