/* global
  $
  islJsNotLoaded
  getLastUpdate
  drawChart
*/

console.log('info-section.js')

var data = []
var dbtc = []

var infoSection = {}

// load required scripts
$.getScript('assets/js/modules/candlestick_chart.js')
$.getScript('assets/js/modules/last_update.js', function () { infoSectionInit() })

// <region> *** infoSectionInit ***
// this runs before section is loaded
// so updating elements from here won't work
// until section is loaded
function infoSectionInit () {
  infoSection.last_update.default(10000)

  if (islJsNotLoaded) {
    infoSectionLoad()
  }
}
// </region> *** infoSectionInit ***

// <region> *** home_section_load ***
// runs every time section is loaded
function infoSectionLoad () {
  console.log('*** infoSectionLoad ***')
  getLastUpdate()
  drawChart()
}
// </region> *** infoSectionLoad ***
