/* global
  $
  islJsNotLoaded
  getLastUpdate
  drawChart
*/

console.log('settings-section.js')

var settingsSection = {}

// load required scripts

// <region> *** settingsSectionInit ***
// this runs before section is loaded
// so updating elements from here won't work
// until section is loaded
function settingsSectionInit () {
//  infoSection.last_update.default(10000)
    settingsSectionLoad()
}
// </region> *** settingsSectionInit ***

// <region> *** home_section_load ***
// runs every time section is loaded
function settingsSectionLoad () {
  console.log('*** settingsSectionLoad ***')
  // $('#survey-response-recent').val('222')
//  $('.separator').click(() => { toggleTopbar() })
//  getLastUpdate()
//  drawChart()
}
// </region> *** settingsSectionLoad ***
