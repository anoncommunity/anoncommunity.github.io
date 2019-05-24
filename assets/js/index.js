/*
  global
  $
  ipcRenderer
*/
// global.electron = require('electron');
// electron.webFrame.setZoomFactor(1.0);

// Assuming "?post=1234&action=edit"

var urlParams = new URLSearchParams(window.location.search);

var section = urlParams.get('section') // "edit"

console.log(section)


//console.log(urlParams.has('post')); // true
//console.log(urlParams.get('action')); // "edit"
//console.log(urlParams.getAll('action')); // ["edit"]
//console.log(urlParams.toString()); // "?post=1234&action=edit"
//console.log(urlParams.append('active', '1')); // "?post=1234&action=edit&active=1"

// list of startup values
var currentFrame = ''
var loaded = 'sections/info-section'
if (section != null) {
  loaded = 'sections/' + section
}
var boolPinMenu = false
var boolTheme = false
var firstRun = true

// the following are there to ensure that load is run only after all elements
// are available - runs every time section is loaded
var islJsNotLoaded = false
var indexSectionLoaded = false

$('#btn-pin').click(() => { pinMenu() })
$('#btn-menu').click(() => { toggleNav() })
$('#btn-theme').click(() => { selectTheme() })

$(function () {
  // setTimeout(winMainCreate, 1000)
  console.log('win_main_start')
  $('body').addClass('is-menu-visible')
  $('#menu').load('menu.html', menuLoaded)
})

function menuLoaded () {
  frameChange(loaded + '.html')
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

$('#top-menu').hover(function () {

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
  if (!firstRun) { 
    $('body').removeClass('is-top-menu-visible') 
  }
  else {
    firstRun = false
  }
  $('#main-div').addClass('unslide')
  $('#btn-menu').removeClass('btn-menu-invert')
  $('#chart_div').removeClass('chart_end')
  $('#chart_div').addClass('chart_sliding')
  $('#menu').addClass('close')
}

function openTopbar () {
  console.log('openNav')
  // $('#btn-menu_img').attr('src', 'assets/images/menuInv.png')
  $('body').addClass('is-top-menu-visible')
  // $('#main-div').removeClass('unslide')
  // $('#main-div').addClass('slide')
  // $('#btn-menu').addClass('btn-menu-invert')
  // $('#chart_div').removeClass('chart_end')
  // $('#chart_div').addClass('chart_sliding')
}

function closeTopbar () {
  // if (boolPinMenu) {
  //   pinMenu()
  // }
  // $('#btn-menu_img').attr('src', 'assets/images/menu1.png')
  // $('#main-div').removeClass('slide')
  $('body').removeClass('is-top-menu-visible')
  // $('#main-div').addClass('unslide')
  // $('#btn-menu').removeClass('btn-menu-invert')
  // $('#chart_div').removeClass('chart_end')
  // $('#chart_div').addClass('chart_sliding')
  // $('#menu').addClass('close')
}


function toggleNav () {
  if ($('.is-menu-visible')[0]) {
    closeNav()
  } else {
    openNav()
  }
//   resizeNow();
}

function toggleTopbar () {
  console.log('toggleTopbar ()')
  if ($('.is-top-menu-visible')[0]) {
    closeTopbar()
  } else {
    openTopbar()
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
