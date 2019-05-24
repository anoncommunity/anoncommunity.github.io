/*
  global
  $
  ipcRenderer
  remote
*/

if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {
  isElectron = true
}

// console.log(process.versions)

// if (debug) console.log(remote.getGlobal('shared').mapAddressAll)

var currentFrame = ''
// var loaded = 'http://zice.biorec.org.uk/sections/overview-section'
var boolPinMenu = false
var boolTheme = false

var islJsNotLoaded = false

$('#btn-pin').click(() => { pinMenu() })
$('#btn-menu').click(() => { toggleNav() })
$('#btn-theme').click(() => { selectTheme() })
// $('#app-close').click(() => {
//   ipcRenderer.send('wallet_stop')
// })
// $('#app-min').click(() => { remote.getCurrentWindow().minimize() })
// $('#app-max').click(() => { remote.getCurrentWindow().maximize() })
// $('#app-restore').click(() => { remote.getCurrentWindow().restore() })
//
// ipcRenderer.on('main-select-recipient', function (event, params) {
//   console.log(remote.getGlobal('shared').selectedRecipient)
//   $('#payment-to-recipient').text(remote.getGlobal('shared').selectedRecipient.name)
//   $('#payment-to-address').val(remote.getGlobal('shared').selectedRecipient.address)
//   $('#payment-to-memo').text(remote.getGlobal('shared').selectedRecipient.memo)
// })



$(function () {
  // setTimeout(winMainCreate, 1000)
  // if (debug) console.log('*** index.js ***')


  $('#menu').load('menu.html', menuLoaded)
})

function menuLoaded () {
  // frameChange(loaded + '.html')

  // const remote = require('electron').remote
  // const Menu = remote.Menu
  // const MenuItem = remote.MenuItem

  // var menu = new Menu()
  // menu.append(new MenuItem({ label: 'MenuItem1', click: function () { console.log('item 1 clicked') } }))
  // menu.append(new MenuItem({ type: 'separator' }))
  // menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))

  window.addEventListener('contextmenu', (e) => {
    if (e.target.id === 'app-icon') {
      e.preventDefault()
      // menu.popup(remote.getCurrentWindow())
    }
  }, false)
}

function frameChange (doc) {
  if (!boolPinMenu &&
      doc !== 'sections/helpoverview-section.html' &&
      doc !== 'sections/info-section.html') {
    closeNav()
  }

  if (doc !== currentFrame) {
    currentFrame = doc
    $('.frame').fadeOut(300, function () {
      $('.frame').load(doc)
      $('.frame').fadeIn(2000)
    })
  }
}

function pinMenu () {
  // console.log('pinMenu');
  if ($('.is-menu-visible')[0]) {
    boolPinMenu = !boolPinMenu
    if (boolPinMenu) {
      $('#btn-pin').addClass('btn-pin-invert')
    } else {
      $('#btn-pin').removeClass('btn-pin-invert')
    }
    $('#main-div').toggleClass('fix_menu')
  }
}

function selectTheme () {
  boolTheme = !boolTheme

  if (boolTheme) {
    $('body').css('background-image', 'url(assets/images/back-1.jpg)')
  } else {
    $('body').css('background-image', 'url(assets/images/back.jpg)')
  }
}

function openNav () {
  console.log('openNav')
  $('#btn-menu_img').attr('src', 'assets/images/menuInv.png')
  $('body').addClass('is-menu-visible')
  $('body').addClass('is-top-menu-visible')
  $('#main-div').removeClass('unslide')
  $('#main-div').addClass('slide')
  $('#btn-menu').addClass('btn-menu-invert')
  $('#chart_div').removeClass('chart_end')
  $('#chart_div').addClass('chart_sliding')
}

function closeNav () {
  if (boolPinMenu) {
    pinMenu()
  }
  $('#btn-menu_img').attr('src', 'assets/images/menu1.png')
  $('#main-div').removeClass('slide')
  $('body').removeClass('is-menu-visible')
  $('body').removeClass('is-top-menu-visible')
  $('#main-div').addClass('unslide')
  $('#btn-menu').removeClass('btn-menu-invert')
  $('#chart_div').removeClass('chart_end')
  $('#chart_div').addClass('chart_sliding')
  $('#menu').addClass('close')
}

function toggleNav () {
  if ($('.is-menu-visible')[0]) {
    closeNav()
  } else {
    openNav()
  }
//   resizeNow();
}

// return from dialog - params identifies the dialog
// this fires only when the 'ok'/'yes' button is selected
// ipcRenderer.on('dialog_ok', function (event, params) {
//   console.log(params)
//   switch (params) {
//     case 'Alert': {
//       console.log('alert clicked')
//       break
//     }
//     case 'Confirm': {
//       console.log('confirm clicked')
//       break
//     }
//   }
// })
