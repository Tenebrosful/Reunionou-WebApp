<template>
  <div>
    <div class="card col-5 p-5 mt-5" style="margin: 0 auto">
      <h2 class="mb-3 text-white">Connexion</h2>
      <form>
        <div class="mb-3">
          <label for="inputUsername" class="form-label text-white"
            >Nom d'utilisateur</label
          >
          <input
            type="text"
            class="form-control"
            id="inputUsername"
            v-model="username"
            @keyup.enter="nextInput('inputPassword')"
          />
          <p class="error text-danger">{{ errorUsername }}</p>
          <div id="emailHelp" class="form-text"></div>
        </div>
        <div class="mt-5">
          <label for="inputPassword" class="form-label text-white"
            >Mot de passe</label
          >
          <input
            type="password"
            class="form-control"
            id="inputPassword"
            v-model="password"
            @keyup.enter="submitForm()"
          />
          <p class="error text-danger">{{ errorPassword }}</p>
        </div>

        <button
          type="button"
          class="btn btn-primary mt-3"
          @click="submitForm()"
        >
          Valider
        </button>
        <br />
        <router-link to="/inscription"
          ><p class="text text-end mt-5" style="width: 100%">
            Vous n'êtes toujours pas inscrit ?
          </p>
        </router-link>
        <router-link to="/"
          ><p class="text text-start mt-5" style="width: 100%">
            Retour à la carte
          </p>
        </router-link>
      </form>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      username: "",
      password: "",
      error: false,
      errorUsername: "",
      errorPassword: "",
    };
  },

  methods: {
    /**
     * Enregistre un utilisateur
     * @return none
     */
    submitForm() {
      if (!this.validateForm()) return;

      axios
      .post(this.$apiUrl + '/auth', {
        login: this.username,
        password: this.password
      })
      .then((response) => {
        this.$store.commit("saveUser", response.data.user)
        console.log(axios.defaults.headers);
        window.location.href = '/'
      })
      .catch((error) => {
        this.$toast.error(
            error,
            { position: "bottom" }
          );
      })
    },

    /**
     * Valide les données du formulaire
     * @return boolean
     */
    validateForm() {
      this.clearError();

      let error = false;

      if (!this.username) {
        this.errorUsername = "Veuillez entrer un nom d'utilisateur !";
        error = true;
      }

      if (!this.password) {
        this.errorPassword = "Veuillez entrer un mot de passe !";
        error = true;
      }

      return !error;
    },

    /**
     * Vide les textes d'erreurs'
     * @return none
     */
    clearError() {
      this.errorUsername = "";
      this.errorPassword = "";
    },

    /**
     * Fait déscendre le focus d'un input
     * @params id de l'input suivant (input)
     * @return none
     */
    nextInput(input) {
      document.getElementById(input).focus();
    },
  },
};
</script>
