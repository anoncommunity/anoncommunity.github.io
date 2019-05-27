/* global
  $
  islJsNotLoaded
  getLastUpdate
  drawChart
*/

console.log('help-mining.js')

helpMiningLoad ()

// load required scripts

// <region> *** settingsSectionInit ***
// this runs before section is loaded
// so updating elements from here won't work
// until section is loaded
function helpMiningInit () {
  helpMiningLoad()
}
// </region> *** settingsSectionInit ***

// <region> *** home_section_load ***
// runs every time section is loaded
function helpMiningLoad () {
  console.log('*** helpMiningLoad ***')

  $.get('https://api.anon.community/getmininginfo').then(response => {
    $('#blockheight').text(response.blocks)
    $('#difficulty').text(Math.round(response.difficulty))
    $('#net-hashrate').text(response.networksolps)
  })
  
  var d = new Date()
  $('#last_update_local').text(d.toTimeString().slice(0,8))
  $('#last_update_utc').text(d.toUTCString().slice(-12))
  
  
//  $('.separator').click(() => { toggleTopbar() })
//  getLastUpdate()
//  drawChart()
}
// </region> *** settingsSectionLoad ***
