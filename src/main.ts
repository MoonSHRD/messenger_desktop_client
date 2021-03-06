'use strict';
// let Router = require('electron-routes');

import {Router} from "./router";
import * as fs from "fs";
import {createConnection} from "typeorm";
import "reflect-metadata";
import {AccountModel} from "../models/AccountModel";
import {SettingsModel} from "../models/SettingsModel";

const {app, BrowserWindow} = require('electron');
const locals = {/* ...*/};
const setupPug = require('electron-pug');

const { autoUpdater } = require("electron-updater")


// const Router = require('./router');

let mainWindow
app.on('ready', async () => {
    let path = app.getPath('userData');
    console.log(`path ${path}`);
    try {
        let pug = await setupPug({pretty: true}, locals);
        pug.on('error', err => console.error('electron-pug error', err))
    } catch (err) {
        console.log(`Could not initiate 'electron-pug'`);
    }

    let width = 1000;
    let height = 700;

    console.log(__dirname +"/../migrations/*.js");
    try {
        let connection = await createConnection({
            type: "sqlite",
            // database: `${__dirname}/../sqlite/data.db`,
            database: path+'/data.db',
            entities: [
                __dirname + '/../models/' + "*.js"
            ],
            synchronize: true,
            logging: false,
            // migrationsRun: true,
            // migrations: [__dirname +"/../migrations/*.js"],
            // cli: {
            //     migrationsDir: __dirname +"/../migrations"
            // }
        });
    } catch (e) {
        let connection = await createConnection({
            type: "sqlite",
            // database: `${__dirname}/../sqlite/data.db`,
            database: path+'/data.db',
            entities: [
                __dirname + '/../models/' + "*.js"
            ],
            // synchronize: true,
            logging: false,
            // migrationsRun: true,
            migrations: [__dirname +"/../migrations/*.js"],
            cli: {
                migrationsDir: __dirname +"/../migrations"
            }
        });
        await connection.query("PRAGMA foreign_keys=OFF;");
        await connection.runMigrations();
        await connection.query("PRAGMA foreign_keys=ON;");
        // throw e;
        console.log(e)
    }
    console.log("ok");
    let settings = (await SettingsModel.find({where: {id:1}}))[0];
    if (settings) {
        width = settings.width;
        height = settings.height;
    }

    let mainWindow = new BrowserWindow({ width: width, minWidth: 1000, height: height, minHeight: 700, resizable: true, show: false, webPreferences: {
            nodeIntegration: true   }, icon: __dirname + '/icon.png' });

    // mainWindow.webContents.openDevTools();
    mainWindow.loadURL(`file://${__dirname}/index.pug`);
    mainWindow.webContents.on('dom-ready', async function() {
        // console.log('finished');
        mainWindow.show();
        const router = new Router(mainWindow);
        await router.init_app();
    });
});


app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
