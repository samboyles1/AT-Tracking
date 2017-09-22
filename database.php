<?php
require_once("config.php");

$conn = new mysqli($hostname, $username, $password, $database);

if ($conn->connect_error)
{
    fatalError($conn->connect_error);
    return;
}


function getAllItems($conn)
{
    $results = array();
    $query = "SELECT route_short_name, trips.route_id, trips.trip_id 
              FROM akl_transport.trips, akl_transport.routes
              WHERE trips.route_id = routes.route_id;";
    $result = $conn->query($query);
    if (!$result)
    {
        fatalError($conn->error);
    }
    else {
        while ($row = $result->fetch_array(MYSQLI_ASSOC))
        {
            $results[] = new Item($row['name'], $row['price'], $row['quantity']);
        }

        $result->close();
    }
    return $results;
}
?>