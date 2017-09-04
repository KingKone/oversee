'use strict';

// Import parts of electron to use
const {app, BrowserWindow} = require('electron');
const path = require('path')
const url = require('url')
const ipcMain = require('electron').ipcMain
const request = require('request');

/* const bittrex = require('node.bittrex.api')

bittrex.options({
  'apikey' : '...',
  'apisecret' : '... ', 
});
*/

var CoinMarketCap = require("node-coinmarketcap");
var options = {
  events: true, // Enable event system
  refresh: 120, // Refresh time in seconds (Default: 60)
  convert: "EUR" // Convert price to different currencies. (Default USD)
}
//var coinmarketcap = new CoinMarketCap(options);


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Keep a reference for dev mode
let dev = false;
if ( process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath) ) {
  dev = true;
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1060, height: 800, show: false, frame: true
  });

  // and load the index.html of the app.
  let indexPath;
  if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    });
  }
  mainWindow.loadURL( indexPath );

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Open the DevTools automatically if developing
    if ( dev ) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// --------------------------------------------------------------------- cmc 
let cmcCurrencies = [];
ipcMain.on('cmc-go', function(event, arg) {
/*  request('https://api.coinmarketcap.com/v1/ticker/?convert=EUR&limit=10', function (error, response, body) {
    console.log(body);
  }); */
  console.log(arg);
  cmcCurrencies = [
      {
          "id": "bitcoin",
          "name": "Bitcoin",
          "symbol": "BTC",
          "rank": "1",
          "price_usd": "4715.97",
          "price_btc": "1.0",
          "24h_volume_usd": "1933500000.0",
          "market_cap_usd": "77982100928.0",
          "available_supply": "16535750.0",
          "total_supply": "16535750.0",
          "percent_change_1h": "0.41",
          "percent_change_24h": "3.7",
          "percent_change_7d": "10.1",
          "last_updated": "1504213774",
          "price_eur": "3969.49797258",
          "24h_volume_eur": "1627454019.0",
          "market_cap_eur": "65638626100.0"
      },
      {
          "id": "ethereum",
          "name": "Ethereum",
          "symbol": "ETH",
          "rank": "2",
          "price_usd": "383.64",
          "price_btc": "0.080934",
          "24h_volume_usd": "729729000.0",
          "market_cap_usd": "36198220335.0",
          "available_supply": "94354656.0",
          "total_supply": "94354656.0",
          "percent_change_1h": "0.41",
          "percent_change_24h": "0.75",
          "percent_change_7d": "18.2",
          "last_updated": "1504213767",
          "price_eur": "322.91515896",
          "24h_volume_eur": "614223115.506",
          "market_cap_eur": "30468548831.0"
      },
      {
          "id": "bitcoin-cash",
          "name": "Bitcoin Cash",
          "symbol": "BCH",
          "rank": "3",
          "price_usd": "587.475",
          "price_btc": "0.123936",
          "24h_volume_usd": "306261000.0",
          "market_cap_usd": "9725097867.0",
          "available_supply": "16554063.0",
          "total_supply": "16554063.0",
          "percent_change_1h": "0.57",
          "percent_change_24h": "3.85",
          "percent_change_7d": "-7.48",
          "last_updated": "1504213803",
          "price_eur": "494.48593215",
          "24h_volume_eur": "257784171.354",
          "market_cap_eur": "8185751026.0"
      },
      {
          "id": "ripple",
          "name": "Ripple",
          "symbol": "XRP",
          "rank": "4",
          "price_usd": "0.246071",
          "price_btc": "0.00005191",
          "24h_volume_usd": "328800000.0",
          "market_cap_usd": "9435307516.0",
          "available_supply": "38343841883.0",
          "total_supply": "99994523265.0",
          "percent_change_1h": "1.49",
          "percent_change_24h": "9.02",
          "percent_change_7d": "7.06",
          "last_updated": "1504213742",
          "price_eur": "0.2071214057",
          "24h_volume_eur": "276755563.2",
          "market_cap_eur": "7941830431.0"
      },
      {
          "id": "litecoin",
          "name": "Litecoin",
          "symbol": "LTC",
          "rank": "5",
          "price_usd": "70.5032",
          "price_btc": "0.0148736",
          "24h_volume_usd": "567205000.0",
          "market_cap_usd": "3717131920.0",
          "available_supply": "52722882.0",
          "total_supply": "52722882.0",
          "percent_change_1h": "0.66",
          "percent_change_24h": "13.22",
          "percent_change_7d": "37.77",
          "last_updated": "1504213745",
          "price_eur": "59.3435304848",
          "24h_volume_eur": "477424389.37",
          "market_cap_eur": "3128761977.0"
      },
      {
          "id": "nem",
          "name": "NEM",
          "symbol": "XEM",
          "rank": "6",
          "price_usd": "0.339218",
          "price_btc": "0.00007156",
          "24h_volume_usd": "22792100.0",
          "market_cap_usd": "3052962000.0",
          "available_supply": "8999999999.0",
          "total_supply": "8999999999.0",
          "percent_change_1h": "1.81",
          "percent_change_24h": "16.33",
          "percent_change_7d": "30.03",
          "last_updated": "1504213762",
          "price_eur": "0.2855245397",
          "24h_volume_eur": "19184429.6594",
          "market_cap_eur": "2569720857.0"
      },
      {
          "id": "dash",
          "name": "Dash",
          "symbol": "DASH",
          "rank": "7",
          "price_usd": "379.348",
          "price_btc": "0.0800285",
          "24h_volume_usd": "34443900.0",
          "market_cap_usd": "2854788854.0",
          "available_supply": "7525514.0",
          "total_supply": "7525514.0",
          "percent_change_1h": "1.37",
          "percent_change_24h": "3.56",
          "percent_change_7d": "24.42",
          "last_updated": "1504213748",
          "price_eur": "319.302522472",
          "24h_volume_eur": "28991912.8446",
          "market_cap_eur": "2402915746.0"
      },
      {
          "id": "iota",
          "name": "IOTA",
          "symbol": "MIOTA",
          "rank": "8",
          "price_usd": "0.869439",
          "price_btc": "0.00018342",
          "24h_volume_usd": "13431800.0",
          "market_cap_usd": "2416632030.0",
          "available_supply": "2779530283.0",
          "total_supply": "2779530283.0",
          "percent_change_1h": "1.05",
          "percent_change_24h": "0.58",
          "percent_change_7d": "0.75",
          "last_updated": "1504213792",
          "price_eur": "0.7318189784",
          "24h_volume_eur": "11305734.1052",
          "market_cap_eur": "2034113012.0"
      },
      {
          "id": "monero",
          "name": "Monero",
          "symbol": "XMR",
          "rank": "9",
          "price_usd": "140.252",
          "price_btc": "0.029588",
          "24h_volume_usd": "139907000.0",
          "market_cap_usd": "2106159899.0",
          "available_supply": "15016969.0",
          "total_supply": "15016969.0",
          "percent_change_1h": "0.28",
          "percent_change_24h": "7.99",
          "percent_change_7d": "64.66",
          "last_updated": "1504213751",
          "price_eur": "118.052071928",
          "24h_volume_eur": "117761680.598",
          "market_cap_eur": "1772784273.0"
      },
      {
          "id": "neo",
          "name": "NEO",
          "symbol": "NEO",
          "rank": "10",
          "price_usd": "33.025",
          "price_btc": "0.00696707",
          "24h_volume_usd": "52047700.0",
          "market_cap_usd": "1651250000.0",
          "available_supply": "50000000.0",
          "total_supply": "100000000.0",
          "percent_change_1h": "0.28",
          "percent_change_24h": "-2.99",
          "percent_change_7d": "-19.88",
          "last_updated": "1504213775",
          "price_eur": "27.79760485",
          "24h_volume_eur": "43809277.7578",
          "market_cap_eur": "1389880243.0"
      }
  ];

  mainWindow.webContents.send('cmcccurrencies', cmcCurrencies);
  //event.sender.send(‘manipulatedData’, manData);
});
/*
coinmarketcap.on("BTC", (coin) => {
  console.log(coin);
});
coinmarketcap.on("NEO", (coin) => {
  console.log(coin);
});
*/
//setInterval(function () { mainWindow.webContents.send('blabla', {bla: 'blaaaa'}); },5000);
/*
bittrex.getmarkethistory({ market : 'BTC-NEO' }, function( data, err ) {
  mainWindow.webContents.send('bittrex-hist', data.result);
  //console.log( data.result );
});

var websocketsclient = bittrex.websockets.subscribe(['BTC-NEO'], function(data) {
  if (data.M === 'updateExchangeState') {
    data.A.forEach(function(data_for) {
      mainWindow.webContents.send('bittrex', data_for);
      
    //console.log('Market Update for '+ data_for.MarketName, data_for);
    });
  } else {
    console.log(data);
  } 
});
*/



