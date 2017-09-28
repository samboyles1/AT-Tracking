<?php
$active = "home";
require_once 'include/header.php';
require_once 'database.php';
?>


<!--<script>-->
<!--    var dbRoutes = --><?////php echo json_encode(getAllRoutes($conn)); ?><!--;-->
<!--</script>-->


<div id="wrapper">
    <div id="listWrapper">
        <div><h1>Select a route</h1></div>
        <div id="listDiv">
            <select id="routeSelector" style="width: 190px " onchange="setSelectedRoute(this.value)"></select>
        </div>
    </div>
    <div id="mapdiv"></div>
</div>

<script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBh1cr8Qd4TKgA4DVOhH5NBLNvgEgmqBg4&callback=setup">
</script>
<script src="scripts/map.js"></script>

<?php
require_once 'include/footer.php';
?>
