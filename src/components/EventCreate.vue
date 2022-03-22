<template>
  <div>
    <div class="card col-10 p-5 mt-5" style="margin: 0 auto">
      <h2 class="mb-3 text-white">Créer un évènement</h2>
      <form>
        <div class="form-group row mt-3">
          <label for="usernameInput" class="col-sm-4 col-form-label text-white"
            >Nom d'utilisateur</label
          >
          <div class="col-sm-8">
            <input type="text" class="form-control" id="InputUsername" />
          </div>
        </div>
        <div class="form-group row mt-3">
          <label for="inputPassword" class="col-sm-4 col-form-label text-white"
            >Mot de passe</label
          >
          <div class="col-sm-8">
            <input
              type="password"
              class="form-control"
              id="inputPassword"
              placeholder="Entrer un mot de passe"
            />
          </div>
        </div>
        <div class="form-group row mt-3">
          <label
            for="inputPasswordConfirm"
            class="col-sm-4 col-form-label text-white"
            >Confirmation mot de passe</label
          >
          <div class="col-sm-8">
            <input
              type="password"
              class="form-control"
              id="inputPasswordConfirm"
              placeholder="Confirmer le mot de passe"
            />
          </div>
        </div>
        <button type="button" class="btn btn-primary mt-5">Valider</button>
        <br />
        <router-link class="float-end mt-5" to="/connexion"
          >Vous avez déjà un compte ? Connectez-vous</router-link
        >
      </form>

      <div id="map"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      map: null,
      myPosition: [48.692054, 6.184417],
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

    let geocodeService = L.esri.Geocoding.geocodeService();
    customPane.style.zIndex = 399; // put just behind the standard overlay pane which is at 400
    this.map.addEventListener("click", (e) => {
      geocodeService
        .reverse()
        .latlng(e.latlng)
        .run(function (error, result) {
          if (error) {
            alert(error);
          } else alert(result.latlng);
        });
    });
  },
};
</script>

<style scoped>
#map {
    position: absolute;
  width: 90%;
  height: 100%;
}
</style>