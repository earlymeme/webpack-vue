import { INCREMENT, TOGGLESEARCH,MENUMUTATION } from './mutation-types'

function makeAction(type) {
    return ({dispatch}, ...args) => dispatch(type, ...args)
}

export const increment = makeAction(INCREMENT)
export const toggleSearch = makeAction(TOGGLESEARCH)
export const menuAction = makeAction(MENUMUTATION)
