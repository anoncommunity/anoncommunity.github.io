/* global
  $
  db
  activeIAccount
*/
console.log('account-info-section.js')

accountInfoSectionInit()

// <region> *** accountInfoSectionInit ***
function accountInfoSectionInit () {
  // this runs once, before html section is loaded
  // so updating elements from here won't work
  console.log('*** accountSettingsSectionInit ***')
}
// </region> ^^^ accountInfoSectionInit ^^^

// <region> *** accountInfoSectionLoad ***
function accountInfoSectionLoad () {
  // init values
  accountInfoInitValues()
}
// </region> ^^^ accountInfoSectionLoad ^^^

// <region> *** functions ***

// <region> *** initValues ***
function accountInfoInitValues () {
  var thisAddress = remote.getGlobal('shared').mapAddress.find(obj => obj.address == activeIAccount.substring(1))
  $('#info-address').val(thisAddress.address)
  $('#info-account').val(thisAddress.account)
  $('#info-balance').val(thisAddress.balance)
}
// </region> ^^^ initValues ^^^

// </region> ^^^ functions ^^^


// </region> ^^^ functions ^^^

// <region> *** sqlite stuff ***


// </region> ^^^ sqlite stuff ^^^
