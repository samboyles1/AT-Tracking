<?php
$active = "home";
require_once 'include/header.php';
?>

<div id="wrapper">
    <div id="listDiv">
        <select multiple size="10" id="routeSelecter">
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
            <option>Option 4</option>
            <option>Option 5</option>
            <option>Option 6</option>
            <option>Option 7</option>
            <option>Option 8</option>
            <option>Option 9</option>
        </select>
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
</script>
<?php
require_once 'include/footer.php';
?>
