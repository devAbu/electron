const electron = require('electron')
const {
  app,
  Menu
} = require('electron')
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const shell = require('electron').shell

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('src/index.html')
  //Open Dev tools
  win.webContents.openDevTools()

  let menu = Menu.buildFromTemplate([{
      label: 'Menu',
      submenu: [{
          label: 'Adjust Notification Value'
        },
        {
          label: 'CoinMarketCap',
          click() {
            shell.openExternal('https://a-boc.com')
          }
        },
        {
          type: "separator"
        },
        {
          label: 'Exit',
          click() {
            app.quit()
          }
        },
      ]
    },
    {
      label: 'Info',
      submenu: [{
        label: 'Exit',
        click() {
          app.quit()
        }
      }]
    }
  ])

  Menu.setApplicationMenu(menu)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
