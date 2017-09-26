<?php
$active = "home";
require_once 'include/header.php';
require_once 'database.php';

$routes = getAllRoutes($conn);
?>

<script>
    function showTripsForRoute(route_id) {
        console.log( route_id + " " +  
            <?php echo $routes ?> 
            );
    }
</script>

<div id="wrapper">
<<<<<<< HEAD
    <div id="listDiv">
        <select id="routeSelecter" style="width: 100px" onchange="showTripsForRoute(this.value)">
            <?php
            foreach($routes as $route) { ?>
            <option value="<?php echo $route->get_id() ?>"><?php echo $route->get_name() ?></option>
            <?php }?>
        </select>
=======
    <div id="listWrapper">
        <div><h1>Select a route</h1></div>
        <div id="listDiv">
            <select multiple size="28" id="routeSelecter">
                <?php
                $routes = getAllRoutes($conn);
                foreach($routes as $route) { ?>
                    <option id="options" value="<?php echo $route->get_id() ?>"><?php echo $route->get_name() ?></option>
                <?php }?>
            </select>
        </div>
>>>>>>> origin/master
    </div>
    <div id="mapdiv"></div>
</div>

<script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBh1cr8Qd4TKgA4DVOhH5NBLNvgEgmqBg4&callback=setup">
</script>
<script src="scripts/map.js"></script>
<script>
    $(document).ready(function() {
    });

    var  routes_as_javascript = <?php echo json_encode(getAllRoutes($conn)); ?>;
</script>
<?php
require_once 'include/footer.php';
?>
