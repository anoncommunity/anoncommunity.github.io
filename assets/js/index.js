/*
  global
  $
  ipcRenderer
*/
// global.electron = require('electron');
// electron.webFrame.setZoomFactor(1.0);

// list of startup values
var currentFrame = ''
 var loaded = 'sections/overview-section'
var boolPinMenu = false

var islJsNotLoaded = false

$('#btn-pin').click(() => { pinMenu() })
$('#btn-menu').click(() => { toggleNav() })

$(function () {
  // setTimeout(winMainCreate, 1000)
  console.log('win_main_start')
  // $('body').addClass('is-menu-visible')
  $('#menu').load('menu.html', menuLoaded)
})

function menuLoaded () {
  frameChange(loaded + '.html')

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
}

function frameChange (doc) {
  if (!boolPinMenu && doc !== 'sections/helpoverview-section.html') {
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

$('.menurow').click(function () {
  frameChange('sections/' + this.id + '.html')
  $('.menurow').removeClass('active')
  $('#' + this.id).addClass('active')

  if (loaded.indexOf(this.id) === -1) {
    loaded += this.id

    $.getScript('assets/js/modules/' + this.id + '.js')
  }
})

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

function openNav () {
  console.log('openNav')
  $('#btn-menu_img').attr('src', 'assets/images/menuInv.png')
  $('body').addClass('is-menu-visible')
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
  // var alertDialog = new openDialog('Alert', 'Wallet has been backed up').alert()
  // var confirmDialog = new openDialog('Confirm', 'Wallet has been backed up').confirm()
})
