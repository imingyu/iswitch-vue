/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export has */
/* unused harmony export isFun */
/* unused harmony export isPromise */
/* unused harmony export toPromise */
/* unused harmony export err */
/* unused harmony export warn */
/* harmony export (immutable) */ __webpack_exports__["a"] = ISwitch;
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var uid = 0;
var has = function has(obj, prop) {
    return obj.hasOwnProperty(prop);
};
var isFun = function isFun(obj) {
    return typeof obj === 'function' || obj instanceof Function;
};
var isPromise = function isPromise(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && isFun(obj.then);
};
var toPromise = function toPromise(fun, args, ctx) {
    if (isFun(fun)) {
        var result = fun.apply(ctx || null, args);
        if (isPromise(result)) {
            return result;
        } else {
            return !!result ? Promise.resolve() : Promise.reject();
        }
    } else {
        return Promise.resolve();
    }
};
var err = function err(msg) {
    throw new Error('[ISwitch Error] ' + msg);
};
var warn = function warn(msg) {
    console.warn('[ISwitch Warn] ' + msg);
};

var validateOptions = function validateOptions(ops) {
    if (!has(ops, 'onValue') || !has(ops, 'offValue')) {
        err('\u914D\u7F6E\u9879onValue\u548CoffValue\u4E0D\u5F97\u4E3A\u7A7A');
    }
    if (ops.onValue === ops.offValue) {
        err('\u914D\u7F6E\u9879onValue\u548CoffValue\u4E0D\u80FD\u662F\u76F8\u7B49\u7684\u503C');
    }
};

function ISwitch(options) {
    var iSwitch = {
        id: 'isw' + uid++,
        ts: new Date(),
        checked: false
    };

    var self = this;
    var isWillChange = function isWillChange(willValue) {
        return willValue !== iSwitch.value;
    };
    var changeValue = function changeValue(value) {
        setValue(value);
        iSwitch.onChange(value);
    };
    var setValue = function setValue(value) {
        iSwitch.value = value;
        iSwitch.checked = iSwitch.value === iSwitch.onValue;
        if (iSwitch.provider && isFun(iSwitch.provider.setValue)) {
            iSwitch.provider.setValue(value, iSwitch.checked);
        }
    };
    var switchChange = function switchChange(willValue) {
        return new Promise(function (resolve, reject) {
            if (isWillChange(willValue)) {
                if (iSwitch.beforeChange && isFun(iSwitch.beforeChange)) {
                    toPromise(iSwitch.beforeChange, [willValue]).then(function () {
                        changeValue(willValue);
                        resolve();
                    }).catch(function (err) {
                        reject(err);
                    });
                } else {
                    changeValue(willValue);
                    resolve();
                }
            } else {
                resolve();
            }
        });
    };

    this.setOptions = function (ops) {
        if ((typeof ops === 'undefined' ? 'undefined' : _typeof(ops)) === 'object') {
            Object.assign(iSwitch, ISwitch.defaultOptions, ops);
        }
        validateOptions(iSwitch);
    };

    this.setOptions(options);

    if (iSwitch.value !== iSwitch.onValue && iSwitch.value !== iSwitch.offValue) {
        warn('value值没有设置或者不在范围内，已经默认设置为offValue');
        setValue(iSwitch.offValue);
    } else {
        iSwitch.checked = iSwitch.value === iSwitch.onValue;
    }

    this.getValue = function () {
        return {
            value: iSwitch.value,
            checked: iSwitch.checked
        };
    };
    this.switchOn = function () {
        return switchChange(iSwitch.onValue);
    };
    this.switchOff = function () {
        return switchChange(iSwitch.offValue);
    };
    this.switchToggle = function () {
        return iSwitch.checked ? switchChange(iSwitch.offValue) : switchChange(iSwitch.onValue);
    };
    this.destroy = function () {
        delete iSwitch.provider;
        delete iSwitch.beforeChange;
        delete iSwitch.onChange;
        iSwitch = null;
    };
}
ISwitch.defaultOptions = {
    onText: '',
    onValue: true,
    onColor: '#64bd63',
    offText: '',
    offValue: false,
    offColor: '#fdfdfd',
    beforeChange: null,
    onChange: null,
    delay: 300,
    name: '',
    value: undefined,
    size: 'default',
    loading: false,
    loadingText: 'Loading...',
    disabled: false,
    static: false,
    readonly: false,
    provider: null //特定框架需要暴露的API
};

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ISwitch_vue__ = __webpack_require__(2);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };




var plugin = {
    install: function install(Vue, options) {
        Object.assign(__WEBPACK_IMPORTED_MODULE_0__core_js__["a" /* ISwitch */].defaultOptions, options || {});
        Vue.component('iswitch', __WEBPACK_IMPORTED_MODULE_1__ISwitch_vue__["a" /* default */]);
    }
};

if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.Vue) {
    window.Vue.use(plugin);
    window.ISwitch = __WEBPACK_IMPORTED_MODULE_1__ISwitch_vue__["a" /* default */];
}

/* harmony default export */ __webpack_exports__["default"] = (plugin);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_ISwitch_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0419f01b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_ISwitch_vue__ = __webpack_require__(6);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(3)
}
var normalizeComponent = __webpack_require__(4)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_ISwitch_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0419f01b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_ISwitch_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\ISwitch.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0419f01b", Component.options)
  } else {
    hotAPI.reload("data-v-0419f01b", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_js__ = __webpack_require__(0);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var sizes = ['mini', 'default', 'large'];
var defaultOptions = __WEBPACK_IMPORTED_MODULE_0__core_js__["a" /* ISwitch */].defaultOptions;
/* harmony default export */ __webpack_exports__["a"] = ({
    name: 'iswitch',
    props: {
        value: null,
        options: {
            type: Object,
            default: function _default() {
                return Object.assign({}, defaultOptions);
            }
        },
        disabled: {
            type: Boolean,
            default: defaultOptions.disabled
        },
        loading: {
            type: Boolean,
            default: defaultOptions.loading
        },
        static: {
            type: Boolean,
            default: defaultOptions.static
        },
        readonly: {
            type: Boolean,
            default: defaultOptions.readonly
        },
        size: {
            type: String,
            default: 'default',
            validator: function validator(val) {
                return sizes.indexOf(val) >= 0;
            }
        }
    },
    data: function data() {
        return {
            loadingIcon: 'data:image/gif;base64,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',
            checkboxChecked: false,
            checked: false,
            $iSwitchCore: null
        };
    },

    watch: {
        options: function options(val) {
            this.setISwitchCoreOptions();
        }
    },
    computed: {
        style: function style() {
            var result = {},
                computeOptions = computeOptions,
                onColor = this.getOptions('onColor'),
                offColor = this.getOptions('offColor');
            result.backgroundColor = this.checked ? onColor : offColor;

            if (this.checked) {
                result.borderColor = onColor;
                result.boxShadow = onColor + ' 0 0 0 16px inset';
            } else {
                result.boxShadow = offColor + ' 0 0 0 0 inset';
            }
            return result;
        },
        computeOptions: function computeOptions() {
            return Object.assign({}, defaultOptions, this.options);
        }
    },
    methods: {
        getOptions: function getOptions(key) {
            var item = this.computeOptions[key];
            if (item) {
                return item;
            } else {
                defaultOptions[key];
            }
        },
        changeCheckbox: function changeCheckbox(event) {
            var _this = this;

            if (this.loading || this.static || this.readonly || this.disabled) {
                event.preventDefault();
                return;
            }
            var oldChecked = this.checkboxChecked;
            (event.target.checked ? this.$iSwitchCore.switchOn() : this.$iSwitchCore.switchOff()).then(function () {
                _this.checkboxChecked = !oldChecked;
                _this.checked = !oldChecked;
            }).catch(function (err) {
                _this.checkboxChecked = oldChecked;
                _this.checked = oldChecked;
                event.target.checked = oldChecked;
            });
        },
        createISwitchCore: function createISwitchCore() {
            var self = this;
            self.checked = self.value === self.options.onValue;
            var ops = Object.assign({}, this.computeOptions, {
                value: self.value,
                provider: {
                    setValue: function setValue(val, checked) {
                        self.checked = checked;
                        self.$emit('input', val);
                    }
                },
                onChange: function onChange(val) {
                    self.$emit('change', val);
                }
            });
            this.$iSwitchCore = new __WEBPACK_IMPORTED_MODULE_0__core_js__["a" /* ISwitch */](ops);
        },
        setISwitchCoreOptions: function setISwitchCoreOptions() {
            var ops = Object.assign({}, this.computeOptions);
            delete ops.provider;
            this.$iSwitchCore.setOptions(ops);
        }
    },
    created: function created() {
        this.createISwitchCore();
    }
});

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      class: ((_obj = {
        "iswitch-container": true,
        "is-loading": _vm.loading,
        "is-readonly": _vm.readonly,
        "is-disabled": _vm.disabled,
        "is-static": _vm.static,
        "is-checked": _vm.checked
      }),
      (_obj["iswitch-" + _vm.size] = true),
      _obj)
    },
    [
      _c("label", { staticClass: "isw-control" }, [
        _c("input", {
          staticClass: "isw-checkbox",
          attrs: {
            type: "checkbox",
            disabled: _vm.loading || _vm.disabled || _vm.readonly || _vm.static,
            name: _vm.computeOptions.name
          },
          on: { change: _vm.changeCheckbox }
        }),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "isw-inner", style: _vm.style },
          [
            !_vm.static ? [_vm._m(0)] : _vm._e(),
            _vm._v(" "),
            _vm.checked
              ? [
                  _vm.computeOptions.onText
                    ? [
                        _vm._v(
                          "\n                    " +
                            _vm._s(_vm.computeOptions.onText) +
                            "\n                "
                        )
                      ]
                    : [_vm._t("onText")]
                ]
              : [
                  _vm.computeOptions.offText
                    ? [
                        _vm._v(
                          "\n                    " +
                            _vm._s(_vm.computeOptions.offText) +
                            "\n                "
                        )
                      ]
                    : [_vm._t("offText")]
                ]
          ],
          2
        )
      ]),
      _vm._v(" "),
      _vm._t("default")
    ],
    2
  )
  var _obj
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "isw-toggle" }, [
      _c("i", { staticClass: "isw-loading" })
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0419f01b", esExports)
  }
}

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map