/* global $
          infoSection
          setElementValue
          nFormat
*/

console.log('index-section.js')

var indexSection = {}

// load required scripts
// $.getScript('assets/js/modules/candlestick_chart.js')
// $.getScript('assets/js/modules/last_update.js', function () { infoSectionInit() })
indexSectionInit()

// <region> *** indexSectionInit ***
// this runs only once when script is initially loaded
// no guarantee that elements are all available
function indexSectionInit () {
  console.log('*** indexSectionInit ***')
}
// </region> *** indexSectionInit ***

// <region> *** indexSectionLoad ***
// runs every time section is loaded
// elements are always loaded by now
function indexSectionLoad () {
  console.log('*** indexSectionLoad ***')
  //  setFromApi('http://127.0.0.1:8080/api/nhd/users', ['active-users', 'registered-users'])
  //  setTimeout(function () { setFromApi('http://127.0.0.1:8080/api/nhd/outqueue', ['outbound-queue', 'outbound-day']) }, 100)
  //  setTimeout(function () { setFromApi('http://127.0.0.1:8080/api/nhd/outqueue', ['outbound-queue', 'outbound-day']) }, 100)
  updateTopBar()
  setInterval(updateTopBar, 3000)
}
// </region> *** indexSectionLoad ***

function updateTopBar () {
  first().then(second).then(newCalls).then(latestSurvey).then(dbSize)
}

var ajaxGET = function (url, finish) {
  $.get(url).done(function (data) {
    finish(data)
  })
}

var first = function () {
  return new Promise(function (resolve) {
    ajaxGET('http://172.21.77.252:9090/api/nhd/users', function (data) {
      var response = data[0][0]
      console.log(response)
      setElementValue('active-users', response.Techs)
      setElementValue('registered-users', response.Total)
      resolve()
    })
  })
}

// 2 - get apple
var second = function () {
  return new Promise(function (resolve) {
    ajaxGET('http://172.21.77.252:9090/api/nhd/outqueue', function (data) {
      var response = data[0][0]
      console.log(response)
      setElementValue('outbound-queue', response.Queue)
      setElementValue('outbound-day', response.Tally)
      resolve()
    })
  })
}

// 2 - get apple
var newCalls = function () {
  return new Promise(function (resolve) {
    ajaxGET('http://172.21.77.252:9090/api/nhd/newcalls', function (data) {
      var response = data[0][0]
      console.log(response)
      setElementValue('new-calls', response.Calls)
      setElementValue('new-calls-day', response.Date)
      resolve()
    })
  })
}

// latest survey
var latestSurvey = function () {
  return new Promise(function (resolve) {
    ajaxGET('http://172.21.77.252:9090/api/nhd/survey', function (data) {
      var response = data[0][0]
      console.log(response)
      setElementValue('survey-recent', response.Date)
      setElementValue('survey-week', response.Tally)
      resolve()
    })
  })
}

var dbSize = function () {
  return new Promise(function (resolve) {
    ajaxGET('http://172.21.77.252:9090/api/nhd/dbsize', function (data) {
      var response = data[0][0]
      console.log(response)
      setElementValue('database-size', response.Size)
      setElementValue('database-status', response.Status)
      resolve()
    })
  })
}

//Start sequential GET using chained promises

// first(['active-users', 'registered-users']).then(second).then(third)

function setFromApi (url, arrel) {
  $.get(url).then(rsp => {
    console.log(rsp)
    var response = rsp[0][0]
    console.log('*** api response ***')
    var idx = 0
    arrel.forEach((el) => {
      setElementValue(el, response[Object.keys(response)[idx]])
      idx++
    })
  })
}
