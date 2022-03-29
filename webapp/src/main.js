import { createApp } from 'vue'
import Vuex from 'vuex'
import VueToast from 'vue-toast-notification';
import App from './App.vue'
import { createRouter,createWebHistory} from 'vue-router'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

//import "bootstrap/dist/css/bootstrap.min.css";

import './assets/main.css' 

import axios from 'axios';

import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-vue/dist/bootstrap-vue.css"

import 'vue-toast-notification/dist/theme-sugar.css';

import '@popperjs/core';

import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

import * as dotenv from 'dotenv'

import store from './store/store.js'

import HomeComponent from './components/HomeComponent.vue'
import SigninComponent from './components/SigninComponent.vue'
import SignupComponent from './components/SignupComponent.vue'
import EventCreate from './components/EventCreate.vue'

const routes = [
    { path: '/:id?', component: HomeComponent },
    { path: '/connexion', component: SigninComponent},
    { path: '/inscription', component: SignupComponent},
    { path: '/creationEvenement', component: EventCreate}
  ] 

const router = new createRouter({
    history: createWebHistory(),
    routes
  })

/*axios.defaults.headers.post['Application'] = 'webApp'
axios.defaults.headers.get['Application'] = 'webApp'
axios.defaults.headers.delete['Application'] = 'webApp'
axios.defaults.headers.put['Application'] = 'webApp'*/

 const app = createApp(App)

 app.config.globalProperties.$apiUrl = "http://docketu.iutnc.univ-lorraine.fr:62461/api"

 app.use(router)
 app.use(VueToast)
 app.use(Vuex)
 app.use(store)
 
 app.component("font-awesome-icon", FontAwesomeIcon)

 app.mount('#app')

 