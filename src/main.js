import { createApp } from 'vue'
import App from './App.vue'
import { createRouter,createWebHistory} from 'vue-router'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-vue/dist/bootstrap-vue.css"

import HomeComponent from './components/HomeComponent.vue'

const routes = [
    { path: '/', component: HomeComponent }
  ] 

const router = new createRouter({
    history: createWebHistory(),
    routes
  })

  createApp(App).use(router).component("font-awesome-icon", FontAwesomeIcon).mount('#app')