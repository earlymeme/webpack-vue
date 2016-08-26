import Vue from 'vue'
import VueResource from 'vue-resource'
import store from './vuex/store'
import * as actions from './vuex/actions'
import './filters/trim'
import Menu from './components/menu.vue'
import DialogPlugin from './components/dialog/dialog-plugin.js'
import AlertPlugin from './components/alert/alert-plugin.js'
import Alert from './components/alert/alert.vue'
import Dialog from './components/dialog/dialog.vue'
import SearchBox from './components/search-box/search-box.vue'
import AuthPlugin from './components/auth-plugin.js'
import co from 'co'
import thunkify from 'thunkify'
import Proms from 'bluebird'

new Proms(function () {
    console.log('bluebird');
});
/*function* main() {
    var result = yield request("/is/manage/index_manage/get_data?key=&module=index_approve&valid=&interface=&biz_type=&platform=&approve_status=&biz_module_id=&index_type_id=&include_field=1&pageSize=30&pageIndex=0");
    var resp = result.data;
    console.log(resp);
}

function request(url) {
    $.getJSON(url, function(response) {
        it.next(response);
    });
}
var it = main();
it.next();*/
/*var main = async function() {
    var result = await request("/is/manage/index_manage/get_data?key=&module=index_approve&valid=&interface=&biz_type=&platform=&approve_status=&biz_module_id=&index_type_id=&include_field=1&pageSize=30&pageIndex=0");
    var resp = result.data;
    console.log(resp);
}

function request(url) {
    return $.getJSON(url);
}
var it = main();
var promise = new Promise(function(resolve, reject) {
    if (1){
        resolve('value');
    } else {
        reject('error');
    }
});

export default class Person {
    constructor( name ) {
        this.name = name;
    }
    sayHello() {
        return `Hello ${ this.name }!`;
    }
    
    sayHelloThreeTimes() {
        let hello = this.sayHello();
        return `${ hello } `.repeat(3);
    }
}
var p = new Person('zjc')
p.sayHelloThreeTimes();*/

/*function wrapper(generatorFunction) {
    return function(...args) {
        let generatorObject = generatorFunction(...args);
        generatorObject.next();
        return generatorObject;
    };
}

const wrapped = wrapper(function*() {
    console.log(`First input: ${yield}`);
    return 'DONE';
});

wrapped().next('hello');*/

/*var child = Vue.component('child', {
 // 声明 props
 props: ['msg'],
 // prop 可以用在模板内
 // 可以用 `this.msg` 设置
 template: '<span>{{ msg }}{{msg1}}</span>',
 data(){
 return {
 msg1: 'abc'
 }
 },
 events: {
 'menu': function() {
 this.msg = '111'
 }
 }
 });*/

Vue.config.debug = true
Vue.config.devtools = true
Vue.use(DialogPlugin)
Vue.use(AlertPlugin)
/*审核通过，不通过弹层*/
Vue.use(AuthPlugin)
Vue.use(VueResource)

Vue.mixin({
    ready: function() {
        var myOption = this.$options.myOption
        if (myOption) {
            console.log(myOption)
        }
    },
    methods: {
        hehe(){
            console.log('hehe')
        }
    }
});
Vue.partial('my-partial', '<p>This is a partial! {{msg}}</p>')

var indexManage = new Vue({
    el: 'body',
    myOption: 'hello',
    /*引用组件*/
    components: {Menu, Dialog, Alert, SearchBox},
    events: {
        /*父组件接收子组件消息*/
        'menu:clicked'(data) {
            var _this = this;
            var $e = $.event.fix(data.event);
            var parent = $($e.currentTarget).parents('.menu-item'),
                id = $($e.currentTarget).attr('data-id');
            _this.module = id;
            var parentid = parent.attr('data-id');
            $.each(_this.moduleData, function(k, v) {
                if (id == v.value || parentid == v.value) {
                    let v1 = v;
                    let v3 = null;
                    if (parentid == 'index_auth') {
                        _.each(v.sub_menu, (v2, k2)=> {
                            if (v2.value == id) {
                                v3 = v2;
                            }
                        });
                    }
                    _this.showFilter(v1, v3);
                }
            });
            if (_this.module == 'index_approve') {
                $('.btn-blue-import').show();
            } else {
                $('.btn-blue-import').hide();
            }
            this.pageIndex = 1;
            this.pageRange = undefined;
            this.fcodes = [];
            this.loadAll();
            if (data.data == 'index_pending' || data.data == 'index_handled') {
                this.loadTblForSubMenu(true, data.data);
            } else {
                this.loadTbl(true);
            }
            this.$broadcast('menu');
            this.filterList = true;
            this.isAuthDetail = false;
        },
        'auth:confirmed'(data){
            let code_list = _.uniq(this.fcodes).join(',');
            let optional = data.optional;
            if (optional) {
                code_list = optional.code
            }
            let result = data.result;
            let text = data.text;
            data.vue.show = false;
            this.approveIndexBatch({
                code_list,
                text,
                result,
                optional
            }, /*callback*/() => {
                if (optional) {
                    /*获取下一个待办指标审核详情*/
                    this.getIndexDiff(optional.next_code)
                }
            });
        },
    },
    store,
    props: {
        styleFilter: {
            default: null
        },
        /*控制显示审核详情块*/
        isAuthDetail: {
            default: false
        },
        apply_data: {
            type: Object,
            default() {
                return {}
            }
        },
        diff_data: {
            type: Array,
            default(){
                return [];
            }
        },
        /*只是注册，给不了默认值，必须用default，像这里的123没有用*/
        next_code: '123',
        showNextCodeNull: {
            type: Boolean,
            default: false
        },
        nullNextCodeText: {
            type: String,
            default: ''
        },
        dialogStyle: {
            type: Object,
            default(){
                return {
                    top: '150px'
                }
            }
        },
        module: {
            type: String,
            default(){
                let _this = this;
                setTimeout(()=> {
                    _this.module = _this.getUrlParam('tab') ? _this.getUrlParam('tab') : 'index_approve'
                })
            }
        },
        showFooter1: {
            type: String,
            default: 321,
        },
        showDelAlert: false
    },
    vuex: {
        actions
    },
    propsData: {
        showFooter1: 123,
    },
    data: {
        /*控制显示filter项和右侧按钮*/
        show_add: true,
        // show_search: true,
        show_pass_reject: false,
        /*end*/
        filterList: true,
        moduleData: PHPCONF.module_data,
        boxStyle: {
            'min-height': '400px'
        },
        isIndexFilter: true,
        diff_data_loading: true,
        diff_data_empty: false,
        showHandledName: false,
        menuSubActive: false,
        searchKeyword: '',
    },
    computed: {
        menuModule() {
            console.log(this.showFooter1); //123
            return this.module;
        }
    },
    watch: {
        isAuthDetail(val, oldVal){
            if (val) {
                /*必须用props，或者data，computed注册过的属性，才是响应式的*/
                this.styleFilter = {}
                $('#title').html('审核指标详情<a href="javascript:;" class="ret"><返回</a>');
            } else {
                let active = $('.index-auth-subul').find('.active a');
                if (active.length) {
                    /*这么做的目的是为了判断是通过点击审核详情上面的返回按钮，还是点击左边导航的*/
                    $('#title').text(active.text());
                }
            }
        },
        /*双向绑定，子组件的state更新，也会更新父组件关联的state*/
        showDelAlert(val){

        }
    },
    created(){
        
    },
    beforeCompile(){
        
    },
    compiled(){
        if ($.browser.msie && $.browser.version <= 8) {
            /*let dialog = new PHDialog();
             let config = {
             width: 400,
             height: 148,
             title: '提示',
             content: [
             '<div class="dialog-box">',
             '<p class="dialog-p">',
             '<i class="icon-dialog-w"></i>',
             '<span>我们推荐使用非IE浏览器！</span>',
             '</p>',
             '</div>'
             ].join(''),
             cloent: function() {
             }
             };
             dialog.init(config);
             dialog.show();
             $('#' + dialog.dialog_id).css('top', 124).addClass('bft')*/
            this.$refs.ieDialog.$emit('open:dialog', {
                content: `<div class="dialog-box">
                         <p class="dialog-p">
                         <i class="icon-dialog-w"></i>
                         <span>我们推荐使用非IE浏览器！</span>
                         </p>
                         </div>`,
                titlegget: '提示',
                showFooter: {
                    showFooterConfirm: true,
                    showFooterCancel: false,
                },
                callback: function(type, vue) {
                    vue.show = false
                }
            })
        }
    },
    ready(){
        console.log('ready');
        this.increment()
    },
    methods: {
        init: function() {
            var _this = this;
            _this.interfaceIp = 'common/entity/get_control_data';
            _this.moduleData = PHPCONF.module_data;
            _this.bindEvents();
            _this.module = IS.getUrlParam('tab') ? IS.getUrlParam('tab') : this.moduleData[0].value;
            if (_this.module == 'index_pending' || _this.module === 'index_handled') {
                _this.menuSubActive = true;
            }
            let error_tab = false;
            _.each(PHPCONF.module_data, (v, k)=> {
                if (this.module == v.value) {
                    error_tab = true;
                    return false;
                } else {
                    _.each(v.sub_menu, (v1, k1)=> {
                        if (v1.value == this.module) {
                            error_tab = true;
                            return false;
                        }
                    })
                }
            });
            if (!error_tab) {
                /*这样会导致页面有几个dialog component 就会渲染几个dialog element*/
                /*this.$broadcast('open:dialog', {
                 content: `<div class="dialog-box">
                 <p class="dialog-p">
                 <i class="icon-dialog-w"></i>
                 <span>没有权限查看，点击确定返回系统管理首页！</span>
                 </p>
                 </div>`,
                 title: '提示',
                 showFooter: {
                 showFooterConfirm: true,
                 showFooterCancel: false,
                 },
                 callback: function(from) {
                 window.location.href = '/is/manage/index_manage'
                 }
                 })*/
                this.$dialog({
                    props: {
                        content: `<div class="dialog-box">
                            <p class="dialog-p">
                                <i class="icon-dialog-w"></i>
                                <span>没有权限查看，点击确认返回系统管理首页！</span>
                            </p>
                        </div>`,
                        title: '提示',
                        showFooter: {
                            showFooterConfirm: true,
                            showFooterCancel: false,
                        },
                        callback: function(from) {
                            window.location.href = '/is/manage/index_manage'
                        }
                    }
                }).show = true;
                return;
            }
            _this.showTab(_this.moduleData)
            _this.initPage();
            _this.loadAll();
            _this.loadTbl(true);
        },
        initPage: function() {
            var _this = this;
            this.pageIndex = 1;
            this.pageSize = 30;
            this.page = new Page({
                widget: $('.all-pg'),
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                callback: function(opt) {
                    _this.pageIndex = opt.pageIndex;
                    _this.pageSize = opt.pageSize;
                    if (_this.module == 'index_pending' || _this.module == 'index_handled') {
                        _this.loadTblForSubMenu();
                    } else {
                        _this.loadTbl();
                    }
                }
            });
        },
        getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return decodeURI(r[2]);
            } else {
                return '';
            }
        },
        showDate: function(date) {
            var _this, config, today, seltDate;
            _this = this;
            today = new Date;
            today.setDate(today.getDate());
            if (date) {
                seltDate = date;
            } else {
                seltDate = _this.getDate(today)
            }
            config = {
                container: 'event_time',
                input_height: 25,
                input_width: 100,
                ready_only: false,
                short_cut: [],
                range_select: ['', _this.getDate(today)],
                default_selected: [seltDate, ''],
                autosubmit: false,
                type: 'single',
                sheet: 1,
                zIndex: 999,
                skin_name: 'noborder',
                ent: {
                    context: this,
                    sure: function(data) {
                        _this.pageIndex = 1;
                        _this.pageRange = undefined;
                        _this.loadTbl();
                    }
                }
            };
            this.calendar = new PHDate;
            this.calendar.init(config);
        },
        getDate: function(date) {
            var _fillDigit;
            _fillDigit = function(str, digit) {
                var cnt;
                if (typeof str !== 'string') {
                    str = str.toString();
                }
                if (digit < str.length) {
                    return str;
                }
                cnt = digit - str.length;
                while (cnt--) {
                    str = '0' + str;
                }
                return str;
            };
            return _fillDigit(date.getFullYear(), 4) + '-' + _fillDigit(date.getMonth() + 1, 2) + '-' + _fillDigit(date.getDate(), 2);
        },
        /*搜索*/
        search(opt){
            var value = opt.text;
            this.pageIndex = 1;
            this.pageRange = undefined;
            this.loadTbl();
        },
        /*批量通过*/
        authPass(){
            if (this.fcodes.length) {
                this.$authShow({
                    title: '请输入通过说明',
                    result: 'accept',
                    callback: function(opt) {
                        if (opt.from === 'confirm') {

                        }
                    }
                })
            }
        },
        /*批量不通过*/
        authReject(){
            if (this.fcodes.length) {
                this.$authShow({
                    title: '请输入拒绝理由',
                    result: 'reject',
                    callback: function() {
                        
                    }
                });
            }
        },
        timer: null,
        bindEvents: function() {
            var $body = $('body'),
                _this = this;
            this.fcodes = [];
            $body/*.on('keypress', '.search-input', function(event) {
             if (event.keyCode == 13) {
             var value = $.trim($(this).val());
             _this.pageIndex = 1;
             _this.pageRange = undefined;
             _this.loadTbl();
             }
             }).on('click', '.icon-search', function() {
             var value = $.trim($('.search-input').val());
             _this.pageIndex = 1;
             _this.pageRange = undefined;
             _this.loadTbl();
             })*/.on('change', '#valid, #module, #index_type, #interface, #biz_type, #platform, #approve_status', function() {
                _this.pageIndex = 1;
                _this.pageRange = undefined;
                _this.loadTbl();
            }).on('click', '.btn-blue-add', function() {
                var id = $(this).attr('data-id');
                window.location.href = '/is/manage/index_manage/conf?module=' + id;
            }).on('click', '.index-publish', function() {
                //发布指标
                var td = $(this).parents('tr').find('td[data-value="f_status"]'),
                    stop = $(this).hasClass('index-stop'),
                    disableOp = $(this).hasClass('disable-op'),
                    id = $(this).attr('data-id'),
                    value = $(this).attr('data-value'),
                    text = $(this).html(),
                    _this = $(this);
                
                if (disableOp) {
                    return;
                }
                
                if (!confirm('确定要' + text + '该字段吗？')) {
                    return;
                }
                var status = value == '已发布' ? '1' : '2';  //如果当前为已发布状态，则更新为未发布状态，反之亦然
                
                $.ajax({
                    type: 'POST',
                    url: '/is/manage/index_manage/publish',
                    data: {
                        module: _this.module,
                        id: id,
                        status: status
                    },
                    dataType: 'json',
                    success: function(ret) {
                        if (ret.code == '0') {
                            alert('操作成功');
                            if (stop) {
                                _this.removeClass('index-stop').html('发布');
                                td.html('未发布');
                            } else {
                                _this.addClass('index-stop').html('不发布');
                                td.html('已发布');
                            }
                        } else {
                            alert(ret.msg);
                        }
                    },
                    error: function() {
                        //
                    }
                });
            }).on('click', '.index-user', function() {
                //停用、启用指标
                var td = $(this).parents('tr').find('td[data-value="f_valid"]'),
                    disabled = $(this).hasClass('index-disabled'),
                    id = $(this).attr('data-id'),
                    value = $(this).attr('data-value'),
                    text = $(this).html(),
                    _aEdit = $(this).siblings('.index-edit'),
                    _aPublish = $(this).siblings('.index-publish'),
                    _this = $(this);
                
                if (!confirm('确定要' + text + '该字段吗？')) {
                    return;
                }
                
                var valid = value == "不可用" ? '1' : '0';   //如果当前为不可以，则设为可用，反之亦然
                $.ajax({
                    type: 'POST',
                    url: '/is/manage/index_manage/enable',
                    data: {
                        module: _this.module,
                        id: id,
                        valid: valid
                    },
                    dataType: 'json',
                    success: function(ret) {
                        if (ret.code == '0') {
                            alert('操作成功');
                            if (disabled) {
                                _this.removeClass('index-disabled').html('启用');
                                td.html('不可用');
                                
                                _aEdit.addClass('disable-op');
                                _aPublish.addClass('disable-op');
                            } else {
                                _this.addClass('index-disabled').html('停用');
                                td.html('可用');
                                
                                _aEdit.removeClass('disable-op');
                                _aPublish.removeClass('disable-op');
                            }
                        } else {
                            alert(ret.msg);
                        }
                    },
                    error: function() {
                        //
                    }
                });
            }).on('click', '.disable-op', function(e) {
                e.preventDefault();
                return false;
            }).on('click', '.index-tbl-auth', function(e) {
                _this.showAuthDetail($(this).attr('data-code'));
            }).on('click', '.ret', function(e) {
                _this.retAuthDetail($(this).attr('data-code'));
            }).on('change', 'input[name="check_all"]', function() {
                var $this = $(this);
                if ($this.prop('checked')) {
                    $('input[name="check_one"]').prop('checked', true).each(function(k, v) {
                        let $v = $(v);
                        let this_code = $v.attr('data-code');
                        if (_this.fcodes.indexOf(this_code) === -1) {
                            _this.fcodes.push(this_code);
                        }
                    });
                } else {
                    $('input[name="check_one"]').prop('checked', false);
                    _this.fcodes = [];
                }
            }).on('click', 'td[data-elems=t_check_one]', function(e) {
                var $this = $(this);
                var $t = $(e.target);
                var cb = $this.find('input[name=check_one]');
                $('input[name="check_all"]').prop('checked', false);
                var this_code = cb.attr('data-code');
                if ($t.hasClass('check-cb')) {
                    if ($t.prop('checked')) {
                        _this.fcodes.push(this_code)
                    } else {
                        _.each(_this.fcodes, function(v, k) {
                            if (v == this_code) {
                                _this.fcodes[k] = null
                            }
                        })
                    }
                    _this.fcodes = _.filter(_this.fcodes, (v, k)=> {
                        return !!v
                    });
                    return
                }
                if (!cb.prop('checked')) {
                    cb.prop('checked', true);
                    _this.fcodes.push(this_code)
                } else {
                    cb.prop('checked', false);
                    _.each(_this.fcodes, function(v, k) {
                        if (v == this_code) {
                            _this.fcodes[k] = null
                        }
                    });
                }
                _this.fcodes = _.filter(_this.fcodes, (v, k)=> {
                    return !!v
                })
            }).on('click', '.rule_expand', function(e) {
                if ($(this).text() === '展开') {
                    $(this).text('收起')
                } else {
                    $(this).text('展开')
                }
                $(this).siblings('pre').toggleClass('pre-auto');
            }).on('click', '.index-handled-fname', function(e) {
                let $this = $(this);
                let fid = $this.attr('data-fid');
                let valid = $this.attr('data-valid');
                let module = $this.attr('data-module');
                _this.showHandledName = true;
                _this.$refs.indexHandledDialog.$('.phdialog').css({width: '600px'});
                _this.$refs.indexHandledDialog.setContent('<table class="index-tbl"><tbody><tr><td colspan="2" style="text-align: center;">数据加载中...</td></tr></tbody></table>');
                let _tpl = template.compile(`<table class="index-tbl">
                            <thead>
                                <tr>
                                    <th style="width:100px;">表名</th>
                                    <th>值</th>
                                </tr>
                            </thead>
                            <tbody>
                                {{each fields as v k}}
                                    <tr>
                                        <td class="t-{{k}}">{{v}}</td>
                                        <td class="v-{{k}}">{{row[k]}}</td>
                                    </tr>
                                {{/each}}
                            </tbody>
                        </table>`);
                _this.$http.get('/is/manage/index_approve/get_one', {
                    module: module,
                    id: fid,
                    convert_value: 1,
                    valid: valid
                }).then((data) => {
                    if (!data.data.code) {
                        _this.$refs.indexHandledDialog.setContent(_tpl(data.data.data))
                        $(_this.$refs.indexHandledDialog.$el).find('.cnt_phdialog').css({
                            'overflow': 'auto',
                            'max-height': '200px'
                        });
                    } else {
                        _this.$refs.indexHandledDialog.setContent(`<table class="index-tbl"><tbody><tr><td colspan="2" style="text-align: center;">${data.msg}</td></tr></tbody></table>`)
                        /*_this.$alert({
                         props: {
                         confirmText: data.msg,
                         show: true,
                         showFooter:false,
                         dialogCoverStyle: {
                         'z-index': '10003'
                         }
                         dialogStyle: {
                         top: '100px'
                         },
                         },
                         data: {

                         }
                         });*/
                    }
                })
            }).on("click", '.index-del', function(e) {
                /*删除功能*/
                var $this = $(this);
                _this.del_fid = $this.attr('data-fid');
                _this.del_module = $this.attr('data-module');
                _this.showDelAlert = true
            });
        },
        delAlertConfirm(){
            let _this = this;
            let module = this.del_module;
            let fid = this.del_fid;
            this.$http.get('/is/manage/index_manage/remove', {
                module: module,
                id: fid,
            }).then((data) => {
                _this.showDelAlert = false;
                if (!data.data.code) {
                    this.$alert({
                        props: {
                            confirmText: data.data.msg,
                            show: true,
                            dialogCoverStyle: {
                                'z-index': '10003',
                            },
                            dialogStyle: {
                                top: '100px'
                            },
                            showFooter: {
                                showFooterConfirm: true
                            },
                            callback(type, vue){
                                vue.show = false;
                                if (type == 'confirm') {
                                    _this.pageIndex = 1;
                                    _this.pageRange = undefined;
                                    _this.loadAll();
                                    _this.loadTbl(true);
                                }
                            }
                        },
                        data: {}
                    })
                } else {
                    this.$alert({
                        props: {
                            confirmText: data.data.msg,
                            show: true,
                            dialogCoverStyle: {
                                'z-index': '10003',
                            },
                            dialogStyle: {
                                top: '100px'
                            },
                            showFooter: false
                        },
                        data: {}
                    });
                }
            }).catch((error)=> {
                _this.showDelAlert = false;
                this.$alert({
                    props: {
                        confirmText: 'error',
                        show: true,
                        dialogCoverStyle: {
                            'z-index': '10003',
                        },
                        dialogStyle: {
                            top: '100px'
                        },
                        showFooter: false
                    },
                    data: {}
                });
            })
        },
        showTab: function(data) {
            if (data.length) {
                var ul = $('#moduleData'),
                    li = '',
                    _this = this;
                $.each(data, function(k, v) {
                    var active = v.value === _this.module ? ' class="active"' : '';
                    var item = '<li' + active + '><a href="javascript:;" data-id="' + v.value + '">' + v.name + '</a></li>';
                    if (v.value === 'index_auth') {
                        item = '<li class="index-auth-li"><a href="javascript:;" data-id="' + v.value + '" class="' + v.value.replace('_', '-') + '">' + v.name + '</a><ul class="sub-ul index-auth-subul"><li><a href="javascript:;">待办任务</a></li><li><a href="javascript:;">已办任务</a></li></div></li>';
                    }
                    li += item;
                    if (v.value === _this.module) {
                        _this.showFilter(v);
                    }
                });
                // ul.empty().html(li);
            }
        },
        showFilter: function(obj, sub_obj) {
            var title = obj.name;
            if (sub_obj) {
                title = sub_obj.name;
            }
            let name = obj.name;
            if (obj.value === 'index_approve') {
                title = '指标列表';
                name = '指标';
            }
            $('#title').html(title);
            $('.pub-box-op .btn-blue-add').attr('data-id', obj.value).find('span').html('新增' + name);
            $('.btn-blue-import').hide();

            if (obj.value == 'index_auth') {
                this.$set('show_add', false);
                /*待办任务时，显示批量通过和批量不通过按钮*/
                if (sub_obj && sub_obj.value == "index_pending") {
                    this.show_pass_reject = true;
                    // this.show_search = false;
                    this.toggleSearch(false);
                } else {
                    this.show_pass_reject = false;
                    // this.show_search = false;
                    this.toggleSearch(false);
                }
            } else if (obj.value == 'index_feedback') {
                this.show_add = false;
                this.show_pass_reject = false;
                this.toggleSearch(false)
            } else {
                this.show_add = true;
                if (obj.value == 'index_approve') {
                    this.isIndexFilter = true
                    $('.btn-blue-import').show();
                } else {
                    this.isIndexFilter = false;
                }
                // this.show_search = true;
                this.toggleSearch(true);
                this.show_pass_reject = false
            }
            $('.filter-list .filter-elem').hide();
            for (var i = 0, len = obj.item.length; i < len; i++) {
                $('.filter-list .filter-elem[data-value="' + obj.item[i] + '"]').show();
            }
        },
        loadAll: function() {
            var _this = this,
                url = _this.interfaceIp,
                param = {
                    code: 'valid'
                };
            IS.interfaceRun(url, param, this.showValid);
            _this.loadModule();
            _this.loadType();
            _this.loadBizType();
            _this.loadPlatform();
            _this.loadApproveStatus();
            /*这个筛选项不是通过接口渲染的，所以手动重置下*/
            /*应用平台 是否对接*/
            $('#interface').find('option:first').prop('selected', true);
            // this.searchKeyword = '';
            // this.$broadcast('search:reset');
        },
        showValid: function(ret) {
            var data = ret.data,
                wrap = '#valid';
            IS.showSelt(wrap, data);
        },
        loadApproveStatus(){
            var _this = this,
                url = _this.interfaceIp,
                param = {
                    code: 'approve_status'
                };
            IS.interfaceRun(url, param, this.showApproveStatus);
        },
        showApproveStatus(ret){
            var data = ret.data,
                wrap = '#approve_status';
            IS.showSelt(wrap, data);
        },
        loadBizType: function() {
            var _this = this,
                url = _this.interfaceIp,
                param = {
                    code: 'biz_type'
                };
            IS.interfaceRun(url, param, this.showBizType);
        },
        showBizType: function(ret) {
            var data = ret.data,
                wrap = '#biz_type';
            IS.showSelt(wrap, data);
        },
        loadPlatform: function() {
            var _this = this,
                url = _this.interfaceIp,
                param = {
                    code: 'platform'
                };
            IS.interfaceRun(url, param, this.showPlatform);
        },
        showPlatform: function(ret) {
            var data = ret.data,
                wrap = '#platform';
            IS.showSelt(wrap, data);
        },
        
        loadModule: function() {
            var _this = this,
                url = _this.interfaceIp,
                param = {
                    code: 'biz_module'
                };
            IS.interfaceRun(url, param, this.showModule);
        },
        showModule: function(ret) {
            var data = ret.data,
                wrap = '#module';
            IS.showSelt(wrap, data);
        },
        loadType: function() {
            var _this = this,
                url = _this.interfaceIp,
                param = {
                    code: 'index_type'
                };
            IS.interfaceRun(url, param, this.showType);
        },
        showType: function(ret) {
            var data = ret.data,
                wrap = '#index_type';
            IS.showSelt(wrap, data);
        },
        /*审核详情返回待办任务按钮*/
        retAuthDetail(){
            this.isAuthDetail = false;
            // this.show_search = false;
            this.toggleSearch(false);
            this.show_pass_reject = true;
            this.filterList = true;
            this.show_add = false;
            /*重新请求一次*/
            this.pageIndex = 1;
            this.pageRange = undefined;
            this.loadTblForSubMenu(true, 'index_pending');
        },
        /*显示审核详情*/
        showAuthDetail(code) {
            this.isAuthDetail = true;
            this.show_pass_reject = false;
            // this.show_search = true;
            this.toggleSearch(true);
            this.filterList = false;
            this.show_add = false;
            this.resetIndexDiffProps();
            this.getIndexDiff(code);
        },
        resetIndexDiffProps(){
            $.each(this.$options.props, (k, v) => {
                if (k == 'apply_data' || k == 'diff_data') {
                    if (v.type && typeof(v.type) == 'function') {
                        this[k] = v.default()
                    }
                }
            });
        },
        /*通过，不通过审核ajax请求*/
        approveIndexBatch(params, callback){
            if (!params.text) {
                return;
            }
            IS.showLoading('.index-list');
            let optional = params.optional;
            this.$http.get('/is/manage/index_approve/approve_index_batch', params).then((data) => {
                IS.hideLoading('.index-list');
                if (!data.data.code) {
                    callback && callback();
                    /*refresh pending task list*/
                    if (optional /*&& !this.next_code*/) {

                    } else {
                        this.pageIndex = 1
                        this.pageRange = undefined
                        this.loadTblForSubMenu(true, 'index_pending')
                    }
                }
            }, (error) => {
                alert('error');
            });
        },
        dialogConfirm(){
            console.log('dialog Confirm');
        },
        /*没有下一个审核的指标出现弹层，点击确定按钮，返回已办任务*/
        alertConfirm(){
            this.retHandledTask();
            this.showNextCodeNull = false
        },
        /*返回已办任务*/
        retHandledTask(){
            this.show_pass_reject = false;
            // this.show_search = false;
            this.toggleSearch(false);
            this.isAuthDetail = false;
            this.filterList = true;
            this.show_add = false;
            /*重新请求一次*/
            this.pageIndex = 1;
            this.pageRange = undefined;
            this.loadTblForSubMenu(true, 'index_handled');
            let vv1;
            let vv2;
            $.each(this.moduleData, (k, v) => {
                if (v.value === 'index_auth') {
                    vv1 = v;
                    $.each(v.sub_menu, (k1, v1) => {
                        if (v1.value === 'index_handled') {
                            vv2 = v1;
                        }
                    });
                }
            });
            this.showFilter(vv1, vv2);
            this.module = 'index_handled';
        },
        getIndexDiff(code){
            if (!code) {
                this.showNextCodeNull = true;
                this.nullNextCodeText = '没有需要审核的指标了，点击确定返回！';
                this.dialogStyle = {
                    top: '80px'
                }
                return
            }
            this.diff_data_loading = true;
            this.$http.get('/is/manage/index_approve/get_index_diff', {
                code
            }).then((data)=> {

                if (data.ok) {
                    this.diff_data_loading = false
                    this.diff_data = data.data.diff_data
                    if (!this.diff_data.length) {
                        this.diff_data_empty = true
                    }
                    this.apply_data = data.data.apply_data
                    this.next_code = data.data.next_code
                }
            }, (error)=> {
                
            })
        },
        activate(done){
            
        },
        passApprove({code, next_code}){
            if (code) {
                this.$authShow({
                    title: '请输入通过说明', result: 'accept', optional: {
                        from: 'detail',
                        code,
                        next_code
                    }
                });
            }
        },
        rejectApprove({code, next_code}){
            if (code) {
                this.$authShow({
                    title: '请输入拒绝理由',
                    result: 'reject',
                    optional: {
                        code,
                        from: 'detail',
                        next_code
                    }
                });
            }
        },
        /*左侧菜单选择了子菜单的时候，特殊处理下*/
        loadTblForSubMenu: function(first, menuId) {
            var _this = this;
            let module_value = this.module;
            if (menuId) {
                module_value = menuId
            }
            var keyword = this.searchKeyword,
                valid = $('#valid').val(),
                module = $('#module').val(),
                index_type = $('#index_type').val();
            var pageIndex, pageSize;
            if (_this.pageIndex < 1) {
                _this.pageIndex = 1;
            }
            if (_this.pageIndex > _this.pageRange) {
                _this.pageIndex = _this.pageRange;
            }
            pageIndex = _this.pageIndex || 1;
            pageSize = _this.pageSize || 30;
            var url = 'manage/index_approve/get_pending_index',
                param = {
                    pageSize: pageSize,
                    pageIndex: pageIndex - 1
                };
            if (module_value == 'index_handled') {
                
                url = 'manage/index_approve/get_handled_index'
            }
            $('.tbl-loading').css('height', $(document).height() + 'px')
            var _tpl = `<thead id="indexThead">
                <tr>
                    {{if module_value == 'index_pending'}}

                        <th class="check-t" data-elems="t_check_all"><input type="checkbox" data-elems="check_all" name="check_all" class="check-cb check-all"></th>
                    {{/if}}
                    {{each field as v k}}
                        <th data-value="{{k}}">{{v.thText}}</th>
                    {{/each}}
                    {{if module_value == 'index_pending'}}
                        <th>操作</th>
                    {{/if}}
                </tr>
            </thead>
            <tbody id="indexTbody">
                {{if data.length}}
                    {{each data as v k}}
                        <tr>
                            {{if module_value=='index_pending'}}
                                <td class="check-t" data-elems="t_check_one"><input type="checkbox" data-elems="check_one" name="check_one" class="check-cb check-one" data-code="{{v.f_code}}"></td>
                            {{/if}}
                            {{each field as v1 k1}}
                                {{if module_value == 'index_handled' && k1 == 'f_name'}}
                                      <td class="{{k1}}"><a href="javascript:;" class="index-handled-fname" data-fid="{{v['_fid']}}" data-valid="{{v.f_valid}}" data-module="{{v._module}}">{{v[k1]}}</a></td>
                                {{else}}    
                                  <td class="{{k1}}">{{v[k1]}}</td>
                                {{/if}}
                            {{/each}}
                            {{if module_value == 'index_pending'}}
                                <td><a href="javascript:;" class="index-tbl-a index-tbl-auth" data-code="{{v.f_code}}">立即审批</a></td>
                            {{/if}}
                        </tr>
                    {{/each}}
                {{else}}
                    {{if module_value == 'index_pending'}}
                        <tr><td class="td-nodata" colspan="8">暂无待办任务</td></tr>
                    {{else}}
                        <tr><td class="td-nodata" colspan="8">暂无已办任务</td></tr>
                    {{/if}}
                {{/if}}
            </tbody>`;
            var tpl = template.compile(_tpl);
            IS.showLoading('.index-list');
            IS.interfaceRun(url, param, function(data) {
                IS.hideLoading('.index-list');
                data.module_value = module_value;
                $.each(data.data, function(k, v) {
                    if (v.f_approve_status === '待审批') {
                        v._fid = v.f_id;
                        v._module = 'index_approve';
                    } else {
                        v._fid = v.f_id;
                        v._module = 'index_handled';
                    }
                });
                $('.manage-tbl').html(tpl(data));
                _this.pageRange = Math.ceil(data.count / _this.pageSize);
                _this.page.param({
                    pageIndex: _this.pageIndex,
                    pageSize: _this.pageSize
                });
                _this.page.initPagipation(data);
            });
        },
        /*计算字符长度*/
        getRealLength(s, isUTF8){
            if (typeof s != "string")return 0;
            if (!isUTF8)return s.replace(/[^\x00-\xFF]/g, "**").length; else {
                var cc = s.replace(/[\x00-\xFF]/g, "");
                return s.length - cc.length + encodeURI(cc).length / 3
            }
        },
        loadTbl: function(first) {
            var _this = this;
            var module_value = this.module,
                keyword = this.searchKeyword,
                valid = $('#valid').val(),
                module = $('#module').val(),
                is_interface = $('#interface').val(),
                platform = $('#platform').val(),
                biz_type = $('#biz_type').val(),
                approve_status = $('#approve_status').val(),
                index_type = $('#index_type').val();
            var pageIndex, pageSize;
            if (_this.pageIndex < 1) {
                _this.pageIndex = 1;
            }
            if (_this.pageIndex > _this.pageRange) {
                _this.pageIndex = _this.pageRange;
            }
            pageIndex = _this.pageIndex || 1;
            pageSize = _this.pageSize || 30;
            var url = 'manage/index_manage/get_data',
                param = {
                    key: keyword,
                    module: module_value ? module_value : '',
                    valid: valid,
                    'interface': is_interface,
                    biz_type: biz_type,
                    platform: platform,
                    approve_status: approve_status,
                    biz_module_id: module,
                    index_type_id: index_type,
                    //day: _this.calendar.retdata[0][0],
                    include_field: '1',
                    pageSize: pageSize,
                    pageIndex: pageIndex - 1
                };
            if (first) {
                param.valid = '';
                param.biz_module_id = '';
                param.index_type_id = '';
                param.approve_status = '';
                param.biz_type = '';
                param.interface = '';
                param.platform = '';
            }
            IS.showLoading('.index-list');
            $('.tbl-loading').css('height', $(document).height() + 'px');
            IS.interfaceRun(url, param, function(ret) {
                IS.hideLoading('.index-list');
                if (ret.code == 0) {
                    var data = ret.data.data,
                        fields = ret.data.fields,
                        flen = fields.length,
                        len = data.length,
                        thead = '',
                        tbody = '';
                    thead += '<tr>';
                    $.each(fields, function(k, v) {
                        thead += '<th data-value="' + v.value + '">' + v.name + '</th>';
                    });
                    if (module_value !== 'index_feedback') {
                        thead += '<th>操作</th>';
                    }
                    thead += '</tr>';
                    $('#indexThead').empty().html(thead);
                    if (len) {
                        $.each(data, function(k, v) {
                            tbody += '<tr>';
                            $.each(fields, function(l, w) {
                                if (w.value == 'f_rule') {
                                    var expand = ''
                                    let rule = v[w.value];
                                    if (v[w.value] && _this.getRealLength(v[w.value], true) > 14 * 3) {
                                        expand = '<a href="javascript:;" class="rule_expand">展开</a>'
                                        rule += '...'
                                    }
                                    tbody += `<td class="t-rule"><pre>${rule}</pre>${expand}</td>`
                                } else {
                                    tbody += `<td class="${w.value}" data-value="${w.value}">${v[w.value]}</td>`
                                }
                            });
                            var cssDisableOp = v.f_valid == '可用' ? '' : 'disable-op';
                            var stop = v.f_status == '已发布'
                                    ? '<a href="javascript:;" class="index-tbl-a index-publish index-stop ' + cssDisableOp + '" data-id="' + v.f_id + '" data-value="' + v.f_status + '">不发布</a>'
                                    : '<a href="javascript:;" class="index-tbl-a index-publish ' + cssDisableOp + '" data-id="' + v.f_id + '" data-value="' + v.f_status + '">发布</a>',
                                valid = v.f_valid == '可用'
                                    ? '<a href="javascript:;" class="index-tbl-a index-user index-disabled" data-id="' + v.f_id + '" data-value="' + v.f_valid + '">停用</a>'
                                    : '<a href="javascript:;" class="index-tbl-a index-user" data-id="' + v.f_id + '"  data-value="' + v.f_valid + '">启用</a>';
                            if (_this.module !== 'index_approve') {
                                stop = '';
                            } else {
                                stop = '';
                            }
                            /*删除按钮*/
                            let del = '';
                            if (PHPCONF.can_del) {
                                del = '<a class="index-tbl-a index-del" href="javascript:;" data-fid="' + v.f_id + '" data-module="' + _this.module + '">删除</a>';
                            }
                            let _valid = v.f_valid == '可用' ? 1 : 0;
                            let opts = '<td><a href="/is/manage/index_manage/conf?module=' + _this.module + '&id=' + v.f_id + '&valid=' + _valid + '" class="index-tbl-a index-edit " data-id="' + v.f_id + '">编辑</a>' + stop + valid + del;
                            if (module_value == 'index_feedback') {
                                opts = '';
                            }
                            tbody += opts;
                            tbody += '</tr>';
                        });
                    } else {
                        tbody += '<tr><td colspan="' + (flen + 1) + '" class="no-data">暂无数据！</td></tr>';
                    }
                    $('#indexTbody').empty().html(tbody);
                    _this.pageRange = Math.ceil(ret.data.count / _this.pageSize);
                    _this.page.param({
                        pageIndex: _this.pageIndex,
                        pageSize: _this.pageSize
                    });
                    _this.page.initPagipation(ret.data);
                    $('.ipt_show').blur();
                } else {
                    alert(ret.msg);
                }
            });
        }
    }
});
indexManage.init();
