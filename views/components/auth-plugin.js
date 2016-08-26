/**
 * Vue Plugin Install.
 */

function install(Vue) {
    
    var AuthConstructor = Vue.extend(require('./auth.vue'));
    var authDialogInstance = null;
    
    Object.defineProperty(Vue.prototype, '$auth', {
        get: function() {
            return (options) => {
                if (authDialogInstance) {
                    return authDialogInstance
                }
                options = options || {};
                authDialogInstance = new AuthConstructor({
                    el: document.createElement('div'),
                    data() {
                        return options
                    },
                    parent: this
                });
                authDialogInstance.$appendTo(document.body)
                return authDialogInstance;
            }
        }
    });
    Object.defineProperty(Vue.prototype, '$authShow', {
        get: function() {
            return (options) => {
                if (!authDialogInstance) {
                    this.$auth(options)
                }
                authDialogInstance.option(options)
                authDialogInstance.open()
            }
        }
    });
    
    Vue.transition('fadeIn', {
        afterEnter: function(el) {
            
        },
        afterLeave: function(el) {
            authDialogInstance = null
        }
    });
}

if (window.Vue) {
    Vue.use(install)
}

module.exports = install;