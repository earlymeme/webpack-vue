<template>
    <div class="dialog-cover" id="dialog_cover_{{dialog_id}}" v-show="show" :transition="alertTransition"
         :style="dialogCoverStyle">
        <div class="dialog dialog_type_{{type}}" id="dialog_{{dialog_id}}" :style="dialogStyle">
            <div class="dialog_header">
                <span class="dialog_title">{{title}}</span>
                <span class="dialog_close" @click="show=false"></span>
            </div>
            <div class="dialog_cnt">
                <div class="dialog_info {{infoTypeClass}}">{{confirmText}}</div>
            </div>
            <div class="dialog_footer" v-if="showFooter">
                <button class="dialog_confirm" @click="confirm" v-if="showFooter.showFooterConfirm">{{footerText}}
                </button>
                <button class="dialog_cancel" @click="cancel" v-if="showFooter.showFooterCancel">{{footerText1}}
                </button>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6" lang="babel">
    /*简单弹层，content只能是文本内容*/
    import coerceBoolean from '../utils/coerceBoolean.js'

    export default {
        props: {
            showFooter: {
                type: Object,
                default: function() {
                    return {
                        showFooterConfirm: false,
                        showFooterCancel: false
                    }
                }
            },
            confirmText: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: '提示',
            },
            infoType: {
                type: String,
                default: '1',
            },
            type: {
                type: String,
                default: 'alert',
            },
            show: {
                type: Boolean,
                coerce: coerceBoolean,
                default: false,
                twoWay: true
            },
            dialogStyle: {
                /*告诉从父组件传入的dialogStyle是一个对象，不然成为了 style = "[object Object]"*/
                type: Object
            },
            dialogCoverStyle: {
                type: Object
            },
            footerText: {
                type: String,
                default: '确认',
            },
            footerText1: {
                type: String,
                default: '取消',
            },
            callback: {
                type: Function
            }
        },
        data(){
            return {
                infoTypes: ['success', 'info', ''],
                dialog_id: parseInt(Math.random() * 1000 + 1000),
                /*会被computed覆盖getter*/
                infoTypeClass: 'info1',
            }
        },
        computed: {
            infoTypeClass(){
                return this.infoTypes[this.infoType] ? `dialog-${this.infoTypes[this.infoType]}` : ''
            },
            positionClass() {
                return this.position ? `alert-${this.position}` : '';
            }
        },
        watch: {
            show(newValue){
                console.log(newValue)
            }
        },
        /*消息*/
        events: {},
        methods: {
            center(){
                var height = $(window).height();
                var height_doc = $(document).height();
                var width = $(window).width();
                var left = (width - $("#dialog_" + this.dialog_id).outerWidth()) / 2;
                left = left < 0 ? 0 : left;
                $("#dialog_" + this.dialog_id).css({left: left + "px"});
            },
            cancel(){
                this.show = false
            },
            confirm(){
                this.$dispatch('alert-confirm', {vue: this})
                this.callback && this.callback('confirm', this)
            }
        }
    };
</script>

<style lang="sass" scoped>
    @mixin clearfix {
        &:before, &:after {
            display: table;
            csassontent: " ";
        }
        &:after {
            clear: both;
        }
        *zoom: 1;
    }

    %clearfix {
        &:before, &:after {
            display: table;
            content: " ";
        }
        &:after {
            clear: both;
        }
        *zoom: 1;
    }

    .dialog-cover {
        z-index: 99;
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, .5);
        .dialog {
            position: absolute;
            background-color: white;
            top: 200px;
            width: 400px;
            margin: 0 auto;
            left: 0;
            right: 0;
        }
        .dialog_header {
            @include clearfix;
            padding: 6px 16px;
            background-color: #33a1ee;
        }
        .dialog_title {
            float: left;
            font-size: 14px;
            color: #fff;
        }

        .dialog_footer {
            padding: 6px 8px;
            text-align: right;
            border-top: none;
            button {
                outline: none;
                cursor: pointer;
                font: 12px/1.6 "Microsoft Yahei", Arial, Helvetica, sans-serif;
                padding: 0px 14px;
                height: 24px;
                cursor: pointer;
            }
            .dialog_confirm {
                color: white;
                background-color: rgb(51, 161, 238);
                border: 1px solid rgb(51, 161, 238);
                margin-left: 5px;
                &:hover {
                    background-color: #1694ec;
                    border: 1px solid #1694ec;
                }
            }
            .dialog_cancel {
                color: rgb(94, 84, 94);
                background-color: rgb(245, 245, 245);
                border: 1px solid rgb(220, 221, 225);
                margin-left: 5px;
                &:hover {
                    background-color: #eaeaea;
                    border: 1px solid #d4d5d7;
                }
            }
        }
        .dialog_close {
            cursor: pointer;
            position: absolute;
            right: 10px;
            top: 10px;
            width: 16px;
            height: 16px;
            display: inline-block;
            background: url(/report/resource/images/icon_delay_close.png) no-repeat -5px -5px;
            margin: 0;
            &:hover {
                background-position: -31px -5px;
            }
        }
        .dialog_type_prompt {
            .dialog_footer {
                padding: 2px 16px 10px 0;
            }
            .dialog_cnt {
                //                @extend %clearfix;
                padding: 15px 15px 0 15px;
                border-top: 1px solid rgb(214, 214, 214);
            }
            .dialog_text {
                width: 100%;
                height: 54px;
                margin-top: 3px;
                border: 1px solid #ccc;
                outline: none;
                resize: none;
                padding: 5px;
            }
        }
        .dialog_type_alert, .dialog_type_confirm {
            .dialog_cnt {
                position: relative;
                border-top: 1px solid rgb(214, 214, 214);
                border-bottom: 1px solid rgb(214, 214, 214);
                text-align: center;
            }
            .dialog_info {
                position: relative;
                display: inline-block;
                word-wrap: break-word;
                max-width: 234px;
                font-size: 16px;
                text-align: left;
                color: rgb(51, 51, 51);
                padding: 31px 0;
                &:before {
                    content: " ";
                    display: block;
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    left: -40px;
                }
                &.dialog-success:before {
                    background-image: url(/report/resource/images/icon-check_new.png);
                }
                &.dialog-info:before {
                    background-image: url(/report/resource/images/icon-close.png);
                    background-repeat: no-repeat;
                }
            }
        }
    }

    /*动画*/
    .fadeIn-transition {
        opacity: 1;
    }

    .fadeIn-leave,
    .fadeIn-enter {
        opacity: 0;
    }
</style>
