<?php
//check if param exists
if (!isset($_GET['day']))
    die("Parameter missing");
//connect to mysql
$link = mysql_connect("localhost", "root", "");
if (!$link) {
    die('Could not connect: ' . mysql_error());
}
mysql_select_db("bookcal", $link);

//read the day from URL
$day = $_GET['day'];
//make a query to database
$result = mysql_query("SELECT * FROM bookings WHERE day='".$day."' ORDER BY time asc", $link );
$num_rows = mysql_num_rows($result);
$i = 0;
//print JSON
header('Content-type: text/json');
header('Content-type: application/json');
echo '[';
while($row = mysql_fetch_array($result)) {
    echo '{"day":"'.$row["day"].'","time":"'.$row["time"].'","description":"'.$row["description"].'"}';
    $i++;
    if ($i < $num_rows) echo ",";
}
echo "]";
//close db connection
mysql_close($link);
?>