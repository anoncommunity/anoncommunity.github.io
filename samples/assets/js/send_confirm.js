// global.electron = require('electron');
// electron.webFrame.setZoomFactor(1.0);


$(function()
{
   // set initial items on form   
   setElementValue('send_confirm_address', remote.getGlobal('shared').send_address);
   setElementValue('send_confirm_amount', remote.getGlobal('shared').send_amount);
   setElementValue('send_confirm_recipient', remote.getGlobal('shared').send_recipient);
   
      qrcode = new QRCode("send_confirm_qrcode",
   {
      text           : 'LbPMKc5rTm4KWsbFqp8ALQZD8GPqY2qPWW',
      width          : 128,
      height         : 128,
      colorDark      : "#000000",
      colorLight     : "#ffffff",
      correctLevel   : QRCode.CorrectLevel.H
   });

});

function set_payment_fee()
{
   var tx_fee = remote.getGlobal('shared').send_txfee;
//   alert(tx_fee);

   if (isNaN(tx_fee)) tx_fee = 0.0002;

   main.rpc("settxfee", [tx_fee], function(res)
   {
     send_payment();
   });
}

function send_payment()
{
   var to_address = remote.getGlobal('shared').send_address;
   var comment_to = remote.getGlobal('shared').send_recipient;
   var tx_amount = remote.getGlobal('shared').send_amount;
   var recipient_pays = remote.getGlobal('shared').cbx_recipient_pays_fees;
   var use_is = remote.getGlobal('shared').cbx_instant_send;

   rpc_request("sendtoaddress", [to_address, tx_amount, '', comment_to, recipient_pays, use_is]);
}










ipcRenderer.on('update_with_selected_address_send_confirm_window', (event, arg) =>
{
   if (debug) if (debug) console.log('update_with_selected_address_rcv_window:');
   if (debug) if (debug) console.log(arg);
   
   $('#send_confirm_qrcode').empty();

   qrcode = new QRCode("send_confirm_qrcode",
   {
      text           : 'LbPMKc5rTm4KWsbFqp8ALQZD8GPqY2qPWW',
      width          : 128,
      height         : 128,
      colorDark      : "#000000",
      colorLight     : "#ffffff",
      correctLevel   : QRCode.CorrectLevel.H
   });
   
   setElementValue('send_confirm_address', arg[0]);
   setElementValue('send_confirm_amount',  arg[1]);
   setElementValue('send_confirm_account', arg[2]);
});

ipcRenderer.on('update_amount_rcv_window', (event, arg) =>
{
   setElementValue('amount', arg);
});


ipcRenderer.on('return_address', (event, arg) =>
{
   if (debug) console.log('return_address : ' + arg);
   if (typeof arg[0] == 'undefined')
   {
      rpc_request("getnewaddress", []);
   }
   else
   {
      var qrcode = new QRCode("qrcode", {
          text: arg[0],
          width: 128,
          height: 128,
          colorDark : "#000000",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
      });

      setElementValue('address', arg[0]);
      setElementValue('amount', arg[1]);
      setElementValue('account', arg[2]);
   }

});

$(document).on('click', '#btn_send_confirm', function () { set_payment_fee(); });
