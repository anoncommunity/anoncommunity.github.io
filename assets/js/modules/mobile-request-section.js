/* global $
          infoSection
          setElementValue
          nFormat
*/

console.log('mobile-request-section.js')

var mobileRequestSection = {}

// load required scripts
// $.getScript('assets/js/modules/candlestick_chart.js')
// $.getScript('assets/js/modules/last_update.js', function () { infoSectionInit() })
mobileRequestSectionInit()

// <region> *** mobileRequestSectionInit ***
// this runs only once when script is initially loaded
// no guarantee that elements are all available
function mobileRequestSectionInit () {
  console.log('*** mobileRequestSectionInit ***')
}
// </region> *** mobileRequestSectionInit ***

// <region> *** mobileRequestSectionLoad ***
// runs every time section is loaded
// elements are always loaded by now
function mobileRequestSectionLoad () {
  console.log('*** mobileRequestSectionLoad ***')
  //  setFromApi('http://127.0.0.1:8080/api/nhd/users', ['active-users', 'registered-users'])
  //  setTimeout(function () { setFromApi('http://127.0.0.1:8080/api/nhd/outqueue', ['outbound-queue', 'outbound-day']) }, 100)
  //  setTimeout(function () { setFromApi('http://127.0.0.1:8080/api/nhd/outqueue', ['outbound-queue', 'outbound-day']) }, 100)
  // updateTopBar()
  // setInterval(updateTopBar, 3000)
  let deviceRequestForm = document.getElementById('device-request-form')
// getUserList()
  $('#btn-get-user-data').click(() => { getUserData() })
  // $('#user-select').on('change', () => { getUserData() })
  $('#btn-submit').click(() => { deviceRequestForm.submit() })
}
// </region> *** mobileRequestSectionLoad ***

var ajaxGET = function (url, finish) {
  $.get(url).done(function (data) {
    console.log(data)
    finish(data)
  })
}

var getUserList = async function () {
  let select = document.getElementById('user-select');
  let users=[]
  await $.getJSON('http://172.21.77.252:9090/api/usersA-M', function (data) {
    var response = data.result.matches
    response.forEach(function(element) {
      users.push(element.cn[0])
    })
  })
  await $.getJSON('http://172.21.77.252:9090/api/usersN-Z', function (data) {
    var response = data.result.matches
    response.forEach(function(element) {
      users.push(element.cn[0])
    })
  })
  // $('#role').val(response.matches[0].title[0])
  // $('#team').val(response.matches[0].department[0])
  // $('#employee-number').val(response.matches[0].employeeID[0])
  users.sort()
  users.forEach(function(element){
    select.options[select.options.length] = new Option(element);
  })
  console.log(users)
}

var getUserData = function () {
  // let taggedName = '<name>' + $('#name').val() + '</name>'
  let user = $('#name').val().replace(' ', '%20')
  // let user = $('#user-select').val()
  console.log(user)
  $.getJSON('http://172.21.77.252:9090/api/ad?user=' + user, function (data) {
    console.log(data)
    var response = data.result
    // $('#name').val(taggedName)
    $('#role').val(response.matches[0].title[0])
    $('#team').val(response.matches[0].department[0])
    $('#employee-number').val(response.matches[0].employeeID[0])
    // $('#email').val(response.matches[0].mail[0] + 'emailend')
  })
}
