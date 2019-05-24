<?php

//print_r($_POST);


$html = implode(PHP_EOL, array_map(
    function ($v, $k) { return sprintf('<%s>%s</%s><br>', $k, $v, $k); },
    $_POST,
    array_keys($_POST)
));

echo $html;

// the message
// $msg = 'name: ' . $_POST['name'] . PHP_EOL;
// $msg = $msg . 'role: ' . $_POST['role'] . PHP_EOL;
// $msg = $msg . 'team: ' . $_POST['team'] . PHP_EOL;
// $msg = $msg . 'employee number: ' . $_POST['employee-number'] . PHP_EOL;

$msg = implode(PHP_EOL, array_map(
    function ($v, $k) { return sprintf('<%s>%s</%s>', $k, $v, $k); },
    $_POST,
    array_keys($_POST)
));

//use this for the page output in browser
// $html = 'name: ' . $_POST['name'] . '<br>';
// $html = $html . 'role: ' . $_POST['role'] . '<br>';
// $html = $html . 'team: ' . $_POST['team'] . '<br>';
// $html = $html . 'employee number: ' . $_POST['employee-number'] . '<br>';

// use wordwrap() if lines are longer than 70 characters
$msg = wordwrap($msg, 70);
$headers = 'From: ' . $_POST['email'];
// send email
mail('nhd.requestforms@sepa.org.uk','Mobile Device',$msg);
?>
