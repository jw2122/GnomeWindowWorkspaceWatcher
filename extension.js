import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
const { GLib, Shell, Gio } = imports.gi;

let workspaceManager;
let focusWindowListener;

async function onWorkspaceChanged() {
    try {
        const workspace = global.workspace_manager.get_active_workspace_index();
        const workspaceChangeList = (await runCmdWithOutput('cat .local/applicationList/workspaceChangeList')).trim().split('\n');
        for (let call of workspaceChangeList) {
            log(call)
            GLib.spawn_command_line_async(`${call} ${workspace}`);
        }
    } catch (err) {
        log(`Error in onWorkspaceChanged: ${err}`);
    }
}

async function onFocusWindowChanged() {
    const windowTracker = Shell.WindowTracker.get_default();
    const name = windowTracker.focusApp?.get_name();
    if (name === undefined) return;

    for (let call of (await runCmdWithOutput('cat .local/applicationList/windowChangeList')).toString().split('\n')) {
        GLib.spawn_command_line_async(`${call} ${name}`);
    }
}

async function runCmdWithOutput(command) {
    const [success, stdout, stderr, exitStatus] = GLib.spawn_command_line_sync(command);
    let decodedOutput = new TextDecoder("utf-8").decode(stdout);
    return decodedOutput.toString();
}

async function xWindowChange() {
    GLib.spawn_command_line_async('/usr/bin/node .local/share/gnome-shell/extensions/applicationlist@johannes.wolf.at/xWindowChange.js')
}


export default class PlainExampleExtension extends Extension {
    enable() {
        workspaceManager = Shell.Global.get().workspace_manager;
        workspaceManager.connect("active-workspace-changed", onWorkspaceChanged);

        focusWindowListener = global.display.connect('notify::focus-window', onFocusWindowChanged);

        setTimeout(xWindowChange, 500);
    }

    disable() {
        if (workspaceManager) {
            workspaceManager.disconnect("active-workspace-changed", onWorkspaceChanged);
        }

        if (focusWindowListener) {
            global.display.disconnect(focusWindowListener);
            focusWindowListener = null;
        }
    }
}
