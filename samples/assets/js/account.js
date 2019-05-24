// global.electron = require('electron');
// electron.webFrame.setZoomFactor(1.0);

$(function () {
//  setTimeout(winMainCreate, 1000)
  console.log('*** account.js ***')

  const remote = require('electron').remote
  const Menu = remote.Menu
  const MenuItem = remote.MenuItem

  var menu = new Menu()
  menu.append(new MenuItem({ label: 'MenuItem1', click: function () { console.log('item 1 clicked') } }))
  menu.append(new MenuItem({ type: 'separator' }))
  menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))

  window.addEventListener('contextmenu', (e) => {
    if (e.target.id === 'app-icon') {
      e.preventDefault()
      menu.popup(remote.getCurrentWindow())
    }
  }, false)

  $('.window-close').on('click', () => {
    window.close()
  })
})

function zGetNewAddress () {
  return new Promise((resolve, reject) => {
    ziceRpc.call('z_getnewaddress', ['sapling'], (err, res) => {
      if (err !== null) {
        console.log(err)
      } else {
        // console.log('*** getTransactionsFromZListUnspent ***')
        console.log(res)
        resolve(res)
      }
    })
  })
}

$('#btn_dialog_ok').click(async () => {
  console.log('*** btn_dialog_ok ***')
  console.log('*** zGetNewAddress - start ***')
  var newAddress = await zGetNewAddress()
  console.log('*** zGetNewAddress - finish ***')
  // console.log(res)
  var params = []
  params.push('"' + newAddress.result + '"')
  params.push('"' + 'Account Name' + '"')
  params.push('"' + '1' + '"')
  params.push('"' + '0' + '"')
  console.log(params)

  insertValues('account', params)
})

$('#btn_send_reset').click(() => {
  var alertDialog = new openDialog('Alert', 'Wallet has been backed up').alert()
  var confirmDialog = new openDialog('Confirm', 'Wallet has been backed up').confirm()
})
