<template>
  <div>
    <div id="mapContainer"></div>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <EventComponent id='id' title='Anniversaire de Clara' descr="test déscription" address="6 rue Jeanne d'arc, Nancy 54000"/>
  </div>
</div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import EventComponent from "./EventComponent.vue";

export default {
  name: "LeafletMap",
  data() {
    return {
      map: null,
      myPosition: [48.692054, 6.184417],
    };
  },
  components: { EventComponent },
  mounted() {
    this.map = L.map("mapContainer").setView(this.myPosition, 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    //use a mix of renderers
    let customPane = this.map.createPane("customPane");
    customPane.style.zIndex = 399; // put just behind the standard overlay pane which is at 400
    let marker = L.marker([48.692154, 6.184517]).addTo(this.map)
      .bindPopup(`<h4 class="text-center">Anniversaire de Clara</h4>
                <p class="text-center fs-6">6 rue Jeanne d'arc, Nancy 54000</p>
                <div class="d-flex justify-content-center">
                <button class="btn btn-primary" type="btn" data-bs-toggle ="modal" data-bs-target="#exampleModal">voir plus</button>
                </div>`);
  },
  created() {
    /*if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("test");
        this.myPosition = [position.coord.latitude, position.coords.longitude];
        console.log(this.myPosition);
      });
    } else {
      console.log("test2");
    }*/
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

.modal-dialog{
  max-width:70vw;
}

@media screen  and (max-width: 638px){
  .modal-dialog[data-v-5567ea9e]{
    max-width: 100vw;
  }

}
</style>