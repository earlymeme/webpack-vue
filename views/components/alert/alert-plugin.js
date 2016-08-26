/**
 * Vue Plugin Install.
 */

function install(Vue) {
    
    var AlertConstructor = Vue.extend(require('./alert.vue'));
    var alertInstance = null;
    
    Object.defineProperty(Vue.prototype, '$alert', {
        
        get: function() {
            
            return (opt) => {
                if (alertInstance) return alertInstance;
                opt.data = opt.data || {};
                opt.data.alertTransition = 'alert-fadeIn';
                opt.data.isPlugin = true;
                alertInstance = new AlertConstructor({
                    el: document.createElement('div'),
                    data() {
                        return opt.data;
                    },
                    propsData: opt.props
                });
                alertInstance.$appendTo(document.body);
                return alertInstance;
            };
        }
        
    });
    
    
    
    Vue.transition('alert-fadeIn', {
        afterEnter: function(el) {
            
        },
        afterLeave: function(el) {
            if (alertInstance) {
                el.remove();
                alertInstance.$destroy()
                alertInstance = null
            }
        }
    });
}

if (window.Vue) {
    Vue.use(install);
}

module.exports = install;