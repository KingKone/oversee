'use strict'
const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const ipcMain = require('electron').ipcMain
const request = require('request')
const mysql = require('mysql')

var connection = mysql.createConnection({
    host     : '...',
    user     : '...',
    password : '...',
    database : '...',
    multipleStatements: false
  })

let mainWindow

let dev = false
if ( process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath) ) {
  dev = true
}

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1500, height: 800, show: false, frame: true })
  mainWindow.webContents.on('did-finish-load',() => {
    mainWindow.setTitle('Oversee - Proof of Concept')
  })

  let indexPath
  if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    })
  }
  mainWindow.loadURL( indexPath )

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    getData()
    if ( dev ) {
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.on('closed', function() {
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
// --------------------------------------------------------------------- sortData
const EventEmitter = require('events')
const mainEv = new EventEmitter()
let openQrys = 0
let compQrys = 0
let sortedData = []
let sortTemp = []
mainEv.on('sortData', (arg) => {
  mainWindow.webContents.send('sortData',arg)
  console.log(arg.tab + ': ' + arg.status)
  if (arg.status == 'qry') openQrys++
  if (arg.status == 'ok') compQrys++
  if (openQrys == compQrys) {
    mainWindow.webContents.send('sortData',{tab: 'all qrys', status:'ok'})
    sectors.forEach((se) => {
      if (se.psec == null) {
        let temp = se
        temp.items = []
        sortedData[se.id] = temp
      }
    })
    sectors.forEach((se) => {
      if (Number.isInteger(se.psec)) {
        let temp = se
        temp.items = []
        sortedData[se.psec].items[se.id] = temp
      }
    })
    let sortedin = []
    cusec.forEach((cs) => {
      if (Number.isInteger( sectors[cs.secid].psec) && cuinfo[cmcCurrencies[cs.cuid].ident] != null ) {
       let temp = cmcCurrencies[cs.cuid]
        temp.price_usd = cuinfo[temp.ident].price_usd
        temp.market_cap_usd = cuinfo[temp.ident].market_cap_usd 
        temp['24h_volume_usd'] = cuinfo[temp.ident]['24h_volume_usd']
        temp.percent_change_24h = cuinfo[temp.ident].percent_change_24h
        temp.rank = cuinfo[temp.ident].rank
        temp.sector = [sectors[cs.secid].psec, cs.secid]
        sortedData[sectors[cs.secid].psec].items[cs.secid].items.push(temp)
        sortedin[cs.cuid] = 1
      }
    })
    cusec.forEach((cs) => {
      if (sectors[cs.secid].psec == null && sortedin[cs.cuid] != 1 && cuinfo[cmcCurrencies[cs.cuid].ident] != null)  {
        let temp = cmcCurrencies[cs.cuid]
        if(cuinfo[temp.ident]) {
          temp.price_usd = cuinfo[temp.ident].price_usd
          temp.market_cap_usd = cuinfo[temp.ident].market_cap_usd
          temp['24h_volume_usd'] = cuinfo[temp.ident]['24h_volume_usd']
          temp.percent_change_24h = cuinfo[temp.ident].percent_change_24h
          temp.rank = cuinfo[temp.ident].rank
          temp.sector = cs.secid
        }
        sortedData[cs.secid].items.push(temp)
      }
    })
    console.log(sortedData)
    mainWindow.webContents.send('sortDataOK',sortedData)
    
    openQrys = 0
    compQrys = 0
    dataRun = false
  }
})
// --------------------------------------------------------------------- getData
let cmcCurrencies = []
let cuinfo = {}
let cusec = []
let sectors = []
let secgrp = []
let secgroups = []
let dataRun = false
function getData() {
  if (!dataRun) {
    dataRun = true
    let qry = "SELECT * FROM currencies"
    mainEv.emit('sortData',{tab: 'currencies', status:'qry'})
    connection.query(qry, function (error, results, fields) {
      if (error) throw error
      results.forEach((result) => {
        cmcCurrencies[result.id] = {
          id: result.id,  
          ident: result.ident,  
          name: result.name,
          symbol: result.symbol          
        }
      })
      mainEv.emit('sortData',{tab: 'currencies', status:'ok'})
    })
    qry = "SELECT * FROM cuinfo"
    mainEv.emit('sortData',{tab: 'cuinfo', status:'qry'})
    connection.query(qry, function (error, results, fields) {
      if (error) throw error
      cuinfo = results

      results.forEach((result) => {
        cuinfo[result.ident] = {
          price_usd: result.price_usd,  
          market_cap_usd: result.market_cap_usd,  
          '24h_volume_usd': result['24h_volume_usd'],
          percent_change_24h: result.percent_change_24h,
          rank: result.rank         
        }
      })
      mainEv.emit('sortData',{tab: 'cuinfo', status:'ok'})
    })
    qry = "SELECT * FROM cusec"
    mainEv.emit('sortData',{tab: 'cusec', status:'qry'})
    connection.query(qry, function (error, results, fields) {
      if (error) throw error
      cusec = results
      mainEv.emit('sortData',{tab: 'cusec', status:'ok'})
    })
    qry = "SELECT * FROM sectors"
    mainEv.emit('sortData',{tab: 'sectors', status:'qry'})
    connection.query(qry, function (error, results, fields) {
      if (error) throw error
      results.forEach((result) => {
        sectors[result.id] = {
          id: result.id,  
          ident: result.ident,  
          name: result.name,
          note: result.note,
          rank: result.rank,
          psec: result.psec
        }
      })
      mainEv.emit('sortData',{tab: 'sectors', status:'ok'})
    })
    qry = "SELECT * FROM secgrp"
    mainEv.emit('sortData',{tab: 'secgrp', status:'qry'})
    connection.query(qry, function (error, results, fields) {
      if (error) throw error
      secgrp = results
      mainEv.emit('sortData',{tab: 'secgrp', status:'ok'})
    })
    qry = "SELECT * FROM secgroups ORDER BY prio"
    mainEv.emit('sortData',{tab: 'secgroups', status:'qry'})
    connection.query(qry, function (error, results, fields) {
      if (error) throw error
      results.forEach((result) => {
        secgroups[result.id] = {
          id: result.id,  
          ident: result.ident,  
          name: result.name,
          note: result.note,
          prio: result.prio
        }
      })
      
      mainEv.emit('sortData',{tab: 'secgroups', status:'ok'})
    })
  }
}

ipcMain.on('cmc-go', function(event, arg) {
  if (sortedData.length > 0) {
    mainWindow.webContents.send('sortDataOK',sortedData)
  } else {
    getData()
  }
})

ipcMain.on('newSector', function(event, arg) {

  let temp = String(arg[1])
  temp = temp.replace(/(?!\w)./g, '').toLowerCase()
  let qry = "INSERT INTO sectors (ident,name,psec,prio) VALUES (?)"
  
  connection.query(qry, [[temp,arg[1],arg[0],2]], function (error, results, fields) {
    if (error) throw error
    sortedData[arg[0]].items.unshift({
      id: results.insertId,  
      ident: temp,  
      items: [],
      name: arg[1],
      note: '',
      rank: '',
      psec: arg[0]
    })
    mainWindow.webContents.send('sortDataOK',sortedData)
  })

})

ipcMain.on('moveItem', function(event, fromTo) {
  if (!Array.isArray(fromTo[0])) {
    let index = null
    let sec = null
    let newsec = null;
    sortedData.forEach((cd, i ) => {
      if (cd.id == fromTo[0]) cd.items.forEach((item,idx) => {
        if (item.id == fromTo[2]) {
          index = idx
          sec = i
        }
      })
    })
    sortedData.forEach((cd, i ) => {
      if (cd.id == fromTo[1][0]) cd.items.forEach((item,idx) => {
        if (item.id == fromTo[1][1] && sortedData[i].items[idx].items) {
          sortedData[i].items[idx].items.push(sortedData[sec].items[index])
          
          newsec = item.id;
        }
      })
    })
    sortedData[sec].items.splice(index,1)

    //cusec.forEach((cs, i) => {  })

    let qry = "INSERT INTO cusec (secid,cuid) VALUES (" + newsec + "," + fromTo[2] + ")"
    
    connection.query(qry, function (error, results, fields) {
      if (error) throw error
      console.log('ok')
    })

  } else {
    let index = null
    let sec = null
    let newsec = null;
    sortedData.forEach((cd, i ) => {
      if (cd.id == fromTo[0][0]) cd.items.forEach((item,idx) => {
        if (Array.isArray(item.items) && item.id == fromTo[0][1]) item.items.forEach((subitem,indx) => {
          if (subitem.id == fromTo[2]) {
            index = indx
            sec = [i,idx]
          }
        })
      })
    })
    
    sortedData.forEach((cd, i ) => {
      if (Array.isArray(cd.items) && cd.id == fromTo[1][0]) cd.items.forEach((item,idx) => {
        if (Array.isArray(item.items) && item.id == fromTo[1][1] && sortedData[i].items[idx].items) {
          let temp = sortedData[sec[0]].items[sec[1]].items[index]
          temp.sector=[cd.id,item.id]
          sortedData[i].items[idx].items.push(temp)
          newsec = item.id;
  
        }
      })
    })
    sortedData[sec[0]].items[sec[1]].items.splice(index,1)
    let qry = "UPDATE cusec SET secid=?, cuid=? WHERE secid = ? AND cuid = ?"
    
    connection.query(qry,[[newsec],[fromTo[2]],[fromTo[0][1]],[fromTo[2]]], function (error, results, fields) {
      if (error) throw error
      console.log('ok')
    })


  }
})
// --------------------------------------------------------------------- cmc 

/* const bittrex = require('node.bittrex.api')
bittrex.options({
  'apikey' : '...',
  'apisecret' : '... ', 
})
var CoinMarketCap = require("node-coinmarketcap")
var options = {
  events: true, // Enable event system
  refresh: 120, // Refresh time in seconds (Default: 60)
  convert: "EUR" // Convert price to different currencies. (Default USD)
}
var coinmarketcap = new CoinMarketCap(options)
*/

/*
let cmcCurrencies = []
let cmcTikcker = []
let cmcCurrencies2 = []

ipcMain.on('cmc-go', function(event, arg) {
  if (cmcCurrencies2.length > 0) {
    mainWindow.webContents.send('cmcccurrencies', cmcCurrencies2)
  } else {
    cmcCurrencies2 = [{category:'currency', name:'Currencies', market_cap_usd:'', volume_24h_usd:'', data:[]}, {category:'asset', name:'Assets', market_cap_usd:'', volume_24h_usd:'', data:[]}]
    let qry = "SELECT * FROM currencies"
    //let inserts = ['users', 'id', userId]
    //sql = mysql.format(sql, inserts)

    connection.query(qry, function (error, results, fields) {
      if (error) throw error
      cmcCurrencies = results
      
      let qry = "SELECT * FROM cuinfo"
      connection.query(qry, function (error, results, fields) {
        if (error) throw error
      
      
        let qry = "SELECT * FROM cuinfo"
        connection.query(qry, function (error, results, fields) {
          if (error) throw error
          
          cmcCurrencies.forEach(function (item, index) {
            for (var c = 0 c < results.length c++) {
              if (results[c].symbol == item.symbol) {
                //console.log(results[c].rank)
                let pos = {currency: 0, asset: 1}
                if (results[c].rank > 0) {
                  cmcCurrencies2[pos[item.category]].data.push({
                    ident: item.ident, 
                    name: item.name, 
                    symbol: item.symbol, 
                    category: item.category, 
                    rank: results[c].rank,
                    price_usd: results[c].price_usd,
                    price_btc: results[c].price_btc,
                    "24h_volume_usd": results[c]['24h_volume_usd'],
                    market_cap_usd: results[c].market_cap_usd,
                    available_supply: results[c].available_supply, 
                    total_supply: results[c].total_supply, 
                    percent_change_1h: results[c].percent_change_1h,
                    percent_change_24h: results[c].percent_change_24h,
                    percent_change_7d: results[c].percent_change_7d,
                    last_updated: results[c].last_updated
                  })
                  console.log(pos[item.category])
                  cmcCurrencies2[pos[item.category]].market_cap_usd = Number(cmcCurrencies2[pos[item.category]].market_cap_usd) + Number(results[c].market_cap_usd)
                  cmcCurrencies2[pos[item.category]].volume_24h_usd = Number(cmcCurrencies2[pos[item.category]].volume_24h_usd) + Number(results[c]['24h_volume_usd'])
                }

                break
              }
              
            } 
            
          })
          mainWindow.webContents.send('cmcccurrencies', cmcCurrencies2)
          
        })
      })
      //results.forEach(function (result) {console.log(result.insertId)})
      
    })
    
    
     
  }
   
  //event.sender.send(‘manipulatedData’, manData)
})
*/

/*
coinmarketcap.on("BTC", (coin) => {
  console.log(coin)
})
coinmarketcap.on("NEO", (coin) => {
  console.log(coin)
})
*/
//setInterval(function () { mainWindow.webContents.send('blabla', {bla: 'blaaaa'}) },5000)
/*
bittrex.getmarkethistory({ market : 'BTC-NEO' }, function( data, err ) {
  mainWindow.webContents.send('bittrex-hist', data.result)
  //console.log( data.result )
})

var websocketsclient = bittrex.websockets.subscribe(['BTC-NEO'], function(data) {
  if (data.M === 'updateExchangeState') {
    data.A.forEach(function(data_for) {
      mainWindow.webContents.send('bittrex', data_for)
      
    //console.log('Market Update for '+ data_for.MarketName, data_for)
    })
  } else {
    console.log(data)
  } 
})
*/



