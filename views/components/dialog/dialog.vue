<template>
    <div class="v-dialog" id="v_dialog_{{dialog_id}}" v-show="show" :transition="dialogTransition">
        <div id="phdialog_{{dialog_id}}" class="phdialog bft v-phdialog" :style="dialogStyle">
            <div class="handler_phdialog"></div>
            <div class="title_phdialog ">{{title}}</div>
            <a href="#" class="close_phdialog" @click.prevent="show=false">X</a>
            <div class="cnt_phdialog">
                {{{content}}}
            </div>
            <div class="cnt_footer" v-if="showFooter">
                <button class="confirm" @click="confirm" v-if="showFooter.showFooterConfirm">{{footerText}}</button>
                <button class="cancel" @click="close" v-if="showFooter.showFooterCancel">{{footerText1}}</button>
            </div>
        </div>
        <div class="phdialog_mask" id="phdialog_{{dialog_id}}_mask"></div>
    </div>
</template>

<style lang="sass" scoped>
    .v-dialog {
        .bft.v-phdialog {
            background: #FFF;
            overflow: hidden;
            position: fixed;
            z-index: 10001;
            width: 400px;
            top: 100px;

            .close_phdialog {
                text-indent: -999px;
            }

            .title_phdialog {
                font-size: 14px;
                font-family: "微软雅黑";
                font-weight: bold;
                cursor: default;
            }

            .cnt_phdialog {
                min-height: 100px;
            }

            .input-text-dialog {
                width: 315px;
                margin-top: 28px;
                margin-left: 10px;
            }

            .required {
                color: #555;

                em {
                    color: red;
                }

            }
            .cnt_footer {
                padding: 6px;
                text-align: right;
                border: 1px solid #ebebeb;
                border-top: none;
                height: auto;
                button {
                    margin: 0
                }
            }
            button {
                outline: none;
                cursor: pointer;
                font: 12px/1.6 "Microsoft Yahei", Arial, Helvetica, sans-serif;
            }

            .confirm {
                color: white;
                background-color: #33a1ee;
                border: 1px solid #33a1ee;
            }

            .cancel {
                color: #5e545e;
                background-color: whitesmoke;
                border: 1px solid #dcdde1;
                margin: 0 6px 0 3px;
            }

        }

        .phdialog_mask {
            width: 100%;
            height: 500px;
            filter: alpha(Opacity=30);
            -moz-opacity: 0.3;
            opacity: 0.3;
            position: fixed;
            z-index: 499;
            top: 0;
            left: 0;
            background: #000;
            z-index: 10000;
        }
    }

    @-webkit-keyframes fadeIn {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @-webkit-keyframes fadeOut {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }

    .dialog-fadeIn-transition {

    }

    .dialog-fadeIn-enter {
        -webkit-animation: fadeIn .5s;
        animation: fadeIn .5s;
    }

    .dialog-fadeIn-leave {
        -webkit-animation: fadeOut .5s;
        animation: fadeOut .5s;
    }
</style>

<script type="text/ecmascript-6" lang="babel">
    //    复杂的弹层，支持内容是html文本
    export default {
        name: 'dialog',
        props: {
            title: {
                type: String,
                default: '提示'
            },
            footerText: {
                type: String,
                default: '确认',
            },
            footerText1: {
                type: String,
                default: '取消',
            },
            showFooter: {
                type: Object,
                default: function() {
                    return {
                        showFooterConfirm: false,
                        showFooterCancel: false
                    }
                }
            },
            show: {
                type: Boolean,
                twoWay: true,
                default: false
            },
            content: {
                type: String,
                default: '<div></div>'
            },
            callback: {
                type: Function
            }
        },
        computed: {
            positionClass() {
                return this.position ? `alert-${this.position}` : '';
            }
        },
        data() {
            return {
                dialog_id: parseInt(Math.random() * 1000 + 1000)
            }
        },
        watch: {
            show(val, oldVal){
                if (val) {
                    this.center()
                }
            }
        },
        events: {
            'open:dialog'(data){
                this.open(data);
            },
            'close:dialog'(){
                this.close();
            }
        },
        compiled(){

        },
        ready(){
            this.$$el = $(this.$el)
        },
        methods: {
            $(selector){
                return this.$$el.find(selector)
            },
            setContent(html){
                this.content = html
            },
            center(){
                var height = $(window).height();
                var height_doc = $(document).height();
                var width = $(window).width();
                var left = (width - $("#phdialog_" + this.dialog_id).outerWidth()) / 2;
                left = left < 0 ? 0 : left;
                $("#phdialog_" + this.dialog_id).css({left: left + "px"});
            },
            close(){
                this.show = false;
            },
            open(opt){
                this.$set('show', true);
                if (opt.title) {
                    this.$set('title', opt.title)
                }
                if (opt.content) {
                    this.$set('content', opt.content);
                }
                if (opt.showFooter) {
                    this.$set('showFooter', opt.showFooter);
                }
                if (opt.callback) {
                    this.callback = opt.callback;
                }
            },
            confirm(){
                this.$dispatch('dialog:confirmed', this);
                this.callback && this.callback('confirm', this);
            }
        }
    };
</script>