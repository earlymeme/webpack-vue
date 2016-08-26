import Vue from 'vue'
import Vuex from 'vuex'
import middlewares from './middlewares'
import {
    INCREMENT,
    TOGGLESEARCH,
    MENUMUTATION
} from './mutation-types'

Vue.use(Vuex)

const state = {
    count: 1,
    show_search: true,
    menu_from: 'parent',
}

const mutations = {
    [INCREMENT] (state) {
        state.count++
    },
    
    [TOGGLESEARCH] (state, bool) {
        state.show_search = bool
    },
    [MENUMUTATION] (state, args) {
        _.extend(state,args)
    },
}

export default new Vuex.Store({
    state,
    mutations,
    middlewares
})
