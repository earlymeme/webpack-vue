<template>
    <ul class="menu-ul1 manage-menu-ul1" id="moduleData">
        <li v-for="v in data"
            :class="{'menu-item':1, 'active': module === v.value, 'index-auth-li': v.value == 'index_auth', 'sub-active': isSubActive && v.value=='index_auth'}"
            data-id="{{v.value}}">
            <a href="javascript:;" data-id="{{v.value}}" @click="menuClicked({value:v.value,from:'parent'},$event)">{{v.name}}</a>
            <template v-if="v.sub_menu.length">
                <ul :class="{'sub-ul': 1, 'index-auth-subul': 1}">
                    <li v-for="v1 in v.sub_menu" :class="{active:isSubActive && v1.value === module}">
                        <a href="javascript:;" data-id="{{v1.value}}"
                           @click="menuClicked({value:v1.value,from:'sub'},$event)">{{v1.name}}</a></li>
                </ul>
            </template>
        </li>
    </ul>
</template>
<style lang="sass" scoped>
    .menu-ul1 {
        > li {
            min-height: 30px;
            > a {
                font-weight: 600;
                padding-left: 3px;
                font-size: 13px;
                display: block;
                height: 30px;
                line-height: 30px;
                color: #5e5e5e;
                border-bottom: 1px solid #edeef0;
                &:hover {
                    color: #5e5e5e;
                }
            }
        }
        .active > a {
            color: #158deb;
            &:hover {
                color: #158deb;
            }
        }
    }

    .manage-menu-ul1 {
        > li {
            position: relative;
            border-bottom: 1px solid #edeef0;
            > a {
                border-bottom: none;
            }
        }
        .index-auth {

        }
        .index-auth-subul {
            margin: -6px 0 0 16px;
        }
        .index-auth-li {
            height: 30px;
            overflow: hidden;
            transition: height .1s ease-in;
            &:hover {
                height: 80px;
            }
            &.sub-active {
                height: 80px;
            }
        }
    }
</style>
<script lang="babel">
    import * as actions from '../vuex/actions'

    export default {
        name: 'menu',
        vuex: {
            getters: {
                count: state => state.count,
                from: state => state.menu_from
            },
            actions: actions
        },
        props: {
            module: {
                type: String,
                twoWay: true
            },

            menuData: {
                type: Array,
                default(){
                    return []
                }
            },
            subActive: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                data: this.menuData,
                isSubActive: this.subActive,
            }
        },
        computed: {
            module1(){
                /*set 方法设置了 function noop，所以this.module = xxx不起作用的*/
                return this;
            },
            isSubActive(){
                return this.subActive
            }
        },
        watch: {
            module(val, oldVal){
                console.log('menu module', val)
//                this.increment(1)
            },
            subActive(val){
                console.log('menu subActive', val)
            }
        },
        ready(){
            this.$dispatch('menu:ready', this)
        },
        methods: {
            menuClicked(params, e){
                let $e = $.event.fix(e);
                let $ct = $($e.currentTarget);
                let parent = $ct.parent();
                if (params.value === 'index_auth') {
                    return;
                }
                let menu = $ct.parents('.menu-item');
                this.menuAction({menu_from: params.from})
                if (!parent.hasClass('active')) {
                    if (menu.hasClass('index-auth-li')) {
                        this.subActive = true;
                    } else {
                        this.subActive = false;
                    }
                    this.$dispatch('menu:clicked', {data: params.value, event: e, vue: this})
                }
            }
        }
    }
</script>
