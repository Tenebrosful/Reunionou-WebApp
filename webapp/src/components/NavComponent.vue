<template>
  <div
    class="myNav"
    style="position: absolute; z-index: 1; top: 0px; right: 0px"
  >
    <div class="d-flex justify-content-end">
      <i
        class="las la-bars la-4x btnMenu"
        style="
          z-index: 15;
          cursor: pointer;
        "
        @click="navbarEvent()"
      ></i>
    </div>
    <div
      id="nav"
      class="navClose rounded mt-2 p-2"
      style="background-color: #424242"
    >
      <router-link v-if="$store.state.user"
        to="creationEvenement"
        type="button"
        class="btn btn-secondary mt-2"
        >Créer un évènement</router-link
      >

      <ul
        class="nav nav-pills nav-justified flex-column mb-3 mt-5 col-12"
        id="pills-tab"
        role="tablist"
      >
        <li
          class="nav-item col-12"
          style="margin: 0 auto; margint-bottom: 0px"
          role="events"
        >
          <button v-if="$store.state.user"
            class="nav-link active"
            id="pills-events-tab"
            style="width: 100%"
            data-bs-toggle="pill"
            data-bs-target="#pills-events"
            type="button"
            role="tab"
            aria-controls="pills-events"
            aria-selected="true"
          >
            Liste des évènements
          </button>
        </li>
        <li
          class="nav-item col-12"
          style="margin: 0 auto; height: 2%"
          role="myEvents"
        >
          <button v-if="$store.state.user"
            class="nav-link"
            id="pills-myEvents-tab"
            style="width: 100%"
            data-bs-toggle="pill"
            data-bs-target="#pills-myEvents"
            type="button"
            role="tab"
            aria-controls="pills-myEvents"
            aria-selected="false"
          >
            Liste de mes évènements
          </button>
        </li>
      </ul>
      <div
        class="tab-content text-white"
        id="pills-tabContent"
        style="height: 100%"
      >
        <div
          class="tab-pane fade show active"
          id="pills-events"
          role="tabpanel"
          aria-labelledby="pills-events-tab"
        >
          <ul class="list-group list-group-flush">
            <li v-for="event in events" :key="event.id" class="list-group-item pointer" @click="$parent.centerByCoords(event.coords.lat, event.coords.long)">{{event.title}}</li>
          </ul>
        </div>
        <div
          class="tab-pane fade"
          id="pills-myEvents"
          role="tabpanel"
          aria-labelledby="pills-myEvents-tab"
        >
          <ul class="list-group list-group-flush">
            <li class="list-group-item pointer">Anniversaire de moi</li>
            <li class="list-group-item pointer">Rendez-vous Bière</li>
            <li class="list-group-item pointer">Repas de famille</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["events"],
  data() {
    return {
      navClose: false,
    };
  },


  methods: {
    navbarEvent() {
      this.navClose = !this.navClose;
      const navbar = document.getElementById("nav");
      if (this.navClose) {
        navbar.classList.remove("navClose");
        navbar.classList.add("navOpen");
      } else {
        navbar.classList.remove("navOpen");
        navbar.classList.add("navClose");
      }
    },
  },

  mounted(){
    console.log(this.events);
  }
};
</script>

<style>
.navOpen {
  opacity: 1;
  height: auto;
  transition: opacity 0.5s ease-in;
  margin-right: 0.5em;
}

.navClose {
  opacity: 0;
  transition: opacity 0.5s ease-out;
  margin-right: 0.5em;
  display: none;
}

.pointer:hover {
  cursor: pointer;
  color: palegreen;
}

.myNav {
  width: 360px;
}

.btnMenu:hover {
  color: dodgerblue;
}

@media screen and (max-width: 638px) {
  .navOpen {
    margin-right: 0em;
  }

  .navClose {
    margin-right: 0em;
  }
  .myNav {
    width: 100%;
  }
}
</style>