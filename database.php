<?php
require_once("config.php");
require_once("modles/Route.php");

$conn = new mysqli($hostname, $username, $password, $database);

if ($conn->connect_error)
{
    fatalError($conn->connect_error);
    return;
}


function getAllRoutes($conn)
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

            $results[] = new Route($row['name'], $row['price'], $row['quantity']);

            $current_route_id = $row['route_id'];
            $route = new Route($row['route_short_name'], $row['route_id']);
            $trip_ids = array();
            while($row['route_id'] == $current_route_id){
                $row = $result->fetch_array(MYSQLI_ASSOC);
                if($row['route_id'] == $current_route_id){
                    $trip_ids[] = $row['trip_id'];
                }
            }
            $route.add_trips($trip_ids);
            $results[] = $route;

        }

        $result->close();
    }
    return $results;
}
?>