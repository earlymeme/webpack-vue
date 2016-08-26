import Vue from 'vue'

Vue.filter('trim', {
    read(value){
        return value.replace(/(^\s*)|(\s*$)/g,'')
    },
    write(value){
        return value.replace(/(^\s*)|(\s*$)/g,'')
    }
})