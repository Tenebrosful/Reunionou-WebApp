
import VuexPersistence from 'vuex-persist'
import Vuex from 'vuex'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
})

const store = new Vuex.Store({
  state: {
    test: 1,
    usersEvent: [],
    commentsEvent: [],
    user: null
  },

  mutations: {
    saveUser(state, user){
      state.user = user
    },

    signOut(state){
      state.user = null
    }
  },

  plugins: [vuexLocal.plugin]
})

export default store