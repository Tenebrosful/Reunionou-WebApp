<template>
  <div>
    <div id="mapContainer"></div>
    <div>
      <div class="searchBar mt-2" style="z-index:10;">
        <div class=" col-6" style="margin: 0 auto; min-width:200px;">
          <div class="input-group">
            <input
              type="text"
              class="form-control bg-white text-black"
              placeholder="Rechercher une adresse"
              aria-label="address"
              id="address"
              style="height: 50px"
              aria-describedby="basic-addon1"
              v-model="address"
              @keyup="getAutoAddress()"
              @blur="setTimeout(() => {autocompleteAddress = null}, 1000)"
              
            />
          </div>
          <div v-if="autocompleteAddress" class="bg-white autocomplete">
            <ul class="list-group">
              <li
                v-for="autoAddress in autocompleteAddress"
                :key="autoAddress.id"
                class="itemAutoCompleteAddress mt-1"
                v-on:click="
                  address = autoAddress.properties.label;
                  centerByAddress(autoAddress);
                  autocompleteAddress = null;
                "
              >
                {{ autoAddress.properties.label }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <EventComponent
          id="id"
          title="Anniversaire de Clara"
          descr="test déscription"
          address="6 rue Jeanne d'arc, Nancy 54000"
        />
      </div>
    </div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import EventComponent from "./EventComponent.vue";

export default {
  name: "LeafletMap",
  data() {
    return {
      map: null,
      myPosition: [48.692054, 6.184417],
      urlDataGouv: "https://api-adresse.data.gouv.fr/search/?q=",
      apiKey: "652ac131889244eda7dfaaf0728d63ae",
      address: "",
      autocompleteAddress: null,
    };
  },
  components: { EventComponent },
  mounted() {
    this.map = L.map("mapContainer").setView(this.myPosition, 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    this.getUserPosition();
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

  methods: {
    /**
     * Récupère les coordonnées de l'utilisateur
     * @return none
     */
    getUserPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          this.myPosition = [pos.coords.latitude, pos.coords.longitude];
          let marker = L.marker(this.myPosition);
          marker.addTo(this.map);
          marker.bindPopup(`<h4 class="text-center">Moi</h4>`);
          marker._icon.style.filter = "hue-rotate(150deg)";
          this.map.flyTo(this.myPosition, 16);
        });
      }
    },

    /**
     * Récupère une liste d'adresse ayant la data 'address' dans la requête
     */
    async getAutoAddress() {
      if (this.address) {
        const request = await axios.get(
          this.urlDataGouv + this.address + "&type=street&limit=7"
        );
        this.autocompleteAddress = request.data.features;
      } else {
        this.autocompleteAddress = null;
      }
    },

    /**
     * Centre la carte par rapport à l'adresse choisie
     * @params adresse (autoAddress)
     * @return none
     */

    centerByAddress(address) {
      this.map.flyTo([
        address.geometry.coordinates[1],
        address.geometry.coordinates[0]],
        17
      );
    },
  },
};
</script>

<style scoped>
#mapContainer {
  width: 100vw;
  height: 100vh;
  z-index: 0;
}

.modal-dialog {
  max-width: 70vw;
}

.myMarker {
  filter: hue-rotate(90deg);
  height: 1000px;
}

.searchBar {
  position: absolute;
  top: 0px;
  margin: 0 auto;
  width: 100%;
}

.itemAutoCompleteAddress:hover{
  cursor: pointer;
  color:rgb(26, 103, 192);
}

@media screen and (max-width: 638px) {
  .modal-dialog[data-v-5567ea9e] {
    max-width: 100vw;
  }
}
</style>