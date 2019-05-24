/* global
  $
  islJsNotLoaded
  getLastUpdate
  drawChart
*/

console.log('json-section.js')

var jsonSection = {}

// <region> *** jsonSectionInit ***
// this runs before section is loaded
// so updating elements from here won't work
// until section is loaded
function jsonSectionInit () {
}
// </region> *** jsonSectionInit ***

// <region> *** jsonSectionLoad ***
// runs every time section is loaded
function jsonSectionLoad () {
  console.log('*** jsonSectionLoad ***')
  $.getJSON('http://172.21.77.252:9090/api/html', function (data) {
    let response = data
    let html = ''
    html = parseResponse(response)
    $('#json').html(html)
  })
}
// </region> *** jsonSectionLoad ***
let html = ''

function parseResponse(response) {
  console.log(response)
  for(var key in response) {
    if (typeof response[key] !== 'object' && key !== null) {
      html += buildHtml(key, response)
    }
    else {
      html += '<div class="ml20">'
      html += '"' + key + '":&nbsp;'
      html += '</div>'
      html += '<div class="ml20">'
      html += '{'
      html += '</div>'
      parseResponse(response[key])
      html += '<div class="ml20">'
      html += '}'
      html += '</div>'
    }
  }
  return html
}

function buildHtml (item, object) {
  let html = ''
  html += '<div  class="flx js">'
  html += '<div class="ml20">'
  html += '"' + item + '":&nbsp;'
  html += '</div>'
  html += '<div id="' + item + '">'
  html += object[item]
  html += '</div>'
  html += '<div style="color: rgb(0,255,0);">'
  html += object[item]
  html += '</div>'
  html += '</div>'
  return html
}