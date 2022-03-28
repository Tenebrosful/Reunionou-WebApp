<template>
  <div>
    <div class="card col-5 p-5 mt-5" style="margin: 0 auto">
      <h2 class="mb-3 text-white">Inscription</h2>
      <form>

        <div class="form-group row mt-3">
          <label for="usernameInput" class="col-sm-4 col-form-label text-white"
            >Nom d'utilisateur <b class="text-danger">*</b></label
          >
          <div class="col-sm-8">
            <input
              type="text"
              class="form-control"
              id="InputUsername"
              v-model="username"
              @keyup.enter.exact="nextInput('loginInput')"
            />
            <p class="error text-danger">{{ errorUsername }}</p>
          </div>
        </div>

        <div class="form-group row mt-3">
          <label for="loginInput" class="col-sm-4 col-form-label text-white"
            >Identifiant <b class="text-danger">*</b></label
          >
          <div class="col-sm-8">
            <input
              type="text"
              class="form-control"
              id="loginInput"
              v-model="login"
              @keyup.enter.exact="nextInput('passwordInput')"
            />
            <p class="error text-danger">{{ errorUsername }}</p>
          </div>
        </div>

        <div class="form-group row mt-3">
          <label for="mailInput" class="col-sm-4 col-form-label text-white"
            >Email</label
          >
          <div class="col-sm-8">
            <input
              type="email"
              pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" 
              class="form-control"
              id="mailInput"
              v-model="mail"
              @keyup.enter.exact="nextInput('inputPassword')"
            />
          </div>
        </div>
        <div class="form-group row mt-3">
          <label for="inputPassword" class="col-sm-4 col-form-label text-white"
            >Mot de passe <b class="text-danger">*</b></label
          >
          <div class="col-sm-8">
            <input
              type="password"
              class="form-control"
              id="inputPassword"
              placeholder="Entrer un mot de passe"
              @keyup.enter="nextInput('inputPasswordConfirm')"
              v-model="password"
            />
            <p class="error text-danger">{{ errorPassword }}</p>
          </div>
        </div>
        <div class="form-group row mt-3">
          <label
            for="inputPasswordConfirm"
            class="col-sm-4 col-form-label text-white"
            >Confirmation mot de passe <b class="text-danger">*</b></label
          >
          <div class="col-sm-8">
            <input
              type="password"
              class="form-control"
              id="inputPasswordConfirm"
              placeholder="Confirmer le mot de passe"
              @keyup.enter="submitForm()"
              v-model="passwordConfirm"
            />
            <p class="error text-danger">{{ errorPasswordConfirm }}</p>
          </div>
        </div>
        <button
          type="submit"
          class="btn btn-primary mt-5"
          @click="event => submitForm(event)"
        >
          Valider
        </button>
        <br />
        <router-link to="/connexion"
          ><p class="text text-end mt-5" style="width: 100%">
            Vous avez déjà un compte ? Connectez-vous
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
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      mail: "",
      password: "",
      passwordConfirm: "",
      error: false,
      errorUsername: "",
      errorLogin: '',
      errorPassword: "",
      errorPasswordConfirm: "",
    };
  },

  methods: {
    /**
     * Enregistre un utilisateur
     * @params évènement (e)
     * @return none
     */
    submitForm(e) {
      e.preventDefault()
      if (!this.validateForm()) return;
      axios
        .post(this.$apiUrl + "/auth/inscription", {
          default_mail: this.mail,
          login:this.login,
          password: this.password,
          username: this.username,
        })
        .then((reponse) => {
          this.clearInput();
          this.$toast.success("Vous avez bien été enregistré", {
            position: "bottom",
          });
          this.$store.commit("saveUser", response.data.user)
          window.location.href = "/";
        })
        .catch((error) => {
          this.$toast.error(
            "Vous n'avez pas été enregistré. Erreur: " + error,
            { position: "bottom" }
          );
        });
    },

    /**
     * Valide les données du formulaire
     * @return boolean
     */
    validateForm() {
      this.clearError();

      let error = false;

      if (!this.login) {
        this.errorLogin = "Veuillez entrer un identifiant !";
        error = true;
      }

      if (!this.username) {
        this.errorUsername = "Veuillez entrer un nom d'utilisateur !";
        error = true;
      }

      if (!this.password) {
        this.errorPassword = "Veuillez entrer un mot de passe !";
        error = true;
      } else {
        if (this.password.length < 8) {
          this.errorPassword = "Votre mot de passe n'est pas assez long !";
          error = true;
        }

        if (!this.passwordConfirm) {
          this.errorPasswordConfirm = "Veuillez confirmer le mot de passe !";
          error = true;
        } else if (this.password !== this.passwordConfirm) {
          this.errorPasswordConfirm =
            "Les mots de passe ne correspondent pas !";
          error = true;
        }
      }

      return !error;
    },

    /**
     * Vide les champs du formulaire
     * @return none
     */
    clearInput() {
      this.login = "";
      this.username = "";
      this.mail = "";
      this.password = "";
      this.passwordConfirm = "";
    },

    /**
     * Vide les textes d'erreurs'
     * @return none
     */
    clearError() {
      this.errorLogin = "";
      this.errorUsername = "";
      this.errorPassword = "";
      this.errorPasswordConfirm = "";
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
