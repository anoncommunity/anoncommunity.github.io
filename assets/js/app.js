/* global $ */
// global.electron = require('electron');
// electron.webFrame.setZoomFactor(1.0);

function setElementValue (element, value) {
  var el = $('#' + element)
  if (el.text() === value) return
  el.text(value)
}

function JSON_fromString (json) {
  var ret = {}
  try { ret = JSON.parse(json) } catch (e) { console.log(e) }
  return ret
}

function nFormat (n, precision, strip) {
  // console.log(typeof parseFloat(n))
  // console.log(typeof 18240836.0)
  if (!precision) precision = 0
  n = parseFloat(n)
  console.log(n.toLocaleString('en'))
  if (precision === 0) {
    return n.toLocaleString('en', {maximumSignificantDigits: 21})
  } else {
    return n.toFixed(precision)
  }
  //  if (strip && precision > 0) n = n.replace(/0+$/, "").replace(/[.]$/, "");
  //   n=parseFloat(n);
}

function msg (s) {
  if (s === '') $('#msg').html('').hide()
  else $('#msg').text(s).show()
}

function settext (element, t) {
  var el = $('#' + element)
  if (el.text() === t) return
  el.text(t)
}

function setHtml (element, h) {
  var el = $('#' + element)
  if (el.data('rawhtml') === h) return
  el.html(h)
  el.data('rawhtml', h)
}

function setcolour (element, c) {
  var el = $('#' + element)
  if (el.css('color') === c) return
  el.css('color', c)
}

function update_gui () {
  function date(t) {
    var d = new Date(t * 1000)
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return isNaN(d.getDate()) ? '' : d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear()
    // return d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear()
  }

  function time (t) {
    var d = new Date(t * 1000)
    var h = '0' + d.getHours() % 24
    // var h = isNaN(d.getHours()) ? ".." : "0" + d.getHours() % 24;
    var m = '0' + d.getMinutes()
    // var m = isNaN(d.getMinutes()) ? ".." : "0" + d.getMinutes();
    var s = '0' + d.getSeconds()
    // var s = isNaN(d.getSeconds()) ? ".." : "0" + d.getSeconds();
    return isNaN(s) ? 'pending' : rtrunc(h) + ':' + rtrunc(m) + ':' + rtrunc(s)
    // return rtrunc(h) + ":" + rtrunc(m) + ":" + rtrunc(s);
  }

  function rtrunc (t) {
    return t.substr(t.length - 2)
  }

  function parseMilliseconds (milliseconds) {
    // Get hours from milliseconds
    var hours = milliseconds / (1000 * 60 * 60)
    var absoluteHours = Math.floor(hours)
    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours

    // Get remainder from hours and convert to minutes
    var minutes = (hours - absoluteHours) * 60
    var absoluteMinutes = Math.floor(minutes)
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes

    // Get remainder from minutes and convert to seconds
    var seconds = (minutes - absoluteMinutes) * 60
    var absoluteSeconds = Math.floor(seconds)
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds

    return h + ':' + m + ':' + s
  }
  var trans = ''
}

function download_progress (file, size, bytes) {
  $('#progressbar').css('width', Math.ceil(bytes / size * 100) + '%')
}

function setUpdater (func, time) {
  setInterval(func, time)
  setTimeout(func, 0) // run right away
}
