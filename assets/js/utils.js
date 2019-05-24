/* global $ drawChart */

var boolPinMenu = false;
var resizeDelay;
var coinfullname = 'zclassic';


function frameChange(doc)
{
  if (!boolPinMenu)
  {
    closeNav();
  }

  if (doc != current_frame)
  {
    current_frame = doc;
    $('.frame').fadeOut(300, function()
    {
    $('.frame').load(doc);
    $('.frame').fadeIn(2000);
    });
  }
}


function containerClick(classId)
{
   if (!boolPinMenu)
   {
      closeNav();
   }
   console.log(classId);
   $('.menurow').removeClass('active');
   $(this).addClass('active');
   $('.container').hide();
   $(classId).show();
   resizeNow();//redraw charts
}

function pinMenu()
{
   // console.log('pinMenu');
   if ($(".is-menu-visible")[0])
   {
      boolPinMenu = !boolPinMenu;
      if (boolPinMenu)
      {
         $('#btn_pin_img').attr('src', 'assets/icons/pngPinInv_32.png');
      }
      else
      {
         $('#btn_pin_img').attr('src', 'assets/icons/pngPinNorm_32.png');
      }
      $('#main-div').toggleClass('fix_menu');
   }
}

function openNav()
{
  console.log('openNav');
  $('body').addClass('is-menu-visible');
  $('#main-div').removeClass('unslide');
  $('#main-div').addClass('slide');
  $('#chart_div').removeClass('chart_end');
  $('#chart_div').addClass('chart_sliding');
}

function closeNav()
{
   if (boolPinMenu)
   {
      pinMenu();
   }
      $('#main-div').removeClass('slide');
      $('body').removeClass('is-menu-visible');
      $('#main-div').addClass('unslide');
      $('#chart_div').removeClass('chart_end');
      $('#chart_div').addClass('chart_sliding');
      $('#menu').addClass('close');
}

function toggleNav()
{

   if ($(".is-menu-visible")[0])
   {
      closeNav();
   }
   else
   {
      openNav();
   }
//   resizeNow();
}

function setElementValue(element, value)
{
   var el = $('#' + element);
   if (el.text() == value) return;
   el.text(value);
}


function JSON_fromString(json)
{
   var ret={};
   try { ret=JSON.parse(json); } catch (e) { console.log(e); };
   return ret;
}


function nFormat(n, precision, strip)
{
//console.log(typeof parseFloat(n));
//console.log(typeof 18240836.0);
   if (!precision) precision = 0;
   n = parseFloat(n);
 console.log(n.toLocaleString('en'));
if (precision == 0)
{
   return n.toLocaleString('en', {maximumSignificantDigits : 21});
}
else
{
   return  n.toFixed(precision);
}
 //  if (strip && precision > 0) n = n.replace(/0+$/, "").replace(/[.]$/, "");
//   n=parseFloat(n);
}


function msg(s)
{
   if (s=="") $('#msg').html('').hide();
   else $('#msg').text(s).show();
}


function settext(element,t)
{
   var el=$('#'+element);
   if (el.text()==t) return;
   el.text(t);
}

function setHtml(element, h) {
    var el = $('#' + element);
    if (el.data('rawhtml') == h) return;
    el.html(h);
    el.data('rawhtml', h)
}

function setcolour(element, c) {
    var el = $('#' + element);
    if (el.css('color') == c) return;
    el.css('color', c);
}


function update_gui()
{
  //  $('#daemonConsole').html = main.daemonString;
    sethtml('daemonConsole', main.daemonString);

    function date(t) {
        var d = new Date(t * 1000);
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return isNaN(d.getDate()) ? "" : d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
//        return d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
    }

    function time(t) {
        var d = new Date(t * 1000);
        var h = "0" + d.getHours() % 24;
//        var h = isNaN(d.getHours()) ? ".." : "0" + d.getHours() % 24;
        var m = "0" + d.getMinutes();
//        var m = isNaN(d.getMinutes()) ? ".." : "0" + d.getMinutes();
        var s = "0" + d.getSeconds();
//        var s = isNaN(d.getSeconds()) ? ".." : "0" + d.getSeconds();
        return isNaN(s) ? "pending" : rtrunc(h) + ":" + rtrunc(m) + ":" + rtrunc(s);
//        return rtrunc(h) + ":" + rtrunc(m) + ":" + rtrunc(s);
    }

    function rtrunc(t)
    {
        return t.substr(t.length - 2);
    }


    function parseMilliseconds(milliseconds) {
        //Get hours from milliseconds
        var hours = milliseconds / (1000 * 60 * 60);
        var absoluteHours = Math.floor(hours);
        var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

        //Get remainder from hours and convert to minutes
        var minutes = (hours - absoluteHours) * 60;
        var absoluteMinutes = Math.floor(minutes);
        var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

        //Get remainder from minutes and convert to seconds
        var seconds = (minutes - absoluteMinutes) * 60;
        var absoluteSeconds = Math.floor(seconds);
        var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;


        return h + ':' + m + ':' + s;
    }

    var trans="";
}

function download_progress(file,size,bytes)
{
   $('#progressbar').css('width',Math.ceil(bytes/size*100)+'%');
}

function setUpdater(func,time)
{
   setInterval(func,time);
   setTimeout(func,0); // run right away
}
