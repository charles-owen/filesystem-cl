(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["FileSystemConsole"] = factory();
	else
		root["FileSystemConsole"] = factory();
})(window, function() {
return (window["webpackJsonp_name_"] = window["webpackJsonp_name_"] || []).push([["FileSystemConsole"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--2!./node_modules/vue-loader/lib??vue-loader-options!./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var users_cl_js_Lib_UserSelectorVue_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! users-cl/js/Lib/UserSelectorVue.vue */ "./vendor/cl/users/js/Lib/UserSelectorVue.vue");
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

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      selectedApp: 'any',
      user: null,
      applications: [],
      fetched: false,
      results: [],
      toView: Site.root + '/cl/filesystem/view',
      toDownload: Site.root + '/cl/filesystem/download',
      toDownloadImg: Site.root + '/vendor/cl/site/img/download.png'
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$parent.setTitle(': File System');
    Site.api.get('/api/filesystem/applications', {}).then(function (response) {
      if (!response.hasError()) {
        var data = response.getData('applications');

        if (data !== null) {
          _this.applications = data.attributes;
        }
      } else {
        Site.toast(_this, response);
      }
    }).catch(function (error) {
      console.log(error);
      Site.toast(_this, error);
    });
  },
  components: {
    'user-selector': users_cl_js_Lib_UserSelectorVue_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  methods: {
    selected: function selected(user) {
      this.user = user;
    },
    open: function open(file) {
      console.log(file);
    },
    query: function query() {
      var _this2 = this;

      if (this.user === null) {
        return;
      }

      this.fetched = false;
      var params = {
        'userId': this.user.id
      };

      if (this.application !== 'any') {
        params.appTag = this.application;
      }

      Site.api.get('/api/filesystem', params).then(function (response) {
        if (!response.hasError()) {
          _this2.fetched = true;
          var data = response.getData('files');

          if (data !== null) {
            _this2.results = data.attributes;
          }
        } else {
          Site.toast(_this2, response);
        }
      }).catch(function (error) {
        console.log(error);
        Site.toast(_this2, error);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--2!./node_modules/vue-loader/lib??vue-loader-options!./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
var LIMIT = 20;
/* harmony default export */ __webpack_exports__["default"] = ({
  props: ['selected'],
  data: function data() {
    return {
      query: '',
      result: [],
      noresult: false,
      seq: 1,
      fetched: false,
      timer: null,
      set: false,
      more: false,
      searcher: Site.root + '/vendor/cl/site/img/search.png',
      deleter: Site.root + '/vendor/cl/site/img/x.png'
    };
  },
  watch: {
    query: function query(after, before) {
      var _this = this;

      if (this.set) {
        this.set = false;
        return;
      }

      if (this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      ;
      this.timer = setTimeout(function () {
        _this.fetch(after);
      }, 300);
    }
  },
  methods: {
    fetch: function fetch(query) {
      var _this2 = this;

      console.log('fetch');
      console.log(query);

      if (this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      ;
      this.selected(null);
      query = query.trim();

      if (query.length < 2) {
        this.fetched = false;
        this.result = [];
        return;
      }

      this.seq++;
      Site.api.get('/api/users', {
        search: query,
        seq: this.seq,
        limit: LIMIT
      }).then(function (response) {
        if (!response.hasError()) {
          // This protects from out-of-order processing
          // of results from the server...
          var seq = response.getData('seq');

          if (+seq.id !== _this2.seq) {
            return;
          }

          var data = response.getData('users');

          if (data !== null) {
            _this2.result = [];
            _this2.more = false;
            data.attributes.forEach(function (userData) {
              if (userData.more !== 'yes') {
                var user = new Users.User(userData);

                _this2.result.push(user);
              } else {
                _this2.more = true;
              }
            });
            _this2.noresult = _this2.result.length === 0;
          }
        } else {
          Site.toast(_this2, response);
        }
      }).catch(function (error) {
        console.log(error);
        Site.toast(_this2, error);
      });
    },
    selectUser: function selectUser(user) {
      ;
      this.query = user.name;
      this.set = true;
      this.result = [];
      this.noresult = false;
      this.more = false;
      this.selected(user);
    },
    clear: function clear() {
      this.seq++; // Just in case

      this.result = [];
      this.noresult = false;
      this.more = false;
      this.query = '';
      this.selected(null);
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=style&index=0&lang=scss&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib??vue-loader-options!./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=style&index=0&lang=scss& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\ndiv.filesystem-editor-cl label span:first-child {\n  display: inline-block;\n  width: 10em;\n  text-align: right;\n  padding: 0 0.25em 0 0;\n}\ndiv.filesystem-editor-cl input[type=text],\ndiv.filesystem-editor-cl option {\n  padding: 1px 0.25em;\n}\ndiv.filesystem-editor-cl select {\n  min-width: 15em;\n}\ndiv.filesystem-editor-cl button:disabled {\n  color: gray;\n}\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=style&index=0&id=e8e7f840&lang=scss&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib??vue-loader-options!./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=style&index=0&id=e8e7f840&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\na.searcher[data-v-e8e7f840] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  height: 100%;\n  min-height: 100%;\n  width: 21px;\n  text-align: center;\n  background: #aaaaaa;\n}\na.searcher img[data-v-e8e7f840] {\n  height: 16px;\n  width: 16px;\n  vertical-align: -4px;\n}\ndiv.cl-input[data-v-e8e7f840] {\n  display: inline-block;\n  position: relative;\n  width: 300px;\n}\ndiv.cl-input input[data-v-e8e7f840] {\n  width: 100%;\n  border: 1px solid #cccccc;\n}\ndiv.cl-input div.cl-results[data-v-e8e7f840] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 100%;\n  overflow: hidden;\n  font-size: 0.85em;\n  background: white;\n  border-left: 1px solid black;\n  border-right: 1px solid black;\n  border-bottom: 1px solid black;\n}\ndiv.cl-input div.cl-results div.cl-result-list[data-v-e8e7f840] {\n  display: table;\n  width: 100%;\n}\ndiv.cl-input div.cl-results div.cl-result-list div[data-v-e8e7f840] {\n  display: table-row;\n  border-bottom: 1px solid #888888;\n  cursor: pointer;\n}\ndiv.cl-input div.cl-results div.cl-result-list div span[data-v-e8e7f840] {\n  display: table-cell;\n  white-space: nowrap;\n  text-align: left;\n  padding: 0.5em 0.25em;\n}\ndiv.cl-input div.cl-results div.cl-result-list div span a[data-v-e8e7f840] {\n  text-decoration: none;\n  color: black;\n}\ndiv.cl-input div.cl-results div.cl-result-list div span a[data-v-e8e7f840]:hover {\n  color: #888888;\n}\ndiv.cl-input div.cl-results div.cl-result-list div span[data-v-e8e7f840]:first-child {\n  font-style: italic;\n}\ndiv.cl-input div.cl-results div.cl-result-list div span[data-v-e8e7f840]:last-child {\n  overflow: hidden;\n  width: 99%;\n}\ndiv.cl-input div.cl-results div.cl-result-list div:first-child span[data-v-e8e7f840],\ndiv.cl-input div.cl-results div.cl-result-list div:last-child span[data-v-e8e7f840] {\n  padding: 0.25em 0.25em;\n}\ndiv.cl-input div.cl-results div.statement[data-v-e8e7f840] {\n  width: 100%;\n  text-align: center;\n  font-style: italic;\n}\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=template&id=138ac23b&":
/*!******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=template&id=138ac23b& ***!
  \******************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "content filesystem-editor-cl" }, [
    _c("div", { staticClass: "full" }, [
      _c("p", [
        _c("label", [
          _c("span", [_vm._v("Application: ")]),
          _c(
            "select",
            {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.selectedApp,
                  expression: "selectedApp"
                }
              ],
              on: {
                change: function($event) {
                  var $$selectedVal = Array.prototype.filter
                    .call($event.target.options, function(o) {
                      return o.selected
                    })
                    .map(function(o) {
                      var val = "_value" in o ? o._value : o.value
                      return val
                    })
                  _vm.selectedApp = $event.target.multiple
                    ? $$selectedVal
                    : $$selectedVal[0]
                }
              }
            },
            [
              _c("option", [_vm._v("any")]),
              _vm._v(" "),
              _vm._l(_vm.applications, function(app) {
                return _c("option", [_vm._v(_vm._s(app))])
              })
            ],
            2
          )
        ])
      ]),
      _vm._v(" "),
      _c("p", [
        _c(
          "label",
          [
            _c("span", [_vm._v("User: ")]),
            _c("user-selector", { attrs: { selected: _vm.selected } })
          ],
          1
        )
      ]),
      _vm._v(" "),
      _c("p", { staticClass: "center" }, [
        _c(
          "button",
          {
            attrs: { disabled: _vm.user === null },
            on: {
              click: function($event) {
                $event.preventDefault()
                _vm.query()
              }
            }
          },
          [_vm._v("Query")]
        )
      ]),
      _vm._v(" "),
      _vm.fetched
        ? _c("div", [
            _vm.results.length > 0
              ? _c(
                  "table",
                  { staticClass: "small" },
                  [
                    _vm._m(0),
                    _vm._v(" "),
                    _vm._l(_vm.results, function(result) {
                      return _c("tr", [
                        _c("td", [_vm._v(_vm._s(result.user))]),
                        _vm._v(" "),
                        _c("td", [_vm._v(_vm._s(result.username))]),
                        _vm._v(" "),
                        _c("td", [
                          _c(
                            "a",
                            {
                              attrs: {
                                href: _vm.toView + "/" + result.id,
                                target: "_file"
                              }
                            },
                            [_vm._v(_vm._s(result.name))]
                          ),
                          _vm._v(" "),
                          _c(
                            "a",
                            {
                              attrs: { href: _vm.toDownload + "/" + result.id }
                            },
                            [_c("img", { attrs: { src: _vm.toDownloadImg } })]
                          )
                        ]),
                        _vm._v(" "),
                        _c("td", [_vm._v(_vm._s(result.createdStr))]),
                        _vm._v(" "),
                        _c("td", [_vm._v(_vm._s(result.modifiedStr))])
                      ])
                    })
                  ],
                  2
                )
              : _vm._e(),
            _vm._v(" "),
            _vm.results.length === 0
              ? _c("p", { staticClass: "centerbox secondb center" }, [
                  _vm._v("No files...")
                ])
              : _vm._e()
          ])
        : _vm._e(),
      _vm._v(" "),
      _c("p", { staticClass: "centerbox primary" }, [
        _vm._v(
          "CourseLib includes a simple file system that is\n      mainly provided to allow quizzes or other assignments to be persistent in the\n      system and to provide a way for applications such as Cirsim to save and\n      load files. It is not meant to be a way to turn in content, though this interface\n      can be used to load content from the file system for any user."
        )
      ])
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("tr", [
      _c("th", [_vm._v("User")]),
      _vm._v(" "),
      _c("th", [_vm._v("Name")]),
      _vm._v(" "),
      _c("th", [_vm._v("File")]),
      _vm._v(" "),
      _c("th", [_vm._v("Created")]),
      _vm._v(" "),
      _c("th", [_vm._v("Modified")])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=template&id=e8e7f840&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=template&id=e8e7f840&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("span", [
    _c("div", { staticClass: "cl-input" }, [
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.query,
            expression: "query"
          }
        ],
        attrs: { type: "text", maxlength: "150" },
        domProps: { value: _vm.query },
        on: {
          input: function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.query = $event.target.value
          }
        }
      }),
      _vm._v(" "),
      _c(
        "a",
        {
          staticClass: "searcher",
          on: {
            click: function($event) {
              $event.preventDefault()
              _vm.fetch(_vm.query)
            }
          }
        },
        [_c("img", { attrs: { src: _vm.searcher } })]
      ),
      _vm._v(" "),
      _vm.result.length > 0 || _vm.noresult
        ? _c("div", { staticClass: "cl-results" }, [
            _c(
              "div",
              { staticClass: "cl-result-list" },
              _vm._l(_vm.result, function(user) {
                return _c(
                  "div",
                  {
                    on: {
                      click: function($event) {
                        $event.preventDefault()
                        _vm.selectUser(user)
                      }
                    }
                  },
                  [
                    _c("span", [
                      _c(
                        "a",
                        {
                          on: {
                            click: function($event) {
                              $event.preventDefault()
                              _vm.selectUser(user)
                            }
                          }
                        },
                        [_vm._v(_vm._s(user.userId))]
                      )
                    ]),
                    _vm._v(" "),
                    _c("span", [
                      _c(
                        "a",
                        {
                          on: {
                            click: function($event) {
                              $event.preventDefault()
                              _vm.selectUser(user)
                            }
                          }
                        },
                        [_vm._v(_vm._s(user.name))]
                      )
                    ])
                  ]
                )
              })
            ),
            _vm._v(" "),
            _vm.noresult
              ? _c("div", { staticClass: "statement" }, [
                  _vm._v("No results...")
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.more
              ? _c("div", { staticClass: "statement" }, [_vm._v("...more...")])
              : _vm._e()
          ])
        : _vm._e()
    ]),
    _vm._v(" "),
    _c(
      "a",
      {
        on: {
          click: function($event) {
            $event.preventDefault()
            return _vm.clear($event)
          }
        }
      },
      [_c("img", { attrs: { src: _vm.deleter } })]
    )
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=style&index=0&lang=scss&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib??vue-loader-options!./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=style&index=0&lang=scss& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/resolve-url-loader!../../../../../node_modules/sass-loader/lib/loader.js?sourceMap!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileSystemComponent.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=style&index=0&lang=scss&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("6419f83c", content, false, {});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/resolve-url-loader!../../../../../node_modules/sass-loader/lib/loader.js?sourceMap!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileSystemComponent.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=style&index=0&lang=scss&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/resolve-url-loader!../../../../../node_modules/sass-loader/lib/loader.js?sourceMap!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileSystemComponent.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=style&index=0&lang=scss&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=style&index=0&id=e8e7f840&lang=scss&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib??vue-loader-options!./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=style&index=0&id=e8e7f840&lang=scss&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/resolve-url-loader!../../../../../node_modules/sass-loader/lib/loader.js?sourceMap!../../../../../node_modules/vue-loader/lib??vue-loader-options!./UserSelectorVue.vue?vue&type=style&index=0&id=e8e7f840&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=style&index=0&id=e8e7f840&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("fdefe8da", content, false, {});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/resolve-url-loader!../../../../../node_modules/sass-loader/lib/loader.js?sourceMap!../../../../../node_modules/vue-loader/lib??vue-loader-options!./UserSelectorVue.vue?vue&type=style&index=0&id=e8e7f840&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=style&index=0&id=e8e7f840&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/resolve-url-loader!../../../../../node_modules/sass-loader/lib/loader.js?sourceMap!../../../../../node_modules/vue-loader/lib??vue-loader-options!./UserSelectorVue.vue?vue&type=style&index=0&id=e8e7f840&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=style&index=0&id=e8e7f840&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./vendor/cl/filesystem/js/Console/FileSystemComponent.vue":
/*!*****************************************************************!*\
  !*** ./vendor/cl/filesystem/js/Console/FileSystemComponent.vue ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FileSystemComponent_vue_vue_type_template_id_138ac23b___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileSystemComponent.vue?vue&type=template&id=138ac23b& */ "./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=template&id=138ac23b&");
/* harmony import */ var _FileSystemComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FileSystemComponent.vue?vue&type=script&lang=js& */ "./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _FileSystemComponent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FileSystemComponent.vue?vue&type=style&index=0&lang=scss& */ "./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FileSystemComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FileSystemComponent_vue_vue_type_template_id_138ac23b___WEBPACK_IMPORTED_MODULE_0__["render"],
  _FileSystemComponent_vue_vue_type_template_id_138ac23b___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!module.hot.data) {
      api.createRecord('138ac23b', component.options)
    } else {
      api.reload('138ac23b', component.options)
    }
    module.hot.accept(/*! ./FileSystemComponent.vue?vue&type=template&id=138ac23b& */ "./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=template&id=138ac23b&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _FileSystemComponent_vue_vue_type_template_id_138ac23b___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileSystemComponent.vue?vue&type=template&id=138ac23b& */ "./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=template&id=138ac23b&");
(function () {
      api.rerender('138ac23b', {
        render: _FileSystemComponent_vue_vue_type_template_id_138ac23b___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _FileSystemComponent_vue_vue_type_template_id_138ac23b___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "vendor/cl/filesystem/js/Console/FileSystemComponent.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=script&lang=js&":
/*!******************************************************************************************!*\
  !*** ./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FileSystemComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--2!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileSystemComponent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FileSystemComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=style&index=0&lang=scss&":
/*!***************************************************************************************************!*\
  !*** ./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=style&index=0&lang=scss& ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_FileSystemComponent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader!../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/resolve-url-loader!../../../../../node_modules/sass-loader/lib/loader.js?sourceMap!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileSystemComponent.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_FileSystemComponent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_FileSystemComponent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_FileSystemComponent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_FileSystemComponent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_FileSystemComponent_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=template&id=138ac23b&":
/*!************************************************************************************************!*\
  !*** ./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=template&id=138ac23b& ***!
  \************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileSystemComponent_vue_vue_type_template_id_138ac23b___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileSystemComponent.vue?vue&type=template&id=138ac23b& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./vendor/cl/filesystem/js/Console/FileSystemComponent.vue?vue&type=template&id=138ac23b&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileSystemComponent_vue_vue_type_template_id_138ac23b___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileSystemComponent_vue_vue_type_template_id_138ac23b___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./vendor/cl/filesystem/js/Console/FileSystemConsole.js":
/*!**************************************************************!*\
  !*** ./vendor/cl/filesystem/js/Console/FileSystemConsole.js ***!
  \**************************************************************/
/*! exports provided: FileSystemConsole */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileSystemConsole", function() { return FileSystemConsole; });
/* harmony import */ var _FileSystemComponent_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileSystemComponent.vue */ "./vendor/cl/filesystem/js/Console/FileSystemComponent.vue");
/**
 * @file
 * File system console components
 */

var FileSystemConsole = function FileSystemConsole(site, Console) {
  Console.tables.add({
    title: 'FileSystem',
    order: 5,
    api: '/api/filesystem/tables'
  });
  Console.components.addOption({
    atLeast: Users.User.STAFF,
    page: {
      title: 'Main',
      route: '',
      order: 1
    },
    section: {
      title: 'Site',
      order: 1
    },
    title: 'File System',
    order: 10,
    route: '/filesystem',
    routes: [{
      route: '/filesystem',
      component: _FileSystemComponent_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
    }]
  });
};

/***/ }),

/***/ "./vendor/cl/filesystem/js/Console/index.js":
/*!**************************************************!*\
  !*** ./vendor/cl/filesystem/js/Console/index.js ***!
  \**************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FileSystemConsole__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileSystemConsole */ "./vendor/cl/filesystem/js/Console/FileSystemConsole.js");
/**
 * @file
 * Course console entry point.
 */

new _FileSystemConsole__WEBPACK_IMPORTED_MODULE_0__["FileSystemConsole"](Site.Site, Site.Console);

/***/ }),

/***/ "./vendor/cl/users/js/Lib/UserSelectorVue.vue":
/*!****************************************************!*\
  !*** ./vendor/cl/users/js/Lib/UserSelectorVue.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _UserSelectorVue_vue_vue_type_template_id_e8e7f840_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UserSelectorVue.vue?vue&type=template&id=e8e7f840&scoped=true& */ "./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=template&id=e8e7f840&scoped=true&");
/* harmony import */ var _UserSelectorVue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UserSelectorVue.vue?vue&type=script&lang=js& */ "./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _UserSelectorVue_vue_vue_type_style_index_0_id_e8e7f840_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UserSelectorVue.vue?vue&type=style&index=0&id=e8e7f840&lang=scss&scoped=true& */ "./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=style&index=0&id=e8e7f840&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _UserSelectorVue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _UserSelectorVue_vue_vue_type_template_id_e8e7f840_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _UserSelectorVue_vue_vue_type_template_id_e8e7f840_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "e8e7f840",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!module.hot.data) {
      api.createRecord('e8e7f840', component.options)
    } else {
      api.reload('e8e7f840', component.options)
    }
    module.hot.accept(/*! ./UserSelectorVue.vue?vue&type=template&id=e8e7f840&scoped=true& */ "./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=template&id=e8e7f840&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _UserSelectorVue_vue_vue_type_template_id_e8e7f840_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UserSelectorVue.vue?vue&type=template&id=e8e7f840&scoped=true& */ "./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=template&id=e8e7f840&scoped=true&");
(function () {
      api.rerender('e8e7f840', {
        render: _UserSelectorVue_vue_vue_type_template_id_e8e7f840_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _UserSelectorVue_vue_vue_type_template_id_e8e7f840_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "vendor/cl/users/js/Lib/UserSelectorVue.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=script&lang=js&":
/*!*****************************************************************************!*\
  !*** ./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_2_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSelectorVue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--2!../../../../../node_modules/vue-loader/lib??vue-loader-options!./UserSelectorVue.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_2_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSelectorVue_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=style&index=0&id=e8e7f840&lang=scss&scoped=true&":
/*!**************************************************************************************************************!*\
  !*** ./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=style&index=0&id=e8e7f840&lang=scss&scoped=true& ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSelectorVue_vue_vue_type_style_index_0_id_e8e7f840_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader!../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/resolve-url-loader!../../../../../node_modules/sass-loader/lib/loader.js?sourceMap!../../../../../node_modules/vue-loader/lib??vue-loader-options!./UserSelectorVue.vue?vue&type=style&index=0&id=e8e7f840&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/resolve-url-loader/index.js!./node_modules/sass-loader/lib/loader.js?sourceMap!./node_modules/vue-loader/lib/index.js?!./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=style&index=0&id=e8e7f840&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSelectorVue_vue_vue_type_style_index_0_id_e8e7f840_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSelectorVue_vue_vue_type_style_index_0_id_e8e7f840_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSelectorVue_vue_vue_type_style_index_0_id_e8e7f840_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSelectorVue_vue_vue_type_style_index_0_id_e8e7f840_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_resolve_url_loader_index_js_node_modules_sass_loader_lib_loader_js_sourceMap_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSelectorVue_vue_vue_type_style_index_0_id_e8e7f840_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=template&id=e8e7f840&scoped=true&":
/*!***********************************************************************************************!*\
  !*** ./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=template&id=e8e7f840&scoped=true& ***!
  \***********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSelectorVue_vue_vue_type_template_id_e8e7f840_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./UserSelectorVue.vue?vue&type=template&id=e8e7f840&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./vendor/cl/users/js/Lib/UserSelectorVue.vue?vue&type=template&id=e8e7f840&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSelectorVue_vue_vue_type_template_id_e8e7f840_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSelectorVue_vue_vue_type_template_id_e8e7f840_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

},[["./vendor/cl/filesystem/js/Console/index.js","runtime","vendor"]]]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9bbmFtZV0vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1tuYW1lXS92ZW5kb3IvY2wvZmlsZXN5c3RlbS9qcy9Db25zb2xlL0ZpbGVTeXN0ZW1Db21wb25lbnQudnVlIiwid2VicGFjazovL1tuYW1lXS92ZW5kb3IvY2wvdXNlcnMvanMvTGliL1VzZXJTZWxlY3RvclZ1ZS52dWUiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vdmVuZG9yL2NsL2ZpbGVzeXN0ZW0vanMvQ29uc29sZS9GaWxlU3lzdGVtQ29tcG9uZW50LnZ1ZT9lMjRhIiwid2VicGFjazovL1tuYW1lXS8uL3ZlbmRvci9jbC91c2Vycy9qcy9MaWIvVXNlclNlbGVjdG9yVnVlLnZ1ZT9lZTNhIiwid2VicGFjazovL1tuYW1lXS8uL3ZlbmRvci9jbC9maWxlc3lzdGVtL2pzL0NvbnNvbGUvRmlsZVN5c3RlbUNvbXBvbmVudC52dWU/MDc5YSIsIndlYnBhY2s6Ly9bbmFtZV0vLi92ZW5kb3IvY2wvdXNlcnMvanMvTGliL1VzZXJTZWxlY3RvclZ1ZS52dWU/ZDUzMyIsIndlYnBhY2s6Ly9bbmFtZV0vLi92ZW5kb3IvY2wvZmlsZXN5c3RlbS9qcy9Db25zb2xlL0ZpbGVTeXN0ZW1Db21wb25lbnQudnVlP2ZhYmEiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vdmVuZG9yL2NsL3VzZXJzL2pzL0xpYi9Vc2VyU2VsZWN0b3JWdWUudnVlPzU4ZGEiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vdmVuZG9yL2NsL2ZpbGVzeXN0ZW0vanMvQ29uc29sZS9GaWxlU3lzdGVtQ29tcG9uZW50LnZ1ZSIsIndlYnBhY2s6Ly9bbmFtZV0vLi92ZW5kb3IvY2wvZmlsZXN5c3RlbS9qcy9Db25zb2xlL0ZpbGVTeXN0ZW1Db21wb25lbnQudnVlPzFiNGEiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vdmVuZG9yL2NsL2ZpbGVzeXN0ZW0vanMvQ29uc29sZS9GaWxlU3lzdGVtQ29tcG9uZW50LnZ1ZT82NmY2Iiwid2VicGFjazovL1tuYW1lXS8uL3ZlbmRvci9jbC9maWxlc3lzdGVtL2pzL0NvbnNvbGUvRmlsZVN5c3RlbUNvbXBvbmVudC52dWU/NWI4MSIsIndlYnBhY2s6Ly9bbmFtZV0vLi92ZW5kb3IvY2wvZmlsZXN5c3RlbS9qcy9Db25zb2xlL0ZpbGVTeXN0ZW1Db25zb2xlLmpzIiwid2VicGFjazovL1tuYW1lXS8uL3ZlbmRvci9jbC9maWxlc3lzdGVtL2pzL0NvbnNvbGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vdmVuZG9yL2NsL3VzZXJzL2pzL0xpYi9Vc2VyU2VsZWN0b3JWdWUudnVlIiwid2VicGFjazovL1tuYW1lXS8uL3ZlbmRvci9jbC91c2Vycy9qcy9MaWIvVXNlclNlbGVjdG9yVnVlLnZ1ZT85MmZkIiwid2VicGFjazovL1tuYW1lXS8uL3ZlbmRvci9jbC91c2Vycy9qcy9MaWIvVXNlclNlbGVjdG9yVnVlLnZ1ZT9mODBjIiwid2VicGFjazovL1tuYW1lXS8uL3ZlbmRvci9jbC91c2Vycy9qcy9MaWIvVXNlclNlbGVjdG9yVnVlLnZ1ZT8wOTk3Il0sIm5hbWVzIjpbIkZpbGVTeXN0ZW1Db25zb2xlIiwic2l0ZSIsIkNvbnNvbGUiLCJ0YWJsZXMiLCJhZGQiLCJ0aXRsZSIsIm9yZGVyIiwiYXBpIiwiY29tcG9uZW50cyIsImFkZE9wdGlvbiIsImF0TGVhc3QiLCJVc2VycyIsIlVzZXIiLCJTVEFGRiIsInBhZ2UiLCJyb3V0ZSIsInNlY3Rpb24iLCJyb3V0ZXMiLCJjb21wb25lbnQiLCJGaWxlU3lzdGVtQ29tcG9uZW50IiwiU2l0ZSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDZ0NBO0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0JBREE7QUFFQSxnQkFGQTtBQUdBLHNCQUhBO0FBS0Es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QUFBQTtBQUFBO0FBQWdkLENBQWdCLHFjQUFHLEVBQUMsQzs7Ozs7Ozs7Ozs7O0FDQXBlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSIsImZpbGUiOiJmaWxlc3lzdGVtY29uc29sZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkZpbGVTeXN0ZW1Db25zb2xlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkZpbGVTeXN0ZW1Db25zb2xlXCJdID0gZmFjdG9yeSgpO1xufSkod2luZG93LCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCI8dGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImNvbnRlbnQgZmlsZXN5c3RlbS1lZGl0b3ItY2xcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmdWxsXCI+XHJcbiAgICAgIDxwPjxsYWJlbD48c3Bhbj5BcHBsaWNhdGlvbjogPC9zcGFuPjxzZWxlY3Qgdi1tb2RlbD1cInNlbGVjdGVkQXBwXCI+XHJcbiAgICAgICAgPG9wdGlvbj5hbnk8L29wdGlvbj5cclxuICAgICAgICA8b3B0aW9uIHYtZm9yPVwiYXBwIGluIGFwcGxpY2F0aW9uc1wiPnt7YXBwfX08L29wdGlvbj5cclxuICAgICAgPC9zZWxlY3Q+PC9sYWJlbD48L3A+XHJcbiAgICAgIDxwPjxsYWJlbD48c3Bhbj5Vc2VyOiA8L3NwYW4+PHVzZXItc2VsZWN0b3IgOnNlbGVjdGVkPVwic2VsZWN0ZWRcIj48L3VzZXItc2VsZWN0b3I+PC9sYWJlbD48L3A+XHJcbiAgICAgIDxwIGNsYXNzPVwiY2VudGVyXCI+PGJ1dHRvbiA6ZGlzYWJsZWQ9XCJ1c2VyID09PSBudWxsXCIgQGNsaWNrLnByZXZlbnQ9XCJxdWVyeSgpXCI+UXVlcnk8L2J1dHRvbj48L3A+XHJcblxyXG4gICAgICA8ZGl2IHYtaWY9XCJmZXRjaGVkXCI+XHJcbiAgICAgICAgPHRhYmxlIGNsYXNzPVwic21hbGxcIiB2LWlmPVwicmVzdWx0cy5sZW5ndGggPiAwXCI+XHJcbiAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgIDx0aD5Vc2VyPC90aD5cclxuICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxyXG4gICAgICAgICAgICA8dGg+RmlsZTwvdGg+XHJcbiAgICAgICAgICAgIDx0aD5DcmVhdGVkPC90aD5cclxuICAgICAgICAgICAgPHRoPk1vZGlmaWVkPC90aD5cclxuICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICA8dHIgdi1mb3I9XCJyZXN1bHQgaW4gcmVzdWx0c1wiPlxyXG4gICAgICAgICAgICA8dGQ+e3tyZXN1bHQudXNlcn19PC90ZD5cclxuICAgICAgICAgICAgPHRkPnt7cmVzdWx0LnVzZXJuYW1lfX08L3RkPlxyXG4gICAgICAgICAgICA8dGQ+PGEgOmhyZWY9XCJ0b1ZpZXcgKyAnLycgKyByZXN1bHQuaWRcIiB0YXJnZXQ9XCJfZmlsZVwiPnt7cmVzdWx0Lm5hbWV9fTwvYT5cclxuICAgICAgICAgICAgPGEgOmhyZWY9XCJ0b0Rvd25sb2FkICsgJy8nICsgcmVzdWx0LmlkXCI+PGltZyA6c3JjPVwidG9Eb3dubG9hZEltZ1wiPjwvYT48L3RkPlxyXG4gICAgICAgICAgICA8dGQ+e3tyZXN1bHQuY3JlYXRlZFN0cn19PC90ZD5cclxuICAgICAgICAgICAgPHRkPnt7cmVzdWx0Lm1vZGlmaWVkU3RyfX08L3RkPlxyXG4gICAgICAgICAgPC90cj5cclxuICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgIDxwIHYtaWY9XCJyZXN1bHRzLmxlbmd0aCA9PT0gMFwiIGNsYXNzPVwiY2VudGVyYm94IHNlY29uZGIgY2VudGVyXCI+Tm8gZmlsZXMuLi48L3A+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPHAgY2xhc3M9XCJjZW50ZXJib3ggcHJpbWFyeVwiPkNvdXJzZUxpYiBpbmNsdWRlcyBhIHNpbXBsZSBmaWxlIHN5c3RlbSB0aGF0IGlzXHJcbiAgICAgICAgbWFpbmx5IHByb3ZpZGVkIHRvIGFsbG93IHF1aXp6ZXMgb3Igb3RoZXIgYXNzaWdubWVudHMgdG8gYmUgcGVyc2lzdGVudCBpbiB0aGVcclxuICAgICAgICBzeXN0ZW0gYW5kIHRvIHByb3ZpZGUgYSB3YXkgZm9yIGFwcGxpY2F0aW9ucyBzdWNoIGFzIENpcnNpbSB0byBzYXZlIGFuZFxyXG4gICAgICAgIGxvYWQgZmlsZXMuIEl0IGlzIG5vdCBtZWFudCB0byBiZSBhIHdheSB0byB0dXJuIGluIGNvbnRlbnQsIHRob3VnaCB0aGlzIGludGVyZmFjZVxyXG4gICAgICAgIGNhbiBiZSB1c2VkIHRvIGxvYWQgY29udGVudCBmcm9tIHRoZSBmaWxlIHN5c3RlbSBmb3IgYW55IHVzZXIuPC9wPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gIDwvZGl2PlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHNjcmlwdD5cclxuICBpbXBvcnQgVXNlclNlbGVjdG9yVnVlIGZyb20gJ3VzZXJzLWNsL2pzL0xpYi9Vc2VyU2VsZWN0b3JWdWUudnVlJztcclxuXHJcbiAgICBleHBvcnQgZGVmYXVsdCB7XHJcbiAgICAgICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RlZEFwcDogJ2FueScsXHJcbiAgICAgICAgICAgICAgICB1c2VyOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgYXBwbGljYXRpb25zOiBbXSxcclxuXHJcbiAgICAgICAgICAgICAgICBmZXRjaGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHJlc3VsdHM6IFtdLFxyXG5cclxuICAgICAgICAgICAgICAgIHRvVmlldzogU2l0ZS5yb290ICsgJy9jbC9maWxlc3lzdGVtL3ZpZXcnLFxyXG4gICAgICAgICAgICAgICAgdG9Eb3dubG9hZDogU2l0ZS5yb290ICsgJy9jbC9maWxlc3lzdGVtL2Rvd25sb2FkJyxcclxuICAgICAgICAgICAgICAgIHRvRG93bmxvYWRJbWc6IFNpdGUucm9vdCArICcvdmVuZG9yL2NsL3NpdGUvaW1nL2Rvd25sb2FkLnBuZydcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBtb3VudGVkKCkge1xyXG4gICAgICAgICAgICB0aGlzLiRwYXJlbnQuc2V0VGl0bGUoJzogRmlsZSBTeXN0ZW0nKTtcclxuXHJcbiAgICAgICAgICAgIFNpdGUuYXBpLmdldCgnL2FwaS9maWxlc3lzdGVtL2FwcGxpY2F0aW9ucycsIHt9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIXJlc3BvbnNlLmhhc0Vycm9yKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSByZXNwb25zZS5nZXREYXRhKCdhcHBsaWNhdGlvbnMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBsaWNhdGlvbnMgPSBkYXRhLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgU2l0ZS50b2FzdCh0aGlzLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIFNpdGUudG9hc3QodGhpcywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29tcG9uZW50czoge1xyXG4gICAgICAgICAgICAndXNlci1zZWxlY3Rvcic6IFVzZXJTZWxlY3RvclZ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWV0aG9kczoge1xyXG4gICAgICAgICAgICBzZWxlY3RlZCh1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXIgPSB1c2VyO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvcGVuKGZpbGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGZpbGUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBxdWVyeSgpIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMudXNlciA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgJ3VzZXJJZCc6IHRoaXMudXNlci5pZFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmFwcGxpY2F0aW9uICE9PSAnYW55Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5hcHBUYWcgPSB0aGlzLmFwcGxpY2F0aW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIFNpdGUuYXBpLmdldCgnL2FwaS9maWxlc3lzdGVtJywgcGFyYW1zKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZighcmVzcG9uc2UuaGFzRXJyb3IoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mZXRjaGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZ2V0RGF0YSgnZmlsZXMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc3VsdHMgPSBkYXRhLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaXRlLnRvYXN0KHRoaXMsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBTaXRlLnRvYXN0KHRoaXMsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuPC9zY3JpcHQ+XHJcblxyXG4vLyBOb3RpY2U6IE5vdCBzY29wZWQhXHJcbjxzdHlsZSBsYW5nPVwic2Nzc1wiPlxyXG5kaXYuZmlsZXN5c3RlbS1lZGl0b3ItY2wge1xyXG5cclxuICBsYWJlbCBzcGFuOmZpcnN0LWNoaWxkIHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIHdpZHRoOiAxMGVtO1xyXG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XHJcbiAgICBwYWRkaW5nOiAwIDAuMjVlbSAwIDA7XHJcbiAgfVxyXG5cclxuICBpbnB1dFt0eXBlPXRleHRdLCBvcHRpb24ge1xyXG4gICAgcGFkZGluZzogMXB4IDAuMjVlbTtcclxuICB9XHJcblxyXG4gIHNlbGVjdCB7XHJcbiAgICBtaW4td2lkdGg6IDE1ZW07XHJcbiAgfVxyXG5cclxuICBidXR0b246ZGlzYWJsZWQge1xyXG4gICAgY29sb3I6IGdyYXk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuPC9zdHlsZT4iLCI8IS0tXHJcbi8qKlxyXG4gKiBAZmlsZVxyXG4gKiBTaW1wbGUgY29tcG9uZW50IGZvciBzZWxlY3RpbmcgYSB1c2VyIGluIHRoZSBzeXN0ZW0uXHJcbiAqL1xyXG4tLT5cclxuPHRlbXBsYXRlPlxyXG4gIDxzcGFuPlxyXG4gICAgPGRpdiBjbGFzcz1cImNsLWlucHV0XCI+PGlucHV0IHYtbW9kZWw9XCJxdWVyeVwiIHR5cGU9XCJ0ZXh0XCIgbWF4bGVuZ3RoPVwiMTUwXCI+XHJcbiAgICAgIDxhIEBjbGljay5wcmV2ZW50PVwiZmV0Y2gocXVlcnkpXCIgY2xhc3M9XCJzZWFyY2hlclwiPjxpbWcgOnNyYz1cInNlYXJjaGVyXCI+PC9hPlxyXG4gICAgICA8ZGl2IHYtaWY9XCJyZXN1bHQubGVuZ3RoID4gMCB8fCBub3Jlc3VsdFwiIGNsYXNzPVwiY2wtcmVzdWx0c1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjbC1yZXN1bHQtbGlzdFwiPlxyXG4gICAgICAgICAgPGRpdiB2LWZvcj1cInVzZXIgaW4gcmVzdWx0XCIgQGNsaWNrLnByZXZlbnQ9XCJzZWxlY3RVc2VyKHVzZXIpXCI+PHNwYW4+PGFcclxuICAgICAgICAgICAgQGNsaWNrLnByZXZlbnQ9XCJzZWxlY3RVc2VyKHVzZXIpXCI+e3t1c2VyLnVzZXJJZH19PC9hPjwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4+PGEgQGNsaWNrLnByZXZlbnQ9XCJzZWxlY3RVc2VyKHVzZXIpXCI+e3t1c2VyLm5hbWV9fTwvYT48L3NwYW4+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgdi1pZj1cIm5vcmVzdWx0XCIgY2xhc3M9XCJzdGF0ZW1lbnRcIj5ObyByZXN1bHRzLi4uPC9kaXY+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwibW9yZVwiIGNsYXNzPVwic3RhdGVtZW50XCI+Li4ubW9yZS4uLjwvZGl2PlxyXG5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj4gPGEgQGNsaWNrLnByZXZlbnQ9XCJjbGVhclwiPjxpbWcgOnNyYz1cImRlbGV0ZXJcIj48L2E+XHJcbiAgPC9zcGFuPlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHNjcmlwdD5cclxuXHJcbiAgY29uc3QgTElNSVQgPSAyMDtcclxuXHJcbiAgICBleHBvcnQgZGVmYXVsdCB7XHJcbiAgICAgICAgcHJvcHM6IFtcclxuICAgICAgICAgICAgJ3NlbGVjdGVkJ1xyXG4gICAgICAgIF0sXHJcbiAgICAgICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBxdWVyeTogJycsXHJcbiAgICAgICAgICAgICAgICByZXN1bHQ6IFtdLFxyXG4gICAgICAgICAgICAgICAgbm9yZXN1bHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2VxOiAxLFxyXG4gICAgICAgICAgICAgICAgZmV0Y2hlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB0aW1lcjogbnVsbCxcclxuICAgICAgICAgICAgICAgIHNldDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBtb3JlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNlYXJjaGVyOiBTaXRlLnJvb3QgKyAnL3ZlbmRvci9jbC9zaXRlL2ltZy9zZWFyY2gucG5nJyxcclxuICAgICAgICAgICAgICAgIGRlbGV0ZXI6IFNpdGUucm9vdCArICcvdmVuZG9yL2NsL3NpdGUvaW1nL3gucG5nJyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd2F0Y2g6IHtcclxuICAgICAgICAgICAgcXVlcnkoYWZ0ZXIsIGJlZm9yZSkge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnRpbWVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mZXRjaChhZnRlcik7XHJcbiAgICAgICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgICAgIGZldGNoKHF1ZXJ5KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmV0Y2gnKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHF1ZXJ5KTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMudGltZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQobnVsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcXVlcnkgPSBxdWVyeS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICBpZihxdWVyeS5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mZXRjaGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXErKztcclxuICAgICAgICAgICAgICAgIFNpdGUuYXBpLmdldCgnL2FwaS91c2VycycsIHtzZWFyY2g6IHF1ZXJ5LCBzZXE6IHRoaXMuc2VxLCBsaW1pdDogTElNSVR9KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZighcmVzcG9uc2UuaGFzRXJyb3IoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBwcm90ZWN0cyBmcm9tIG91dC1vZi1vcmRlciBwcm9jZXNzaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvZiByZXN1bHRzIGZyb20gdGhlIHNlcnZlci4uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VxID0gcmVzcG9uc2UuZ2V0RGF0YSgnc2VxJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZigrc2VxLmlkICE9PSB0aGlzLnNlcSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gcmVzcG9uc2UuZ2V0RGF0YSgndXNlcnMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW9yZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuYXR0cmlidXRlcy5mb3JFYWNoKCh1c2VyRGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih1c2VyRGF0YS5tb3JlICE9PSAneWVzJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXIgPSBuZXcgVXNlcnMuVXNlcih1c2VyRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc3VsdC5wdXNoKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3JlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9yZXN1bHQgPSAodGhpcy5yZXN1bHQubGVuZ3RoID09PSAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaXRlLnRvYXN0KHRoaXMsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBTaXRlLnRvYXN0KHRoaXMsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VsZWN0VXNlcih1c2VyKSB7O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVyeSA9IHVzZXIubmFtZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vcmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQodXNlcik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNsZWFyKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXErKzsgLy8gSnVzdCBpbiBjYXNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub3Jlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3JlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5ID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGUgbGFuZz1cInNjc3NcIiBzY29wZWQ+XHJcblxyXG4gIGEuc2VhcmNoZXIge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBtaW4taGVpZ2h0OiAxMDAlO1xyXG4gICAgd2lkdGg6IDIxcHg7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBiYWNrZ3JvdW5kOiAjYWFhYWFhO1xyXG5cclxuICAgIGltZyB7XHJcbiAgICAgIGhlaWdodDogMTZweDtcclxuICAgICAgd2lkdGg6IDE2cHg7XHJcbiAgICAgIHZlcnRpY2FsLWFsaWduOiAtNHB4O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGl2LmNsLWlucHV0IHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIHdpZHRoOiAzMDBweDtcclxuXHJcblxyXG4gICAgaW5wdXQge1xyXG4gICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2NjY2NjYztcclxuICAgIH1cclxuXHJcbiAgICBkaXYuY2wtcmVzdWx0cyB7XHJcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgbGVmdDogMDtcclxuICAgICAgcmlnaHQ6IDA7XHJcbiAgICAgIHRvcDogMTAwJTtcclxuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgZm9udC1zaXplOiAwLjg1ZW07XHJcblxyXG4gICAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcclxuICAgICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCBibGFjaztcclxuICAgICAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgYmxhY2s7XHJcbiAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCBibGFjaztcclxuXHJcbiAgICAgIGRpdi5jbC1yZXN1bHQtbGlzdCB7XHJcbiAgICAgICAgZGlzcGxheTogdGFibGU7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcblxyXG5cclxuICAgICAgICBkaXYge1xyXG4gICAgICAgICAgZGlzcGxheTogdGFibGUtcm93O1xyXG4gICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICM4ODg4ODg7XHJcbiAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcblxyXG4gICAgICAgICAgc3BhbiB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IHRhYmxlLWNlbGw7XHJcbiAgICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDAuNWVtIDAuMjVlbTtcclxuXHJcbiAgICAgICAgICAgIGEge1xyXG4gICAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgICAgICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGE6aG92ZXIge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiAjODg4ODg4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgc3BhbjpmaXJzdC1jaGlsZCB7XHJcbiAgICAgICAgICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzcGFuOmxhc3QtY2hpbGQge1xyXG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgICAgICAgICB3aWR0aDogOTklO1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgZGl2OmZpcnN0LWNoaWxkLCBkaXY6bGFzdC1jaGlsZCB7XHJcbiAgICAgICAgICBzcGFuIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMC4yNWVtIDAuMjVlbTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICBkaXYuc3RhdGVtZW50IHtcclxuICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbjwvc3R5bGU+IiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKShmYWxzZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJcXG5kaXYuZmlsZXN5c3RlbS1lZGl0b3ItY2wgbGFiZWwgc3BhbjpmaXJzdC1jaGlsZCB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICB3aWR0aDogMTBlbTtcXG4gIHRleHQtYWxpZ246IHJpZ2h0O1xcbiAgcGFkZGluZzogMCAwLjI1ZW0gMCAwO1xcbn1cXG5kaXYuZmlsZXN5c3RlbS1lZGl0b3ItY2wgaW5wdXRbdHlwZT10ZXh0XSxcXG5kaXYuZmlsZXN5c3RlbS1lZGl0b3ItY2wgb3B0aW9uIHtcXG4gIHBhZGRpbmc6IDFweCAwLjI1ZW07XFxufVxcbmRpdi5maWxlc3lzdGVtLWVkaXRvci1jbCBzZWxlY3Qge1xcbiAgbWluLXdpZHRoOiAxNWVtO1xcbn1cXG5kaXYuZmlsZXN5c3RlbS1lZGl0b3ItY2wgYnV0dG9uOmRpc2FibGVkIHtcXG4gIGNvbG9yOiBncmF5O1xcbn1cXG5cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG4iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKGZhbHNlKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIlxcbmEuc2VhcmNoZXJbZGF0YS12LWU4ZTdmODQwXSB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICByaWdodDogMDtcXG4gIGhlaWdodDogMTAwJTtcXG4gIG1pbi1oZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMjFweDtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGJhY2tncm91bmQ6ICNhYWFhYWE7XFxufVxcbmEuc2VhcmNoZXIgaW1nW2RhdGEtdi1lOGU3Zjg0MF0ge1xcbiAgaGVpZ2h0OiAxNnB4O1xcbiAgd2lkdGg6IDE2cHg7XFxuICB2ZXJ0aWNhbC1hbGlnbjogLTRweDtcXG59XFxuZGl2LmNsLWlucHV0W2RhdGEtdi1lOGU3Zjg0MF0ge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgd2lkdGg6IDMwMHB4O1xcbn1cXG5kaXYuY2wtaW5wdXQgaW5wdXRbZGF0YS12LWU4ZTdmODQwXSB7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2NjY2M7XFxufVxcbmRpdi5jbC1pbnB1dCBkaXYuY2wtcmVzdWx0c1tkYXRhLXYtZThlN2Y4NDBdIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGxlZnQ6IDA7XFxuICByaWdodDogMDtcXG4gIHRvcDogMTAwJTtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICBmb250LXNpemU6IDAuODVlbTtcXG4gIGJhY2tncm91bmQ6IHdoaXRlO1xcbiAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCBibGFjaztcXG4gIGJvcmRlci1yaWdodDogMXB4IHNvbGlkIGJsYWNrO1xcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIGJsYWNrO1xcbn1cXG5kaXYuY2wtaW5wdXQgZGl2LmNsLXJlc3VsdHMgZGl2LmNsLXJlc3VsdC1saXN0W2RhdGEtdi1lOGU3Zjg0MF0ge1xcbiAgZGlzcGxheTogdGFibGU7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuZGl2LmNsLWlucHV0IGRpdi5jbC1yZXN1bHRzIGRpdi5jbC1yZXN1bHQtbGlzdCBkaXZbZGF0YS12LWU4ZTdmODQwXSB7XFxuICBkaXNwbGF5OiB0YWJsZS1yb3c7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgIzg4ODg4ODtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuZGl2LmNsLWlucHV0IGRpdi5jbC1yZXN1bHRzIGRpdi5jbC1yZXN1bHQtbGlzdCBkaXYgc3BhbltkYXRhLXYtZThlN2Y4NDBdIHtcXG4gIGRpc3BsYXk6IHRhYmxlLWNlbGw7XFxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgdGV4dC1hbGlnbjogbGVmdDtcXG4gIHBhZGRpbmc6IDAuNWVtIDAuMjVlbTtcXG59XFxuZGl2LmNsLWlucHV0IGRpdi5jbC1yZXN1bHRzIGRpdi5jbC1yZXN1bHQtbGlzdCBkaXYgc3BhbiBhW2RhdGEtdi1lOGU3Zjg0MF0ge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgY29sb3I6IGJsYWNrO1xcbn1cXG5kaXYuY2wtaW5wdXQgZGl2LmNsLXJlc3VsdHMgZGl2LmNsLXJlc3VsdC1saXN0IGRpdiBzcGFuIGFbZGF0YS12LWU4ZTdmODQwXTpob3ZlciB7XFxuICBjb2xvcjogIzg4ODg4ODtcXG59XFxuZGl2LmNsLWlucHV0IGRpdi5jbC1yZXN1bHRzIGRpdi5jbC1yZXN1bHQtbGlzdCBkaXYgc3BhbltkYXRhLXYtZThlN2Y4NDBdOmZpcnN0LWNoaWxkIHtcXG4gIGZvbnQtc3R5bGU6IGl0YWxpYztcXG59XFxuZGl2LmNsLWlucHV0IGRpdi5jbC1yZXN1bHRzIGRpdi5jbC1yZXN1bHQtbGlzdCBkaXYgc3BhbltkYXRhLXYtZThlN2Y4NDBdOmxhc3QtY2hpbGQge1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gIHdpZHRoOiA5OSU7XFxufVxcbmRpdi5jbC1pbnB1dCBkaXYuY2wtcmVzdWx0cyBkaXYuY2wtcmVzdWx0LWxpc3QgZGl2OmZpcnN0LWNoaWxkIHNwYW5bZGF0YS12LWU4ZTdmODQwXSxcXG5kaXYuY2wtaW5wdXQgZGl2LmNsLXJlc3VsdHMgZGl2LmNsLXJlc3VsdC1saXN0IGRpdjpsYXN0LWNoaWxkIHNwYW5bZGF0YS12LWU4ZTdmODQwXSB7XFxuICBwYWRkaW5nOiAwLjI1ZW0gMC4yNWVtO1xcbn1cXG5kaXYuY2wtaW5wdXQgZGl2LmNsLXJlc3VsdHMgZGl2LnN0YXRlbWVudFtkYXRhLXYtZThlN2Y4NDBdIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1zdHlsZTogaXRhbGljO1xcbn1cXG5cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG4iLCJ2YXIgcmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBfdm0gPSB0aGlzXG4gIHZhciBfaCA9IF92bS4kY3JlYXRlRWxlbWVudFxuICB2YXIgX2MgPSBfdm0uX3NlbGYuX2MgfHwgX2hcbiAgcmV0dXJuIF9jKFwiZGl2XCIsIHsgc3RhdGljQ2xhc3M6IFwiY29udGVudCBmaWxlc3lzdGVtLWVkaXRvci1jbFwiIH0sIFtcbiAgICBfYyhcImRpdlwiLCB7IHN0YXRpY0NsYXNzOiBcImZ1bGxcIiB9LCBbXG4gICAgICBfYyhcInBcIiwgW1xuICAgICAgICBfYyhcImxhYmVsXCIsIFtcbiAgICAgICAgICBfYyhcInNwYW5cIiwgW192bS5fdihcIkFwcGxpY2F0aW9uOiBcIildKSxcbiAgICAgICAgICBfYyhcbiAgICAgICAgICAgIFwic2VsZWN0XCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBcIm1vZGVsXCIsXG4gICAgICAgICAgICAgICAgICByYXdOYW1lOiBcInYtbW9kZWxcIixcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiBfdm0uc2VsZWN0ZWRBcHAsXG4gICAgICAgICAgICAgICAgICBleHByZXNzaW9uOiBcInNlbGVjdGVkQXBwXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgY2hhbmdlOiBmdW5jdGlvbigkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgIHZhciAkJHNlbGVjdGVkVmFsID0gQXJyYXkucHJvdG90eXBlLmZpbHRlclxuICAgICAgICAgICAgICAgICAgICAuY2FsbCgkZXZlbnQudGFyZ2V0Lm9wdGlvbnMsIGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gby5zZWxlY3RlZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsID0gXCJfdmFsdWVcIiBpbiBvID8gby5fdmFsdWUgOiBvLnZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgX3ZtLnNlbGVjdGVkQXBwID0gJGV2ZW50LnRhcmdldC5tdWx0aXBsZVxuICAgICAgICAgICAgICAgICAgICA/ICQkc2VsZWN0ZWRWYWxcbiAgICAgICAgICAgICAgICAgICAgOiAkJHNlbGVjdGVkVmFsWzBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBfYyhcIm9wdGlvblwiLCBbX3ZtLl92KFwiYW55XCIpXSksXG4gICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgIF92bS5fbChfdm0uYXBwbGljYXRpb25zLCBmdW5jdGlvbihhcHApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2MoXCJvcHRpb25cIiwgW192bS5fdihfdm0uX3MoYXBwKSldKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIDJcbiAgICAgICAgICApXG4gICAgICAgIF0pXG4gICAgICBdKSxcbiAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICBfYyhcInBcIiwgW1xuICAgICAgICBfYyhcbiAgICAgICAgICBcImxhYmVsXCIsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgX2MoXCJzcGFuXCIsIFtfdm0uX3YoXCJVc2VyOiBcIildKSxcbiAgICAgICAgICAgIF9jKFwidXNlci1zZWxlY3RvclwiLCB7IGF0dHJzOiB7IHNlbGVjdGVkOiBfdm0uc2VsZWN0ZWQgfSB9KVxuICAgICAgICAgIF0sXG4gICAgICAgICAgMVxuICAgICAgICApXG4gICAgICBdKSxcbiAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICBfYyhcInBcIiwgeyBzdGF0aWNDbGFzczogXCJjZW50ZXJcIiB9LCBbXG4gICAgICAgIF9jKFxuICAgICAgICAgIFwiYnV0dG9uXCIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgYXR0cnM6IHsgZGlzYWJsZWQ6IF92bS51c2VyID09PSBudWxsIH0sXG4gICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBfdm0ucXVlcnkoKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBbX3ZtLl92KFwiUXVlcnlcIildXG4gICAgICAgIClcbiAgICAgIF0pLFxuICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgIF92bS5mZXRjaGVkXG4gICAgICAgID8gX2MoXCJkaXZcIiwgW1xuICAgICAgICAgICAgX3ZtLnJlc3VsdHMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICA/IF9jKFxuICAgICAgICAgICAgICAgICAgXCJ0YWJsZVwiLFxuICAgICAgICAgICAgICAgICAgeyBzdGF0aWNDbGFzczogXCJzbWFsbFwiIH0sXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIF92bS5fbSgwKSxcbiAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgICAgX3ZtLl9sKF92bS5yZXN1bHRzLCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2MoXCJ0clwiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICBfYyhcInRkXCIsIFtfdm0uX3YoX3ZtLl9zKHJlc3VsdC51c2VyKSldKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBfYyhcInRkXCIsIFtfdm0uX3YoX3ZtLl9zKHJlc3VsdC51c2VybmFtZSkpXSksXG4gICAgICAgICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgX2MoXCJ0ZFwiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY6IF92bS50b1ZpZXcgKyBcIi9cIiArIHJlc3VsdC5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBcIl9maWxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtfdm0uX3YoX3ZtLl9zKHJlc3VsdC5uYW1lKSldXG4gICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7IGhyZWY6IF92bS50b0Rvd25sb2FkICsgXCIvXCIgKyByZXN1bHQuaWQgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW19jKFwiaW1nXCIsIHsgYXR0cnM6IHsgc3JjOiBfdm0udG9Eb3dubG9hZEltZyB9IH0pXVxuICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBfYyhcInRkXCIsIFtfdm0uX3YoX3ZtLl9zKHJlc3VsdC5jcmVhdGVkU3RyKSldKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBfYyhcInRkXCIsIFtfdm0uX3YoX3ZtLl9zKHJlc3VsdC5tb2RpZmllZFN0cikpXSlcbiAgICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIDJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIDogX3ZtLl9lKCksXG4gICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgX3ZtLnJlc3VsdHMubGVuZ3RoID09PSAwXG4gICAgICAgICAgICAgID8gX2MoXCJwXCIsIHsgc3RhdGljQ2xhc3M6IFwiY2VudGVyYm94IHNlY29uZGIgY2VudGVyXCIgfSwgW1xuICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiTm8gZmlsZXMuLi5cIilcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICA6IF92bS5fZSgpXG4gICAgICAgICAgXSlcbiAgICAgICAgOiBfdm0uX2UoKSxcbiAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICBfYyhcInBcIiwgeyBzdGF0aWNDbGFzczogXCJjZW50ZXJib3ggcHJpbWFyeVwiIH0sIFtcbiAgICAgICAgX3ZtLl92KFxuICAgICAgICAgIFwiQ291cnNlTGliIGluY2x1ZGVzIGEgc2ltcGxlIGZpbGUgc3lzdGVtIHRoYXQgaXNcXG4gICAgICBtYWlubHkgcHJvdmlkZWQgdG8gYWxsb3cgcXVpenplcyBvciBvdGhlciBhc3NpZ25tZW50cyB0byBiZSBwZXJzaXN0ZW50IGluIHRoZVxcbiAgICAgIHN5c3RlbSBhbmQgdG8gcHJvdmlkZSBhIHdheSBmb3IgYXBwbGljYXRpb25zIHN1Y2ggYXMgQ2lyc2ltIHRvIHNhdmUgYW5kXFxuICAgICAgbG9hZCBmaWxlcy4gSXQgaXMgbm90IG1lYW50IHRvIGJlIGEgd2F5IHRvIHR1cm4gaW4gY29udGVudCwgdGhvdWdoIHRoaXMgaW50ZXJmYWNlXFxuICAgICAgY2FuIGJlIHVzZWQgdG8gbG9hZCBjb250ZW50IGZyb20gdGhlIGZpbGUgc3lzdGVtIGZvciBhbnkgdXNlci5cIlxuICAgICAgICApXG4gICAgICBdKVxuICAgIF0pXG4gIF0pXG59XG52YXIgc3RhdGljUmVuZGVyRm5zID0gW1xuICBmdW5jdGlvbigpIHtcbiAgICB2YXIgX3ZtID0gdGhpc1xuICAgIHZhciBfaCA9IF92bS4kY3JlYXRlRWxlbWVudFxuICAgIHZhciBfYyA9IF92bS5fc2VsZi5fYyB8fCBfaFxuICAgIHJldHVybiBfYyhcInRyXCIsIFtcbiAgICAgIF9jKFwidGhcIiwgW192bS5fdihcIlVzZXJcIildKSxcbiAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICBfYyhcInRoXCIsIFtfdm0uX3YoXCJOYW1lXCIpXSksXG4gICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgX2MoXCJ0aFwiLCBbX3ZtLl92KFwiRmlsZVwiKV0pLFxuICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgIF9jKFwidGhcIiwgW192bS5fdihcIkNyZWF0ZWRcIildKSxcbiAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICBfYyhcInRoXCIsIFtfdm0uX3YoXCJNb2RpZmllZFwiKV0pXG4gICAgXSlcbiAgfVxuXVxucmVuZGVyLl93aXRoU3RyaXBwZWQgPSB0cnVlXG5cbmV4cG9ydCB7IHJlbmRlciwgc3RhdGljUmVuZGVyRm5zIH0iLCJ2YXIgcmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBfdm0gPSB0aGlzXG4gIHZhciBfaCA9IF92bS4kY3JlYXRlRWxlbWVudFxuICB2YXIgX2MgPSBfdm0uX3NlbGYuX2MgfHwgX2hcbiAgcmV0dXJuIF9jKFwic3BhblwiLCBbXG4gICAgX2MoXCJkaXZcIiwgeyBzdGF0aWNDbGFzczogXCJjbC1pbnB1dFwiIH0sIFtcbiAgICAgIF9jKFwiaW5wdXRcIiwge1xuICAgICAgICBkaXJlY3RpdmVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJtb2RlbFwiLFxuICAgICAgICAgICAgcmF3TmFtZTogXCJ2LW1vZGVsXCIsXG4gICAgICAgICAgICB2YWx1ZTogX3ZtLnF1ZXJ5LFxuICAgICAgICAgICAgZXhwcmVzc2lvbjogXCJxdWVyeVwiXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBhdHRyczogeyB0eXBlOiBcInRleHRcIiwgbWF4bGVuZ3RoOiBcIjE1MFwiIH0sXG4gICAgICAgIGRvbVByb3BzOiB7IHZhbHVlOiBfdm0ucXVlcnkgfSxcbiAgICAgICAgb246IHtcbiAgICAgICAgICBpbnB1dDogZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoJGV2ZW50LnRhcmdldC5jb21wb3NpbmcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdm0ucXVlcnkgPSAkZXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICBfYyhcbiAgICAgICAgXCJhXCIsXG4gICAgICAgIHtcbiAgICAgICAgICBzdGF0aWNDbGFzczogXCJzZWFyY2hlclwiLFxuICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICBjbGljazogZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgIF92bS5mZXRjaChfdm0ucXVlcnkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBbX2MoXCJpbWdcIiwgeyBhdHRyczogeyBzcmM6IF92bS5zZWFyY2hlciB9IH0pXVxuICAgICAgKSxcbiAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICBfdm0ucmVzdWx0Lmxlbmd0aCA+IDAgfHwgX3ZtLm5vcmVzdWx0XG4gICAgICAgID8gX2MoXCJkaXZcIiwgeyBzdGF0aWNDbGFzczogXCJjbC1yZXN1bHRzXCIgfSwgW1xuICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgIFwiZGl2XCIsXG4gICAgICAgICAgICAgIHsgc3RhdGljQ2xhc3M6IFwiY2wtcmVzdWx0LWxpc3RcIiB9LFxuICAgICAgICAgICAgICBfdm0uX2woX3ZtLnJlc3VsdCwgZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBfYyhcbiAgICAgICAgICAgICAgICAgIFwiZGl2XCIsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKCRldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgICAgIF92bS5zZWxlY3RVc2VyKHVzZXIpXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBfYyhcInNwYW5cIiwgW1xuICAgICAgICAgICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKCRldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF92bS5zZWxlY3RVc2VyKHVzZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgW192bS5fdihfdm0uX3ModXNlci51c2VySWQpKV1cbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgICBfYyhcInNwYW5cIiwgW1xuICAgICAgICAgICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKCRldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF92bS5zZWxlY3RVc2VyKHVzZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgW192bS5fdihfdm0uX3ModXNlci5uYW1lKSldXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgX3ZtLm5vcmVzdWx0XG4gICAgICAgICAgICAgID8gX2MoXCJkaXZcIiwgeyBzdGF0aWNDbGFzczogXCJzdGF0ZW1lbnRcIiB9LCBbXG4gICAgICAgICAgICAgICAgICBfdm0uX3YoXCJObyByZXN1bHRzLi4uXCIpXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgOiBfdm0uX2UoKSxcbiAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICBfdm0ubW9yZVxuICAgICAgICAgICAgICA/IF9jKFwiZGl2XCIsIHsgc3RhdGljQ2xhc3M6IFwic3RhdGVtZW50XCIgfSwgW192bS5fdihcIi4uLm1vcmUuLi5cIildKVxuICAgICAgICAgICAgICA6IF92bS5fZSgpXG4gICAgICAgICAgXSlcbiAgICAgICAgOiBfdm0uX2UoKVxuICAgIF0pLFxuICAgIF92bS5fdihcIiBcIiksXG4gICAgX2MoXG4gICAgICBcImFcIixcbiAgICAgIHtcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgcmV0dXJuIF92bS5jbGVhcigkZXZlbnQpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgW19jKFwiaW1nXCIsIHsgYXR0cnM6IHsgc3JjOiBfdm0uZGVsZXRlciB9IH0pXVxuICAgIClcbiAgXSlcbn1cbnZhciBzdGF0aWNSZW5kZXJGbnMgPSBbXVxucmVuZGVyLl93aXRoU3RyaXBwZWQgPSB0cnVlXG5cbmV4cG9ydCB7IHJlbmRlciwgc3RhdGljUmVuZGVyRm5zIH0iLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2xvYWRlcnMvc3R5bGVQb3N0TG9hZGVyLmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZXNvbHZlLXVybC1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/c291cmNlTWFwIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9pbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4vRmlsZVN5c3RlbUNvbXBvbmVudC52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZsYW5nPXNjc3MmXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciBhZGQgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXNDbGllbnQuanNcIikuZGVmYXVsdFxudmFyIHVwZGF0ZSA9IGFkZChcIjY0MTlmODNjXCIsIGNvbnRlbnQsIGZhbHNlLCB7fSk7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG4gLy8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3NcbiBpZighY29udGVudC5sb2NhbHMpIHtcbiAgIG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvbG9hZGVycy9zdHlsZVBvc3RMb2FkZXIuanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Jlc29sdmUtdXJsLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz9zb3VyY2VNYXAhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2luZGV4LmpzPz92dWUtbG9hZGVyLW9wdGlvbnMhLi9GaWxlU3lzdGVtQ29tcG9uZW50LnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmxhbmc9c2NzcyZcIiwgZnVuY3Rpb24oKSB7XG4gICAgIHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2xvYWRlcnMvc3R5bGVQb3N0TG9hZGVyLmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZXNvbHZlLXVybC1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/c291cmNlTWFwIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9pbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4vRmlsZVN5c3RlbUNvbXBvbmVudC52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZsYW5nPXNjc3MmXCIpO1xuICAgICBpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcbiAgICAgdXBkYXRlKG5ld0NvbnRlbnQpO1xuICAgfSk7XG4gfVxuIC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3NcbiBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn0iLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2xvYWRlcnMvc3R5bGVQb3N0TG9hZGVyLmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZXNvbHZlLXVybC1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/c291cmNlTWFwIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9pbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4vVXNlclNlbGVjdG9yVnVlLnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmlkPWU4ZTdmODQwJmxhbmc9c2NzcyZzY29wZWQ9dHJ1ZSZcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIGFkZCA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlc0NsaWVudC5qc1wiKS5kZWZhdWx0XG52YXIgdXBkYXRlID0gYWRkKFwiZmRlZmU4ZGFcIiwgY29udGVudCwgZmFsc2UsIHt9KTtcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcbiAvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuIGlmKCFjb250ZW50LmxvY2Fscykge1xuICAgbW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9sb2FkZXJzL3N0eWxlUG9zdExvYWRlci5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVzb2x2ZS11cmwtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzP3NvdXJjZU1hcCEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvaW5kZXguanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyEuL1VzZXJTZWxlY3RvclZ1ZS52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD1lOGU3Zjg0MCZsYW5nPXNjc3Mmc2NvcGVkPXRydWUmXCIsIGZ1bmN0aW9uKCkge1xuICAgICB2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9sb2FkZXJzL3N0eWxlUG9zdExvYWRlci5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVzb2x2ZS11cmwtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzP3NvdXJjZU1hcCEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvaW5kZXguanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyEuL1VzZXJTZWxlY3RvclZ1ZS52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD1lOGU3Zjg0MCZsYW5nPXNjc3Mmc2NvcGVkPXRydWUmXCIpO1xuICAgICBpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcbiAgICAgdXBkYXRlKG5ld0NvbnRlbnQpO1xuICAgfSk7XG4gfVxuIC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3NcbiBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn0iLCJpbXBvcnQgeyByZW5kZXIsIHN0YXRpY1JlbmRlckZucyB9IGZyb20gXCIuL0ZpbGVTeXN0ZW1Db21wb25lbnQudnVlP3Z1ZSZ0eXBlPXRlbXBsYXRlJmlkPTEzOGFjMjNiJlwiXG5pbXBvcnQgc2NyaXB0IGZyb20gXCIuL0ZpbGVTeXN0ZW1Db21wb25lbnQudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPWpzJlwiXG5leHBvcnQgKiBmcm9tIFwiLi9GaWxlU3lzdGVtQ29tcG9uZW50LnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qcyZcIlxuaW1wb3J0IHN0eWxlMCBmcm9tIFwiLi9GaWxlU3lzdGVtQ29tcG9uZW50LnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmxhbmc9c2NzcyZcIlxuXG5cbi8qIG5vcm1hbGl6ZSBjb21wb25lbnQgKi9cbmltcG9ydCBub3JtYWxpemVyIGZyb20gXCIhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3J1bnRpbWUvY29tcG9uZW50Tm9ybWFsaXplci5qc1wiXG52YXIgY29tcG9uZW50ID0gbm9ybWFsaXplcihcbiAgc2NyaXB0LFxuICByZW5kZXIsXG4gIHN0YXRpY1JlbmRlckZucyxcbiAgZmFsc2UsXG4gIG51bGwsXG4gIG51bGwsXG4gIG51bGxcbiAgXG4pXG5cbi8qIGhvdCByZWxvYWQgKi9cbmlmIChtb2R1bGUuaG90KSB7XG4gIHZhciBhcGkgPSByZXF1aXJlKFwiQzpcXFxcVXNlcnNcXFxcY2hhcmxcXFxcRG9jdW1lbnRzXFxcXENsYXNzZXNcXFxcQ1NFMzM1XFxcXHdlYi1uZXdcXFxcbm9kZV9tb2R1bGVzXFxcXHZ1ZS1ob3QtcmVsb2FkLWFwaVxcXFxkaXN0XFxcXGluZGV4LmpzXCIpXG4gIGFwaS5pbnN0YWxsKHJlcXVpcmUoJ3Z1ZScpKVxuICBpZiAoYXBpLmNvbXBhdGlibGUpIHtcbiAgICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gICAgaWYgKCFtb2R1bGUuaG90LmRhdGEpIHtcbiAgICAgIGFwaS5jcmVhdGVSZWNvcmQoJzEzOGFjMjNiJywgY29tcG9uZW50Lm9wdGlvbnMpXG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZWxvYWQoJzEzOGFjMjNiJywgY29tcG9uZW50Lm9wdGlvbnMpXG4gICAgfVxuICAgIG1vZHVsZS5ob3QuYWNjZXB0KFwiLi9GaWxlU3lzdGVtQ29tcG9uZW50LnZ1ZT92dWUmdHlwZT10ZW1wbGF0ZSZpZD0xMzhhYzIzYiZcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgYXBpLnJlcmVuZGVyKCcxMzhhYzIzYicsIHtcbiAgICAgICAgcmVuZGVyOiByZW5kZXIsXG4gICAgICAgIHN0YXRpY1JlbmRlckZuczogc3RhdGljUmVuZGVyRm5zXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cbmNvbXBvbmVudC5vcHRpb25zLl9fZmlsZSA9IFwidmVuZG9yL2NsL2ZpbGVzeXN0ZW0vanMvQ29uc29sZS9GaWxlU3lzdGVtQ29tcG9uZW50LnZ1ZVwiXG5leHBvcnQgZGVmYXVsdCBjb21wb25lbnQuZXhwb3J0cyIsImltcG9ydCBtb2QgZnJvbSBcIi0hLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMiEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvaW5kZXguanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyEuL0ZpbGVTeXN0ZW1Db21wb25lbnQudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPWpzJlwiOyBleHBvcnQgZGVmYXVsdCBtb2Q7IGV4cG9ydCAqIGZyb20gXCItIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTIhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2luZGV4LmpzPz92dWUtbG9hZGVyLW9wdGlvbnMhLi9GaWxlU3lzdGVtQ29tcG9uZW50LnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qcyZcIiIsImltcG9ydCBtb2QgZnJvbSBcIi0hLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1zdHlsZS1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2xvYWRlcnMvc3R5bGVQb3N0TG9hZGVyLmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZXNvbHZlLXVybC1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/c291cmNlTWFwIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9pbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4vRmlsZVN5c3RlbUNvbXBvbmVudC52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZsYW5nPXNjc3MmXCI7IGV4cG9ydCBkZWZhdWx0IG1vZDsgZXhwb3J0ICogZnJvbSBcIi0hLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1zdHlsZS1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2xvYWRlcnMvc3R5bGVQb3N0TG9hZGVyLmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZXNvbHZlLXVybC1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/c291cmNlTWFwIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9pbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4vRmlsZVN5c3RlbUNvbXBvbmVudC52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZsYW5nPXNjc3MmXCIiLCJleHBvcnQgKiBmcm9tIFwiLSEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvbG9hZGVycy90ZW1wbGF0ZUxvYWRlci5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9pbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4vRmlsZVN5c3RlbUNvbXBvbmVudC52dWU/dnVlJnR5cGU9dGVtcGxhdGUmaWQ9MTM4YWMyM2ImXCIiLCIvKipcclxuICogQGZpbGVcclxuICogRmlsZSBzeXN0ZW0gY29uc29sZSBjb21wb25lbnRzXHJcbiAqL1xyXG5cclxuaW1wb3J0IEZpbGVTeXN0ZW1Db21wb25lbnQgZnJvbSAnLi9GaWxlU3lzdGVtQ29tcG9uZW50LnZ1ZSc7XHJcblxyXG5leHBvcnQgbGV0IEZpbGVTeXN0ZW1Db25zb2xlID0gZnVuY3Rpb24oc2l0ZSwgQ29uc29sZSkge1xyXG4gICAgQ29uc29sZS50YWJsZXMuYWRkKHtcclxuICAgICAgICB0aXRsZTogJ0ZpbGVTeXN0ZW0nLFxyXG4gICAgICAgIG9yZGVyOiA1LFxyXG4gICAgICAgIGFwaTogJy9hcGkvZmlsZXN5c3RlbS90YWJsZXMnXHJcbiAgICB9KTtcclxuXHJcbiAgICBDb25zb2xlLmNvbXBvbmVudHMuYWRkT3B0aW9uKHtcclxuICAgICAgICBhdExlYXN0OiBVc2Vycy5Vc2VyLlNUQUZGLFxyXG4gICAgICAgIHBhZ2U6IHt0aXRsZTogJ01haW4nLCByb3V0ZTogJycsIG9yZGVyOiAxfSxcclxuICAgICAgICBzZWN0aW9uOiB7dGl0bGU6ICdTaXRlJywgb3JkZXI6IDF9LFxyXG4gICAgICAgIHRpdGxlOiAnRmlsZSBTeXN0ZW0nLFxyXG4gICAgICAgIG9yZGVyOiAxMCxcclxuICAgICAgICByb3V0ZTogJy9maWxlc3lzdGVtJyxcclxuICAgICAgICByb3V0ZXM6IFtcclxuICAgICAgICAgICAge3JvdXRlOiAnL2ZpbGVzeXN0ZW0nLCBjb21wb25lbnQ6IEZpbGVTeXN0ZW1Db21wb25lbnR9XHJcbiAgICAgICAgXVxyXG4gICAgfSk7XHJcblxyXG5cclxufVxyXG4iLCIvKipcclxuICogQGZpbGVcclxuICogQ291cnNlIGNvbnNvbGUgZW50cnkgcG9pbnQuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtGaWxlU3lzdGVtQ29uc29sZX0gZnJvbSAnLi9GaWxlU3lzdGVtQ29uc29sZSc7XHJcblxyXG5uZXcgRmlsZVN5c3RlbUNvbnNvbGUoU2l0ZS5TaXRlLCBTaXRlLkNvbnNvbGUpO1xyXG4iLCJpbXBvcnQgeyByZW5kZXIsIHN0YXRpY1JlbmRlckZucyB9IGZyb20gXCIuL1VzZXJTZWxlY3RvclZ1ZS52dWU/dnVlJnR5cGU9dGVtcGxhdGUmaWQ9ZThlN2Y4NDAmc2NvcGVkPXRydWUmXCJcbmltcG9ydCBzY3JpcHQgZnJvbSBcIi4vVXNlclNlbGVjdG9yVnVlLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qcyZcIlxuZXhwb3J0ICogZnJvbSBcIi4vVXNlclNlbGVjdG9yVnVlLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qcyZcIlxuaW1wb3J0IHN0eWxlMCBmcm9tIFwiLi9Vc2VyU2VsZWN0b3JWdWUudnVlP3Z1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmaWQ9ZThlN2Y4NDAmbGFuZz1zY3NzJnNjb3BlZD10cnVlJlwiXG5cblxuLyogbm9ybWFsaXplIGNvbXBvbmVudCAqL1xuaW1wb3J0IG5vcm1hbGl6ZXIgZnJvbSBcIiEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvcnVudGltZS9jb21wb25lbnROb3JtYWxpemVyLmpzXCJcbnZhciBjb21wb25lbnQgPSBub3JtYWxpemVyKFxuICBzY3JpcHQsXG4gIHJlbmRlcixcbiAgc3RhdGljUmVuZGVyRm5zLFxuICBmYWxzZSxcbiAgbnVsbCxcbiAgXCJlOGU3Zjg0MFwiLFxuICBudWxsXG4gIFxuKVxuXG4vKiBob3QgcmVsb2FkICovXG5pZiAobW9kdWxlLmhvdCkge1xuICB2YXIgYXBpID0gcmVxdWlyZShcIkM6XFxcXFVzZXJzXFxcXGNoYXJsXFxcXERvY3VtZW50c1xcXFxDbGFzc2VzXFxcXENTRTMzNVxcXFx3ZWItbmV3XFxcXG5vZGVfbW9kdWxlc1xcXFx2dWUtaG90LXJlbG9hZC1hcGlcXFxcZGlzdFxcXFxpbmRleC5qc1wiKVxuICBhcGkuaW5zdGFsbChyZXF1aXJlKCd2dWUnKSlcbiAgaWYgKGFwaS5jb21wYXRpYmxlKSB7XG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICAgIGlmICghbW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgICBhcGkuY3JlYXRlUmVjb3JkKCdlOGU3Zjg0MCcsIGNvbXBvbmVudC5vcHRpb25zKVxuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVsb2FkKCdlOGU3Zjg0MCcsIGNvbXBvbmVudC5vcHRpb25zKVxuICAgIH1cbiAgICBtb2R1bGUuaG90LmFjY2VwdChcIi4vVXNlclNlbGVjdG9yVnVlLnZ1ZT92dWUmdHlwZT10ZW1wbGF0ZSZpZD1lOGU3Zjg0MCZzY29wZWQ9dHJ1ZSZcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgYXBpLnJlcmVuZGVyKCdlOGU3Zjg0MCcsIHtcbiAgICAgICAgcmVuZGVyOiByZW5kZXIsXG4gICAgICAgIHN0YXRpY1JlbmRlckZuczogc3RhdGljUmVuZGVyRm5zXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cbmNvbXBvbmVudC5vcHRpb25zLl9fZmlsZSA9IFwidmVuZG9yL2NsL3VzZXJzL2pzL0xpYi9Vc2VyU2VsZWN0b3JWdWUudnVlXCJcbmV4cG9ydCBkZWZhdWx0IGNvbXBvbmVudC5leHBvcnRzIiwiaW1wb3J0IG1vZCBmcm9tIFwiLSEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0yIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9pbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4vVXNlclNlbGVjdG9yVnVlLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qcyZcIjsgZXhwb3J0IGRlZmF1bHQgbW9kOyBleHBvcnQgKiBmcm9tIFwiLSEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0yIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9pbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4vVXNlclNlbGVjdG9yVnVlLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qcyZcIiIsImltcG9ydCBtb2QgZnJvbSBcIi0hLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1zdHlsZS1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2xvYWRlcnMvc3R5bGVQb3N0TG9hZGVyLmpzIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZXNvbHZlLXVybC1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanM/c291cmNlTWFwIS4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9pbmRleC5qcz8/dnVlLWxvYWRlci1vcHRpb25zIS4vVXNlclNlbGVjdG9yVnVlLnZ1ZT92dWUmdHlwZT1zdHlsZSZpbmRleD0wJmlkPWU4ZTdmODQwJmxhbmc9c2NzcyZzY29wZWQ9dHJ1ZSZcIjsgZXhwb3J0IGRlZmF1bHQgbW9kOyBleHBvcnQgKiBmcm9tIFwiLSEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLXN0eWxlLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvbG9hZGVycy9zdHlsZVBvc3RMb2FkZXIuanMhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Jlc29sdmUtdXJsLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcz9zb3VyY2VNYXAhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2luZGV4LmpzPz92dWUtbG9hZGVyLW9wdGlvbnMhLi9Vc2VyU2VsZWN0b3JWdWUudnVlP3Z1ZSZ0eXBlPXN0eWxlJmluZGV4PTAmaWQ9ZThlN2Y4NDAmbGFuZz1zY3NzJnNjb3BlZD10cnVlJlwiIiwiZXhwb3J0ICogZnJvbSBcIi0hLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2xvYWRlcnMvdGVtcGxhdGVMb2FkZXIuanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvaW5kZXguanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyEuL1VzZXJTZWxlY3RvclZ1ZS52dWU/dnVlJnR5cGU9dGVtcGxhdGUmaWQ9ZThlN2Y4NDAmc2NvcGVkPXRydWUmXCIiXSwic291cmNlUm9vdCI6IiJ9