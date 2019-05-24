/* global
  $
  rpcAsync
  mapAddress
*/
console.log('account-payment-section.js')

accountPaymentSectionInit()

// <region> *** accountsTransactionSectionInit ***
// this runs before section is loaded
// so updating elements from here won't work
function accountPaymentSectionInit () {
  if (debug) console.log('*** accountPaymentSectionInit ***')
}
// </region> *** accountsTransactionSectionInit ***

// <region> *** home_section_load ***
// runs every time section is loaded
async function accountPaymentSectionLoad () {
  console.log('*** accountPaymentSectionLoad ***')

  accountPaymentInitValues()

  $('#btn-send').click(async function () {
    console.log('*** btn-send ***')
    // console.log($('#payment-from-address').text(), $('#payment-to-address').val(), $('#payment-to-amount').val())
    remote.getGlobal('shared').opId = (await rpcAsync('z_sendmany', [$('#payment-from-address').text(), [{ 'address': $('#payment-to-address').val(), 'amount': $('#payment-to-amount').val() }], 1, 0])).result
    console.log(remote.getGlobal('shared').opId)

    // sample usage
    // polls every 500ms for up to 30 seconds
    pollUntilDone(remote.getGlobal('shared').opId, 1000, 30 * 1000).then(function (res) {
      console.log('*** done***')
    }).catch(function (err) {
      console.log('err' + err)
      // handle error here
    })

    // setTimeout(() => zGetOperationStatus(remote.getGlobal('shared').opId), 30000) // todo - use z_getoperationstatus to check for success
    // setTimeout(() => updateBalance($('#payment-from-address').val()), 40000) // todo - use z_getoperationstatus to check for success
    // setTimeout(() => updateBalance($('#payment-to-address').val()), 40000) // todo - use z_getoperationstatus to check for success
  })

  $('.wallet-subsection-cancel').click(function () {
    walletSubSectionCancel()
  })

  $('#btn-select-recipient').click(function () {
    openDialogRecipient('select', 'recipient', 'select-recipient')
  })

  $('#btn-add-recipient').click(function () {
    openDialogRecipient('add', 'recipient', 'add-recipient')
  })
}
// </region> *** infoSectionLoad ***

// <region> *** functions ***

// <region> *** initValues ***
function accountPaymentInitValues () {
  var thisAddress = remote.getGlobal('shared').mapAddress.find(obj => obj.address == activePAccount.substring(1))
  // $('#payment-from-address').val(thisAddress.address)
  $('#payment-from-address').text(thisAddress.address)
  $('#payment-from-account').text(thisAddress.account)
  $('#payment-balance').text(numberWithCommas(thisAddress.balance))
  $('#payment-available-balance').text(numberWithCommas(thisAddress.balance))
}
// </region> ^^^ initValues ^^^

function openDialogRecipient (title, text, page) {
  console.log('*** openDialog ***')
  main.dialogCreate(title, text, 800, 890, 200, 200, page)

  this.alert = () => { dia('alert') }
  this.confirm = () => { dia('confirm') }

//  function dia (d) { main.dialogCreate(title, text, 600, 390, 100, 100, d) }
  var dia = d => { main.dialogCreate(title, text, 600, 390, 200, 200, d) }
};

// </region> ^^^ functions ^^^
