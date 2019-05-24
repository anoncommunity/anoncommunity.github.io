// global.electron = require('electron');
// electron.webFrame.setZoomFactor(1.0);

$(function () {
//  setTimeout(winMainCreate, 1000)
  console.log('splash_start')

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
})

function winMainCreate () {
  main.winMain()
}

// return from dialog - params identifies the dialog
// this fires only when the 'ok'/'yes' button is selected
ipcRenderer.on('dialog_ok', function (event, params) {
  console.log(params)
  switch (params) {
    case 'Alert': {
      console.log('alert clicked')
      break
    }
    case 'Confirm': {
      console.log('confirm clicked')
      break
    }
  }
})

$('#btn_send_reset').click(() => {
  var alertDialog = new openDialog('Alert', 'Wallet has been backed up').alert()
  var confirmDialog = new openDialog('Confirm', 'Wallet has been backed up').confirm()
})
