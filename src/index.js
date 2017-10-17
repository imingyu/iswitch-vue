import * as core from './core.js';
import ISwitch from './ISwitch.vue';

var plugin = {
    install(Vue, options) {
        Object.assign(core.ISwitch.defaultOptions, options || {});
        Vue.component('iswitch', ISwitch);
    }
}

if (typeof window === 'object' && window.Vue) {
    window.Vue.use(plugin);
    window.ISwitch = ISwitch;
}

export default plugin;