<template>
  <div id="modal-content" class="modal-content" style="overflow: hidden">
    <div class="modal-header">
      <p class="fst-italic float-start">
        Créateur de l'évènement: <b>{{ owner }}</b>
      </p>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
      ></button>
    </div>
    <div class="modal-body">
      <h3 class="modal-title text-danger mb-2" style="filter: brightness(1.75)">
        {{ title }}
      </h3>
      <h6 class="text-white">Le {{ new Date(date).toLocaleString() }}</h6>
      <p class="fs-6 text-white font-weight-bold font-italic">
        adresse: {{ coords.address }}
      </p>
      <p class="text-white">{{ descr }}</p>
      <div v-if="!$store.state.user" class="col-3 mb-3" style="margin: 0 auto">
        <input
          type="text"
          class="form-control bg-white text-black"
          id="UsernameInput"
          v-model="username"
          placeholder="J'écris mon nom et prénom"
        />
      </div>
      <div class="d-flex justify-content-center">
        <button
          type="button"
          class="btn btn-success me-5"
          @click="participe(true)"
        >
          Je viens
        </button>
        <button type="button" class="btn btn-danger" @click="participe(false)">
          Je ne viens pas
        </button>
      </div>
      <div class="form-group row mt-3">
        <div class="col-sm-4" style="margin: 0 auto">
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="Rechercher une personne"
              aria-label="address"
              style="height: 50px"
              aria-describedby="basic-addon1"
              v-model="userInput"
              @keyup="getAutoUser()"
              @blur="setTimeout(() => (autocompleteUser = null), 1000)"
            />
          </div>
          <div v-if="autocompleteUser" class="bg-white autocomplete">
            <ul class="list-group mt-3 pt-3">
              <li v-for="autoUser in autocompleteUser" :key="autoUser.id">
                {{ autoUser.username }}
                <button
                  type="button"
                  class="btn btn-primary btn-sm ms-5"
                  @click="addParticipant(autoUser.id, autoUser.username)"
                >
                  Inviter
                </button>
              </li>
            </ul>
          </div>
          <p class="error text-danger">{{ errorAddress }}</p>
        </div>
      </div>
      <ul
        class="nav nav-pills nav-justified mb-3 mt-5"
        id="pills-tab"
        role="tablist"
      >
        <li class="nav-item" role="people">
          <button
            class="nav-link active"
            id="pills-people-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-people"
            type="button"
            role="tab"
            aria-controls="pills-people"
            aria-selected="true"
          >
            Personnes
            <i class="las la-user la-lg"></i>
          </button>
        </li>
        <li class="nav-item" role="comments">
          <button
            class="nav-link"
            id="pills-comments-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-comments"
            type="button"
            role="tab"
            aria-controls="pills-comments"
            aria-selected="false"
            @click="scrollComments()"
          >
            Commentaire
            <i class="las la-comments la-lg"></i>
          </button>
        </li>
        <li class="nav-item" role="info">
          <button
            class="nav-link"
            id="pills-info-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-info"
            type="button"
            role="tab"
            aria-controls="pills-info"
            aria-selected="false"
          >
            info
            <i class="las la-question-circle la-lg"></i>
          </button>
        </li>
      </ul>
      <div class="tab-content" id="pills-tabContent" style="height: 100%">
        <div
          class="tab-pane fade show active"
          id="pills-people"
          role="tabpanel"
          aria-labelledby="pills-people-tab"
        >
          <PeopleComponent :id="id" />
        </div>
        <div
          class="tab-pane fade"
          id="pills-comments"
          role="tabpanel"
          aria-labelledby="pills-comments-tab"
          style="overflow-y: auto"
        >
          <CommentsComponent :id="id" />
        </div>
        <div
          class="tab-pane fade"
          id="pills-info"
          role="tabpanel"
          aria-labelledby="pills-info-tab"
        >
          <InformationComponent :coords="coords" :date="date" />
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-warning" data-bs-dismiss="modal">
        Close
      </button>
    </div>
  </div>
</template>

<script>
import PeopleComponent from "./PeopleComponent.vue";
import CommentsComponent from "./CommentsComponent.vue";
import InformationComponent from "./InformationComponent.vue";
import axios from "axios";
export default {
  props: ["id", "title", "descr", "coords", "date", "owner"],
  components: { PeopleComponent, CommentsComponent, InformationComponent },
  data() {
    return {
      username: "",
      userInput: "",
      autocompleteUser: null,
    };
  },
  mounted() {
    document.getElementById("pills-comments").scrollTo(0, 1000);
  },

  methods: {
    /**
     * Scroll tout en bas de la section commentaire
     * @return none
     */
    scrollComments() {
      setTimeout(
        () =>
          (document.getElementById("chat").scrollTop =
            document.getElementById("chatBody").offsetHeight),
        300
      );
    },

    /**
     * Déclare l'utilisateur dans la liste des participants
     * @param come (bool) indique si le participant vient ou non
     * @return none
     */
    participe(come) {
      if (this.$store.state.user) {
        axios
          .post(
            this.$apiUrl + "/event/" + this.id + "/join-event/auth",
            { comeToEvent: come },
            { headers: { authorization: this.$store.state.user.token } }
          )
          .then(() => {
            this.$toast.success("Votre réponse a été enregistré", {
              position: "bottom",
            });

            this.$store.commit("addUserEvent", {
              username: this.$store.state.user.username,
              comeToEvent: come,
            });
          })
          .catch((error) => {
            console.log(error);
            this.$toast.error(
              "Votre réponse n'a pas été enregistré. Erreur: " + error,
              {
                position: "bottom",
              }
            );
          });
      } else {
        if (this.username) {
          axios
            .post(this.$apiUrl + "/event/" + this.id + "/join-event", {
              username: this.username,
              comeToEvent: come,
            })
            .then(() => {
              this.$toast.success("Votre réponse a été enregistré", {
                position: "bottom",
              });

              this.$store.commit("addUserEvent", {
                username: this.username,
                comeToEvent: come,
              });
            })
            .catch((error) => {
              this.$toast.error(
                "Votre réponse n'a pas été enregistré. Erreur: " + error,
                {
                  position: "bottom",
                }
              );
            });
        } else {
          this.$toast.error("Vous devez entrer un nom", {
            position: "bottom",
          });
        }
      }
    },

    /**
     * Récupère une liste d'utilisateur ayant la data 'userInput' dans la requête
     * @return none
     */
    async getAutoUser() {
      if (this.userInput) {
        if (this.userInput.length > 3) {
          const request = await axios.get(
            this.$apiUrl + "/user/autocomplete?q=" + this.userInput
          );
          this.autocompleteUser = request.data.users;
        }
      } else {
        this.autocompleteUser = null;
      }
    },

    /**
     * ajouter un participant
     * @param {user_id}
     * @return none
     */
    addParticipant(user_id, username) {
      axios
        .post(
          this.$apiUrl + "/event/" + this.id + "/invite-event/" + user_id,
          {},
          { headers: { authorization: this.$store.state.user.token } }
        )
        .then(() => {
          this.$toast.success("La personne a bien été enregistré", {
            position: "bottom",
          });

          this.$store.commit("addUserEvent", {
            username,
            comeToEvent: false,
          });
        })
        .catch((error) => {
          console.log(error.response.data);
          this.$toast.error(
            "La personne n'a pas été enregistré. Erreur: " +
              error.response.data.message,
            {
              position: "bottom",
            }
          );
        });
    },
  },
};
</script>

<style scoped>
#modal-content,
.modal-content {
  width: 80vw;
  max-height: 1100px;
}

.modal-body {
  overflow: auto;
}

.nav-pills .nav-link {
  width: 100%;
}

@media screen and (max-width: 638px) {
  #modal-content,
  .modal-content {
    width: 100vw;
    height: 100%;
    max-height: 100%;
  }
}
</style>