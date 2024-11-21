mapboxgl.accessToken =
  "pk.eyJ1IjoiYW5kcmVzZmVybjQxMyIsImEiOiJjbTNxY2E5ajMwcHdpMm5wc3dmZWUxaHVrIn0.RFjVRp1Np_R0dEgJ7pZHWg";

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [-74.033, 40.746], // starting position [lng, lat]
  zoom: 13.75, // starting zoom
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
const locations = [
  { coordinates: [-74.0327618, 40.7485811], name: "Columbus Park" },
  { coordinates: [-74.0317791, 40.7417982], name: "Church Square Park" },
  { coordinates: [-74.0300475, 40.7414881], name: "Stevens Park" },
  { coordinates: [-74.0273996, 40.7485778], name: "Elysian Park" },
  { coordinates: [-74.0351103, 40.7525261], name: "Northwest Resiliency Park"},
  { coordinates: [-74.0282121, 40.7546086], name: "Harborside Park" },
  { coordinates: [-74.0255863, 40.7515979], name: "Shipyard Park" },
  { coordinates: [-74.0254779, 40.7486785], name: "Maxwell Place Park" },
  { coordinates: [-74.0273669, 40.7413064], name: "Sinatra Park" },
  { coordinates: [-74.0276524, 40.7399832], name: "Pier C Park" },
  { coordinates: [-74.0279966, 40.7374069], name: "Pier A Park" },
];

// Add park markers
locations.forEach(location => {
  const el = document.createElement('div');
  el.className = 'park-marker';
  el.title = location.name;

  new mapboxgl.Marker(el)
      .setLngLat(location.coordinates)
      .addTo(map);
});
