const sheetId = "1GJWUBWdRH2dziqCLmUSGxvM-eaHscqbidf_K9Jte77Q";
const sheetName = encodeURIComponent("locations");
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

function prepareText(rawText) {
  // remove the first and last characters
  return rawText.slice(1, -1);
}

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.text();
  })
  .then((text) => {
    // the first line is the header

    const lines = text.split("\n");

    const header = lines[0].split(",").map(prepareText);

    const locations = lines.slice(1).map((line) => {
      console.log(line);
      const rowData = line.split(",").map(prepareText);
      const row = {};
      header.forEach((key, index) => {
        row[key] = rowData[index];
      });
      return row;
    });

    drawLocations(locations, map);
  })
  .catch((error) => {
    console.error("There has been a problem with your fetch operation:", error);
  });

function drawLocations(locations, map) {
  locations.forEach((location) => {
    console.log(location);

    // use the specified marker color
    L.marker([location.lat, location.lon]).addTo(map).bindPopup(location.name);
  });
}

// Initialize the map
const zoomLevel = 8;
var map = L.map("map", {
  // no controls
  zoomControl: false,
}).setView([47, 9], zoomLevel); // Center on desired location

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: zoomLevel + 4,
  minZoom: zoomLevel - 2,
}).addTo(map);
