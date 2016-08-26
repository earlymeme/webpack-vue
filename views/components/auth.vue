<template>
    <div id="v_auth_{{dialog_id}}" class="v-auth" v-show="show" transition="fadeIn">
        <div id="v-phdialog_{{dialog_id}}" class="phdialog bft v-phdialog">
            <div class="handler_phdialog"></div>
            <div class="title_phdialog ">{{title}}</div>
            <a href="#" class="close_phdialog" @click.prevent="show=false">X</a>
            <div class="cnt_phdialog ">
                <input type="text" id="desc" class="input-text input-text-dialog" placeholder="{{placeholder}}"
                       value="{{text}}"
                       @change="inputChange" v-model="text">
                <span class="required"><em>*</em>必填</span>
            </div>
            <div class="cnt_footer">
                <button :class="{confirm:1,disabled:confirm_disabled}" @click="confirm">确定</button>
                <button class="cancel" @click="close">取消</button>
            </div>
        </div>
        <div class="v-phdialog_mask" id="v-phdialog_{{dialog_id}}_mask"></div>
    </div>

</template>

<style lang="sass">
    .phdialog.v-phdialog {
        background: #fff;
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
        }
        button {
            outline: none;
            padding: 4px 12px;
            cursor: pointer;
            font: 12px/1.6 "Microsoft Yahei", Arial, Helvetica, sans-serif;
        }
        .confirm {
            color: white;
            background-color: #33a1ee;
            border: 1px solid #33a1ee;
            &.disabled {
                color: #5e545e;
                border: 1px solid #dcdde1;
                background-color: whitesmoke;
            }
        }
        .cancel {
            color: #5e545e;
            background-color: whitesmoke;
            border: 1px solid #dcdde1;
            margin: 0 6px 0 3px;
        }
    }

    .v-phdialog_mask {
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

    /*动画*/
    .fadeIn-transition {
        opacity: 1;
    }

    .fadeIn-leave,
    .fadeIn-enter {
        opacity: 0;
    }

</style>

<script lang="babel">
    export default {
        name: 'auth-dialog',
        computed: {
            /*position() {
             return this.position ? `alert-${this.position}` : '';
             },*/
            confirm_disabled(){
                if (!this.text) {
                    return true
                } else {
                    return false
                }
            }
        },
        props: {
            text: {
                type: String,
                default(){
                    let _this = this;
                    setTimeout(()=> {
                        _this.text = _this.result == 'accept' ? '通过' : '不通过'
                    })
                }
            },
            placeholder: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                position: 'dialog',
                show: this.show,
                title: this.title,
                dialog_id: parseInt(Math.random() * 1000 + 1000),
                result: this.result,
                optional: this.optional,
            }
        },
        watch: {
            show(val, oldVal){
                if (val) {
                    this.center()
                }
            }
        },
        methods: {
            center(){
                var height = $(window).height();
                var height_doc = $(document).height();
                var width = $(window).width();
                var left = (width - $("#v-phdialog_" + this.dialog_id).outerWidth()) / 2;
                left = left < 0 ? 0 : left;
                $("#v-phdialog_" + this.dialog_id).css({left: left + "px"})
            },
            close(){
                this.show = false
            },
            option(opt){
                _.extend(this, opt);
                this.text = this.result == 'accept' ? '通过' : '不通过';
                return this
            },
            open(opt){
                this.$set('show', true)
            },
            confirm(){
                if (!this.result) {
                    return
                }
                this.$dispatch('auth:confirmed', {
                    text: this.text,
                    vue: this,
                    result: this.result,
                    optional: this.optional
                });
                this.callback && this.callback({from: 'confirm'}, this);
            },
            inputChange(){
                if (!this.text) {
                    this.confirm_disabled = true
                } else {
                    this.confirm_disabled = false
                }
            }
        }
    }
</script>