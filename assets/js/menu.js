/*
  global
  $
  ipcRenderer
*/
// global.electron = require('electron');
// electron.webFrame.setZoomFactor(1.0);

// list of startup values
$(function () {
  // setTimeout(winMainCreate, 1000)

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


$('.expandable').click(function () {
  let rotate = $('#' + this.id + '-open').hasClass('rotated')
  $('.expander-icon').removeClass('rotated')
  if (!rotate) $('#' + this.id + '-open').addClass('rotated')
})

$('.menurow,.btn-click').click(function () {
  console.log(this.id)
  if (!$('#' + this.id).hasClass('indent'))
  {
    $('.expander-icon').removeClass('rotated')
  }
  $('.menurow').removeClass('active')
  $('#' + this.id).addClass('active')

  frameChange('sections/' + this.id + '.html')

  // make sure it only loads the script once
  // otherwise multiple setIntervals could occur, for example
  if (loaded.indexOf(this.id) === -1) {
    loaded += this.id

    $.getScript('assets/js/modules/' + this.id + '.js')
  }
})
