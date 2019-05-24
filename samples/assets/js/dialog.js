// global.electron = require('electron');
// electron.webFrame.setZoomFactor(1.0);

$(() => {
  setElementValue('dialog_title', getParameterByName('title'))
  setElementValue('confirm_question',  getParameterByName('text'))
})
