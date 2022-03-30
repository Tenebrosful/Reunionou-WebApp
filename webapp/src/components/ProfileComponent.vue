<template>
  <div class="container-xl px-4 mt-4">
    <div class="row mb-3">
      <router-link class="text-start mt-5" to="/"
        >&lt; Retour à la carte</router-link
      >
    </div>
    <div v-if="$store.state.user">
      <div v-if="error">
        <p class="text-white fs-3">{{ error.message }}</p>
      </div>
    </div>
    <div class="row text-white">
      <div class="col-xl-4">
        <!-- Profile picture card-->
        <div class="card mb-4 mb-xl-0">
          <div class="card-header">Image de profil</div>
          <div class="card-body text-center">
            <!-- Profile picture image-->
            <img
              class="img-account-profile rounded-circle mb-2"
              :src="urlImg"
              alt=""
            />
            <!-- Profile picture help block-->
            <div class="small font-italic text-muted mb-4">Url seulement</div>
            <!-- Profile picture upload button-->
            <input
              class="form-control"
              id="inputUsername"
              type="text"
              placeholder="https://..."
              v-model="urlImg"
            />
          </div>
        </div>
      </div>
      <div class="col-xl-8">
        <!-- Account details card-->
        <div class="card mb-4">
          <div class="card-header">Details du compte</div>
          <div class="card-body">
            <form>
              <!-- Form Group (username)-->
              <div class="mb-3">
                <label class="small mb-1" for="inputUsername"
                  >Nom d'utilisateur (comment votre nom va apparaitre sur le
                  site)</label
                >
                <input
                  class="form-control"
                  id="inputUsername"
                  type="text"
                  placeholder="Enter your username"
                  v-model="username"
                />
              </div>
              <!-- Form Group (email address)-->
              <div class="mb-3">
                <label class="small mb-1" for="inputEmailAddress"
                  >Adresse mail</label
                >
                <input
                  class="form-control"
                  id="inputEmailAddress"
                  type="email"
                  placeholder="Enter your email address"
                  v-model="mail"
                />
              </div>
              <!-- Save changes button-->
              <button
                class="btn btn-primary"
                type="button"
                @click="saveChange()"
              >
                Sauvegarder les changements
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-xl-12 mt-5 text-white">
        <!-- Account details card-->
        <div class="card mb-4">
          <div class="card-header fs-3">
            Mes évènements ({{ myEvents.length }})
          </div>
          <div class="card-body text-start">
            <div
              v-for="event in myEvents"
              :key="event.id"
              class="card col-xl-8 p-3 mb-3"
              style="margin: 0 auto; background-color: #555"
            >
              <h3
                class="modal-title text-danger mb-2"
                style="filter: brightness(1.75)"
              >
                {{ event.title }}
              </h3>
              <h6 class="text-white">
                Le {{ new Date(event.date).toLocaleString() }}
              </h6>
              <p class="fs-6 text-white font-weight-bold font-italic">
                adresse: {{ event.coords.address }}
              </p>
              <p class="text-white">{{ event.description }}</p>
              <div class="d-flex">
                <router-link
                  type="button"
                  :to="'/' + event.id"
                  class="btn btn-secondary"
                  >Voir sur la carte</router-link
                >
                <router-link
                  type="button"
                  :to="'/modificationEvenement/' + event.id"
                  class="btn btn-primary ms-3"
                  >Modifier</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      error: "",
      username: "",
      errorUsername: "",
      mail: "",
      urlImg: "",
      myEvents: [],
    };
  },

  created() {
    if (this.$store.state.user) {
      axios
        .get(this.$apiUrl + "/user/" + this.$store.state.user.id, {
          headers: { authorization: this.$store.state.user.token },
        })
        .then((response) => {
          this.username = response.data.username;
          this.mail = response.data.default_event_mail;
          this.urlImg = response.data.profile_image_url;
          console.log(this.urlImg);
        })
        .catch((error) => {
          console.log(error);
          this.error = error;
        });

      axios
        .get(
          this.$apiUrl +
            "/user/" +
            this.$store.state.user.id +
            "/self-event",
          { headers: { authorization: this.$store.state.user.token } }
        )
        .then((response) => {
          this.myEvents = response.data.events;
        })

        .catch((error) => {
          this.error = error;
        });
    }
  },

  methods: {
    /**
     * Enregistre les changements sur le profil utilisateur
     * @return none
     */
    saveChange() {
      this.errorUsername = "";

      if (!this.username) {
        this.errorUsername = "Veuillez entrer un nom d'utilisateur !";
        error = true;
      } else {
        axios
          .patch(
            this.$apiUrl +
              "/user/" +
              this.$store.state.user.id,
              {
                  profile_image_url: this.urlImg,
                  username: this.username,
                  default_mail: this.mail
              },
            { headers: { authorization: this.$store.state.user.token } }
          )
          .then((response) => {
            const user = {
                username: this.username,
            }

            this.$store.commit("changeUser", user)
            this.$toast.success(
            "Vos données ont bien été modifiées",
            { position: "bottom" }
          );
          })

          .catch((error) => {
              console.log(error);
            this.$toast.error(
            "Vos données n'ont pas été modifiées. Error: " + error,
            { position: "bottom" }
          );
          });
      }
    },
  },
};
</script>

<style scoped>
.img-account-profile {
  height: 10rem;
}
.rounded-circle {
  border-radius: 50% !important;
}
.card {
  box-shadow: 0 0.15rem 1.75rem 0 rgb(33 40 50 / 15%);
}
.card .card-header {
  font-weight: 500;
}
.card-header:first-child {
  border-radius: 0.35rem 0.35rem 0 0;
}
.card-header {
  padding: 1rem 1.35rem;
  margin-bottom: 0;
  background-color: rgba(33, 40, 50, 0.03);
  border-bottom: 1px solid rgba(33, 40, 50, 0.125);
}
.form-control,
.dataTable-input {
  display: block;
  width: 100%;
  padding: 0.875rem 1.125rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1;
  color: #69707a;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #c5ccd6;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.35rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.nav-borders .nav-link.active {
  color: #0061f2;
  border-bottom-color: #0061f2;
}
.nav-borders .nav-link {
  color: #69707a;
  border-bottom-width: 0.125rem;
  border-bottom-style: solid;
  border-bottom-color: transparent;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0;
  padding-right: 0;
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>