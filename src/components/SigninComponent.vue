<template>
  <div>
    <div class="card col-5 p-5 mt-5" style="margin: 0 auto;">
        <h2 class="mb-3 text-white">Connexion</h2>
      <form>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label text-white"
            >Nom d'utilisateur</label
          >
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" class="form-text">
          </div>
        </div>
        <div class="mt-5">
          <label for="exampleInputPassword1" class="form-label text-white">Mot de passe</label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
          />
        </div>

        <button type="button" class="btn btn-primary mt-3">Valider</button>
        <br>
        <router-link class="float-end mt-5" to="/inscription">Vous n'êtes toujours pas inscrit ?</router-link>
      </form>
    </div>
  </div>
</template>
<script>
export default {};
</script>