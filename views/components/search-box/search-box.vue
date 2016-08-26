<template>
    <div class="search" id="search_box_{{id}}" :style="searchStyle" v-show="searchShow">
        <span class="search-text">{{label}}：</span>
        <input type="text"
               class="search-input"
               placeholder="{{placeholder}}"
               autocomplete="off"
               v-model="text|trim"
               @keyup.enter="search">
        <a href="javascript:;" class="icon-search" title="{{hint}}" @click="search"></a>
    </div>
</template>

<style lang="sass" scoped>
    .search-text {
        width: 60px;
        text-align: right;
        display: inline-block;
        line-height: 25px;
    }
</style>

<script lang="babel">
    import * as actions from '../../vuex/actions'

    export default {
        props: {
            hint: '',
            placeholder: '',
            label: '',
            text: {
                type: String,
                default: ''
            }
        },
        vuex: {
            getters: {
                searchShow: state => state.show_search
            },
            actions: actions
        },
        data(){
            return {
                id: parseInt(Math.random() * 1000 + 1000),
            }
        },
        watch: {
            text(val){
                console.log(val)
            }
        },
        events: {
            'search:reset'(){
                this.text = ''
            }
        },
        ready(){
            this.hehe()
        },
        methods: {
            search(){
                this.$dispatch('search:text', {vue: this, text: this.text})
            },
            show(){
                this.showSearch()
            }
        }
    }
</script>
