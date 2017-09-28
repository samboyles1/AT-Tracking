<?php
require_once("include/config.php");
require_once("models/Route.php");

$conn = new mysqli($hostname, $username, $password, $database);

if ($conn->connect_error)
{
    fatalError($conn->connect_error);
    return;
}

function getAllRoutes($conn)
{
    $results = array();
    $query = "SELECT routes.route_short_name, routes.route_long_name, trips.route_id, trips.trip_id 
              FROM akl_transport.trips, akl_transport.routes
              WHERE trips.route_id = routes.route_id;";
    $dbresult = $conn->query($query);
    if (!$dbresult)
    {
        fatalError($conn->error);
    }
    else {
        while ($row = $dbresult->fetch_array(MYSQLI_ASSOC))
        {

            $current_route_id = $row['route_id'];
            $route = new Route($row['route_short_name'] . ' ' . $row['route_long_name'], $row['route_id']);
            $trip_ids = array();
            while($row['route_id'] == $current_route_id){
                $row = $dbresult->fetch_array(MYSQLI_ASSOC);
                if($row['route_id'] == $current_route_id){
                    $trip_ids[] = $row['trip_id'];
                }
            }
            $route->add_trips($trip_ids);
            $results[] = $route;
        }
        $dbresult->close();
    }
    return $results;
}
?>