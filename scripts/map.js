function initMap() {
        var auckland = {lat:-36.848461, lng:174.763336};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: auckland
        });
        var marker = new google.maps.Marker({
          position: auckland,
          map: map
        });
      }