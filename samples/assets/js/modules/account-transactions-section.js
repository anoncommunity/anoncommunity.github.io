/* global
  $
*/

let transactionsArray = []
let transactionsTable = []
let zListReceivedByNoOpid = []
let acceptedTxs = []
let balance
let accountStartTime

console.log('accounts-transaction-section.js')

accountsTransactionSectionInit()

// <region> *** accountsTransactionSectionInit ***
// this runs before section is loaded
// so updating elements from here won't work
// until section is loaded
function accountsTransactionSectionInit () {
//  walletSection.last_update.default(10000)
}
// </region> ^^^ accountsTransactionSectionInit ^^^

// <region> *** accountsTransactionSectionLoad ***
// runs every time section is loaded
function accountsTransactionSectionLoad () {
  console.log('*** accountsTransactionSectionLoad ***')
  console.log(opidTable)

  getValidTransactions()
  makeTransactionTable()
  //  fetchTransactions()
}
// </region> ^^^ accountsTransactionSectionLoad ^^^

function getValidTransactions () {
  transactionsArray.length = 0
  transactionsTable.length = 0
  acceptedTxs.length = 0

  log.info('\n' + unixToDate(Date.now() / 1000) + ' *** opidTable ***')
  log.info(opidTable)
  log.info('\n' + unixToDate(Date.now() / 1000) + ' *** activeTAccount ***')
  log.info(activeTAccount.substring(1))
  transactionsArray = opidTable.filter(row => (row.toaddress === activeTAccount.substring(1) && row.method != 'z_sendmany') || row.fromaddress == activeTAccount.substring(1))
  transactionsArray.sort(compare)
  log.info('\n' + unixToDate(Date.now() / 1000) + ' *** transactionsArray ***')
  log.info(transactionsArray)
  accountStartTime = (transactionsArray[0].creation_time)

  balance = 0
}

// this is taken only from entries in the db
// need to make sure db is up to date before calling this
// (needs to check z_listreceivedby as these are normally external txs into the
// local address and don't show up in the db unless polled)
function makeTransactionTable () {

  transactionsArray.forEach((element) => {
    var transactionsRow = {}

    transactionsRow.timestamp = element.creation_time
    transactionsRow.date = unixToDate(element.creation_time)
    transactionsRow.memo = 'memo'
//    transactionsRow.memo = (element.memo.indexOf('000' === 0)) ? '&nbsp;' : element.memo

    if (element.toaddress === activeTAccount.substring(1)) {
      balance += element.amount
      transactionsRow.in = element.amount
      transactionsRow.out = '&nbsp;'
    } else {
      // balance = element.amount
      balance -= element.amount
      transactionsRow.in = '&nbsp;'
      // transactionsRow.out = prevBalance - element.amount
      transactionsRow.out = element.amount
    }
    // prevBalance = balance
    transactionsRow.balance = balance
    transactionsTable.push(transactionsRow)
  })

  $('#myTable').DataTable({
    'data': transactionsTable,
    'columns': [
      { 'data': 'timestamp' },
      { 'data': 'date' },
      { 'data': 'memo' },
      { 'data': 'in' },
      { 'data': 'out' },
      { 'data': 'balance' }
    ],
    'columnDefs': [
      {
        'targets': 0,
        'className': 'dt-body-center'
      },
      {
        'targets': 1,
        'className': 'dt-body-center'
      },
      {
        'targets': 2,
        'className': 'dt-body-centert'
      },
      {
        'targets': 3,
        'className': 'dt-body-right'
      },
      {
        'targets': 4,
        'className': 'dt-body-right'
      },
      {
        'targets': 5,
        'className': 'dt-body-right'
      }
    ],
    'order': [[ 0, 'desc' ]]
  })
}

async function fetchTransactions () {
  console.log('*** fetchTransactions ***')
  transactionsArray.length = 0
  transactionsTable.length = 0

  // use this thing as a starting point -
  transactionsArray = (await rpcAsync('z_listreceivedbyaddress', [activeTAccount.substring(1)])).result
  console.log(transactionsArray)

  // get the amount info from the opid table
  transactionsArray.filter(row => row.outindex === 1).forEach(element => {
    // for testing - some txids have no entry as they were created
    // before the GUI wallet stored these in the db
    element.amount = 999 // need to calculate real value from balance and change?

    var opidTx = opidTable.find(row => row.txid == element.txid)
    if (typeof opidTx !== 'undefined') {
      if (opidTx.amount > 0) element.amount = opidTx.amount
    }
  })

transactionsArray.forEach(element => {
  var opidTx = opidTable.find(row => row.txid == element.txid)
  if (typeof opidTx !== 'undefined') {
    element.date = opidTx.creation_time
  }
})

  // await fetchTransactionTimes()
  //  await htmlAccountTransactions()

  // need to check the opid table for anything else, such as an exact note spend
  // odd things will only be in the from address - so a check for this active address
  // in the table with no matching transactions in the transactions array
  // should identify them

  opidTable.filter(row => row.fromaddress == activeTAccount.substring(1)).forEach(element => {
    var txMatch = transactionsArray.find(row => row.txid == element.txid)
    if (typeof txMatch === 'undefined') {
      // identified transaction not in transactionArray
      console.log(element)
      // need to add to transactions transactionArray

      element.change = false
      element.date = element.creation_time
      element.outindex = 1
      element.memo = '000'
      transactionsArray.push(element)
    }
  })

  transactionsArray.sort(compare)

  transactionsArray.forEach((element) => {
    if (debug) console.log(element)
  })

  // console.log(transactionsArray)


  var balance = 0
  // var prevBalance = 0

  transactionsArray.forEach((element) => {
    var transactionsRow = {}

    transactionsRow.timestamp = element.date
    transactionsRow.date = unixToDate(element.date)
    transactionsRow.memo = (element.memo.indexOf('000' === 0)) ? '&nbsp;' : element.memo

    if (element.outindex === 0) {
      balance += element.amount
      transactionsRow.in = element.amount
      transactionsRow.out = '&nbsp;'
    } else {
      // balance = element.amount
      balance -= element.amount
      transactionsRow.in = '&nbsp;'
      // transactionsRow.out = prevBalance - element.amount
      transactionsRow.out = element.amount
    }
    // prevBalance = balance
    transactionsRow.balance = balance
    transactionsTable.push(transactionsRow)
  })

  console.log(transactionsTable[0])
  console.log(transactionsTable)

  $('#myTable').DataTable({
    'data': transactionsTable,
    'columns': [
      { 'data': 'timestamp' },
      { 'data': 'date' },
      { 'data': 'memo' },
      { 'data': 'in' },
      { 'data': 'out' },
      { 'data': 'balance' }
    ],
    'columnDefs': [
      {
        'targets': 0,
        'className': 'dt-body-center'
      },
      {
        'targets': 1,
        'className': 'dt-body-center'
      },
      {
        'targets': 2,
        'className': 'dt-body-centert'
      },
      {
        'targets': 3,
        'className': 'dt-body-right'
      },
      {
        'targets': 4,
        'className': 'dt-body-right'
      },
      {
        'targets': 5,
        'className': 'dt-body-right'
      }
    ],
    'order': [[ 0, 'desc' ]]
  })
}

// redo this - should already have missing transaction times in opid table
function fetchTransactionTimes () {
  return new Promise(async (resolve, reject) => {
    for (var transaction of transactionsArray) {
      // console.log(transaction)
      var res = (await rpcAsync('gettransaction', [transaction.txid]).timeout(700)).result
      transaction.date = res.time
      console.log(transaction.date + ':' + res.time)
    }
    resolve()
  })
}

function compare (a, b) {
  if (a.creation_time < b.creation_time) {
    return -1
  }
  if (a.creation_time > b.creation_time) {
    return 1
  }
  return 0
}

function compareDate(a, b) {
  if (a.date < b.date) {
    return -1
  }
  if (a.date > b.date) {
    return 1
  }
  return 0
}
