<template>
  <div>
    <div class="card col-5 p-5 mt-5" style="margin: 0 auto">
      <h2 class="mb-3 text-white">Inscription</h2>
      <form>
  <div class="form-group row mt-3">
    <label for="usernameInput" class="col-sm-4 col-form-label text-white">Nom d'utilisateur</label>
    <div class="col-sm-8">
      <input type="text" class="form-control" id="InputUsername">
    </div>
  </div>
  <div class="form-group row mt-3">
    <label for="inputPassword" class="col-sm-4 col-form-label text-white">Mot de passe</label>
    <div class="col-sm-8">
      <input type="password" class="form-control" id="inputPassword" placeholder="Entrer un mot de passe">
    </div>
  </div>
  <div class="form-group row mt-3">
    <label for="inputPasswordConfirm" class="col-sm-4 col-form-label text-white">Confirmation mot de passe</label>
    <div class="col-sm-8">
      <input type="password" class="form-control" id="inputPasswordConfirm" placeholder="Confirmer le mot de passe">
    </div>
  </div>
  <button type="button" class="btn btn-primary mt-5">Valider</button>
  <br>
        <router-link class="float-end mt-5" to="/connexion">Vous avez déjà un compte ? Connectez-vous</router-link>
</form>
    </div>
  </div>
</template>
<script>
export default {};
</script>