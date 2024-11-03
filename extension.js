import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
const { GLib, Shell, Gio } = imports.gi;

let workspaceManager;
let focusWindowListener;

// this function is called when the workspace is changed. it reads the content of the workspaceChangeList file and runs every line as a command with the workspace as an argument
async function onWorkspaceChanged() {
    try {
        const workspace = global.workspace_manager.get_active_workspace_index();
        const workspaceChangeList = (await readFile('.local/share/gnomeWindowWorkspaceWatcher/workspaceChangeList')).trim().split('\n');

        for (let call of workspaceChangeList) {
            log(call)
            GLib.spawn_command_line_async(`${call} ${workspace}`);
        }
    } catch (err) {
        log(`Error in onWorkspaceChanged: ${err}`);
    }
}

// this function is called when the focused window is changed. it reads the content of the windowChangeList file and runs every line as a command with the window's name as an argument
async function onFocusWindowChanged() {
    const windowTracker = Shell.WindowTracker.get_default();
    const name = windowTracker.focusApp?.get_name();
    if (name === undefined) return;

    for (let call of (await readFile('.local/share/gnomeWindowWorkspaceWatcher/windowChangeList')).toString().split('\n')) {
        GLib.spawn_command_line_async(`${call} ${name}`);
    }
}

// this is used to read the content of the list files
async function readFile(filePath) {
    const [success, stdout, stderr, exitStatus] = GLib.spawn_command_line_sync(`cat ${filePath}`);
    let decodedOutput = new TextDecoder("utf-8").decode(stdout);
    return decodedOutput.toString();
}

// this runs the nodejs script for X-based applications which are not showed up sometimes
function xWindowChange() {
    GLib.spawn_command_line_async('/usr/bin/node .local/share/gnome-shell/extensions/gnomeWindowWorkspaceWatcher/xWindowChange.js')
}


export default class PlainExampleExtension extends Extension {
    enable() {
        // this creates a listener if the workspace changes
        workspaceManager = Shell.Global.get().workspace_manager;
        workspaceManager.connect("active-workspace-changed", onWorkspaceChanged);

        // this is a listener if the focused window changes
        focusWindowListener = global.display.connect('notify::focus-window', onFocusWindowChanged);

        // it is working better on my system using the timeout
        setTimeout(xWindowChange, 500);
    }

    disable() {
        // this diaables the workspace listener
        if (workspaceManager) 
            workspaceManager.disconnect("active-workspace-changed", onWorkspaceChanged);

        // this disables the window changes listener
        if (focusWindowListener) {
            global.display.disconnect(focusWindowListener);
            focusWindowListener = null;
        }
    }
}
