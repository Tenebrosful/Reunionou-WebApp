<template>
  <div v-if="!error">
    <div id="weather">
      <div v-if="errorWeather">
        <p>{{ errorWeather }}</p>
      </div>
      <div v-else>
          <div v-if="weatherEvent" class="text-white">
              <p>Température moyenne: {{moyenneTemps}}°C</p>
          </div>
          <div v-else>
            <p>Il n'y a pas de prévision météo pour ce jour là</p> 
          </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Impossible de récupérer les coordonnées de l'évènement</p>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["coords", "date"],
  data() {
    return {
      loading: true,
      error: false,
      errorWeather: false,
      weatherUrl: "https://api.meteo-concept.com/api/forecast/daily?latlng=",
      weatherApiKey:
        "a9bd5017c9d5547efab5fc113fabff2c2eeef5b5f481d9db664b914e94897c2a",
      weatherEvent: null,
      city: null
    };
  },

  mounted() {
    if (!this.coords) this.error = true;

    this.getWeather();
  },

  methods: {
    /**
     * Récupère la météo sur 14 jours des coodonnées associées à un évènement
     * @return none
     */
    getWeather() {
      axios
        .get(
          this.weatherUrl +
            this.coords.lat +
            "," +
            this.coords.long +
            "&token=" +
            this.weatherApiKey
        )
        .then((response) => {
        this.city = response.data.name
          response.data.forecast.forEach(weather => {
              if(new Date(this.date).setHours(0,0,0,0) === new Date(weather.datetime).setHours(0,0,0,0)){
                  this.weatherEvent = weather
              }
          });
        });
    },
  },

  computed: {
      /**
     * Renvoi la moyenne de la température de la journée de l'évènement
     * return moyenne
     */
    moyenneTemps(){
        return (this.weatherEvent.tmin + this.weatherEvent.tmax) / 2
    }
  }
};
</script>