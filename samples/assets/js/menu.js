/*
  global
  $
  startUp
  isElectron
*/

$(function () {
  // display menu at startup
  $('#top-menu').css('opacity', '1')

  // remove opacity attribute so it falls under control of css rules
  $('#top-menu').hover(
    function () { }, function () {
      if (startUp) {
        $('#top-menu').css('opacity', '')
        startUp = false
      }
    }
  )

  if (isElectron) {
    $('.electron-only').css('display', 'flex')
  }

  $('#firstCollapseMenu').collapsible({
    accordion: true,
    accordionUpSpeed: 200,
    accordionDownSpeed: 300,
    collapseSpeed: 200,
    contentOpen: null,
    arrowRclass: null,
    arrowDclass: null,
    animate: true
  })
})

$('.menurow,.btn-click').click(function () {
  frameChange('sections/' + this.id + '.html')
  $('.menurow').removeClass('active')
  $('#' + this.id).addClass('active')

  if (loaded.indexOf(this.id) === -1) {
    loaded += this.id
    $.getScript('assets/js/modules/' + this.id + '.js')
  }
})
