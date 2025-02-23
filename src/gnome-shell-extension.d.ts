// I stole this from npm i gnome-shell-extension-types
// But it was *really* lacking, so I'm adding my own stuff, I guess...

declare var imports: Imports;
declare var global: Global;

/**
 * https://developer.gnome.org/clutter/unstable/ClutterStage.html
 */
interface ClutterStage {
    scale_factor: number;

    connect(event: ClutterEvent, callback: Function):void;

    disconnect(event: ClutterEvent):void;
}

interface GnomeString extends String {
    format(...args: Array<number | string>): string;
}

/**
 * https://developer.gnome.org/clutter/stable/ClutterCanvas.html
 */
interface ClutterCanvas {
    scale_factor: number;
}

type ClutterEvent = 'captured-event' | 'showing' | 'hidden';

interface MetaWindowActor {

}

/**
 * https://developer.gnome.org/meta/stable/MetaRectangle.html
 */
interface MetaRectangle {
    width: number;
    height: number;
    x: number;
    y: number;
}

/**
 * https://developer.gnome.org/meta/stable/MetaWindow.html
 */
interface MetaWindow {
    get_maximized(): number;

    unmaximize(flag: MetaMaximizeFlag);

    get_work_area_current_monitor(): MetaRectangle;

    get_frame_rect(): MetaRectangle;

    move_resize_frame(userOperation: boolean, newX: number, newY: number, newWidth: number, newHeight: number);
}

interface Screen {
    get_n_monitors(): number;

    get_monitor_geometry(index: number): number;

    set_cursor(cursor: Cursor);
}

interface WaylandDisplay extends Screen {
}

interface XScreen extends Screen {
}

interface GlobalSettings {
    get_strv(name: string);
}

/**
 * https://developer.gnome.org/meta/stable/MetaWorkspace.html
 */
interface MetaWorkspace {
    override_workspace_layout(startingCorner: string, verticalLayout: boolean, numberRows: number, numberColumns: number);
}

interface Global {
    stage: ClutterStage;

    /**
     * This proeprty is only available in Wayland sessions
     */
    display?: WaylandDisplay;

    /**
     * This property is only available in X sessions
     */
    screen?: XScreen;
    settings: GlobalSettings;
    workspace_manager: MetaWorkspace;

    log(message: string):void;

    get_window_actors(): MetaWindowActor[];

    create_app_launch_context(param1: number, param2: number): string;
}
declare function log(msg:string): void;


type ObjectActorEvent = "changed::check-interval" | "changed::interval-unit";

interface ObjectActor {
    connect(event: ObjectActorEvent, callback: Function);
}

interface ClassData {
    Name: string;
    Extends: Button;
    actor: ObjectActor;
    GTypeName: string;

    _init(params: string): void;

    parent(param: string | null, name?: string);
}

interface LangClass {
    new<T extends ClassData>(classData: T): Lang;
}

interface Lang {
    Class: LangClass;

    bind(self: ClassData, callback: Function);
}

interface Gettext {
    bindtextdomain(domain: string, path: string);

    domain(domain: string): Gettext;

    gettext(id: string): string;
}

/**
 * https://developer.gnome.org/gio/stable/GFile.html
 */
interface GFile {
    new_for_path(path: string): GFile;

    copy(destination: string, flag: FileCopyFlags, param3, param4): boolean;
}

interface FilePath {
    file: string;
}

interface FileIcon {
    new(path: FilePath);
}

/**
 * https://developer.gnome.org/gio/stable/gio-GSettingsSchema-GSettingsSchemaSource.html
 */
interface GSettingsSchemaSource {
    new_from_directory(path: string, parent: GSettingsSchemaSource, trusted: boolean): GSettingsSchemaSource;

    get_default(): GSettingsSchemaSource;

    lookup(schemaId: string, recursive: boolean): GSettings;
}

interface GSettingsProperties {
    settings_schema?: GSettings;
}

/**
 * https://developer.gnome.org/gio/stable/GSettings.html
 */
interface GSettings {
    new(properties?: GSettingsProperties): GSettings;

    get_int(id: string): number;

    get_double(id: string): number;

    get_boolean(id: string): boolean;

    get_string(id: string): string;

    get_strv(id: string): boolean;

    get_enum(id: string): number;
}

interface SettingsBindFlags {
    DEFAULT: string;
}

interface DataStreamProperties {
    base_stream: UnixStream;
}

interface UnixStreamProperties {
    fd: any;
}

interface UnixStream {
    new(properties: UnixStreamProperties): UnixStream;
}

interface DataStream {
    new(properties: DataStreamProperties): DataStream;

    read_line(param: any): [number, number];
}

interface DBuxProxy {
    makeProxyWrapper(proxy: any);
}

interface DBus {
    session;
}

interface LocalFilePrototype {

}

interface Gio {
    File: GFile;
    FileIcon: FileIcon;
    SettingsSchemaSource: GSettingsSchemaSource;
    Settings: GSettings;
    SettingsBindFlags: SettingsBindFlags;
    DataInputStream: DataStream;
    UnixInputStream: UnixStream;
    DataOutputStream: DataStream;
    UnixOutputStream: UnixStream;
    DBusProxy: DBuxProxy;
    DBus: DBus;
    FileCopyFlags: FileCopyFlags;
    _LocalFilePrototype: LocalFilePrototype;

    app_info_launch_default_for_uri(uri: string, launchContext: string);

    _promisify(param1: string, param2: string, param3: string);
}

interface SpawnFlags {
    SEARCH_PATH: string;
}

interface UserDirectory {
    DIRECTORY_DESKTOP: string;
}

interface FileCopyFlags {
    OVERWRITE: string;
}

interface DateTime {
    new_now_local(): DateTime;

    format(format: string): string;
}

interface Glib {
    PRIORITY_DEFAULT: string;

    UserDirectory: UserDirectory;

    SpawnFlags: SpawnFlags;

    DateTime: DateTime;

    timeout_add(priority: string, timeout: number, callback: Function): number;

    source_remove(id: number);

    get_user_special_dir(): string;

    build_filenamev(parts: string[]);

    spawn_async_with_pipes(
        workingDirectory: string,
        arguments: any,
        environment: any,
        flags: any,
        childSetup: Function,
        userData: any,
        childProcessId: number,
    );

    get_home_dir(): string;

    spawn_command_line_sync(command: string);
}

interface Button {
    menu: MenuItem;

    new(): Button;

    _init(param1, param2);

    _onDestroy();

    destroy();

    add_actor(widget: StWidget);
}

interface PanelMenu {
    Button: Button;
}

interface PopupSubMenuMenuItem {
    new(T: string, S: boolean): PopupSubMenuMenuItem;
}

interface PopupMenuItemSettings {
    reactive?: boolean;
    activate?: boolean;
    hover?: boolean;
    can_focus?: boolean;
}

interface PopupMenuItem {
    new(T: string, settings: PopupMenuItemSettings): PopupMenuItem;
}

interface PopupBaseMenuItemProperties {
    activate: boolean;
}

type MenuItemEventType = "destroy" | "changed";

interface MenuItemProperties {
    style_class: string,
}

interface MenuItemEvent {
    get_time(): string;
}

interface MenuItem {
    icon: Icon;
    name: string;

    _init(properties?: MenuItemProperties | MenuItem);

    setDragEnabled(state: boolean);

    add_child(thing);

    connect(event: MenuItemEventType, callback: (item: MenuItem) => any);

    addMenuItem(item: StWidget);

    isRemovable(): boolean;

    eject();

    disconnect(id: number);

    destroy();

    launch(string);

    activate(event: MenuItemEvent);
}

interface PopupBaseMenuItem extends MenuItem {
    new(properties?: PopupBaseMenuItemProperties): PopupBaseMenuItem;
}

interface PopupSeparatorMenuItem extends MenuItem {
    new(): PopupSeparatorMenuItem;
}

interface PlacesManager {

}

interface PopupMenuSection {
    new(): PopupMenuSection;
}

interface PopupMenu {
    PopupSubMenuMenuItem: PopupSubMenuMenuItem;
    PopupMenuItem: PopupMenuItem;
    PopupBaseMenuItem: PopupBaseMenuItem;
    PopupSeparatorMenuItem: PopupSeparatorMenuItem;
    PopupMenuSection: PopupMenuSection;

    arrowIcon(side: string);

    disconnect();
}

type SystemNotificationEvent = "destroy";

interface SystemNotificationSource {
    new(): SystemNotificationSource;

    createIcon;

    notifications: MessageTrayNotification[];

    connect(event: SystemNotificationEvent, callback: Function);

    notify(notification: MessageTrayNotification);

}

interface MessageTrayNotification {
    new(notificationSource: SystemNotificationSource,
        title: string,
        message: string): MessageTrayNotification

    setTransient(state: boolean);

    update(title: string, message: string, properties);

    addAction(param1: string, callback: Function);
}

interface MessageTray {
    SystemNotificationSource: SystemNotificationSource;

    Notification: MessageTrayNotification;

    add(notificationSource: SystemNotificationSource);
}

interface StandardSlider {
    new(T: number): StandardSlider;
}

interface Slider {
    Slider: StandardSlider;
}

interface LayoutMonitorProperties {
    index: number;
}

interface LayoutMonitor {
    new(properties: LayoutMonitorProperties): LayoutMonitor;
}

interface Layout {
    Monitor: LayoutMonitor;
}

interface TweenProperties {
    opacity?: number;
    time?: number;
    transition?: string;
    onComplete?: Function;
}

interface Tweener {
    addTween(label: StLabel, properties: TweenProperties);
}

interface ExtensionSystem {

}

interface DragMotionResult {
    CONTINUE: string;
    COPY_DROP: string;
}

interface DragNDrop {
    makeDraggable<T>(thing): T;

    DragMotionResult: DragMotionResult;
}

interface ThumbnailsBox {
    prototype: any;
}

interface WorkSpaceThumbnail {
    ThumbnailsBox: ThumbnailsBox;
}

interface UserInterface {
    panel: Panel;
    panelMenu: PanelMenu;
    popupMenu: PopupMenu;
    messageTray: MessageTray;
    slider: Slider;
    main: Main;
    screencast: ScreenCast;
    layout: Layout;
    tweener: Tweener;
    extensionSystem: ExtensionSystem;
    dnd: DragNDrop;
    workspaceThumbnail: WorkSpaceThumbnail;
}

interface Slider {

}

interface MenuManager {
    removeMenu(menu: string);
}

interface LeftPanel {
    indexOf(name: string): number;
}

type StatusAreaAlignment = 'left' | 'right';

interface StatusArea {

}

interface RightBox {
    insert_child_at_index(widget: StWidget, index: number);

    remove_child(widgt: StWidget);
}

interface Panel {
    menuManager: MenuManager;
    left: LeftPanel;
    _rightBox: RightBox;
    statusArea: StatusArea;

    addToStatusArea(name: string, button: Button, index: number, alignment: StatusAreaAlignment);
}

interface Monitor {
    height: number;
    width: number;
    x: number;
    y: number;
}

interface LayoutManager {
    focusMonitor: Monitor;
    currentMonitor: Monitor;
    primaryMonitor: Monitor;
}

interface ClutterActor {

}

interface UserInterfaceGroup {
    add_actor(actor: ClutterActor);

    remove_actor(actor: ClutterActor);
}

interface SessionMode {
    panel: Panel;

    connect(event: 'updated', callback: Function);
}

interface MainUtil {
    trySpawnCommandLine(command: string);
}

interface WindowManager {
    addKeybinding(
        shortcutKey: string,
        settings: any,
        flag: number,
        mode: string,
        callback: Function,
    );

    removeKeybinding(shortcutKey: string);
}

interface Main {
    panel: Panel;
    layoutManager: LayoutManager;
    uiGroup: UserInterfaceGroup;
    sessionMode: SessionMode;
    overview: ClutterStage;
    Util: MainUtil;
    wm: WindowManager;
    messageTray: MessageTray;

    pushModal(actor: ClutterActor);

    popModal(actor: ClutterActor);
}

interface ScreenCastInterface {

}

interface ScreenCast {
    ScreencastIface: ScreenCastInterface;
}

interface Signals {
    addSignalMethods();
}

interface MainLoop {
    timeout_add_seconds(number, callback: Function);

    source_remove(id: number);
}

interface ByteArray {
    toString(byteArray: string[]);
}

interface Imports {
    gi: GI;
    lang: Lang;
    misc: Misc;
    gettext: Gettext;
    ui: UserInterface;
    signals: Signals;
    mainloop: MainLoop;
    byteArray: ByteArray;
    format: string;
}

interface ExtensionDirectory {
    get_child(folder: string);

    get_path(): string;
}

interface ExtensionMetaData {
    'gettext-domain': string;
    uuid: string;
    version: string;
    name: string;
}

interface ExtensionMeta {
  metadata: ExtensionMetaData; // Parsed metadata.json file, apparently
  uuid: string;
  type: number; // 1 for system, 2 for user
  dir: GFile; // The extension directory
  path: string; // the exention directory path
  error: string; // An error message
  hasPrefs: boolean; // has a preferences dialog
  hasUpdate: boolean; // has a pending update
  canChange: boolean; // Can be enabled/disabled
  sessionModes: string[]; // The list of supported session modes
}

interface Extension {
    imports: any;
    dir: ExtensionDirectory;
    path: string;
    metadata: ExtensionMetaData;
}

interface MiscExtensionUtils {
    extensions: { [key: string]: Extension }

    getCurrentExtension(): Extension;

    initTranslations();

    getSettings(which:string):GSettings| undefined;
}

interface MiscConfig {
    LOCALEDIR: string;
    PACKAGE_VERSION: string;
}

interface MiscUtil {

}

interface Misc {
    extensionUtils: MiscExtensionUtils;
    config: MiscConfig;
    util: MiscUtil;
}

interface Repository {
    prepend_search_path(path: string);

    prepend_library_path(path: string);
}

interface GIRepository {
    Repository: Repository;
}

interface MixerControlState {
    CLOSED: string;
    CONNECTING: string;
    FAILED: string;
    READY: string;
}

interface Gvc {
    MixerControlState: MixerControlState;
}

interface StWidgetProperties {
    style_class?: string;
}

interface BoxLayout extends StWidget {
    new(properties?: StWidgetProperties): BoxLayout;

    add_child(widget: StWidget);

    add_actor(widget: StWidget);
}

interface LabelSettings {
    text?: string;
    width?: number;
    height?: number;
    style_class?: string;
    y_expand?: boolean;
    y_align?: string;
    content_gravity?: string;
    x_expand?: boolean;
    x_align?: string;
    opacity?: number;
}

interface EasingProperties {
    opacity?: number;
    duration?: number;
    mode?: string;
    onComplete: Function;
}

interface StLabel extends StWidget, LabelSettings {
    new(settings: LabelSettings): StLabel;

    set_position(x: number, y: number);

    destroy();

    remove_all_transitions();

    set_text(text: string);

    ease(properties: EasingProperties);
}

interface Alignment {
    END: string;
    BOTTOM: string;
}

interface WidgetProperties {
    name: string;
    style_class: string;
    visible: boolean;
    reactive: boolean;
    x: number;
    y: number;
}

interface Widget {
    new(properties: WidgetProperties): Widget;
}

type TextureCacheEvent = "icon-theme-changed";

interface TextureCache {
    get_default(): TextureCache;

    connect(event: TextureCacheEvent, callback: Function): number;

    disconnect(id: string);
}

interface DrawingAreaProperties {
    style_class: string;
    pseudo_class: string;
}

type DrawingAreaEvent = "repaint";

interface DrawingArea {
    new(properties: DrawingAreaProperties): DrawingArea;

    connect(event: DrawingAreaEvent, callback: (DrawingArea) => void);
}

interface ThemeContext {
    get_for_stage(stage: ClutterStage): ClutterCanvas;
}

interface StButtonProperties {
    child?: StWidget;
    style_class?: string;
}

interface StWidget {
    connect(event: string, callback: () => any)
}

interface StButton extends StWidget {
    new(properties: StButtonProperties): StButton;
}

interface St {
    BoxLayout: BoxLayout;
    Icon: Icon;
    Label: StLabel;
    Align: Alignment;
    Widget: Widget;
    Bin: Bin;
    Button: StButton;
    TextureCache: TextureCache;
    Side: Alignment;
    DrawingArea: DrawingArea;
    ThemeContext: ThemeContext;
}

interface IconSettings {
    gicon?: Icon;
    icon_size?: number;
    icon_name?: string;
    style_class?: string;
}

interface Icon extends StWidget, IconSettings {
    new(iconSettings: IconSettings): Icon;
}

interface MetaData {
    version: string;
}

interface Cursor {
    DEFAULT: string;
    CROSSHAIR: string;
}

interface DisplayCorner {
    TOPLEFT;
}

interface VirtualModifier {
    SHIFT_MASK: number;
}

type MetaMaximizeFlag = "Horizontal" | "Vertical" | "Both";

interface MetaMaximizeFlags {
    BOTH: MetaMaximizeFlag;
    Horizontal: MetaMaximizeFlag;
    Both: MetaMaximizeFlag;
}

interface KeyBindingFlag {
    PER_WINDOW: number;
    IS_REVERSED: number;
}

interface Meta {
    metadata: MetaData;
    path: string;
    DisplayCorner: DisplayCorner;
    Cursor: Cursor;
    VirtualModifier: VirtualModifier;
    MaximizeFlags: MetaMaximizeFlags;
    KeyBindingFlags: KeyBindingFlag;
}

/**
 * https://developer.gnome.org/shell/stable/shell-shell-app-system.html
 */
interface ShellAppSystem {
    get_default(): ShellAppSystem;

    lookup_app(id: string): ShellAppSystem;
}

interface App {

}

interface ActionMode {
    NORMAL: string;
}

interface Shell {
    AppSystem: ShellAppSystem;
    App: App;
    ActionMode: ActionMode;
}

interface ActorAlign {
    CENTER: string;
}

interface ClutterEventType {
    KEY_PRESS: string;
}

interface AnimationMode {
    EASE_OUT_QUAD: string;
}

interface Clutter {
    ActorAlign: ActorAlign;
    ContentGravity: ActorAlign;
    EventType: ClutterEventType;
    Escape: string;
    AnimationMode: AnimationMode;
}

interface GObjectClass {
    new(T: ClassData): GObjectClass;
}

interface GObject {
    Class: GObjectClass;

    registerClass<T>(customClass: Object): T;
}

interface Box {
}

/**
 * https://developer.gnome.org/gtk3/stable/GtkBuilder.html
 */
interface GtkBuilder {
    new(): GtkBuilder;

    set_translation_domain(name: string);

    add_from_file(T: string);

    get_object(name: string);
}

interface GtkLabelSettings {
    label: string;
    vexpand?: boolean;
}

interface GtkLabel {
    new(T: GtkLabelSettings): GtkLabel;
}

/**
 * https://developer.gnome.org/gtk3/stable/GtkCellRendererText.html
 */
interface GtkCellRendererTextProperties {
    editable: true;
}

/**
 * https://developer.gnome.org/gtk3/stable/GtkCellRendererAccel.html
 */
type GtkCellRendererAccelEvent = "accel-edited" | "accel-cleared";

/**
 * https://developer.gnome.org/gtk3/stable/GtkCellRendererAccel.html
 */
interface GtkCellRendererAccel {
    new(properties: GtkCellRendererTextProperties): GtkCellRendererAccel;

    connect(event: GtkCellRendererAccelEvent, callback: Function);
}

type GtkCellRendererAttribute = "accel-key" | "accel-mods" | "text";

/**
 * https://developer.gnome.org/gtk3/stable/GtkTreeViewColumn.html
 */
interface GtkTreeViewColumnAttributes {
    title: string;
}

/**
 * https://developer.gnome.org/gtk3/stable/GtkBox.html
 */
interface GtkBox {
    pack_start(
        renderer: GtkCellRendererAccel,
        expand?: boolean,
        fill?: boolean,
        padding?: number
    );

    add_attribute(
        renderer: GtkCellRendererAccel,
        attribute: GtkCellRendererAttribute, column: number
    );
}

/**
 * https://developer.gnome.org/gtk3/stable/GtkTreeViewColumn.html
 */
interface GtkTreeViewColumn extends GtkBox {
    new(properties?: GtkTreeViewColumnAttributes): GtkTreeViewColumn;
}

/**
 * https://developer.gnome.org/gtk3/stable/GtkCellRendererText.html
 */
interface GtkCellRendererText {
    new(): GtkCellRendererText;
}

interface GtkAdjustmentProperties {
    value: number;
    lower: number;
    upper: number;
    step_increment: number;
    page_increment: number;
}

/**
 * https://developer.gnome.org/gtk3/stable/GtkAdjustment.html
 */
interface GtkAdjustment {
    new(properties: GtkAdjustmentProperties): GtkAdjustment;
}

interface GtkAlign {
    START: string;
}

interface GtkPositionType {
    BOTTOM: string;
}

type PolicyType = "";

interface Gtk {
    Box: Box;
    Builder: GtkBuilder;
    Label: GtkLabel;
    CellRendererAccel: GtkCellRendererAccel;
    TreeViewColumn: GtkTreeViewColumn;
    CellRendererText: GtkCellRendererText;
    Adjustment: GtkAdjustment;
    Align: GtkAlign;
    PositionType: GtkPositionType;
    PolicyType: PolicyType;

    /**
     * https://developer.gnome.org/gtk3/stable/gtk3-Keyboard-Accelerators.html
     */
    accelerator_name(acceleratorKey: number, acceleratorMods: string);

    accelerator_parse(data: string);
}

interface EllipsizeMode {
    END: string;
}

interface Pango {
    EllipsizeMode: EllipsizeMode;
}

interface SessionProperties {
    ssl_use_system_ca_file: boolean;
}

interface SessionAsync {
    new(properties: SessionProperties): SessionAsync;
}

interface Session {

}

interface ProxyResolverDefault {
    new(): ProxyResolverDefault;
}

type HttpMethods = "GET" | "POST";

interface Soup {
    Session: Session;
    SessionAsync: SessionAsync;
    ProxyResolverDefault: ProxyResolverDefault;

    form_request_new_from_hash(method: HttpMethods, url: string, parameters);
}

interface Bin {
    new(properties?: StWidgetProperties): Bin;

    set_child(widget: StWidget);
}

interface AtkRole {
    LABEL: string;
}

interface AtkStateType {
    CHECKED: string;
}

interface Atk {
    Role: AtkRole;
    StateType: AtkStateType;
}

interface TreeProperties {
    menu_basename: string;
}

interface Tree {
    new(properties: TreeProperties): Tree;
}

interface GMenu {
    Tree: Tree;
}

interface GI {
    GIRepository: GIRepository;
    Gio: Gio;
    GLib: Glib;
    Gvc: Gvc;
    St: St;
    Meta: Meta;
    Shell: Shell;
    Clutter: Clutter;
    GObject: GObject;
    Gtk: Gtk;
    Atk: Atk;
    Pango: Pango;
    GMenu: GMenu;
    Soup: Soup;
}
