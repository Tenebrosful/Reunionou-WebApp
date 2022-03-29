<template>
  <div v-if="$store.state.user">
    <div class="card col-10 p-5 mt-5" style="margin: 0 auto">
      <h2 class="mb-3 text-white">Créer un évènement</h2>
      <form>
        <div class="form-group row mt-3">
          <label for="title" class="col-sm-4 col-form-label text-white"
            >Titre</label
          >
          <div class="col-sm-8">
            <input
              type="text"
              class="form-control"
              id="title"
              v-model="title"
            />
            <p class="error text-danger">{{ errorTitle }}</p>
          </div>
        </div>
        <div class="form-group row mt-3">
          <label for="date" class="col-sm-4 col-form-label text-white"
            >Date</label
          >
          <div class="col-sm-8">
            <input
              type="datetime-local"
              class="form-control"
              id="date"
              v-model="date"
            />
            <p class="error text-danger">{{ errorDate }}</p>
          </div>
        </div>
        <div class="form-group row mt-3">
          <label for="address" class="col-sm-4 col-form-label text-white"
            >Adresse</label
          >
          <div class="col-sm-8">
            <div class="input-group mb-3">
              <span
                class="input-group-text"
                id="basic-addon1"
                @click="displayMap()"
                style="cursor: pointer"
                ><i class="las la-map-marked la-2x"></i
              ></span>
              <input
                type="text"
                class="form-control"
                placeholder="adresse"
                aria-label="address"
                id="address"
                style="height: 50px"
                aria-describedby="basic-addon1"
                v-model="address"
                @keyup="getAutoAddress()"
                @blur="setTimeout(() => (autocompleteAddress = null), 1000)"
              />
            </div>
            <div v-if="autocompleteAddress" class="bg-white autocomplete">
              <ul class="list-group mt-3">
                <li
                  v-for="autoAddress in autocompleteAddress"
                  :key="autoAddress.id"
                  class="itemAutoCompleteAddress"
                  @click="
                    address = autoAddress.properties.label;
                    setPointByAddress(autoAddress);
                    autocompleteAddress = null;
                  "
                >
                  {{ autoAddress.properties.label }}
                </li>
              </ul>
            </div>
            <p class="error text-danger">{{ errorAddress }}</p>
          </div>
        </div>
        <div class="form-group row mt-3">
          <label for="description" class="col-sm-4 col-form-label text-white"
            >Description</label
          >
          <div class="col-sm-8">
            <textarea
              class="form-control"
              id="description"
              rows="3"
              v-model="description"
            ></textarea>
            <p class="error text-danger">{{ errorDescription }}</p>
          </div>
        </div>
        <button
          type="button"
          class="btn btn-primary mt-5"
          @click="submitEvent()"
        >
          Valider
        </button>
        <br />
        <router-link class="float-end mt-5" to="/"
          >Retour à la carte</router-link
        >
      </form>
    </div>
    <div id="modalMap" class="closeMap">
      <div id="map"></div>
      <i
        class="las la-times-circle la-3x btnClose"
        style="
          z-index: 5;
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
        "
        @click="displayMap()"
      ></i>
    </div>
  </div>
  <div v-else>
    <h1 class="text-white mt-5">
      Vous devez être connecté pour créer un évènement
    </h1>
    <router-link class="mt-5" to="/">Retour à la carte</router-link>
  </div>
</template>

<script>
import L from "leaflet";
import axios from "axios";
export default {
  data() {
    return {
      title: "",
      errorTitle: "",
      date: "",
      errorDate: "",
      description: "",
      errorDescription: "",
      map: null,
      myPosition: [48.692054, 6.184417],
      markerPosition: null,
      marker: null,
      display: true,
      urlGeoapify: "https://api.geoapify.com/v1/geocode/reverse?",
      urlDataGouv: "https://api-adresse.data.gouv.fr/search/?q=",
      apiKey: "652ac131889244eda7dfaaf0728d63ae",
      address: "",
      errorAddress: "",
      autocompleteAddress: null,
    };
  },
  mounted() {
    if (this.$store.state.user) {
      this.map = L.map("map").setView(this.myPosition, 16);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
      //use a mix of renderers
      let customPane = this.map.createPane("customPane");

      this.map.addEventListener("click", (e) => {
        this.setMarkerPosition(e);
      });
    }
  },
  methods: {
    /**
     * Enregistre un évènement
     * @return none
     */

    submitEvent() {
      if (!this.validateForm()) return;

      axios
        .post(
          this.$apiUrl + "/event",
          {
            title: this.title,
            date: this.date,
            description: this.description,
            coords: {
              address: this.address,
              lat: this.markerPosition[0],
              long: this.markerPosition[1],
            },
          },
          { headers: { authorization: this.$store.state.user.token } }
        )
        .then((response) => {
          this.$toast.success("L'évènement a été créé", {
            position: "bottom",
          });
          window.location.href = "/"
        })
        .catch((error) => {
          console.log(error);
          this.$toast.error("L'évènement n'a pas été créé. Erreur: " + error, {
            position: "bottom",
          });
        });
    },

    /**
     * Valide les données du formulaire
     * @return boolean
     */
    validateForm() {
      let error = false;

      if (!this.title) {
        this.errorTitle = "Veuillez entrer un titre !";
        error = true;
      }

      if (!this.date) {
        this.errorDate = "Veuillez entrer une date !";
        error = true;
      }

      if (!this.address) {
        this.errorAddress =
          "Veuillez entrer une adresse ou choisir un point sur la carte !";
        error = true;
      }

      if (!this.description) {
        this.errorDescription = "Veuillez entrer une description !";
        error = true;
      }

      return !error;
    },

    /**
     * Lors d'un clique sur la carte
     * Modifie la position de l'évènement
     * @params : Objet point (e)
     * @return : null
     */
    setMarkerPosition(e) {
      this.markerPosition = [e.latlng.lat, e.latlng.lng];

      this.$toast.success("Votre marqueur a été enregistré", {
        position: "top",
      });

      this.setAddress();

      this.setMarker();
    },

    /**
     * Créé un marker sur la carte
     */
    setMarker() {
      if (!this.marker) {
        this.marker = L.marker(this.markerPosition).addTo(this.map);
      } else {
        this.marker.setLatLng(this.markerPosition);
      }

      this.marker.bindPopup(`<p class="text-center fs-6">${this.address}</p>`);
    },

    /**
     * Cherche une adresse à partir des coordonnées du marker et l'enregistre dans les datas
     * @return none
     */
    setAddress() {
      axios
        .get(
          this.urlGeoapify +
            "lat=" +
            this.markerPosition[0] +
            "&lon=" +
            this.markerPosition[1] +
            "&lang=fr&apiKey=" +
            this.apiKey
        )
        .then((response) => {
          const data = response.data.features[0].properties;
          this.address =
            data.street +
            " " +
            data.postcode +
            " " +
            data.city +
            ", " +
            data.country;
        })
        .catch((error) => {
          console.log(error);
          this.address = "adresse inconnue";
        });
    },

    /**
     * Enregistre les coordonnées d'une adresse
     * @params adresse (autoAddress)
     * @return none
     */

    setPointByAddress(address) {
      this.markerPosition = [
        address.geometry.coordinates[1],
        address.geometry.coordinates[0],
      ];
      this.setMarker();
    },

    /**
     * Gère l'affichage de la carte
     * @return none
     */
    displayMap() {
      this.display = !this.display;
      if (this.display) {
        document.getElementById("modalMap").classList.remove("displayMap");
        document.getElementById("modalMap").classList.add("closeMap");
      } else {
        document.getElementById("modalMap").classList.remove("closeMap");
        document.getElementById("modalMap").classList.add("displayMap");
        this.$toast.info("Cliquez sur la carte pour choisir un point", {
          position: "top",
        });
        this.map.invalidateSize();
      }
    },

    /**
     * Récupère les coordonnées de l'utilisateur
     * @return none
     */
    getUserPosition() {
      if (navigator.geolocation) {
        // get GPS position
        navigator.geolocation.getCurrentPosition((pos) => {
          this.myPosition = [pos.coords.latitude, pos.coords.longitude];

          this.map.panTo(this.myPosition);
        });
      }
    },

    /**
     * Récupère une liste d'adresse ayant la data 'address' dans la requête
     */
    async getAutoAddress() {
      if (this.address) {
        if (this.address.length > 8) {
          const request = await axios.get(
            this.urlDataGouv + this.address + "&type=street&limit=7"
          );
          this.autocompleteAddress = request.data.features;
        }
      } else {
        this.autocompleteAddress = null;
      }
    },
  },

  created() {
    if (this.$store.state.user) this.getUserPosition();
  },
};
</script>

<style scoped>
#map {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 0;
}

.modal-dialog {
  max-width: 80vw;
}

.modal-body {
  height: 90vh;
}

.displayMap {
  display: block;
}

.closeMap {
  display: none;
}

.btnClose:hover {
  color: dodgerblue;
}

.autocomplete {
  max-height: 500px;
  width: auto;
  position: absolute;
}

.itemAutoCompleteAddress:hover {
  cursor: pointer;
  color: rgb(26, 103, 192);
}
</style>