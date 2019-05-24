console.log('home-section.js');

var data = [];
var dbtc = [];

var view_home = {}


//load required scripts
// $.getScript('assets/js/modules/candlestick_chart.js');
// $.getScript('assets/js/modules/last_update.js', function() {home_section_init()});

//<region> *** home-section_init ***
// this runs before section is loaded
// so updating elements from here won't work
// until section is loaded
function home_section_init () {
  view_home.last_update.default(10000)

  if (hsl_js_not_loaded)
  {
    home_section_load();
  }
}
//</region> *** home-section_init ***

//<region> *** home-section_load ***
// runs every time section is loaded
function home_section_load()
{
  getLastUpdate();
  drawChart();
}
//</region> *** home-section_load ***
