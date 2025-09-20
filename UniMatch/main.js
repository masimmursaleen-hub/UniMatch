import { app, BrowserWindow } from "electron";
import path from "path";
import { fork } from "child_process";

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "assets/yourImage.ico")
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (serverProcess) serverProcess.kill(); // stop backend
  });
}

app.on("ready", () => {
  // Start backend server
  serverProcess = fork(path.join(__dirname, "server.js"));
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
