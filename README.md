# Gnome Window-Workspace Watcher

GNOME extension which runs commands if the Window or the Workspace changes giving the focused application name or the actual workspace as an argument

# Requirements

* Nodejs installed in /usr/bin/node
* Gnome running on Wayland

# Quick Start

1. Install the extension by cloning the responsitory to ~/.local/share/gnome-shell/extensions/gnomeWindowWorkspaceWatcher@jw2122.github.com

```sh
git clone https://github.com/jw2122/GnomeWindowWorkspaceWatcher ~/.local/share/gnome-shell/extensions/gnomeWindowWorkspaceWatcher@jw2122.github.com
```

2. Create the folder **~/.local/share/gnomeWindowWorkspaceWatcher**. This folder will contain two files: workspaceChangeList and windowChangeList
```sh
mkdir -p ~/.local/share/gnomeWindowWorkspaceWatcher
```

3. Create two files in **~/.local/share/gnomeWindowWorkspaceWatcher** whcih are called **workspaceChangeList** and **windowChangeList**
```sh
touch ~/.local/share/gnomeWindowWorkspaceWatcher/workspaceChangeList
touch ~/.local/share/gnomeWindowWorkspaceWatcher/windowChangeList
```
4. Now you can define the applications you want to launch when the workspace or the focused application changes. you have to write every program you want to start in a new line so that the extension will detect the programs
    For examle, if you want to receive a notification every time you change the workspace, open the ~/.local/share/gnomeWindowWorkspaceWatcher/workspaceChangeList and enter the following line:
    ```txt
    notify-send
    ```
    The windowChangeList is exactly the same to configure.

5. The extension is now installed on your system. To load it, you have to start a new gnome session by logging out and loggin in again.
```sh
gnome-session-quit
```
