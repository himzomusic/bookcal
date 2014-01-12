<?php
//check if param exists
if (!isset($_POST['day']) || !isset($_POST['time']))
    die("Parameter missing");
//connect to mysql
$link = mysql_connect("localhost", "root", "");
if (!$link) {
    die('Could not connect: ' . mysql_error());
}
mysql_select_db("bookcal", $link);

//read the values from the URL
$day = $_POST['day'];
$time = $_POST['time'];
//delete from table query
$result = mysql_query("DELETE FROM bookings WHERE day='".$day."' AND time='".$time."'");

//return query result
if($result){
	header('Content-type: text/json');
	header('Content-type: application/json');
	echo '[{ "status_code": 200, "status_txt": "OK" }]';
} else {
	header('Content-type: text/json');
	header('Content-type: application/json');
	echo '[{ "status_code": 503, "status_txt":'.mysql_error().' }]';
}

//close db connection
mysql_close($link);
?>