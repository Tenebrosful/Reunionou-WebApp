import { createApp } from 'vue'
import App from './App.vue'
import { createRouter,createWebHistory} from 'vue-router'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

//import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-vue/dist/bootstrap-vue.css"

import HomeComponent from './components/HomeComponent.vue'
import SigninComponent from './components/SigninComponent.vue'
import SignupComponent from './components/SignupComponent.vue'
import EventCreate from './components/EventCreate.vue'

const routes = [
    { path: '/', component: HomeComponent },
    { path: '/connexion', component: SigninComponent},
    { path: '/inscription', component: SignupComponent},
    { path: '/creationEvenement', component: EventCreate}
  ] 

const router = new createRouter({
    history: createWebHistory(),
    routes
  })

  createApp(App).use(router).component("font-awesome-icon", FontAwesomeIcon).mount('#app')