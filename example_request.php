<?php //database.php
require_once 'include/config.php';
require_once 'requests.php';

$url = "https://api.at.govt.nz/v2/public/realtime";
# if we had query parametets say, trip_ids, we would include an array of them like below
$trip_ids = array("18028094941-20170918164808_v58.16", "17101084273-20170918162843_v58.15");
$params = array("tripid" => $trip_ids);
//$params = array();
$results = apiCall($APIKey, $url, $params);
// Tell the browser we are sending back json
header('Content-Type: application/json');
print $results[0];

?>
