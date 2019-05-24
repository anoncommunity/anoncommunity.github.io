/* global
  $
  islJsNotLoaded
  getLastUpdate
  drawChart
*/

console.log('backup-section.js')
var ledArray = []
var backupSection = {}
var clock
backupSectionInit()

// <region> *** infoSectionInit ***
// this runs before section is loaded
// so updating elements from here won't work
// until section is loaded
function backupSectionInit () {
  // initialise the path to conf file

  backupSection.last_update.default(10000)
}
// </region> *** infoSectionInit ***

// <region> *** home_section_load ***
// runs every time section is loaded
function backupSectionLoad () {
  ipcRenderer.send('backup_init')
  console.log('*** backupSectionLoad ***')
  $('#btn-exportdir').click(() => { backup_exportdir() })
  $('#btn-backup').click(() => { ipcRenderer.send('backupwallet') })
  $('#btn-export').click(() => { ipcRenderer.send('z_exportwallet') })


// var objTree = {}
// var core = {}
// var data = []
//
// foreach (string in path) {
//   var node = {}
//   node.text = 'mnt'
//   node.state = { 'opened': true }
//   node.children = []
// }
//
// data.push(node)
//
// core.data = data
//
// console.log(JSON.stringify(core))


  // $('#exportdir-graphic').jstree({
  //   'core': {
  //     'data': [
  //       {
  //         'text': 'mnt',
  //         'state': { 'opened': true },
  //         'children': [
  //           {
  //             'text': 'crypto',
  //             'state': { 'opened': true },
  //             'children': [
  //               {
  //                 'text': 'coins',
  //                 'state': { 'opened': true }
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // })
}
// </region> *** infoSectionLoad ***
