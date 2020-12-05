const {
  app,
  BrowserWindow
} = require('electron')
const path = require('path')

app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadFile(path.join(__dirname, 'renderer.html'))
})

console.log('Hi NodeJS')
