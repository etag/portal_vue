/*

This file serves as a central store of variables used across components and views.
See the vuex documentation for more details: https://vuex.vuejs.org/

 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    title: 'Electronic Transponder Analysis Gateway Data Portal',
    login_url: '/api/api-auth/login/?next=/#/',
    logout_url: '/api/api-auth/logout/',
    user: {
      loggedIn: false,
      username: '',
      firstname: '',
      lastname: ''
    },
    csrftoken: '',

    // The following are application specific
    animals: {
      count: 0,
      next: '',
      prev: '',
      results: []
    },
    locations: {},
    tags: {
      count: 0,
      next: '',
      prev: '',
      results: []
    }
  },
  mutations: {
    // TODO: This is not complete
    SIGNIN: (state, username, password) => {
      if (state.loggedIn === false) {
        console.log('api post to login')
        fetch('/api/api-auth/login/', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({username:username, password:password})
        })
          .then(response => {
            console.log(response.json())
          })
      }
    },
    LOG_IN: (state) => {
      fetch('/api/user/?format=json', {credentials: 'include'})
        .then(response => {
          return response.json() // we only get here if there is no error
        })
        .then(json => {
          state.user = {
            'loggedIn': true,
            'username': json.username,
            'firstname': json.firstname,
            'lastname': json.lastname
          }
          Vue.$ga.enable()
        })
        .catch(err => {
          console.log(err)
          state.user = {
            'loggedIn': false,
            'username': '',
            'firstname': '',
            'lastname': ''
          }
        })
    },
    LOG_OUT: (state) => {
      fetch('/api/api-auth/logout/?next=/#/', {credentials: 'include'})
        .then(response => {
          return response // we only get here if there is no error
        })
        .then(
          state.user = {
              'loggedIn': false,
              'username': '',
              'firstname': '',
              'lastname': ''
          },
          Vue.$ga.disable()
        )
        .catch(err => {
          console.log(err)
        })
    },
    SET_CSRF_TOKEN: (state) => {
      function getCookie (cname) {
        let name = cname + '='
        let decodedCookie = decodeURIComponent(document.cookie)
        let ca = decodedCookie.split(';')
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i]
          while (c.charAt(0) === ' ') {
            c = c.substring(1)
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
          }
        }
        return ''
      }
      state.csrftoken = getCookie('csrftoken')
    },
    GET_LOCATIONS: (state) => {
      fetch('/api/etag/locations/?format=json', {credentials: 'include'})
        .then(response => {
          return response.json() // we only get here if there is no error
        })
        .then(json => {
          state.locations = json.results
        })
        .catch(err => {
          console.log(err)
          state.locations = {}
        })
    },
    GET_ANIMALS: (state) => {
      fetch('/api/etag/tag_animal/?format=json', {credentials: 'include'})
        .then(response => {
          return response.json() // we only get here if there is no error
        })
        .then(json => {
          state.animals = {
            'count': json.count,
            'next': json.next,
            'prev': json.prev,
            'results': json.results
          }
        })
        .catch(err => {
           console.log(err)
           state.animals = {
             'count': 0,
             'next': '',
             'prev': '',
             'results': []
           }
        })
    },
    GET_TAGS: (state) => {
      fetch('/api/etag/tags/?format=json', {credentials: 'include'})
        .then(response => {
          return response.json() // we only get here if there is no error
        })
        .then(json => {
          state.tags = {
            'count': json.count,
            'next': json.next,
            'prev': json.prev,
            'results': json.results
          }
        })
        .catch(err => {
          console.log(err)
          state.tags = {
            'count': 0,
            'next': '',
            'prev': '',
            'results': []
          }
        })
    },
  },
  actions: {
    signin: (context) => {
      context.commit('SIGNIN')
      context.commit('SET_CSRF_TOKEN')
      context.commit('LOG_IN')
    },
    log_in: (context) => {
      context.commit('SET_CSRF_TOKEN')  // Ensure that we have the CSRF token
      context.commit('LOG_IN')
    },
    log_out: (context) => {
      context.commit('LOG_OUT')
    },
    set_csrf_token: (context) => {
      context.commit('SET_CSRF_TOKEN')
    },
    get_animals: (context) => {
      context.commit('GET_ANIMALS')
    },
    get_locations: (context) => {
      context.commit('GET_LOCATIONS')
    },
    get_tags: (context) => {
      context.commit('GET_TAGS')
    }
  },
  getters: {
    getLocationById: (state) => (id) => {
      return state.locations.results.find(location => location.location_id === id)
    }
  }
})
