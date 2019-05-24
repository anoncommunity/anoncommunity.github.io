// global.electron = require('electron');
// electron.webFrame.setZoomFactor(1.0);

$(function () {
//  setTimeout(winMainCreate, 1000)
  console.log('*** select-recipient.js ***')

  console.log(remote.getGlobal('shared').mapAddressAll)

  htmlAccountBalances(remote.getGlobal('shared').mapAddress)
  htmlRecipientList(remote.getGlobal('shared').recipientList)

  console.log(remote.getGlobal('shared').recipientList)

  $('.window-close').on('click', () => {
    ipcRenderer.send('select-recipient-close')
    window.close()
  })
})

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

  insertAccountTable(params)
})

function htmlAccountBalances (mapAddress) {
  var html = '<div class="flx dc jb ac" style="">'
  console.log(mapAddress)
  mapAddress.forEach((element, index) => {
    html += '<div id=' + element.address + ' class="flx dc js select-account">'
    html += '  <div class="flx jb" style="overflow: hidden; padding: 10px; background-color: rgba(255, 255, 255, 0.5);">'
    html += '    <div style="color: #663399; font-size: 1.5rem; ">' + element.account + '</div>'
    html += '    <div class="flx js ae">'
    html += '      <div style="color: #333; font-size: 2rem">' + numberWithCommas(element.balance) + '</div>'
    html += '      <div style="color: #333; font-size: 1rem">&nbsp;ZCE</div>'
    html += '    </div>'
    html += '  </div>'
    html += '  <div class="flx js">'
    html += '    <div style="color: #333; font-family: Exo-Light;">' + element.address + '</div>'
    html += '  </div>'
    html += '</div>'
  })
  html += '</div>'
  $('#account-list').html(html)
}

function htmlRecipientList (recipientList) {
  var html = '<div class="flx dc jb ac" style="">'
  console.log(recipientList)
  recipientList.forEach((element, index) => {
    html += '<div id=' + element.address + ' class="flx dc js select-recipient">'
    html += '  <div class="flx jb" style="overflow: hidden; padding: 10px; background-color: rgba(255, 255, 255, 0.5);">'
    html += '    <div style="color: #663399; font-size: 1.5rem; ">' + element.name + '</div>'
    html += '    <div class="flx js ae">'
    html += '      <div style="color: #333; font-size: 1.5rem">memo: ' + element.memo + '</div>'
    html += '    </div>'
    html += '  </div>'
    html += '  <div class="flx js">'
    html += '    <div style="color: #333; font-family: Exo-Light;">' + element.address + '</div>'
    html += '  </div>'
    html += '</div>'
  })
  html += '</div>'
  $('#recipient-list').html(html)

  $('.select-recipient').click(function () {
    remote.getGlobal('shared').selectedRecipient = recipientList.find(obj => obj.address === this.id)
    console.log(remote.getGlobal('shared').selectedRecipient)
    ipcRenderer.send('select-recipient-close')
    window.close()
  })

  $('.select-account').click(function () {
    remote.getGlobal('shared').selectedRecipient = remote.getGlobal('shared').mapAddress.find(obj => obj.address === this.id)
    console.log(remote.getGlobal('shared').selectedRecipient)
    ipcRenderer.send('select-recipient-close')
    window.close()
  })
}
