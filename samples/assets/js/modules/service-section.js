/* global
  $
  islJsNotLoaded
  getLastUpdate
  drawChart
*/

console.log('service-section.js')
var ledArray = []
var serviceSection = {}
var clock
serviceSectionInit()

// <region> *** infoSectionInit ***
// this runs before section is loaded
// so updating elements from here won't work
// until section is loaded
function serviceSectionInit () {
  serviceSection.last_update.default(10000)
}
// </region> *** infoSectionInit ***

// <region> *** home_section_load ***
// runs every time section is loaded
function serviceSectionLoad () {
  console.log('*** serviceSectionLoad ***')
  clock = new FlipClock($('.clock'), 39995, {
    clockFace: 'Counter'
  })
  initElectrumServicesStatus()
  updateElectrumServicesStatus()
  updateQuiteTheNode()
  updateTestnetTestnet123()
  updateBlockCount()
  setInterval(updateBlockCount, 1000)
  setInterval(updateElectrumServicesStatus, 3000)
  setInterval(updateQuiteTheNode, 10000)
}
// </region> *** infoSectionLoad ***

function updateBlockCount () {
  $.get('http://api.zcl.community:9080/getinfo').then(response => {
    clock.setValue(response.blocks)
  })
}

function initElectrumServicesStatus () {
  $.get('http://api.zcl.community:9080/electrumx').then(response => {
    console.log(response)
    response.forEach((server, index) => {
      var ledStatus = $($('<img src=assets/images/ledGreen64.png>'))
      ledStatus.id = server.address
      ledArray.push(ledStatus)
      var vseparator = $('<div/>', { class: 'flx jc ac small_screen_hide' }).append($('<div/>', { class: 'vl light' }))
      var hseparator = ($('<div/>', { class: 'small_screen_show display_none hl light' }))
      var serverDNS = $($('<p/>', { class: 'bold' }))
      var portNumber = $($('<p/>'))
      var electrumDiv = $('<div/>', { class: 'flx dc jc ac infopanel-wide font-normal' })
        .append($('<div/>', { class: 'flx js ac' })
          .append(serverDNS))
        .append($('<div/>', { class: 'flx dc js ac' })
          .append(ledStatus))
        .append($('<div/>', { class: 'infobar_footer' })
          .append(portNumber))

      serverDNS.html(server.address)
      portNumber.text('port 50002')
      $('#nodeList').append(electrumDiv)

      if (index < response.length - 1) {
        $('#nodeList').append(vseparator)
        $('#nodeList').append(hseparator)
      }
    })
  })
}

function updateElectrumServicesStatus () {
  $.get('http://api.zcl.community:9080/electrumx').then(response => {
    console.log('*** updateElectrumServicesStatus ***')
    response.forEach((server) => {
      var result = ledArray.find(obj => {
        return obj.id === server.address
      })
      console.log(result)
      result.attr('src', (server.alive) ? 'assets/images/ledGreen64.png' : 'assets/images/ledRed64.png')
    })
  })
}

function initKnowYourNodes () {
  $.get('http://api.zcl.community:9080/getpeerinfo').then(response => {
    console.log(response)
    response.forEach((server, index) => {
      var ledStatus = $($('<img src=assets/images/ledGreen64.png>'))
      ledStatus.id = server.address
      ledArray.push(ledStatus)
      var vseparator = $('<div/>', { class: 'flx jc ac small_screen_hide' }).append($('<div/>', { class: 'vl light' }))
      var hseparator = ($('<div/>', { class: 'small_screen_show display_none hl light' }))
      var serverDNS = $($('<p/>', { class: 'bold' }))
      var portNumber = $($('<p/>'))
      var electrumDiv = $('<div/>', { class: 'flx dc jc ac infopanel-wide font-normal' })
        .append($('<div/>', { class: 'flx js ac' })
          .append(serverDNS))
        .append($('<div/>', { class: 'flx dc js ac' })
          .append(ledStatus))
        .append($('<div/>', { class: 'infobar_footer' })
          .append(portNumber))

      serverDNS.html(server.address)
      portNumber.text('port 50002')
      $('#nodeList').append(electrumDiv)

      if (index < response.length - 1) {
        $('#nodeList').append(vseparator)
        $('#nodeList').append(hseparator)
      }
    })
  })
}

function updateQuiteTheNode () {
  $.get('http://api.zcl.community:9080/getpeerinfo').then(response => {
    console.log(response)

    $('#xnodeList').html(
      "<div class='flx js ac'>" +
        "<p class='bold'>zclele.duckdns.org</p>" +
      '</div>' +
      "<div class='flx dc jc ac'>" +
        "<img id='img18195' src='assets/images/ledGreen64.png'>" +
      '</div>' +
      "<div class='infobar_footer'>" +
        "<p id='ip_18_dns'>" +
          'port 50002' +
        '</p>' +
      '</div>'
    )

    setElementValue('ip0', response[0].address.split(':')[0])
    setElementValue('addnode0', response[0].address)
    setElementValue('blocks0', response[0].blocks)
    $('#imgavailable0').attr('src', (response[0].available) ? 'assets/images/ledGreen64.png' : 'assets/images/ledRed64.png')
    setElementValue('ip1', response[1].address.split(':')[0])
    setElementValue('addnode1', response[1].address)
    setElementValue('blocks1', response[1].blocks)
    $('#imgavailable1').attr('src', (response[1].available) ? 'assets/images/ledGreen64.png' : 'assets/images/ledRed64.png')
  })
}

var myCounter = new flipCounter('flip-counter', {value:10000, inc:123, pace:600, auto:true});


function updateTestnetTestnet123 () {
  $.get('http://api.zcl.community:9080/testnet/getinfo').then(response => {
    console.log(response)
    setElementValue('ip0-testnet', response.address.split(':')[0])
    setElementValue('addnode0-testnet', response.address)
    setElementValue('blocks0-testnet', response.blocks)
    $('#imgavailable0-testnet').attr('src', (response.available) ? 'assets/images/ledGreen64.png' : 'assets/images/ledRed64.png')
  })
}
