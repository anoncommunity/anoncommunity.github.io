/* global $
          google
          setElementValue
          data
*/

console.log('info-section-chart.js')
var coin = 'ZCL'
var options
var chart
var data1

var resizeDelay

window.onresize = function (event) {
  // drawChart()
  clearTimeout(resizeDelay)
  resizeDelay = setTimeout(resizeNow, 200)
}

function resizeNow () {
  drawChart()
//   drawChartBtc();
}

$(function () {
  $.getScript('https://www.gstatic.com/charts/loader.js', function () {
    google.charts.load('current', { 'packages': [ 'corechart' ] })
  })
})

$('#main-div').on('webkitTransitionEnd', function (e) {
  if (e.originalEvent.propertyName === 'width') {
    $('#chart_div').removeClass('chart_sliding')
    $('#chart_div').addClass('chart_end')

    drawChart()
  }
})

function drawChart () {
  var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['Work',     11],
    ['Eat',      2],
    ['Commute',  2],
    ['Watch TV', 2],
    ['Sleep',    7]
  ]);

  var options = {
    title: 'My Daily Activities'
  }

  chart = new google.visualization.PieChart(document.getElementById('chart_div'))
  chart.draw(data, options)
}

function setTooltipContent(dataTable,row) {
   // alert('ttt');
   //date.getDate() + ' ' + months[date.getMonth()]
   // var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
   var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    if (row != null) {
        var content = '<div class="custom-tooltip" ><h1>' + dataTable.getValue(row, 0) + '</h1><div>' + dataTable.getValue(row, 1) + '</div></div>'; //generate tooltip content
        var tooltip = document.getElementsByClassName("google-visualization-tooltip")[0];
        setElementValue('date', dataTable.getValue(row, 0).getDate() + ' ' + months[dataTable.getValue(row, 0).getMonth()]);
        setElementValue('open', '$' + dataTable.getValue(row, 2).toFixed(2));
        setElementValue('close', '$' + dataTable.getValue(row, 3).toFixed(2));
        setElementValue('low', '$' + dataTable.getValue(row, 1).toFixed(2));
        setElementValue('high', '$' + dataTable.getValue(row, 4).toFixed(2));
    }
}

function drawChartBtc()
{
   var data1 = new google.visualization.DataTable();

   data1.addColumn('date');
   data1.addColumn('number');
   data1.addColumn('number');
   data1.addColumn('number');
   data1.addColumn('number');
   data1.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});

   data1.addRows(dbtc);

   var options = {
                    title: "",
                    legend:
                    {
                       position: 'none'
                    },
                    backgroundColor:
                    {
                      fill:'transparent'
                    },
                    chartArea:
                    {
                       left:85,
                       top:10,
                       right:20,
                       bottom: 35,
                       width: '100%',
                       height: '100%'
                    },
                    height: 260,
                    candlestick:
                    {
                       fallingColor:
                       {
                          strokeWidth: 1,
                          stroke: '#000',
                          fill: '#a52714'
                       },
                       risingColor:
                       {
                          strokeWidth: 1,
                          stroke: '#000',
                          fill: '#0f9d58'
                       }
                    },
                    series:
                    {
                       0:
                       {
                          color: '#000'
                       }
                    },
                    vAxis:
                    {
                       title: "price (BTC)",
                       gridlines :
                       {
                          color: '#CCC'
                       }
                    },
                    hAxis:
                    {
                       title: "days of month",
                       textStyle :
                       {
                          color: '#333',
                          fontSize: 10
                       },
                       format: 'd',
                       gridlines :
                       {
                          color: '#F5F5F5',
                          count: 30
                       },
                    },
                    tooltip:
                    {
                       isHtml: true,
                       trigger: 'focus'
                    }
                 };

   // var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div_btc'));
   // chart.draw(data1, options);
}

function customHTML(date, low, open, close, high) {
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

console.log('customHTML');
setElementValue('low', '$' + low);


// return '<span>' + date.getDate() + ' ' + months[date.getMonth()] + ': low ' + '$' + low + ': open ' + '$' + open + ': close ' + '$' + close + ': high ' + '$' + high + '</span>';
return '<span></span>';
}
