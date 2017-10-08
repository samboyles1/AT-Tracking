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
    $other_query = "SELECT routes.route_id, routes.route_short_name, routes.route_long_name
                    FROM akl_transport.routes";

    //sanitize the query
    mysqlCleaner($other_query);

    $dbresult = $conn->query($other_query);
    if (!$dbresult)
    {
        fatalError($conn->error);
    }
    else {
        while ($row = $dbresult->fetch_array(MYSQLI_ASSOC))
        {
            $route = new Route($row['route_short_name'] . ' ' . $row['route_long_name'], $row['route_id']);
            $results[] = $route;
        }
        $dbresult->close();
    }
    return $results;
}

function mysqlCleaner($data)
{
    $data= stripslashes($data);
    return $data;
}

?>