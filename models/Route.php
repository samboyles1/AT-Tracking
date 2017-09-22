<?php
/**
 * Created by PhpStorm.
 * User: Shane
 * Date: 22/09/2017
 * Time: 2:25 PM
 */

class route {
    var $id;
    var $trip_ids;
    var $route_name;

    function __construct($route_short_name, $route_id) {
        $this->id = $route_id;
        $this->route_name = $route_short_name;
    }

    function add_trips($trips){
        $this->trip_ids = $trips;
    }

    function get_name(){
        return $this->route_name;
    }

    function get_id(){
        return $this->id;
    }
}

?>