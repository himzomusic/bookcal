<?php
$data = file_get_contents("php://input");
$objData = json_decode($data);

$user = $objData -> user;
$pass = $objData -> pass;

//connect to mysql
$link = mysql_connect("localhost", "root", "");
if (!$link) {
    die('Could not connect: ' . mysql_error());
}
mysql_select_db("bookcal", $link);

$num_rows = mysql_num_rows(mysql_query("SELECT * FROM users WHERE user='".$user."' AND pass='".$pass."'", $link ));

//return query result
if($num_rows == 0){
	header('HTTP/1.1 401 Unauthorized', true, 401);
} else {
    header("HTTP/1.1 200 OK");
}

//close db connection
mysql_close($link);
?>