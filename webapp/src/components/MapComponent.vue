<template>
  <div class="d-flex justify-content-center">
    <div id="mapContainer"></div>
    <div class="searchBar mt-2" style="min-width: 200px; width: 40%">
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
          @blur="setTimeout( () => autocompleteAddress = null, 1000)"
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

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div v-if="event" class="modal-dialog modal-dialog-centered">
        <EventComponent
          :id="event.id"
          :title="event.title"
          :descr="event.description"
          :address="event.coords.address"
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
      event: null,
    };
  },
  components: { EventComponent },
  mounted() {
    this.setMap();
  },

  methods: {
    /**
     * Récupère les coordonnées de l'utilisateur
     * @return none
     */
    async getUserPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          this.myPosition = [pos.coords.latitude, pos.coords.longitude];
          let marker = L.marker(this.myPosition);
          marker.addTo(this.map);
          marker.bindPopup(`<h4 class="text-center">Moi</h4>`);
          marker._icon.style.filter = "hue-rotate(150deg)";

          if (!this.idEvent) {
            this.map.flyTo(this.myPosition, 16);
          }
        });
      }

      this.setEventMarker();
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
     * Créé la carte
     * @return none
     */
    setMap() {
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

    /**
     * Ajoute un marker évènement si il y a un id dans la route
     * @return none
     */
    setEventMarker() {
      if (this.idEvent) {
        axios
          .get(this.$apiUrl + "/event/" + this.idEvent)
          .then((response) => {
            const event = response.data;
            this.event = event;
            L.marker([event.coords.lat, event.coords.long]).addTo(this.map)
              .bindPopup(`<h4 class="text-center">${event.title}</h4>
                <p class="text-center fs-6">${event.coords.address}</p>
                <div class="d-flex justify-content-center">
                <button class="btn btn-primary" type="btn" data-bs-toggle ="modal" data-bs-target="#exampleModal">voir plus</button>
                </div>`);
            this.map.flyTo([event.coords.lat, event.coords.long], 16);
          })
          .catch((error) => {
            this.$toast.error("Cette évènement est introuvable", {
              position: "bottom",
            });
          });
      }
    },

    /**
     * Centre la carte par rapport à l'adresse choisie
     * @params adresse (autoAddress)
     * @return none
     */

    centerByAddress(address) {
      this.map.flyTo(
        [address.geometry.coordinates[1], address.geometry.coordinates[0]],
        17
      );
    },
  },

  computed: {
    /**
     * retourne me parametre id
     */
    idEvent() {
      return this.$route.params.id;
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

.itemAutoCompleteAddress:hover {
  cursor: pointer;
  color: rgb(26, 103, 192);
}

@media screen and (max-width: 638px) {
  .modal-dialog[data-v-5567ea9e] {
    max-width: 100vw;
  }
}
</style>