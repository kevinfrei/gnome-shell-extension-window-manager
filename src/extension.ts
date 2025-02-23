/// <reference path="./gnome-shell-extension.d.ts"/>

// documentation here: https://gjs.guide/extensions/
// For typescript, I started here:
// https://discourse.gnome.org/t/proposal-transition-gnome-shell-js-extensions-to-typescript-guide-for-extensions-today/4270
// What's delightful is the the Gnome people seem completely unaware that
// the planet has basically moved away from vanilla javascript.

const Gio = imports.gi.Gio;
const Clutter = imports.gi.Clutter;
const GLib = imports.gi.GLib;
const St = imports.gi.St;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;
const Mainloop = imports.mainloop;
const GObject = imports.gi.GObject;

const Gettext = imports.gettext.domain('gnome-shell-extensions');
const _ = Gettext.gettext;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Slider = imports.ui.slider;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const WINDOWMANAGER_SCHEMA = 'org.gnome.shell.extensions.windowManager';
const ALL_MONITOR = 'all-monitor';
class ArrangeMenuClass extends PanelMenu.Button {
  _gsettings: GSettings | undefined;
  _allMonitor: boolean;
  _allMonitorItem: PopupMenu.PopupSwitchMenuItem;
  constructor() {
    super();
    this._gsettings =undefined;
    this._allMonitor = false;
  }
  _init() {
    super._init(0.0, _('Arrange Windows'));

    this._gsettings = ExtensionUtils.getSettings(WINDOWMANAGER_SCHEMA);

    this._allMonitor = this._gsettings!.get_boolean(ALL_MONITOR);

    let icon = new St.Icon({
      gicon: this._getCustIcon('arrange-windows-symbolic'),
      style_class: 'system-status-icon',
    });
    this.add_actor(icon);

    this.menu.addAction(
      _('Cascade'),
      () => this.cascadeWindow(),
      this._getCustIcon('cascade-windows-symbolic'),
    );

    this.menu.addAction(
      _('Tile'),
      () => this.tileWindow(),
      this._getCustIcon('tile-windows-symbolic'),
    );

    this.menu.addAction(
      _('Side by side'),
      () => this.sideBySideWindow(),
      this._getCustIcon('sidebyside-windows-symbolic'),
    );

    this.menu.addAction(
      _('Stack'),
      () => this.stackWindow(),
      this._getCustIcon('stack-windows-symbolic'),
    );

    this.menu.addAction(
      _('Maximize'),
      () => this.maximizeWindow(Meta.MaximizeFlags.BOTH),
      this._getCustIcon('maximize-windows-symbolic'),
    );

    this.menu.addAction(
      _('Maximize Vertical'),
      () => this.maximizeWindow(Meta.MaximizeFlags.VERTICAL),
      this._getCustIcon('maximize-vertical-windows-symbolic'),
    );

    this.menu.addAction(
      _('Maximize Horizontal'),
      () => this.maximizeWindow(Meta.MaximizeFlags.HORIZONTAL),
      this._getCustIcon('maximize-horizontal-windows-symbolic'),
    );

    this.menu.addAction(
      _('Restoring'),
      () => this.restoringWindow(),
      this._getCustIcon('restoring-window-symbolic'),
    );

    this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

    this._allMonitorItem = new PopupMenu.PopupSwitchMenuItem(
      _('All monitors'),
      this._allMonitor,
    );
    this._allMonitorItem.connect(
      'toggled',
      this._allMonitorToggle.bind(this),
    );
    this.menu.addMenuItem(this._allMonitorItem);

    this._column = new Column();
    this.menu.addMenuItem(this._column.menu);

    this.show();

    this.connect('destroy', this._onDestroy.bind(this));
  }

  cascadeWindow() {
    let windows = this.getWindows();
    if (windows.length == 0) return;

    let workArea = this.getWorkArea(windows[0]);

    let y = workArea.y + 5;
    let x = workArea.x + 10;
    let width = workArea.width * 0.7;
    let height = workArea.height * 0.7;
    for (let i = 0; i < windows.length; i++) {
      let win = windows[i].get_meta_window();
      win.unmaximize(Meta.MaximizeFlags.BOTH);
      win.move_resize_frame(true, x, y, width, height);
      x = x + CASCADE_WIDTH;
      y = y + CASCADE_HEIGHT;
    }
  }

  sideBySideWindow() {
    let windows = this.getWindows();
    if (windows.length == 0) return;

    let workArea = this.getWorkArea(windows[0]);
    let width = Math.round(workArea.width / windows.length);

    let y = workArea.y;
    let x = workArea.x;
    for (let i = 0; i < windows.length; i++) {
      let win = windows[i].get_meta_window();
      win.unmaximize(Meta.MaximizeFlags.BOTH);
      win.move_resize_frame(false, x, y, width, workArea.height);
      x = x + width;
    }
  }

  stackWindow() {
    let windows = this.getWindows();
    if (windows.length == 0) return;

    let workArea = this.getWorkArea(windows[0]);
    let height = Math.round(workArea.height / windows.length);

    let y = workArea.y;
    let x = workArea.x;
    for (let i = 0; i < windows.length; i++) {
      let win = windows[i].get_meta_window();
      win.unmaximize(Meta.MaximizeFlags.BOTH);
      win.move_resize_frame(false, x, y, workArea.width, height);
      y += height;
    }
  }

  tileWindow() {
    /* Display all windows in a grid defined by the number of columns in
     * settings.
     *
     * In the last row, the rectangles may be wider so that the remaining
     * windows equally share the total width.
     *
     * Try to assign the windows to the closest rectangle in the grid so that
     * windows move by the smallest amount. This is important because they
     * may be pressing tile from a state that is already tiled so wouldn't expect
     * the windows to change order.
     *
     * A quick heuristic to approximate this is to calculate the closest grid position
     * for each window and then assign them to the closest available in order
     * of shortest first.
     */

    let windows = this.getWindows();
    if (windows.length == 0) return;
    let workArea = this.getWorkArea(windows[0]);

    // Get number of columns from settings
    let columnNumber = parseInt(
      COLUMN[this._gsettings.get_int(COLUMN_NUMBER)],
    );
    // Calculate number of rows based on number of windows and number of columns
    let rowNumber = Math.ceil(windows.length / columnNumber);

    // Create the grid
    let gridCells = [];
    for (let i = 0; i < windows.length; i++) {
      let row = Math.floor(i / columnNumber);
      let col = i % columnNumber;

      let gridWidth = Math.floor(workArea.width / columnNumber);
      let gridHeight = Math.floor(workArea.height / rowNumber);
      let numLastRow = windows.length % columnNumber;

      let cell = {};

      if (row + 1 === rowNumber && numLastRow !== 0) {
        // In the last row, recalculate width so that they fill the screen
        let gridWidthLastRow = Math.floor(workArea.width / numLastRow);
        cell.x = workArea.x + col * gridWidthLastRow;
        cell.w = gridWidthLastRow;
      } else {
        cell.x = workArea.x + col * gridWidth;
        cell.w = gridWidth;
      }
      cell.y = workArea.y + row * gridHeight;
      cell.h = gridHeight;
      cell.centerX = cell.x + cell.w / 2;
      cell.centerY = cell.y + cell.h / 2;
      gridCells.push(cell);
    }

    // Calculate distances[i][j] as the distance from windows[i] to
    // gridCells[j].
    let distances = [];
    for (let windowI = 0; windowI < windows.length; windowI++) {
      const win = windows[windowI];
      const windowCenterX = win.x + win.width / 2;
      const windowCenterY = win.y + win.height / 2;
      distances[windowI] = [];
      for (let cellJ = 0; cellJ < gridCells.length; cellJ++) {
        const cell = gridCells[cellJ];
        const dist = Math.sqrt(
          (windowCenterX - cell.centerX) ** 2 +
            (windowCenterY - cell.centerY) ** 2,
        );
        distances[windowI][cellJ] = dist;
      }
    }

    // Move window into cell
    function moveWindow(wind, cell) {
      const win = wind.get_meta_window();
      win.unmaximize(Meta.MaximizeFlags.BOTH);
      win.unminimize();
      win.move_resize_frame(false, cell.x, cell.y, cell.w, cell.h);
    }

    // Now we can assign windows in order of closest
    const windowIsToMove = new Set(windows.keys());
    const cellJsToFill = new Set(gridCells.keys());

    // Move windows, closest to grid position first.
    for (let i = 0; i < windows.length; i++) {
      if (windowIsToMove.size !== cellJsToFill.size)
        throw Error('Expected to assign one cell per window');
      let minDist = Infinity;
      let minI, minJ;
      windowIsToMove.forEach((windowI) =>
        cellJsToFill.forEach((cellJ) => {
          if (distances[windowI][cellJ] < minDist) {
            minDist = distances[windowI][cellJ];
            minI = windowI;
            minJ = cellJ;
          }
        }),
      );
      moveWindow(windows[minI], gridCells[minJ]);
      windowIsToMove.delete(minI);
      cellJsToFill.delete(minJ);
    }
  }

  maximizeWindow(direction) {
    if (this._allMonitor == true) {
      this.maximizeWindowAllMonitor(direction);
      return;
    }

    let windows = this.getWindows();

    for (let i = 0; i < windows.length; i++) {
      let actor = windows[i];
      let win = actor.get_meta_window();
      win.maximize(direction);
    }
  }

  maximizeWindowAllMonitor(direction) {
    let windows = this.getWindows();
    if (windows.length == 0) return;

    let workArea = this.getWorkArea(windows[0]);

    for (let i = 0; i < windows.length; i++) {
      let win = windows[i].get_meta_window();

      switch (direction) {
        case Meta.MaximizeFlags.BOTH:
          win.move_resize_frame(
            true,
            workArea.x,
            workArea.y,
            workArea.width,
            workArea.height,
          );
          break;
        case Meta.MaximizeFlags.VERTICAL:
          win.move_resize_frame(
            true,
            win.get_frame_rect().x,
            workArea.y,
            win.get_frame_rect().width,
            workArea.height,
          );
          break;
        case Meta.MaximizeFlags.HORIZONTAL:
          win.move_resize_frame(
            true,
            workArea.x,
            win.get_frame_rect().y,
            workArea.width,
            win.get_frame_rect().height,
          );
          break;
      }
    }
  }

  restoringWindow() {
    let windows = this.getWindows();

    for (let i = 0; i < windows.length; i++) {
      let actor = windows[i];
      let win = actor.get_meta_window();
      win.unmaximize(Meta.MaximizeFlags.BOTH);
    }
  }

  getWindows() {
    let currentWorkspace = global.workspace_manager.get_active_workspace();

    let windows = global.get_window_actors().filter((actor) => {
      if (actor.meta_window.get_window_type() == Meta.WindowType.NORMAL)
        return actor.meta_window.located_on_workspace(currentWorkspace);

      return false;
    });

    if (!this._allMonitor) {
      windows = windows.filter((w) => {
        return w.meta_window.get_monitor() == this.getFocusedMonitor();
      });
    }
    return windows;
  }

  getFocusedMonitor() {
    let focusWindow = global.display.get_focus_window();
    if (focusWindow) {
      return focusWindow.get_monitor();
    } else {
      return global.display.get_current_monitor();
    }
  }

  getWorkArea(window) {
    if (this._allMonitor)
      return window.get_meta_window().get_work_area_all_monitors();
    else return window.get_meta_window().get_work_area_current_monitor();
  }

  _allMonitorToggle() {
    this._allMonitor = this._allMonitorItem.state;
    this._gsettings.set_boolean(ALL_MONITOR, this._allMonitorItem.state);
  }

  _getCustIcon(icon_name) {
    let gicon = Gio.icon_new_for_string(
      Me.dir.get_child('icons').get_path() + '/' + icon_name + '.svg',
    );
    return gicon;
  }

  _onDestroy() {}
}

let ArrangeMenu = GObject.registerClass<ArrangeMenuClass>(ArrangeMenuClass);

let Column = GObject.registerClass(
  class Column extends PanelMenu.SystemIndicator {
    _init() {
      super._init();

      this._gsettings = ExtensionUtils.getSettings(ARRANGEWINDOWS_SCHEMA);

      this._item = new PopupMenu.PopupBaseMenuItem({ activate: false });
      this.menu.addMenuItem(this._item);

      this._slider = new Slider.Slider(0);
      this._slider.connect('drag-end', this._sliderChanged.bind(this));

      let number = this._gsettings.get_int(COLUMN_NUMBER);
      this._slider.value = number / 6;
      this._label = new St.Label({ text: 'Tile x' + COLUMN[number] });

      this._item.add(this._label);
      this._item.add(this._slider);
    }

    _sliderChanged() {
      let number = Math.round(this._slider.value * 6);
      this._slider.value = number / 6;
      this._label.set_text('Tile x' + COLUMN[number]);
      this._gsettings.set_int(COLUMN_NUMBER, number);
    }
  },
);

function addKeybinding() {
  let modeType = Shell.ActionMode.NORMAL;

  Main.wm.addKeybinding(
    HOTKEY_CASCADE,
    arrange._gsettings,
    Meta.KeyBindingFlags.NONE,
    modeType,
    arrange.cascadeWindow.bind(arrange),
  );
  Main.wm.addKeybinding(
    HOTKEY_TILE,
    arrange._gsettings,
    Meta.KeyBindingFlags.NONE,
    modeType,
    arrange.tileWindow.bind(arrange),
  );
  Main.wm.addKeybinding(
    HOTKEY_SIDEBYSIDE,
    arrange._gsettings,
    Meta.KeyBindingFlags.NONE,
    modeType,
    arrange.sideBySideWindow.bind(arrange),
  );
  Main.wm.addKeybinding(
    HOTKEY_STACK,
    arrange._gsettings,
    Meta.KeyBindingFlags.NONE,
    modeType,
    arrange.stackWindow.bind(arrange),
  );
}

function removeKeybinding() {
  Main.wm.removeKeybinding(HOTKEY_CASCADE);
  Main.wm.removeKeybinding(HOTKEY_TILE);
  Main.wm.removeKeybinding(HOTKEY_SIDEBYSIDE);
  Main.wm.removeKeybinding(HOTKEY_STACK);
}

let arrange:ArrangeMenuClass;

function init(metadata:ExtensionMeta) {
  log(`Initializing ${metadata.metadata.name}`)
}

function enable() {
  arrange = new ArrangeMenu();
  Main.panel.addToStatusArea('arrange-menu', arrange);
  addKeybinding();
}

function disable() {
  removeKeybinding();
  arrange.destroy();
}
