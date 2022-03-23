<template>
  <div>
    <div class="card col-5 p-5 mt-5" style="margin: 0 auto">
      <h2 class="mb-3 text-white">Inscription</h2>
      <form>
        <div class="form-group row mt-3">
          <label for="usernameInput" class="col-sm-4 col-form-label text-white"
            >Nom d'utilisateur</label
          >
          <div class="col-sm-8">
            <input 
            type="text" 
            class="form-control"
            id="InputUsername" 
            v-model="username" 
            @keyup.enter.exact="nextInput('inputPassword')" 
            />
            <p class="error text-danger">{{ errorUsername }}</p>
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
            >Confirmation mot de passe</label
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
        <button type="button" class="btn btn-primary mt-5" @click="submitForm()">Valider</button>
        <br />
        <router-link to="/connexion"
          ><p class="text text-end mt-5" style="width:100%;">Vous avez déjà un compte ? Connectez-vous</p>
        </router-link>
        <router-link to="/"
          ><p class="text text-start mt-5" style="width:100%;">Retour à la carte</p>
        </router-link>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      passwordConfirm: '',
      error: false,
      errorUsername: "",
      errorPassword: "",
      errorPasswordConfirm: "",
    };
  },

  methods: {

    /**
     * Enregistre un utilisateur
     * @return none
    */
    submitForm() {
      if (this.validateForm()) {

      }
    },

    /**
     * Valide les données du formulaire
     * @return boolean
    */
    validateForm() {
      this.errorUsername = ''
      this.errorPassword = ''
      this.errorPasswordConfirm = ''
      let error = false;
      if (!this.username) {
        this.errorUsername = "Veuillez entrer un nom d'utilisateur !";
        error = true;
      }

      if (!this.password) {
        this.errorPassword = "Veuillez entrer un mot de passe !";
        error = true;
      } else {

        if ( this.password.length < 8){
          this.errorPassword = "Votre mot de passe n'est pas assez long !";
          error = true;
        }

        if (!this.passwordConfirm) {
          this.errorPasswordConfirm = "Veuillez confirmer le mot de passe !";
          error = true;
        } else if (this.password !== this.passwordConfirm){
          this.errorPasswordConfirm = "Les mots de passe ne correspondent pas !";
          error = true;
        }
      }

      return !error
    },

    nextInput(input){
      document.getElementById(input).focus()
    }
  },
};
</script>
