/* global
  $
  db
  activeSAccount
*/
console.log('account-settings-section.js')
var accountSettingsParams = {}

accountSettingsSectionInit()

// <region> *** accountSettingsSectionInit ***
function accountSettingsSectionInit () {
  // this runs once, before html section is loaded
  // so updating elements from here won't work
  console.log('*** accountSettingsSectionInit ***')
}
// </region> ^^^ accountSettingsSectionInit ^^^

// <region> *** accountSettingsSectionLoad ***
function accountSettingsSectionLoad () {
  // init values
  accountSettingsInitValues()

  // <region> *** click events ***
  //
  $('.params-account-table').on('change', function () {
    accountSettingsParams.account = '"' + $('#settings-account').val() + '"'
    console.log(accountSettingsParams)
  })

  $('#settings-visibility').on('click', function () {
    ($('#settings-visibility').toggleClass('checked').hasClass('checked'))
      ? accountSettingsParams.visibility = 1
      : accountSettingsParams.visibility = 0
    console.log(accountSettingsParams)
  })

  $('.update-account-table').on('click', function () {
    var thisAddress = remote.getGlobal('shared').mapAddress.find(obj => obj.address == activeSAccount.substring(1))
    thisAddress.visibility = accountSettingsParams.visibility

    updateAccountTable(activeSAccount.substring(1), accountSettingsParams)
  })
  // </region> ^^^ click events ^^^
}

// </region> ^^^ accountSettingsSectionLoad ^^^

// <region> *** functions ***

// <region> *** initValues ***
function accountSettingsInitValues () {
  var thisAddress = remote.getGlobal('shared').mapAddress.find(obj => obj.address == activeSAccount.substring(1))
  $('#settings-address').val(thisAddress.address)
  $('#settings-account').val(thisAddress.account)
  $('#settings-balance').val(thisAddress.balance)
  // if (thisAddress.visibility === 1) {
  //   $('#settings-visibility').addClass('checked')
  // }
  // initiate a new Toggles class
  $('.account-settings-visibility').toggles({
    on: false
  })

  $('#account-settings-header').text(thisAddress.account)

  // the underlying Toggles class can be accessed
  var togVisibility = $('.account-settings-visibility').data('toggles')

  if (thisAddress.visibility === 1) {
    togVisibility.toggle(true)
    $('.account-settings-visibility').addClass('checked')
  }
}
// </region> ^^^ initValues ^^^

// </region> ^^^ functions ^^^

// <region> *** sqlite stuff ***

// </region> ^^^ sqlite stuff ^^^
