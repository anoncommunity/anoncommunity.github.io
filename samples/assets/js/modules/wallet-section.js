/* global
  $
*/
var activePAccount
var activeTAccount
var activeSAccount
var activeIAccount
var counter = 0
var globalAccountsParams = {}

var accountsArray = []
var wsAccountParams = {}
var zListAddressesArray = []

console.log('*** wallet-section.js ***')

walletSectionInit()

// <region> *** walletSectionInit ***
// this runs before section is loaded
// so updating elements from here won't work
// until section is loaded
function walletSectionInit () {
}
// </region> *** walletSectionInit ***

// <region> *** walletSectionLoad ***
// runs every time section is loaded
async function walletSectionLoad () {
  // init values
  walletInitValues()

  // <region> *** click events ***
  $('#wallet-accounts-showhidden').on('click', function () {
    if ($('#wallet-accounts-showhidden').toggleClass('checked').hasClass('checked')) {
      globalAccountsParams.showhidden = 1
      remote.getGlobal('shared').showHidden = 1
      remote.getGlobal('shared').mapAddress = remote.getGlobal('shared').mapAddressAll
    } else {
      globalAccountsParams.showhidden = 0
      remote.getGlobal('shared').showHidden = 0
      remote.getGlobal('shared').mapAddress = remote.getGlobal('shared').mapAddressAll.filter(obj => obj.visibility > 0)
    }
    htmlAccountBalances(remote.getGlobal('shared').mapAddress)
    startWallet()

    updateGlobalTable(globalAccountsParams)
  })

  $('#btn-new-account').click(function () {
    openDialog('123', '345')
  })
  // </region> ^^^ click events ^^^


  console.log('*** htmlAccountBalances - start ***')
  if (remote.getGlobal('shared').showHidden === 1) {
    remote.getGlobal('shared').mapAddress = remote.getGlobal('shared').mapAddressAll
  }

  htmlAccountBalances(remote.getGlobal('shared').mapAddress)
  console.log('*** htmlAccountBalances - finish ***')

  // console.log('*** startWallet - start ***')
  startWallet()
}
// </region> ^^^ walletSectionLoad ^^^

// <region> *** functions ***

// <region> *** initValues ***
function walletInitValues () {
  // if (remote.getGlobal('shared').showHidden == 1) {
  //   $('#wallet-accounts-showhidden').addClass('checked')
  // }

  $('#wallet-accounts-showhidden').toggles({
    on: false
  })

  // the underlying Toggles class can be accessed
  var togShowHidden = $('#wallet-accounts-showhidden').data('toggles')

  if (remote.getGlobal('shared').showHidden === 1) {
    togShowHidden.toggle(true)
    $('#wallet-accounts-showhidden').addClass('checked')
  }
}
// </region> ^^^ initValues ^^^

function walletSubSectionCancel () {
  frameChange('sections/wallet-section.html')

  if (loaded.indexOf('wallet-section') === -1) {
    loaded += 'wallet-section'
    $.getScript('assets/js/modules/wallet-section.js')
  }
}

function openDialog (title, text) {
  console.log('*** openDialog ***')
  main.dialogCreate(title, text, 600, 390, 200, 200, 'account')

  this.alert = () => { dia('alert') }
  this.confirm = () => { dia('confirm') }

  //  function dia (d) { main.dialogCreate(title, text, 600, 390, 100, 100, d) }
  var dia = d => { main.dialogCreate(title, text, 600, 390, 200, 200, d) }
};


function startWallet () {
  // needs to be after html is added to DOM
  $('.account-transactions-section').click(function () {
    activeTAccount = this.id
    frameChange('sections/account-transactions-section.html')
    if (loaded.indexOf('account-transactions-section') === -1) {
      loaded += 'account-transactions-section'

      $.getScript('assets/js/modules/account-transactions-section.js')
    }
  })

  // needs to be after html is added to DOM
  $('.account-payment-section').click(function () {
    activePAccount = this.id
    frameChange('sections/account-payment-section.html')
    if (loaded.indexOf('account-payment-section') === -1) {
      loaded += 'account-payment-section'

      $.getScript('assets/js/modules/account-payment-section.js')
    }
  })

  // needs to be after html is added to DOM
  $('.account-info-section').click(function () {
    activeIAccount = this.id
    frameChange('sections/account-info-section.html')
    if (loaded.indexOf('account-info-section') === -1) {
      loaded += 'account-info-section'

      $.getScript('assets/js/modules/account-info-section.js')
    }
  })

  // needs to be after html is added to DOM
  $('.account-settings-section').click(function () {
    activeSAccount = this.id
    frameChange('sections/account-settings-section.html')
    if (loaded.indexOf('account-settings-section') === -1) {
      loaded += 'account-settings-section'

      $.getScript('assets/js/modules/account-settings-section.js')
    }
  })
}

function htmlAccountBalances (mapAddress) {
  var html = '<div class="flx dc jb ac" style="margin: 20px;">'
  console.log(mapAddress)
  mapAddress.forEach((element, index) => {
    html += '<div class="flx js" style="margin: 10px; border-top: 5px solid darkblue; flex-grow: 1; width: 100%">'
    html += '  <div class="flx dc js" style="overflow: hidden; padding: 10px; width: 70%; height: 170px; background-color: #FFF;">'
    html += '    <div style="color: #663399; font-size: 1.5rem; ">' + element.account + '</div>'
    html += '    <div id=t' + element.address + ' style="font-family: Exo-Light;">' + element.address + '</div>'
    html += '    <div class="flx ae">'
    html += '      <div id=b' + element.address + ' style="color: #333; font-size: 2rem">' + numberWithCommas(element.balance) + '</div>'
    html += '      <div style="font-size: 1rem">&nbsp;ZCE</div>'
    html += '    </div>'
    html += '  </div>'
    html += '  <div class="flx dc ja ac" style="flex-grow: 1">'
    html += '    <div id=t' + element.address + ' class="flx jb ac btn-accounts account-transactions-section" style="flex-grow: 1; background-color: #f0f0f0; width: 100%;">'
    html += '      <div id="account-transactions-section">View transactions</div>'
    html += '      <i class="icon-right-open-2"></i>'
    html += '    </div>'
    html += '    <div id=p' + element.address + ' class="flx jb ac btn-accounts account-payment-section" style="flex-grow: 1; background-color: #f0f0f0; width: 100%;">'
    html += '      <div id="account-payment-section">Payments and transfers</div>'
    html += '      <i class="icon-right-open-2"></i>'
    html += '    </div>'
    html += '    <div id=i' + element.address + ' class="flx jb ac btn-accounts account-info-section" style="flex-grow: 1; background-color: #f0f0f0; width: 100%;">'
    html += '      <div id="account-info-section">Info</div>'
    html += '      <i class="icon-right-open-2"></i>'
    html += '    </div>'
    html += '    <div id=s' + element.address + ' class="flx jb ac btn-accounts account-settings-section" style="flex-grow: 1; background-color: #f0f0f0; width: 100%;">'
    html += '      <div id="account-settings-section">Settings</div>'
    html += '      <i class="icon-right-open-2"></i>'
    html += '    </div>'
    html += '  </div>'
    html += '</div>'
  })
  html += '</div>'
  $('#z-listunspent').html(html)
}
// </region> ^^^ functions ^^^
