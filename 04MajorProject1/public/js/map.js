console.log(coordinate);
let newcoordinate=JSON.parse(coordinate);

const map = new maplibregl.Map({
  container: 'map',
//   style:'https://api.maptiler.com/maps/openstreetmap/style.json?key=rYIotyfPqG63nWqLyShV'
  style: 'https://api.maptiler.com/maps/streets/style.json?key='+mapApi, // stylesheet location
  center: newcoordinate, // starting position [lng, lat]
  zoom: 9 // starting zoom
});


const marker= new maplibregl.Marker({color:"red"})     // marker color
  .setLngLat(newcoordinate)            // [longitude, latitude]
  .setPopup(new maplibregl.Popup({offset: 25}).setHTML(
    `<h4> ${olocation} </h4><p>Exact location provided after booking</p>`
))
.addTo(map);                              // add it to the map instance


