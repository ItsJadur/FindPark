mapboxgl.accessToken =
  "pk.eyJ1IjoiYW5kcmVzZmVybjQxMyIsImEiOiJjbTNxY2E5ajMwcHdpMm5wc3dmZWUxaHVrIn0.RFjVRp1Np_R0dEgJ7pZHWg";

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true,
  })
);
