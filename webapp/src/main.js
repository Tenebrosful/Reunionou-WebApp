import { createApp } from 'vue'
import Vuex from 'vuex'
import VueToast from 'vue-toast-notification';
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import './assets/main.css'

import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-vue/dist/bootstrap-vue.css"

import 'vue-toast-notification/dist/theme-sugar.css';

import '@popperjs/core';

import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

import store from './store/store.js'

import HomeComponent from './components/HomeComponent.vue'
import SigninComponent from './components/SigninComponent.vue'
import SignupComponent from './components/SignupComponent.vue'
import EventCreate from './components/EventCreate.vue'
import ProfileComponent from './components/ProfileComponent.vue'

const routes = [
  { component: HomeComponent, path: '/:id?', },
  { component: SigninComponent, path: '/connexion', },
  { component: SignupComponent, path: '/inscription', },
  { component: EventCreate, path: '/creationEvenement', },
  { component: ProfileComponent, path: '/profil', }
]

const router = new createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)

app.config.globalProperties.$apiUrl = "http://docketu.iutnc.univ-lorraine.fr:62461/api"

app.use(router)
app.use(VueToast)
app.use(Vuex)
app.use(store)

app.component("font-awesome-icon", FontAwesomeIcon)

app.mount('#app')

