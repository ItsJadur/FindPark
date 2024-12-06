mapboxgl.accessToken =
  "pk.eyJ1IjoiYW5kcmVzZmVybjQxMyIsImEiOiJjbTNxY2E5ajMwcHdpMm5wc3dmZWUxaHVrIn0.RFjVRp1Np_R0dEgJ7pZHWg";

function getBoundingBox([longitude, latitude], radiusInMiles = 0.5) {
  const milesToDegrees = 1 / 69;
  const latitudeRadius = radiusInMiles * milesToDegrees;
  const longitudeRadius =
    (radiusInMiles * milesToDegrees) / Math.cos(latitude * (Math.PI / 180));

  const minLongitude = longitude - longitudeRadius;
  const maxLongitude = longitude + longitudeRadius;
  const minLatitude = latitude - latitudeRadius;
  const maxLatitude = latitude + latitudeRadius;

  return [minLongitude, minLatitude, maxLongitude, maxLatitude];
}

async function getParks(center) {
  let locations = [];
  let BoundingBox = getBoundingBox([center.lng, center.lat]);

  const url = `https://api.mapbox.com/search/searchbox/v1/category/park?access_token=${mapboxgl.accessToken}&poi_category_exclusions=swimming_pool,dog_park&limit=25&origin=${center.lng},${center.lat}&proximity=${center.lng},${center.lat}&bbox=${BoundingBox[0]},${BoundingBox[1]},${BoundingBox[2]},${BoundingBox[3]}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Add new markers
    for (const feature of data.features) {
      locations.push(feature);
    }
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
function addLocationToList(location) {
  const list = document.getElementById("locations-list");
  const listItem = document.createElement("li");
  listItem.textContent = location.properties.name;
  listItem.style.cursor = "pointer";

  listItem.addEventListener("click", () => {
    markers.forEach((marker) => marker.remove());
    const marker = new mapboxgl.Marker()
      .setLngLat(location.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `<h4>${location.properties.name}</h4><p>${
            location.properties.full_address
          }</p>`
        )
      )
      .addTo(map);

    marker.getElement().addEventListener("click", () => {
      marker.togglePopup();
    });

    markers.push(marker);
    map.flyTo({
      center: location.geometry.coordinates,
      zoom: 16,
      essential: true,
      duration: 3000,
    });
  });

  list.appendChild(listItem);
}
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [-74.033, 40.746], // starting position [lng, lat]
  zoom: 13.75, // starting zoom
});
map.addControl(
  new mapboxgl.GeolocateControl({
    showAccuracyCircle: false,
    positionOptions: {
      enableHighAccuracy: true,
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true,
  })
);
let markers = [];
function distanceInFeet(coord1, coord2) {
  const earthRadiusFeet = 20925524.9; // Earth radius in feet
  const dLat = (coord2[1] - coord1[1]) * (Math.PI / 180);
  const dLng = (coord2[0] - coord1[0]) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1[1] * (Math.PI / 180)) *
      Math.cos(coord2[1] * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusFeet * c;
}

// Function to filter out markers that are too close to each other
function filterCloseLocations(locations, thresholdFeet = 300) {
  const filtered = [];
  locations.forEach((location) => {
    const isTooClose = filtered.some((existingLocation) => {
      return (
        distanceInFeet(
          location.geometry.coordinates,
          existingLocation.geometry.coordinates
        ) < thresholdFeet
      );
    });
    if (!isTooClose) {
      filtered.push(location);
    }
  });
  return filtered;
}

document.getElementById("FindParks").addEventListener("click", async () => {
  document.getElementById("locations-list").innerHTML = "";

  const center = map.getCenter();
  let locations = await getParks(center);

  // Filter locations to remove ones that are too close
  const filteredLocations = filterCloseLocations(locations);

  filteredLocations.forEach((location) => {
    addLocationToList(location);
  });
});
