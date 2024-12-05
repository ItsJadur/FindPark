mapboxgl.accessToken =
  "pk.eyJ1IjoiYW5kcmVzZmVybjQxMyIsImEiOiJjbTNxY2E5ajMwcHdpMm5wc3dmZWUxaHVrIn0.RFjVRp1Np_R0dEgJ7pZHWg";

async function getParks(center) {
  let locations = [];
  const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=park&language=en&poi_category=park&proximity=${center.lng},${center.lng}&session_token=0e3812df-4e80-4f71-8939-79bad3406d66&access_token=${mapboxgl.accessToken}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Add new markers
    await data.suggestions.forEach(async (suggestion) => {
      const url2 = `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestion.mapbox_id}?session_token=[GENERATED-UUID]&access_token=${mapboxgl.accessToken}`;
      const reponse2 = await fetch(url2);
      const data2 = await reponse2.json();

      if (data2.features.length !== 0) {
        data2.features.forEach((feature) => {
          locations.push(feature);
        });
      }
    });
  } catch (error) {
    console.error("Error fetching parks:", error);
  }
  return locations;
}

function getBounds(features) {
  const bounds = new mapboxgl.LngLatBounds();
  features.forEach((feature) => bounds.extend(feature.geometry.coordinates));
  return bounds;
}
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

document.getElementById("FindParks").addEventListener("click", async () => {
  const center = map.getCenter();
  let locations = await getParks(center);
  locations.forEach((location) => {
    console.log(location);
  });
});
