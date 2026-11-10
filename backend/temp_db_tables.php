<?php
$host='127.0.0.1'; $user='root'; $pass=''; $db='erp_backend';
$mysqli = new mysqli($host,$user,$pass,$db);
if ($mysqli->connect_error) { echo 'CONNECT ERR: '.$mysqli->connect_error."\n"; exit(1); }
$res = $mysqli->query("SHOW TABLES");
while ($row = $res->fetch_array()) { echo $row[0]."\n"; }
$res->close();
$mysqli->close();
