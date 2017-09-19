<?php
$active = "home";
require_once 'include/header.php';
?>

<div id="mapdiv"></div>

<script async defer
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBh1cr8Qd4TKgA4DVOhH5NBLNvgEgmqBg4&callback=setup">
</script>
<script src="scripts/map.js"></script>
<script>
    $(document).ready(function() {

    });
</script>
<?php
require_once 'include/footer.php';
?>
