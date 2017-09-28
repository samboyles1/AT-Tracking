<?php
$active = "home";
require_once 'include/header.php';
require_once 'database.php';
?>

<script>
    var dbRoutes = <?php echo json_encode(getAllRoutes($conn)); ?>;
</script>

<div id="listDiv">
    <h1 id="selectorTitle">Select a Route</h1>
    <select id="routeSelector" class="select-style" onchange="setSelectedRoute(this.value)">
        <option value="" disabled selected>routes...</option>
    </select>
</div>
<div id="mapdiv"></div>

<script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBh1cr8Qd4TKgA4DVOhH5NBLNvgEgmqBg4&callback=setup">
</script>
<script src="scripts/map.js"></script>

<?php
require_once 'include/footer.php';
?>
