<template>
  <div>
    {{ markerPosition }}
    <div class="card col-10 p-5 mt-5" style="margin: 0 auto">
      <h2 class="mb-3 text-white">Créer un évènement</h2>
      <form>
        <div class="form-group row mt-3">
          <label for="title" class="col-sm-4 col-form-label text-white"
            >Titre</label
          >
          <div class="col-sm-8">
            <input type="text" class="form-control" id="title" />
          </div>
        </div>
        <div class="form-group row mt-3">
          <label for="address" class="col-sm-4 col-form-label text-white"
            >Adresse</label
          >
          <div class="col-sm-8">
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1" @click="displayMap()" style="cursor:pointer;"><i class="las la-map-marked la-2x"></i></span>
              <input
                type="text"
                class="form-control"
                placeholder="adresse"
                aria-label="address"
                id="address"
                style="height:50px;"
                aria-describedby="basic-addon1"
              />
            </div>
          </div>
        </div>
        <div class="form-group row mt-3">
          <label for="description" class="col-sm-4 col-form-label text-white"
            >Description</label
          >
          <div class="col-sm-8">
            <textarea class="form-control" id="description" rows="3"></textarea>
          </div>
        </div>
        <button type="button" class="btn btn-primary mt-5">Valider</button>
        <br />
        <router-link class="float-end mt-5" to="/"
          >Retourner au menu</router-link
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
</template>

<script>
export default {
  data() {
    return {
      map: null,
      myPosition: [48.692054, 6.184417],
      markerPosition: null,
      marker: null,
      display: true,
    };
  },
  mounted() {
    this.map = L.map("map").setView(this.myPosition, 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    //use a mix of renderers
    let customPane = this.map.createPane("customPane");

    this.map.addEventListener("click", (e) => {
      this.setMarker(e);
    });
  },
  methods: {
    /**
     * Lors d'un clique sur la carte
     * Modifie la position de l'évènement et créé un marker
     * @params : Objet point (e)
     * @return : null
     */
    setMarker(e) {
      this.markerPosition = [e.latlng.lat, e.latlng.lng];

      if (!this.marker) {
        this.marker = L.marker(this.markerPosition).addTo(this.map)
          .bindPopup(`<h4 class="text-center">Anniversaire de Clara</h4>
                <p class="text-center fs-6">6 rue Jeanne d'arc, Nancy 54000</p>
                <div class="d-flex justify-content-center">
                <button class="btn btn-primary" type="btn" data-bs-toggle ="modal" data-bs-target="#exampleModal">voir plus</button>
                </div>`);
      } else {
        this.marker.setLatLng(this.markerPosition);
      }
    },

    displayMap() {
      this.display = !this.display;
      if (this.display) {
        document.getElementById("modalMap").classList.remove("displayMap");
        document.getElementById("modalMap").classList.add("closeMap");
      } else {
        document.getElementById("modalMap").classList.remove("closeMap");
        document.getElementById("modalMap").classList.add("displayMap");
        this.map.invalidateSize();
      }
    },

    /**
     * récupérer la position de l'utilisateur
     * @params null
     * @return null
     */
    getUserPosition(){
      
    }
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

.btnClose:hover{
  color: dodgerblue;
}
</style>