import Vue from 'vue'
import VueResource from 'vue-resource'
import 'babel-polyfill'
import store from './vuex/store'
import * as actions from './vuex/actions'
import './filters/trim'
import SearchBox from './components/search-box/search-box.vue'

Vue.config.debug = true
Vue.config.devtools = true
/*审核通过，不通过弹层*/
Vue.use(VueResource)

var indexList = new Vue({
    el: 'body',
    /*引用组件*/
    components: {SearchBox},
    events: {
        
    },
    store,
    props: {
        
    },
    vuex: {
        actions
    },
    propsData: {
        
    },
    data: {
        moduleData: PHPCONF.module_data,
    },
    computed: {
        
    },
    watch: {
        
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
             $('#' + dialog.dialog_id).css('top', 124).addClass('bft');*/
            this.$broadcast('open:dialog', {
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
                callback: function() {
                    
                }
            });
        }
    },
    ready(){
        
    },
    methods: {
        init: function() {
            var _this = this;
            if ($.cookie('banner')) {
                $('.index-banner').hide();
            } else {
                _this.setBanner();
                $(window).resize(function() {
                    _this.setBanner();
                });
            }
        
            _this.events();
            _this.showTab(this.moduleData);
            _this.loadAll();
            _this.initPage();
            _this.loadInfo(true);
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
                    _this.loadInfo();
                }
            });
        },
        setBanner: function() {
            var w = $('.wrap').width();
            var h = w * 40 / 1325,
                t = (h - 26) / 2;
            $('.index-banner').css({height: h + 'px'});
            $('.banner-info').css({top: t + 'px'});
        },
        timer: null,
        events: function() {
            var $body = $('body'),
                _this = this;
            $body.on('keypress', '.search-input', function(event) {
                if (event.keyCode == 13) {
                    var value = $.trim($(this).val());
                    _this.pageIndex = 1;
                    _this.pageRange = undefined;
                    _this.loadInfo();
                }
            }).on('click', '.icon-search', function() {
                var value = $.trim($('.search-input').val());
                _this.pageIndex = 1;
                _this.pageRange = undefined;
                _this.loadInfo();
            }).on('click', '.banner-close', function() {
                $('.index-banner').remove();
                $.cookie('banner', '1', {expires: 7});
            })/*.on('click', '.index-class-a', function() {
             if ($(this).hasClass('index-class-ab')) {
             $(this).removeClass('index-class-ab');
             $('#moduleInfo .beyond').hide();
             } else {
             $(this).addClass('index-class-ab');
             $('#moduleInfo .beyond').show();
             }
             })*/.on('click', '.psa', function() {
                var pre = $(this).siblings('.pre');
                if (pre.hasClass('pre-auto')) {
                    $(this).html('展开');
                    pre.removeClass('pre-auto');
                } else {
                    $(this).html('收起');
                    pre.addClass('pre-auto');
                }
            }).on('mouseover', '.psr', function() {
                $(this).find('.psa').show();
            }).on('mouseout', '.psr', function() {
                $(this).find('.psa').hide();
            }).on('click', '#download', function() {
                var moduleId = $('#moduleData .cur a').attr('data-id') || '',
                    url = '/is/index_list/get_data?is_export=1&key=&biz_module_id=' + moduleId;
                window.open(url);
            }).on('click', '#moduleData a', function() {
                var id = $(this).attr('data-id'),
                    parent = $(this).parent(),
                    li = $('#moduleData li');
                if (id) {
                    if ($(this).hasClass('sub-a')) {
                        if (!parent.hasClass('cur')) {
                            li.removeClass('cur').removeClass('active');
                            parent.addClass('cur');
                            parent.parents('li').addClass('active');
                        }
                    } else {
                        if (!parent.hasClass('active')) {
                            li.removeClass('cur').removeClass('active');
                            parent.addClass('active');
                        }
                    }
                    _this.moduleID = id;
                    _this.timer && clearTimeout(_this.timer);
                    _this.timer = setTimeout(function() {
                        _this.loadAll();
                        _this.pageIndex = 1;
                        _this.pageRange = undefined;
                        _this.loadInfo(true);
                    }, 500);
                }
            }).on('change', '#index_type, #platform', function() {
                _this.pageIndex = 1;
                _this.pageRange = undefined;
                _this.loadInfo();
            }).on('change','#biz_module',function() {
                _this.moduleID = $(this).val();
                _this.pageIndex = 1;
                _this.pageRange = undefined;
                _this.loadInfo();
            }).on('click', '.showdlg', function(e) {
                var opt = {
                    url: $(e.currentTarget).attr('data-interface'),
                    fcode: $(e.currentTarget).attr('data-fcode'),
                };
                var url = opt.url + opt.fcode;
                _this.showDialog(url);
            }).on('click', '.index-bug', function(e) {
                var $this = $(this);
                /*报错*/
                var options = {
                    type: 'html',
                    width: 600,
                    height: 300,
                    title: '报错',
                    content: '<div class="dialog-bug"> <div class="bug-title">报错内容：</div><textarea name="bug" id="bug" class="txarea txarea-bug" placeholder="在此填写错误内容及正确的口径注释"></textarea><div class="bug_footer"><span class="result"></span><button class="bug_confirm">提交</button></div> </div>',
                    height_auto: true,
                    drag: true,
                    cloent: function() {
                        _this.dialogBug.remove();
                    }
                };
                _this.dialogBug = null;
                _this.dialogBug = new PHDialog;
                _this.dialogBug.init(options);
                _this.dialogBug.show();
                _this.$dialogBug = $('#' + _this.dialogBug.dialog_id);
                _this.$dialogBug.addClass('bft');
                _this.$dialogBug.css('top', '100px');
                _this.$dialogBug.attr('data-code', $this.attr('data-code')).attr('data-name', $this.attr('data-name'));
            }).on('click', '.bug_confirm', function(e) {
                /*报错确认*/
                _this.$dialogBug.find('.result').text('提交反馈中...');
                $.ajax({
                    url: '/is/manage/index_manage/update',
                    data: {
                        module: 'index_feedback',
                        code: _this.$dialogBug.attr('data-code'),
                        detail: _this.$dialogBug.find('#bug').val(),
                        name: _this.$dialogBug.attr('data-name')
                    },
                    dataType: 'json',
                    method: 'GET',
                    success: function(data) {
                        if (!data.code) {
                            _this.$dialogBug.find('.result').text('提交完成');
                            _this.dialogBug.remove();
                        }else {
                            _this.$dialogBug.find('.result').text(data.msg);
                        }
                    }
                });
            });
            var t;
            var thead = $('.index-tbl-head-fix');
            var box = $('.pub-box-c');
            var $window = $(window);
            if ($window.scrollTop() > 240) {
                thead.css({
                    width: box.width()
                }).show();
            } else {
                thead.hide();
            }
            $window.on('scroll resize', function() {
                clearTimeout(t);
                t = setTimeout(function() {
                    if ($window.scrollTop() > 240) {
                        thead.css({
                            width: box.width()
                        }).show();
                    } else {
                        thead.hide();
                    }
                }, 500);
            });
        
        },
        loadBizModule: function() {
            var _this = this,
                url = 'common/entity/get_control_data',
                param = {
                    code: 'biz_module'
                };
            IS.interfaceRun(url, param, _this.showBizModule);
        },
        showBizModule: function(ret) {
            var data = ret.data,
                wrap = '#biz_module';
            IS.showSelt(wrap, data);
            $(wrap).find('option[value=' + this.moduleID + ']').prop('selected',true)
        },
        loadAll: function() {
            var _this = this,
                url = 'index_list/get_index_type',
                param = {
                    biz_module_id: _this.moduleID
                };
            IS.interfaceRun(url, param, _this.showIndexType);
            _this.loadPlatform();
            _this.loadBizModule();
        },
        showIndexType: function(ret) {
            var data = ret.data,
                wrap = '#index_type';
            IS.showSelt(wrap, data);
        },
        loadPlatform: function() {
            var _this = this,
                url = 'index_list/get_platform',
                param = {
                    biz_module_id: _this.moduleID
                };
            IS.interfaceRun(url, param, _this.showPlatform);
        },
        showPlatform: function(ret) {
            var data = ret.data,
                wrap = '#platform';
            IS.showSelt(wrap, data);
        },
        showTab: function(data) {
            if (data.length) {
                var ul = $('#moduleData'),
                    li = '',
                    _this = this;
                $.each(data, function(k, v) {
                    /*var cur = k == 0 ? ' class="cur"' : '';
                     li += '<li'+ cur +'><a href="javascript:;" data-id="'+ v.id +'">'+ v.name +'</a></li>';
                     if (k == 0) {
                     _this.showDesc(v);
                     }*/
                    var active = k == 0 ? ' class="active"' : '';
                    if (v.list && v.list.length) {
                        li += '<li' + active + '><a href="javascript:;">' + v.name + '</a>';
                        li += '<ul class="sub-ul">';
                        $.each(v.list, function(l, w) {
                            var cur = '';
                            if (k == 0 && l == 0) {
                                cur = ' class="cur"';
                                _this.moduleID = w.id;
                            }
                            li += '<li' + cur + '><a href="javascript:;" data-id="' + w.id + '" class="sub-a"><i class="icon-faq-list"></i><span>' + w.name + '</span></a></li>';
                        });
                        li += '</ul></li>'
                    } else {
                        li += '<li' + active + '><a href="javascript:;" data-id="' + v.id + '"><i></i>' + v.name + '</a></li>';
                        if (k == 0) {
                            _this.moduleID = v.id;
                        }
                    }
                });
                ul.empty().html(li);
            }
        },
        showDesc: function(data) {
            var wrap = $('#moduleInfo'),
                keyword = $('.index-class-t h3 strong'),
                desc = $('.index-class-t h3 span'),
                list = $('.index-class-c ul'),
                keywordData = data.keyword + ': ',
                descData = data.desc,
                listData = data.list ? data.list : [];
            if (!descData && !listData.length) {
                wrap.hide();
            } else {
                wrap.show();
                keyword.html(keywordData);
                desc.html(descData);
                var li = '',
                    len = listData.length;
                if (len > 3) {
                    $('.index-class-a').show();
                } else {
                    $('.index-class-a').hide();
                }
                $.each(listData, function(k, v) {
                    var be = k < 3 ? '' : ' class="beyond"';
                    li += '<li' + be + '><em>·</em><p>' + v.name + ': ' + v.desc + '</p></li>';
                });
                list.empty().html(li);
            }
        },
        loadInfo: function(first) {
            var _this = this;
            var moduleId = _this.moduleID ? _this.moduleID : '',
                keyword = $.trim($('.search-input').val());
            var pageIndex, pageSize;
            if (_this.pageIndex < 1) {
                _this.pageIndex = 1;
            }
            if (_this.pageIndex > _this.pageRange) {
                _this.pageIndex = _this.pageRange;
            }
            pageIndex = _this.pageIndex || 1;
            pageSize = _this.pageSize || 30;
            var url = 'index_list/get_data',
                param = {
                    key: keyword,
                    biz_module_id: moduleId,
                    index_type: $('#index_type').val(),
                    platform: $('#platform').val(),
                    pageSize: pageSize,
                    pageIndex: pageIndex - 1
                };
            if (first) {
                param.index_type = '';
                param.platform = '';
            }
            IS.showLoading('.index-list');
            $('.tbl-loading').css('height', $(document).height() + 'px');
            IS.interfaceRun(url, param, function(ret) {
                IS.hideLoading('.index-list');
                if (moduleId === _this.moduleID) {
                    if (ret.code == 0) {
                        var data = ret.data,
                            len = data.data.length,
                            tr = '',
                            patt = new RegExp('\n');
                        if (len) {
                            $.each(data.data, function(k, v) {
                                var platform_list = '';
                                if (v.f_platform_list) {
                                    var l = v.f_platform_list.length;
                                    $.each(v.f_platform_list, function(k1, v1) {
                                        if (v1.interface) {
                                            if (k1 < l - 1) {
                                                platform_list += '<a href="javascript:;" class="showdlg" data-interface="' + v1.url + '" data-fcode="' + v.f_code + '">' + v1.name + '</a><span>，</span>';
                                            } else {
                                                platform_list += '<a href="javascript:;" class="showdlg" data-interface="' + v1.url + '" data-fcode="' + v.f_code + '">' + v1.name + '</a>';
                                            }
                                        } else {
                                            if (v1.url) {
                                                if (k1 < l - 1) {
                                                    platform_list += '<a href="' + v1.url + '" target="_blank">' + v1.name + '</a><span>，</span>';
                                                } else {
                                                    platform_list += '<a href="' + v1.url + '" target="_blank">' + v1.name + '</a>';
                                                }
                                            
                                            } else {
                                                if (k1 < l - 1) {
                                                    platform_list += '<span>' + v1.name + '，</span>';
                                                } else {
                                                    platform_list += '<span>' + v1.name + '</span>';
                                                }
                                            }
                                        }
                                    
                                    });
                                }
                                var str = '';
                                if (patt.test(v.f_rule)) {
                                    str = '<a href="javascript:;" class="psa">展开</a>';
                                }
                                tr += [
                                    '<tr>',
                                    '<td class="f_code">' + v.f_code + '</td>',
                                    '<td>' + v.f_index_type_id + '</td>',
                                    '<td class="f_name"><a href="/is/index_list/detail?id=' + v.f_id + '">' + v.f_name + '</a></td>',
                                    //'<td>'+ v.f_definition +'</td>',
                                    '<td class="psr"><div class="psrr"><pre class="pre" title="' + v.f_rule + '">' + v.f_rule + '</pre>' + str + '</div></td>',
                                    '<td class="f_platform"><div class="f_platform_cnt">' + platform_list + '</div></td>',
                                    '<td class="f_opt"><div class="opt opt-bug"><a href="javascript:;" class="index-tbl-a index-bug" data-code="' + v.f_code + '" data-name="' + v.f_name + '">报错</a></div></td>',
                                    '</tr>'
                                ].join('');
                            });
                        } else {
                            tr += '<tr><td colspan="6" class="no-data">暂无数据</td></tr>';
                        }
                        $('#indexTbody').empty().html(tr);
                        $('.index-tbl-head-fix tbody').empty().html(tr).css('visibility', 'hidden');
                        _this.pageRange = Math.ceil(data.count / _this.pageSize);
                        _this.page.param({
                            pageIndex: _this.pageIndex,
                            pageSize: _this.pageSize
                        });
                        _this.page.initPagipation(data);
                        $('.ipt_show').blur();
                    } else {
                        alert(ret.msg);
                    }
                }
            });
        },
        /*
         /issue/bn-data-pf-54/show
         *  */
        showDialog: function(url) {
            var _this = this;
            var options = {
                type: 'html',
                width: 400,
                height: 300,
                title: '可查看报表',
                content: '<div class="warn_tbl"> <table class="warn_table"> </table> </div>',
                height_auto: true,
                drag: true,
                cloent: function() {
                    _this.dialog.remove();
                }
            };
            _this.dialog = null;
            _this.dialog = new PHDialog;
            _this.dialog.init(options);
            _this.dialog.show();
            _this.$dialog = $('#' + _this.dialog.dialog_id);
            _this.$dialog.addClass('bft');
            _this.$dialog.css('top', '100px');
            this.renderZbCover(url);
        },
        coverTblTpl: template.compile(`<thead>
            <tr>
                <th>序号</th>
                <th>表名</th>
            </tr>
        </thead>
        <tbody>
            {{if data&&data.length}}
                {{each data as v k}}
                    <tr>
                        <td>{{k+1}}</td>
                        <td><a href="{{v.url}}" class="form-url" target="_blank">{{v.form_name}}</a></td>
                    </tr>
                {{/each}}
            {{else}}
                <tr><td style="text-align: center;border-bottom: 1px solid #e8ebed;" colspan="2">报表建设中</td></tr>
            {{/if}}
        </tbody>`),
        renderZbCover: function(url) {
            var _this = this;
            $('.warn_table').html('<tbody><tr data-elems="loadingtr"><td colspan="2" style="border-bottom: 1px solid #e8ebed;text-align: center;color:#545454;">数据加载中...</td></tr></tbody>');
            if (this.ajaxCover) {
                this.ajaxCover.abort();
            }
            this.ajaxCover = $.ajax({
                url: '/is/index_api/get_reference_by_url',
                data: {
                    url: encodeURI(url)
                },
                dataType: 'json',
                method: 'GET',
                cache: true,
                success: function(data) {
                    if (!data.code) {
                        $('.warn_table').html(_this.coverTblTpl(data));
                    } else {
                        alert(data.msg);
                    }
                }
            });
        }
    }
});
indexList.init();
