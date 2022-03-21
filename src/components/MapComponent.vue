<template>
  <div id="mapContainer"></div>
  {{myPosition}}
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default {
  name: "LeafletMap",
  data() {
    return {
      map: null,
      myPosition: [48.692054, 6.184417],
    };
  },
  mounted() {
    console.log(navigator.geolocation);
    this.map = L.map("mapContainer").setView(this.myPosition, 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    //use a mix of renderers
    let customPane = this.map.createPane("customPane");
    customPane.style.zIndex = 399; // put just behind the standard overlay pane which is at 400
    L.marker([48.692154, 6.184517]).addTo(this.map)
      .bindPopup(`<h4 class="text-center">Anniversaire de Clara</h4>
                <p class="text-center fs-6">6 rue Jeanne d'arc, Nancy 54000</p>
                <div class="d-flex justify-content-center">
                <button class="btn btn-primary" type="btn">voir plus</button>
                </div>`);
  },
  created() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
      console.log("test");
      this.myPosition = [position.coord.latitude, position.coords.longitude];
      console.log(this.myPosition);
    });
    } else {console.log('test2');}
  },

  onBeforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
};
</script>

<style scoped>
#mapContainer {
  width: 100vw;
  height: 100vh;
  z-index: 0;
}
</style>