/*
    Copyright (c) 2018 Iain Lawrie, all rights reserved
    See LICENSE file for more info
*/

/*
  global
*/

// <region> *** init vars ***
// const path = require('path')
// const { remote, ipcRenderer } = require('electron')

// const log = require('electron-log')

// const ziceRpc = require('bluebird').promisifyAll(require('node-bitcoin-rpc'))
// ziceRpc.init('localhost', '18232', 'ziceuser', 'zicepass')

// const sqlite3 = require('sqlite3-promise')
//const db = new sqlite3.Database(':memory')
// let dbFile = path.join(remote.app.getAppPath(), 'wallet.db')
let dbFile = '/home/iain/Desktop/wallet.db'
console.log(dbFile)
// const db = new sqlite3.Database(dbFile)

// const main = remote.require('./main.js')

// process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1'

const debug = true
let isElectron = false
let startUp = true
let accountTable
let opidTable
let zListAddresses

// </region> *** init vars ***

if (window.document.title === 'Zclassic Info') appEntry()

// <region> *** misc functions ***
async function appEntry () {

  // zListAddresses = (await rpcAsync('z_listaddresses', [])).result
  //
  // opidTable = await initTable(tableDef('opid'))
  //
  // accountTable = await initTable(tableDef('account'))
  //
  // // set up some global things
  // remote.getGlobal('shared').mapAddressAll = accountTable
  // console.log(remote.getGlobal('shared').mapAddressAll)
  //
  // // update balance from blockchain
  // for (let row of remote.getGlobal('shared').mapAddressAll) {
  //   console.log(row.address)
  //   await updateBalance(row.address)
  // }
  //
  // // filter out the hidden accounts
  // remote.getGlobal('shared').mapAddress = accountTable.filter(obj => obj.visibility > 0)
  // log.info('\n' + unixToDate(Date.now() / 1000) + ' *** remote.getGlobal("shared").mapAddress ***')
  // log.info(remote.getGlobal('shared').mapAddress)
  //
  // var globalTable = await initTable(tableDef('global'))
  //
  // if (debug) console.log(opidTable)
  // var recipientTable = await initTable(tableDef('recipient'))
  // await setRecipientList()
  // if (debug) console.log(remote.getGlobal('shared').recipientList)
  // if (debug) console.log(recipientTable)
  // remote.getGlobal('shared').showHidden = globalTable[0].showhidden
  // if (debug) console.log(remote.getGlobal('shared').showHidden)
  // setPolls()
  //
  // if (window.document.title === 'Zclassic Info') ipcRenderer.send('winSplash_close')// closes the splash screen window
}

function unixToDate (unixTimestamp) {
  var a = new Date(unixTimestamp * 1000)
  // var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var year = a.getFullYear()
  // var monthA = months[a.getMonth()]
  var month = a.getMonth() + 1
  if (month < 10) { month = '0' + month }
  var date = a.getDate()
  if (date < 10) { date = '0' + date }
  var hour = a.getHours()
  if (hour < 10) { hour = '0' + hour }
  var min = a.getMinutes()
  if (min < 10) { min = '0' + min }
  var sec = a.getSeconds()
  if (sec < 10) { sec = '0' + sec }
  // var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
  // var time = date + ' ' + month + ' ' + year
  let time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec
  return time
}
// </region> ^^^ misc functions ^^^

// <region> *** polling functions ***
function setPolls () {
  for (let account of accountTable) {
    setInterval(function () { updateDbZListReceivedBy('opid', account.address, account.start_time) }, 10000)
  }
}

// interval is how often to poll
// timeout is how long to poll waiting for a result (0 means try forever)
// url is the URL to request
function pollUntilDone (opid, interval, timeout) {
  let start = Date.now()
  function run () {
    return ziceRpc.callAsync('z_getoperationstatus', [[opid]], (err, res) => {
      if (err !== null) console.log(err)
      if (res.result[0].status === 'success') {
        console.log(res)
        zGetOperationStatus(opid)
        // we know we're done here, return from here whatever you
        // want the final resolved value of the promise to be
        return res
      } else {
        if (timeout !== 0 && Date.now() - start > timeout) {
          throw new Error('timeout error on pollUntilDone')
        } else {
          // run again with a short delay
          return delay(interval).then(run)
        }
      }
    })
  }
  return run()
}

// poll for received txs and add to opid table
async function updateDbZListReceivedBy (table, address, startTime) {
  let zListReceivedBy = []
  zListReceivedBy.length = 0
  let acceptedTxs = []
  acceptedTxs.length = 0
  let opidTx = []
  opidTx.length = 0

  let temp = (await rpcAsync('z_listreceivedbyaddress', [address])).result
  zListReceivedBy = temp.filter(row => row.change === false)

  for (let element of zListReceivedBy) {
    opidTx = opidTable.filter(row => row.txid === element.txid)

    if (opidTx.length > 0) {
      let exists = false
      opidTx.forEach((rba) => {
        if (rba.method === 'z_listreceivedbyaddress') exists = true
      })
      console.log(exists)
      if (!exists) {
        for (let element of opidTx) {
          let zGetTime = (await rpcAsync('gettransaction', [element.txid])).result
          console.log(zGetTime)
          if (zGetTime.time > startTime) {
            acceptedTxs.push([ zGetTime.time, '"z_listreceivedbyaddress"', '"' + address + '"', element.amount, '""', '"' + element.txid + '"', '"success"' ])
            let obj = {}
            obj.creation_time = zGetTime.time
            obj.method = 'z_listreceivedbyaddress'
            obj.toaddress = address
            obj.amount = element.amount
            obj.fromaddress = ''
            obj.txid = element.txid
            obj.status = 'success'
            opidTable.push(obj)
            acceptedTxs.push(obj)
          }
        }
        console.log(acceptedTxs)
        // if (acceptedTxs.length > 0) {
        //   iRows(table, acceptedTxs)
        // }
      }
    } else { // not found in opid table - need to check timestamp to see if it needs added
      let zGetTx = (await rpcAsync('gettransaction', [element.txid])).result
      console.log(zGetTx)
      if (zGetTx.time > startTime) {
        acceptedTxs.push([ zGetTx.time, '"z_listreceivedbyaddress"', '"' + address + '"', element.amount, '""', '"' + element.txid + '"', '"success"' ])
        let obj = {}
        obj.creation_time = zGetTx.time
        obj.method = 'z_listreceivedbyaddress'
        obj.toaddress = address
        obj.amount = element.amount
        obj.fromaddress = ''
        obj.txid = element.txid
        obj.status = 'success'
        opidTable.push(obj)
        acceptedTxs.push(obj)
        // iRows(table, acceptedTxs)
      }
    }
    if (acceptedTxs.length > 0) {
      insertRows(table, acceptedTxs)
    }
  }
}
// </region> ^^^ polling functions ^^^

// <region> *** rpc functions ***
function rpcAsync (command, params) {
  // var res = ziceRpc.callAsync(command, params)
  // return res
}

function delay (t) {
  return new Promise(function (resolve) {
    setTimeout(resolve, t)
  })
}

function zGetOperationStatus (opid) {
  ziceRpc.callAsync('z_getoperationstatus', [[opid]], (err, res) => {
    if (err !== null) console.log(err)
    else {
      // console.log(res)
      var params = []
      params.push('"' + res.result[0].creation_time + '"')
      params.push('"' + res.result[0].method + '"')
      params.push('"' + res.result[0].params.amounts[0].address + '"')
      params.push('"' + res.result[0].params.amounts[0].amount + '"')
      params.push('"' + res.result[0].params.fromaddress + '"')
      params.push('"' + res.result[0].result.txid + '"')
      params.push('"' + res.result[0].status + '"')
      console.log(params)

      insertOpidTable(params)
    }
  })
}

async function updateBalance (address) {
  let params = {}
  // let obj = remote.getGlobal('shared').mapAddress.find(x => x.address === address)
  var balance = (await rpcAsync('z_getbalance', [address])).result
  // update balance in mapAddressAll
  address.balance = balance
  // update balance in db
  params.balance = balance
  updateAccountTable(address, params)
}

// </region> *** rpc functions ***

// <region> *** db functions ***

// <region> *** table defs ***
function tableDef (table) {
  var tableDef = {
    'global': function () {
      return {
        name: 'global',
        columns: [
          { name: 'showhidden', type: 'BOOLEAN', value: 1 }
        ]
      }
    },
    'account': function () {
      return {
        name: 'account',
        columns: [
          { name: 'start_time', type: 'INTEGER' },
          { name: 'address', type: 'TEXT' },
          { name: 'account', type: 'TEXT' },
          { name: 'visibility', type: 'BOOLEAN' },
          { name: 'balance', type: 'REAL' }
        ]
      }
    },
    'opid': function () {
      return {
        name: 'opid',
        columns: [
          { name: 'creation_time', type: 'INTEGER' },
          { name: 'method', type: 'TEXT' },
          { name: 'toaddress', type: 'TEXT' },
          { name: 'amount', type: 'REAL' },
          { name: 'fromaddress', type: 'TEXT' },
          { name: 'txid', type: 'TEXT' },
          { name: 'status', type: 'TEXT' }
        ]
      }
    },
    'recipient': function () {
      return {
        name: 'recipient',
        columns: [
          { name: 'name', type: 'TEXT' },
          { name: 'address', type: 'TEXT' },
          { name: 'memo', type: 'TEXT' }
        ]
      }
    },
    'test': function () {
      return {
        name: 'test',
        columns: [
          { name: 'address', type: 'TEXT', value: 'z-addr' },
          { name: 'account', type: 'TEXT', value: 'Current Account' },
          { name: 'visibility', type: 'BOOLEAN', value: 1 },
          { name: 'balance', type: 'REAL', value: 17.6 }
        ]
      }
    },
    'testnovalues': function () {
      return {
        name: 'testnovalues',
        columns: [
          { name: 'address', type: 'TEXT' },
          { name: 'account', type: 'TEXT' },
          { name: 'visibility', type: 'BOOLEAN' },
          { name: 'balance', type: 'REAL' }
        ]
      }
    }
  }
  return (tableDef[table])()
}
// </region> ^^^ table defs ^^^

// <region> *** initialise table ***
async function initTable (tableDef) {
  try {
    var retVal = []
    // check for existence of table
    var rows = await db.allAsync('SELECT count(*) FROM sqlite_master WHERE type="table" AND name=?', [tableDef.name])
    console.log(rows)

    // value will be '0' if table doesn't exist
    if (Object.values(rows[0])[0] === 0) {
      var doInsert = false
      var createSql = 'CREATE TABLE IF NOT EXISTS "' + tableDef.name + '" ('
      var insertSql = 'INSERT INTO "' + tableDef.name + '" VALUES ('
      tableDef.columns.forEach((column, index) => {
        createSql += column.name + ' ' + column.type + ','
        // note: needs to either have a value in every column in tableDef
        // or the value should be absent from every column
        if (column.value) {
          doInsert = true
          insertSql += '"' + column.value + '",'
        }
      })
      createSql = createSql.replace(/.$/, ')')
      log.info('\n' + unixToDate(Date.now() / 1000) + ' *** createSql ***' + tableDef.name)
      log.info(createSql)

      await db.runAsync(createSql)

      if (doInsert) {
        // this populates the table from values in tableDef
        insertSql = insertSql.replace(/.$/, ')')
        log.info('\n' + unixToDate(Date.now() / 1000) + ' *** insertSql ***' + tableDef.name)
        log.info(insertSql)

        await db.run(insertSql)
        retVal = await db.allAsync('SELECT * FROM "' + tableDef.name + '"')
      } else {
        // this populates the table from an alternate source and returns the rows
        retVal = await populateTable(tableDef.name)
        // log.info('\n' + unixToDate(Date.now() / 1000) + ' *** initTable populate ***' + tableDef.name)
        // log.info(retVal)
      }
    } else {
      retVal = await db.allAsync('SELECT * FROM "' + tableDef.name + '"')
      // log.info('\n' + unixToDate(Date.now() / 1000) + ' *** initTable exists ***' + tableDef.name)
      // log.info(retVal)
    }
    log.info('\n' + unixToDate(Date.now() / 1000) + ' *** ' + tableDef.name + ' ***')
    log.info(retVal)

    return retVal
  } catch (e) {
    console.log(e)
  }
}
// </region> ^^^ initialise table ^^^

// <region> *** populate table ***
async function populateTable (table) {
  console.log(table)
  var popDef = {
    'account': async function () {
      let retVal = await populateAccountTable(table)
      return retVal
    },
    'recipient': () => { return [] },
    // this populates table with current balance as a starting point
    // as currently there is no easy way to get previous sent transactions from sapling
    'opid': async function () {
      let retVal = await populateOpidTable(table)
      return retVal
    }
  }
  let tablePopulate = await popDef[table]()
  // log.info('\n' + unixToDate(Date.now() / 1000) + ' *** tablePopulate - ' + table + ' ***')
  // log.info(tablePopulate)
  return tablePopulate
}
// </region> ^^^ populate table ^^^

// <region> *** select ***
async function populateAccountTable (table) {
  try {
    let rows = []
    let now = Math.floor(Date.now() / 1000)
    // needs to compare rows with connected node zListAddresses
    log.info('\n' + unixToDate(Date.now() / 1000) + ' *** zListAddresses ***')
    log.info(zListAddresses)

    // if no node addresses then clear all existing, create one and add to db
    if (zListAddresses.length <= 0) {
      log.info('\n' + unixToDate(Date.now() / 1000) + ' *** no node addresses found ***')
      console.log('zListAddresses.length <= 0')
      await truncateTable(table)
      var newAddress = (await rpcAsync('z_getnewaddress', ['sapling'])).result
      await iRows(table, ['"' + newAddress + '", "New Account", "1", "0"'])
      console.log(newAddress)
    } else {
      // fetch all existing addresses in database
      rows = await db.allAsync('SELECT * FROM account WHERE visibility > -1')
      log.info('\n' + unixToDate(Date.now() / 1000) + ' *** existing addresses in db ***')
      log.info(rows)

      // check that db addresses are in wallet - remove any invalid addresses
      for (let element of rows) {
        let foundMatch = zListAddresses.find(address => address === element.address)
        if (typeof foundMatch === 'undefined') {
          let obj = {}
          obj.column = 'address'
          obj.value = element.address
          deleteRows(table, obj)
        }
      }

      // check for any addresses in local wallet not in db and add those
      for (let address of zListAddresses) {
        var addMatch = rows.find(row => row.address === address)
        if (typeof addMatch === 'undefined') {
          // identified transaction not in transactionArray
          console.log(address)
          var obj = {}
          obj.address = address
          obj.account = 'found account'
          obj.visibility = 1
          obj.balance = (await rpcAsync('z_getbalance', [address])).result
          rows.push(obj)

          log.info('\n' + unixToDate(Date.now() / 1000) + ' *** existing node addresses not in db - ***')
          log.info(rows)

          await iRows(table, ['"' + now + '", "' + address + '", "found account", "1", "' + obj.balance + '"'])
        }
      }
    }
    return rows
  } catch (e) {
    console.log(e)
  }
}

async function populateOpidTable (table) {
  let rows = []
  let now = Math.floor(Date.now() / 1000)
  // let zListReceivedBy = []

  console.log(now)
  for (var address of zListAddresses) {
    if (address.indexOf('ztestsapling') === 0) {
      let zGetBalance = (await rpcAsync('z_getbalance', [address])).result
      let obj = {
        creation_time: now,
        method: 'z_getbalance',
        toaddress: address,
        amount: zGetBalance,
        fromaddress: '',
        txid: '',
        status: 'success'
      }
      rows.push(obj)
    }
  }

  // this adds anything received by the address after the start time
  // of the wallet
  // (currently irrelevant as the start time is when this is run)
  // needs changed over to poll method instead
  // let temp = (await rpcAsync('z_listreceivedbyaddress', [address])).result
  // zListReceivedBy = temp.filter(row => row.change === false)
  // log.info('\n' + unixToDate(Date.now() / 1000) + ' *** zListReceivedBy Opid ***')
  // log.info(zListReceivedBy)
  //
  // for (let element of zListReceivedBy) {
  //   let zGetTime = (await rpcAsync('gettransaction', [element.txid])).result
  //   console.log(zGetTime)
  //   let zTime = Math.floor(zGetTime.time / 1000)
  //   if (zTime > now) {
  //     let obj = {}
  //     obj.creation_time = now
  //     obj.method = 'z_listreceivedbyaddress'
  //     obj.toaddress = address
  //     obj.amount = element.amount
  //     obj.fromaddress = ''
  //     obj.txid = element.txid
  //     obj.status = 'success'
  //     // let obj = [now, '"z_listreceivedbyaddress", "' + address + '", ' + received.amount + ', "", "", "success"']
  //     rows.push(obj)
  //   }
  // }
  // console.log(rows)
  // log.info('\n' + unixToDate(Date.now() / 1000) + ' *** populate opid table ***')
  // log.info(rows)
  insertRows(table, rows)

  return rows
}

async function setRecipientList () {
  try {
    var rows = await db.allAsync('SELECT * FROM recipient')
    remote.getGlobal('shared').recipientList = rows
  } catch (e) {
    console.log(e)
  }
}
// </region> ^^^ select ^^^

// <region> *** insert ***
function iRows (table, rows) {
  var sql = 'INSERT INTO "' + table + '" VALUES '
  rows.forEach((row, index) => {
    sql += '(' + row + '),'
  })
  sql = sql.replace(/.$/, '')
  // console.log(sql)
  console.log(sql)
  log.info('\n' + unixToDate(Date.now() / 1000) + ' *** insert rows ' + table + ' ***')
  log.info(sql)
  db.run(sql)

  // const cols = Object.keys(obj).join(', ')
  // const placeholders = Object.keys(obj).fill('?').join(', ')
  // db.run('INSERT INTO ' + table + ' (' + cols + ') VALUES (' + placeholders + ')', Object.values(obj))
}

async function insertRows (table, rows) {
  let sql = 'INSERT INTO ' + table + ' VALUES '

  rows.forEach((row, index) => {
    if (index > 0) sql += ', '
    sql += '("' + Object.values(row).join('", "') + '")'
  })

  // log.info('\n' + unixToDate(Date.now() / 1000) + ' *** insert rows ' + table + ' ***')
  // log.info(sql)

  await db.run(sql)
}

function insertValues (table, values) {
  var sql = 'INSERT INTO "' + table + '" VALUES ('
  values.forEach((value, index) => {
    sql += value + ','
    if (index >= values.length - 1) {
      sql = sql.replace(/.$/, ')')
    }
  })

  console.log(sql)
  db.run(sql)
  db.close()
}

function insertOpidTable (params) {
  var sql

  sql = 'INSERT INTO opid ('
  sql += '  creation_time,'
  sql += '  method,'
  sql += '  toaddress,'
  sql += '  amount,'
  sql += '  fromaddress,'
  sql += '  txid,'
  sql += '  status)'
  sql += 'VALUES ('

  params.forEach((value, index) => {
    console.log(value)
    sql += value + ','
    if (index >= params.length - 1) {
      sql = sql.replace(/.$/, ')')
    }
  })

  console.log(sql)
  db.run(sql)
}
// </region> ^^^ insert ^^^

// <region> *** delete ***
function deleteRows (table, params) {
  var sql = 'DELETE FROM ' + table +
    ' WHERE "' + params.column + '" = "' + params.value + '"'

  console.log(sql)
  db.run(sql)
}

function truncateTable (table) {
  var sql = 'DELETE FROM ' + table

  console.log(sql)
  db.run(sql)
}
// </region> ^^^ delete ^^^

// <region> *** update ***
function updateAccountTable (address, params) {
  var sql

  sql = 'UPDATE account\n'
  sql += ' SET '

  Object.keys(params).forEach((obj, index) => {
    sql += Object.keys(params)[index] + ' = ' + Object.values(params)[index] + ','
    if (index >= Object.keys(params).length - 1) {
      sql = sql.replace(/.$/, '')
    }
    sql += '\n'
  })
  sql += ' WHERE address = "' + address + '"'

  console.log(sql)
  db.run(sql)
}
// </region> ^^^ update ^^^

// </region> ^^^ db functions ^^^

// <region> *** helper functions ***
function numberWithCommas (x) {
  var parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

function setElementValue (element, value) {
  var el = $('#' + element)
  if (el.text() === value) return
  el.text(value)
}

function JSON_fromString (json) {
  var ret = {}
  try { ret = JSON.parse(json) } catch (e) { console.log(e) }
  return ret
}

function nFormat (n, precision, strip) {
  // console.log(typeof parseFloat(n))
  // console.log(typeof 18240836.0)
  if (!precision) precision = 0
  n = parseFloat(n)
  console.log(n.toLocaleString('en'))
  if (precision === 0) {
    return n.toLocaleString('en', {maximumSignificantDigits: 21})
  } else {
    return n.toFixed(precision)
  }
  //  if (strip && precision > 0) n = n.replace(/0+$/, "").replace(/[.]$/, "");
  //   n=parseFloat(n);
}

function msg (s) {
  if (s === '') $('#msg').html('').hide()
  else $('#msg').text(s).show()
}

function settext (element, t) {
  var el = $('#' + element)
  if (el.text() === t) return
  el.text(t)
}

function setHtml (element, h) {
  var el = $('#' + element)
  if (el.data('rawhtml') === h) return
  el.html(h)
  el.data('rawhtml', h)
}

function setcolour (element, c) {
  var el = $('#' + element)
  if (el.css('color') === c) return
  el.css('color', c)
}

function date(t) {
  var d = new Date(t * 1000)
  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return isNaN(d.getDate()) ? '' : d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear()
  // return d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear()
}

function time (t) {
  var d = new Date(t * 1000)
  var h = '0' + d.getHours() % 24
  // var h = isNaN(d.getHours()) ? ".." : "0" + d.getHours() % 24;
  var m = '0' + d.getMinutes()
  // var m = isNaN(d.getMinutes()) ? ".." : "0" + d.getMinutes();
  var s = '0' + d.getSeconds()
  // var s = isNaN(d.getSeconds()) ? ".." : "0" + d.getSeconds();
  return isNaN(s) ? 'pending' : rtrunc(h) + ':' + rtrunc(m) + ':' + rtrunc(s)
  // return rtrunc(h) + ":" + rtrunc(m) + ":" + rtrunc(s);
}

function rtrunc (t) {
  return t.substr(t.length - 2)
}

function parseMilliseconds (milliseconds) {
  // Get hours from milliseconds
  var hours = milliseconds / (1000 * 60 * 60)
  var absoluteHours = Math.floor(hours)
  var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours

  // Get remainder from hours and convert to minutes
  var minutes = (hours - absoluteHours) * 60
  var absoluteMinutes = Math.floor(minutes)
  var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes

  // Get remainder from minutes and convert to seconds
  var seconds = (minutes - absoluteMinutes) * 60
  var absoluteSeconds = Math.floor(seconds)
  var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds

  return h + ':' + m + ':' + s
}

function download_progress (file, size, bytes) {
  $('#progressbar').css('width', Math.ceil(bytes / size * 100) + '%')
}
// </region> *** helper functions ***
