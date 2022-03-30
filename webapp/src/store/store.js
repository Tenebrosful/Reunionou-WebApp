
import VuexPersistence from 'vuex-persist'
import Vuex from 'vuex'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
})

const store = new Vuex.Store({
  mutations: {
    addUserEvent(state, user) {
      let particip = state.usersEvent.find(participant => participant.username === user.username)
      if (particip) {
        particip.comeToEvent = user.comeToEvent
      } else {
        state.usersEvent.push(user)
      }
    },

    changeUser(state, userData) {
      state.user.username = userData.username
    },

    deleteUserEvent(state) {
      state.usersEvent = []
    },

    saveUser(state, user) {
      state.user = user
    },

    setExpirationDate(state) {
      const date = new Date(new Date().setHours(new Date().getHours() + 1))
      state.expirationDate = date;
    },

    signOut(state) {
      state.user = null
    },

  },
  plugins: [vuexLocal.plugin],
  state: {
    commentsEvent: [],
    expirationDate: null,
    test: 1,
    user: null,
    usersEvent: [],
  },
})

export default store