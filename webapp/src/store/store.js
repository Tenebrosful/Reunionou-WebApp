
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
    user: null,
    expirationDate:null
  },

  mutations: {

    saveUser(state, user){
      state.user = user
    },

    signOut(state){
      state.user = null
    },

    setExpirationDate(state){
      const date = new Date(new Date().setHours(new Date().getHours() + 1))
      state.expirationDate = date;
    },

    addUserEvent(state, user){
      state.usersEvent.push(user)
    }

  },

  plugins: [vuexLocal.plugin]
})

export default store