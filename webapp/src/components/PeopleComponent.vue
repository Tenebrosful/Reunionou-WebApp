<template>
  <div v-if="$store.state.usersEvent">
    <table
      class="table table-striped"
      style="max-height: 300px; overflow: auto"
    >
      <tbody>
        <tr
          v-for="people in $store.state.usersEvent"
          :key="people.username"
        >
          <td>{{ people.username }}</td>
          <td v-if="people.comeToEvent">Vient</td>
          <td v-else>Ne vient pas</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else>
    <div v-if="loading"></div>
    <div v-else>
      <p>Erreur lors de la récupération des personnes</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["id"],
  data() {
    return {
      loading: true,
      error: false,
    };
  },

  mounted() {

    this.getUsersEvent();
  },

  methods: {
    /**
     * Récupère les personnes associées à un évènement
     * @return none
     */
    getUsersEvent() {

      axios
        .get(this.$apiUrl + "/event/" + this.id + "/participants")
        .then((response) => {
          const people = response.data;
          this.$store.commit("deleteUserEvent")
          people.participants.forEach(participant => {
            this.$store.commit("addUserEvent", { username: participant.username, comeToEvent: participant.comeToEvent})
          });
        })
        .catch((error) => {
          this.$toast.error(
            "Impossible de récupérer les personnes liées à l'évènement. Erreur: " +
              error,
            {
              position: "bottom",
              timeout: 10000
            }
          );
          this.error = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>