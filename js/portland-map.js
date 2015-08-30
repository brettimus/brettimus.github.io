/**
 * Example style rule

 var styleRule = {
   featureType: '',
   elementType: '',
   stylers: [
     {hue: ''},
     {saturation: ''},
     {lightness: ''},
     // etc...
   ]
 };

 */

function portlandMapStyles() {
  var all = {
      featureType: "all",
      stylers: [
          { hue: "#222222" },
          { saturation: -100 },
          { lightness: "-30" },
      ]
  };

  var noNeighborhoodLabels = {
    featureType: "administrative.neighborhood",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  };

  var noRoadLabels = {
    featureType: "road",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  };

  var noPOILabels = {
    featureType: "poi",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  };

  var arterialRoadStyles = {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        { hue: "#ffceb1" },
        { saturation: 5 },
        { lightness: 10 }
      ]
  };

  var highwayRoadStyles = {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      { hue: "#0198B6" },
      { saturation: 10 }
    ]
  };

  var waterStyles = {
      featureType: "water",
      elementType: "all",
      stylers: [
        { hue: "#0198B6" },
        { saturation: 10 }
      ]
  };

  var mapStyles = [
      all,
      noNeighborhoodLabels,
      noRoadLabels,
      noPOILabels,
      arterialRoadStyles,
      highwayRoadStyles,
      waterStyles,
  ];

  return mapStyles;
}

function portlandMap() {
    var map,
        styles = portlandMapStyles(),
        marker,
        markerImage;

    map = new google.maps.Map(document.getElementById('portland'), {
        center: {
            lat: 45.5189616,
            lng: -122.6520927,
        },
        zoom: 12,
        minZoom: 12,
        maxZoom: 12,
        disableDefaultUI: true,
        draggable: false,
        styles: styles,
    });

    markerImage = {
      url: "/img/sq/me-sm-sq.png", // needs an already scaled photo
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(50, 50)
    };

    marker = new google.maps.Marker({
        position: {
            lat: 45.5189616,
            lng: -122.6520927,
        },
        animation: google.maps.Animation.DROP,
        map: map,
        icon: "/img/icon-boots-50.svg",
        title: "Sup?"
        // icon: markerImage,
    });

    var infowindow = new google.maps.InfoWindow({
      content: "<div class='info-window'><b>Fun fact!</b> My nickname is Boots.</div>"
    });

    marker.addListener("click", function() {
        infowindow.open(map, marker);
    });
}

