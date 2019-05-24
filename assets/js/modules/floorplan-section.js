/* global
  $
  islJsNotLoaded
  getLastUpdate
  drawChart
*/

console.log('floorplan-section.js')

// load required scripts
// $.getScript('assets/js/maphilight.min.js')

// <region> *** floorplanSectionInit ***
// this runs before section is loaded
// so updating elements from here won't work
// until section is loaded
function floorplanSectionInit () {
//  infoSection.last_update.default(10000)
}
// </region> *** floorplanSectionInit ***

// <region> *** floorplanSectionLoad ***
// runs every time section is loaded
function floorplanSectionLoad () {
  console.log('*** floorplanSectionLoad ***')
  $(function() {
  // var db = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);
  // console.log(db)
          $('.map').maphilight({
              fillColor: '008800',
              stroke: false
          });

          $('.desk').mouseover(function(e) {
            let desk = this.id
            // let user = $('#user-select').val()
            // console.log(desk)
            $.getJSON('http://172.21.77.252:9090/api/infra?desk=' + desk, function (data) {
              // console.log(data[0].Location)
              $('#location').val(data[0].Location)
              $('#user').val(data[0].User)
              $('#net-port-1').val(data[0].NetPort1)
              $('#net-port-2').val(data[0].NetPort2)
              $('#switch-port-1').val(data[0].SwitchPort1)
              $('#switch-port-2').val(data[0].SwitchPort2)
              $('#pc1').val(data[0].PC1)
              $('#pc2').val(data[0].PC2)
              $('#pc3').val(data[0].PC3)
              $('#igel').val(data[0].iGel)
              if (!data[0].NetConn1) { $('#net-port-1').addClass('no-connection') }
              if (data[0].SwitchPort1 == 'NC') { $('#switch-port-1').addClass('no-connection') }
              if (!data[0].NetConn2 && data[0].NetPort2 != null) { $('#net-port-2').addClass('no-connection') }
              if (data[0].SwitchPort2 == 'NC') { $('#switch-port-2').addClass('no-connection') }
              // if (!data[0].NetConn2 || data[0].NetPort2 == 'NA') { $('#net-port-2').addClass('no-connection') }
            })
          }).mouseout(function(e) {
            $('.net-port').removeClass('no-connection')
            $('.switch-port').removeClass('no-connection')
          })

          var getUserData = function () {
            // let taggedName = '<name>' + $('#name').val() + '</name>'
            let desk = this.id
            // let user = $('#user-select').val()
            console.log(desk)
            $.getJSON('http://172.21.77.252:9090/api/infra?desk=' + desk, function (data) {
              console.log(data)
              var response = data.result
              // $('#name').val(taggedName)
              // $('#role').val(response.matches[0].title[0])
              // $('#team').val(response.matches[0].department[0])
              // $('#employee-number').val(response.matches[0].employeeID[0])
              // $('#email').val(response.matches[0].mail[0] + 'emailend')
            })
          }


          // $('#hilightlink').mouseover(function(e) {
          //     $('#square2').mouseover();
          // }).mouseout(function(e) {
          //     $('#square2').mouseout();
          // }).click(function(e) { e.preventDefault(); });
          // $('#starlink').click(function(e) {
          //     e.preventDefault();
          //     var data = $('#star').data('maphilight') || {};
          //     data.neverOn = !data.neverOn;
          //     $('#star').data('maphilight', data);
          // });
          // $('#star,#starlink2').click(function(e) {
          //     e.preventDefault();
          //     var data = $('#star').mouseout().data('maphilight') || {};
          //     data.alwaysOn = !data.alwaysOn;
          //     $('#star').data('maphilight', data).trigger('alwaysOn.maphilight');
          // });
      });
    }
// </region> *** floorplanSectionLoad ***
