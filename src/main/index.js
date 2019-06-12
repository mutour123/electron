import {app, BrowserWindow} from 'electron'
const fs = require('fs')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV == 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

global.parkingLot = [] //停车场数据，最多存放60辆车
global.history = []
global.write = []
global.money = []

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 563,
        useContentSize: true,
        width: 1000,
        resizable: false
    })

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    mainWindow.loadURL(winURL)

    // 初始化数据
    parkingLot = JSON.parse(fs.readFileSync('./src/data/parkinglot.json'))
    history = JSON.parse(fs.readFileSync('./src/data/history.json'))
    write = JSON.parse(fs.readFileSync('./src/data/write.json'))
    money = JSON.parse(fs.readFileSync('./src/data/money.json'))
    console.log('parkingLot:')
    console.log(parkingLot)
    // console.log(history)
    // console.log(write)

    // ipc 处理main.js
    require('./ipcMain.js')

    mainWindow.on('closed', () => {
        //将数据存入本地文件中
        fs.writeFileSync('./src/data/parkinglot.json', JSON.stringify(parkingLot))
        fs.writeFileSync('./src/data/history.json', JSON.stringify(history))
        fs.writeFileSync('./src/data/write.json', JSON.stringify(write))
        fs.writeFileSync('./src/data/money.json', JSON.stringify(money))

        mainWindow = null
    })
}


app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
