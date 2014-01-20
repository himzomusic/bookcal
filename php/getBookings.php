<?php
//connect to mysql
$link = mysql_connect("localhost", "root", "");//("db.cendre.se", "wse657003", "cendre2013")
if (!$link) {
    die('Could not connect: ' . mysql_error());
}
mysql_select_db("bookcal", $link);//"wse657003", $link

if (isset($_GET['day']))
    $sql = "SELECT * FROM bookings WHERE day='".$_GET['day']."' ORDER BY time asc";
else 
    $sql = "SELECT * FROM bookings ORDER BY day, time asc";
    
//make a query to database
$result = mysql_query($sql, $link );
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