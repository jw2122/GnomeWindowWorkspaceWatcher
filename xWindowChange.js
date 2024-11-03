import { exec } from 'child_process'

let lastFocusedWindow = '';


async function runCmd(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) console.error(err)
            resolve(stdout);
        })
    })
}

async function main() {
    const focusedWindow = await runCmd("xdotool getactivewindow getwindowname | awk -F ' - ' '{print $NF}'")
    const commandList = (await runCmd("cat ~/.local/applicationList/windowChangeList")).toString().trim().split('\n')

    // set lastFocusedWindow also if no focused Window to send notification if focus again
    if (lastFocusedWindow === focusedWindow) return;
    lastFocusedWindow = focusedWindow;
    if (focusedWindow === '') return;

    commandList.forEach(command => {
        runCmd(`${command} "${focusedWindow}"`)  
    })
}



setInterval(main, 250);
