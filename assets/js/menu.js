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
