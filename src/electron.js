const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain, session, globalShortcut } = electron;

// Set ENV
process.env.NODE_ENV = 'staging';

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', () => {
    // Create new window
    mainWindow = new BrowserWindow({ width: 1200, height: 700 });
    
    // Load html into window
    mainWindow.loadURL('https://kiwi-staging.firebaseapp.com/');
    mainWindow.webContents.session.clearCache(() => { console.log('Cache has been cleared') });
    
    // pathname is of form file://dirname/mainWindow.html
    // mainWindow.loadURL(url.format({
        //     pathname: path.join(__dirname, 'index.html'),
        //     protocol: 'file:',
        //     slases: true
        // })); 
        
        // Quit app when closed
        mainWindow.on('closed', () => {
            app.quit();
        });
        
        // Remove menu bar
        mainWindow.setMenu(null);

        // Shortcut keys
        globalShortcut.register('F5', () => {mainWindow.reload()});
        globalShortcut.register('CommandOrControl+R', () => {mainWindow.reload()});
        globalShortcut.register('CommandOrControl+Shift+J', () => {mainWindow.webContents.openDevTools()})
        
    });
    
    
// // If mac, add empty object to menu
// if (process.platform == 'darwin') {
//     mainMenuTemplate.unshift({});
// }

// // Add developer tools item if not in prod
// if (process.env.NODE_ENV !== 'production') {
//     mainMenuTemplate.push({
//         label: 'Developer Tools',
//         submenu: [
//             {
//                 label: 'Toggle DevTools',
//                 accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
//                 click(item, focusedWindow) {
//                     focusedWindow.toggleDevTools();
//                 }
//             },
//             {
//                 role: 'reload'
//             }
//         ]
//     });
// }