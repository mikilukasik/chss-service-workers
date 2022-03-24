/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/reloadHandler.ts":
/*!*************************************!*\
  !*** ./src/client/reloadHandler.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"reloadHandler\": () => (/* binding */ reloadHandler)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (undefined && undefined.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (_) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\nvar reloadHandler = [\n    'reload',\n    function () { return __awaiter(void 0, void 0, void 0, function () {\n        return __generator(this, function (_a) {\n            console.log('reload command received, will refresh the page');\n            document.location.reload();\n            return [2 /*return*/];\n        });\n    }); },\n];\n\n\n//# sourceURL=webpack://chss-service-workers/./src/client/reloadHandler.ts?");

/***/ }),

/***/ "./src/clientController.ts":
/*!*********************************!*\
  !*** ./src/clientController.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _msg_src_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../msg/src/client */ \"../msg/src/client.js\");\n/* harmony import */ var _client_reloadHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./client/reloadHandler */ \"./src/client/reloadHandler.ts\");\nconsole.log('Client controller loaded.');\n\n\nvar socket = _msg_src_client__WEBPACK_IMPORTED_MODULE_0__.msgClient.ws(\"ws://\".concat(self.location.hostname, \":3300/learnersControllerSocket\"));\nsocket.on.apply(socket, _client_reloadHandler__WEBPACK_IMPORTED_MODULE_1__.reloadHandler);\n\n\n//# sourceURL=webpack://chss-service-workers/./src/clientController.ts?");

/***/ }),

/***/ "../msg/node_modules/uuid-random/index.js":
/*!************************************************!*\
  !*** ../msg/node_modules/uuid-random/index.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\n(function(){\n\n  var\n    buf,\n    bufIdx = 0,\n    hexBytes = [],\n    i\n  ;\n\n  // Pre-calculate toString(16) for speed\n  for (i = 0; i < 256; i++) {\n    hexBytes[i] = (i + 0x100).toString(16).substr(1);\n  }\n\n  // Buffer random numbers for speed\n  // Reduce memory usage by decreasing this number (min 16)\n  // or improve speed by increasing this number (try 16384)\n  uuid.BUFFER_SIZE = 4096;\n\n  // Binary uuids\n  uuid.bin = uuidBin;\n\n  // Clear buffer\n  uuid.clearBuffer = function() {\n    buf = null;\n    bufIdx = 0;\n  };\n\n  // Test for uuid\n  uuid.test = function(uuid) {\n    if (typeof uuid === 'string') {\n      return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);\n    }\n    return false;\n  };\n\n  // Node & Browser support\n  var crypt0;\n  if (typeof crypto !== 'undefined') {\n    crypt0 = crypto;\n  } else if( (typeof window !== 'undefined') && (typeof window.msCrypto !== 'undefined')) {\n    crypt0 = window.msCrypto; // IE11\n  }\n\n  if (true) {\n    crypt0 = crypt0 || __webpack_require__(/*! crypto */ \"?800d\");\n    module.exports = uuid;\n  } else {}\n\n  // Use best available PRNG\n  // Also expose this so you can override it.\n  uuid.randomBytes = (function(){\n    if (crypt0) {\n      if (crypt0.randomBytes) {\n        return crypt0.randomBytes;\n      }\n      if (crypt0.getRandomValues) {\n        if (typeof Uint8Array.prototype.slice !== 'function') {\n          return function(n) {\n            var bytes = new Uint8Array(n);\n            crypt0.getRandomValues(bytes);\n            return Array.from(bytes);\n          };\n        }\n        return function(n) {\n          var bytes = new Uint8Array(n);\n          crypt0.getRandomValues(bytes);\n          return bytes;\n        };\n      }\n    }\n    return function(n) {\n      var i, r = [];\n      for (i = 0; i < n; i++) {\n        r.push(Math.floor(Math.random() * 256));\n      }\n      return r;\n    };\n  })();\n\n  // Buffer some random bytes for speed\n  function randomBytesBuffered(n) {\n    if (!buf || ((bufIdx + n) > uuid.BUFFER_SIZE)) {\n      bufIdx = 0;\n      buf = uuid.randomBytes(uuid.BUFFER_SIZE);\n    }\n    return buf.slice(bufIdx, bufIdx += n);\n  }\n\n  // uuid.bin\n  function uuidBin() {\n    var b = randomBytesBuffered(16);\n    b[6] = (b[6] & 0x0f) | 0x40;\n    b[8] = (b[8] & 0x3f) | 0x80;\n    return b;\n  }\n\n  // String UUIDv4 (Random)\n  function uuid() {\n    var b = uuidBin();\n    return hexBytes[b[0]] + hexBytes[b[1]] +\n      hexBytes[b[2]] + hexBytes[b[3]] + '-' +\n      hexBytes[b[4]] + hexBytes[b[5]] + '-' +\n      hexBytes[b[6]] + hexBytes[b[7]] + '-' +\n      hexBytes[b[8]] + hexBytes[b[9]] + '-' +\n      hexBytes[b[10]] + hexBytes[b[11]] +\n      hexBytes[b[12]] + hexBytes[b[13]] +\n      hexBytes[b[14]] + hexBytes[b[15]]\n    ;\n  }\n\n})();\n\n\n//# sourceURL=webpack://chss-service-workers/../msg/node_modules/uuid-random/index.js?");

/***/ }),

/***/ "../msg/src/client.js":
/*!****************************!*\
  !*** ../msg/src/client.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"msgClient\": () => (/* binding */ msgClient)\n/* harmony export */ });\nconst getRandomId = __webpack_require__(/*! ./lib/getRandomId.js */ \"../msg/src/lib/getRandomId.js\");\nconst isFunction = __webpack_require__(/*! ./lib/isfunction.js */ \"../msg/src/lib/isfunction.js\");\n\nconst msgClient = (function createMsgService(optionalOptions) {\n  // the below hack is needed do the client bundle can be built in consuming apps.\n  // TODO: there must be a better way\n  if (typeof self === 'undefined') return { ws: () => ({ do: async () => {}, on: async () => {} }) };\n\n  var msgOptions = {\n    mySocketRules: {},\n    waitingHandlersByConvId: {},\n    serviceName: 'client-' + getRandomId(),\n    waitingCbsByConvId: {},\n    waitingErrHandlersByConvId: {},\n    wsRoutes: {},\n    timeoutIds: {},\n    intervalIds: {},\n    stopped: false,\n  };\n\n  // msgOptions.createRule = require('./lib/createRule')(msgOptions);\n  msgOptions.createSocketRule = __webpack_require__(/*! ./lib/createSocketRule */ \"../msg/src/lib/createSocketRule.js\")(msgOptions);\n  // msgOptions.toGtw = require('./lib/toGtw')(msgOptions);\n\n  optionalOptions = optionalOptions || {};\n  if (optionalOptions && typeof optionalOptions === 'object')\n    Object.keys(optionalOptions).forEach(function (key) {\n      msgOptions[key] = optionalOptions[key];\n      // if(key === 'console.log') console.log = optionalOptions.console.log\n    });\n\n  if (!msgOptions.serviceLongName) msgOptions.serviceLongName = msgOptions.serviceName;\n  // console.log('MSG Client starting...');\n\n  var msgClient = {\n    log: msgOptions.log,\n    cookies: __webpack_require__(/*! ./lib/cookies */ \"../msg/src/lib/cookies.js\"),\n    sharedWorker(scriptLocation) {\n      console.log('Starting MSG Shared Worker from ' + scriptLocation);\n      return new SharedWorker(scriptLocation);\n    },\n    ws: function (route) {\n      var wsOptions = {\n        onConnect: () => {},\n        onReConnect: () => {},\n        connectCount: 0,\n        subscribedTo: {},\n      };\n\n      var waitForConnect = function () {\n        const timeout = 20; //sec\n        const deadLine = new Date().getTime() + timeout * 1000;\n        return new Promise(function (res, rej) {\n          function check() {\n            if (msgOptions.wsRoutes[route].ws.readyState === 1) return res();\n            if (new Date().getTime() > deadLine) return rej('Connect timeout (' + timeout + 's)');\n            msgOptions.timeoutIds.waitForConnect = setTimeout(check, 100);\n          }\n          check();\n        });\n      };\n\n      function start() {\n        var ws = new WebSocket(route);\n        msgOptions.wsRoutes[route].ws = ws;\n\n        ws.onopen = function (openEvent) {\n          msgOptions.log('WS route ' + route + ' connected.');\n          if (wsOptions.connectCount) wsOptions.onReConnect(openEvent);\n          wsOptions.connectCount += 1;\n          wsOptions.onConnect(openEvent);\n        };\n        ws.onmessage = function (evt) {\n          var message;\n          try {\n            message = JSON.parse(evt.data);\n          } catch (e) {\n            message = evt.data;\n          }\n          var callBack = msgOptions.wsRoutes[route].callBacks[message.cmd];\n          if (!callBack) return console.log('No callback found, message:', message, callbacks);\n          callBack(message);\n        };\n        ws.onerror = function (err) {\n          console.log('WS ERROR on route ' + route + ': ' + err.message + '\\n' + err.stack);\n        };\n        ws.onclose = function () {\n          console.log('WS connection on route ' + route + ' closed, retry in 2s...');\n          msgOptions.timeoutIds.wsOnCloseRetry = setTimeout(function () {\n            start();\n          }, 2000);\n        };\n      }\n\n      function askGtw(cmd, data) {\n        return new Promise(function (res3, rej3) {\n          var tempConversationId = getRandomId();\n          data.cmd = cmd;\n          try {\n            msgOptions.waitingCbsByConvId[tempConversationId] = function (reply) {\n              delete msgOptions.waitingCbsByConvId[tempConversationId];\n              delete msgOptions.waitingErrHandlersByConvId[tempConversationId];\n              return res3(reply);\n            };\n\n            msgOptions.waitingErrHandlersByConvId[tempConversationId] = function (e) {\n              delete msgOptions.waitingCbsByConvId[tempConversationId];\n              delete msgOptions.waitingErrHandlersByConvId[tempConversationId];\n              return rej3(e);\n            };\n\n            waitForConnect().then(function () {\n              try {\n                msgOptions.wsRoutes[route].ws.send(\n                  JSON.stringify(\n                    Object.assign(\n                      {\n                        owner: msgOptions.serviceName,\n                        tempConversationId: tempConversationId,\n                      },\n                      data,\n                    ),\n                  ),\n                );\n              } catch (ex) {\n                return rej3(ex);\n              }\n            }, rej3);\n          } catch (te) {\n            rej3(te);\n          }\n        });\n      }\n\n      function toGtw(cmd, data, conversationId) {\n        return new Promise(function (res3, rej3) {\n          try {\n            waitForConnect()\n              .then(function () {\n                try {\n                  msgOptions.wsRoutes[route].ws.send(\n                    JSON.stringify(\n                      Object.assign(\n                        {\n                          cmd: cmd,\n                          data: data,\n                          owner: msgOptions.serviceLongName,\n                          conversationId: conversationId,\n                          serviceName: msgOptions.serviceName,\n                          serviceLongName: msgOptions.serviceLongName,\n                        },\n                        data,\n                      ),\n                    ),\n                  );\n                } catch (ex) {\n                  return rej3(ex);\n                }\n              }, rej3)\n              .then(res3, rej3);\n          } catch (te) {\n            rej3(te);\n          }\n        });\n      }\n\n      var myCallBacks = {\n        doStarted: function doStarted(message) {\n          msgOptions.waitingCbsByConvId[message.tempConversationId](message);\n          delete msgOptions.waitingCbsByConvId[message.tempConversationId];\n        },\n        answer: function answer(message) {\n          msgOptions.waitingCbsByConvId[message.conversationId](message.data);\n          delete msgOptions.waitingCbsByConvId[message.conversationId];\n        },\n        error: function error(message) {\n          console.error(message);\n          msgOptions.waitingHandlersByConvId[message.conversationId].errorHandler(message.data);\n        },\n        data: (message) => {\n          msgOptions.waitingHandlersByConvId[message.conversationId].dataHandler(message.data);\n        },\n        do: function (message) {\n          var thisRule = msgOptions.mySocketRules[message.argObj.cmd];\n          if (!thisRule)\n            throw new Error(`Could not find rule for command ${message.argObj.cmd} on socket route ${route}`);\n\n          const thisHandler = thisRule.handler;\n          var newArgObj = message.argObj;\n          thisHandler(newArgObj.data, {\n            message: message,\n            conversationId: message.conversationId,\n            send: function (data) {\n              toGtw('answer', data, message.conversationId, { confirmReceipt: true });\n            },\n            error: function (err) {\n              toGtw('error', err, message.conversationId);\n            },\n          });\n        },\n      };\n\n      if (!msgOptions.wsRoutes[route]) {\n        var callbacks = Object.assign({}, myCallBacks);\n        msgOptions.wsRoutes[route] = {\n          callBacks: callbacks,\n          route: route,\n        };\n\n        start();\n      }\n\n      // var waitForConnect = function(){\n      //   return new Promise(function(res, rej){\n      //     function check(){\n      //       if (msgOptions.wsRoutes[route].ws.readyState === 1) return res();\n      //       setTimeout(check, 100);\n      //     }\n      //     check();\n      //   });\n      // };\n\n      function objDo(cmd, data, handler) {\n        var argObj = { cmd, data, handler };\n\n        var handlers = {\n          dataHandler: function () {\n            msgOptions.log('in pure datahandler!!!!!llllss!!!!!!');\n          },\n          errorHandler: function (e) {\n            msgOptions.log(e, 'in pure errorhandler!!!!!!!!!!!');\n          },\n        };\n\n        if (argObj.handler) {\n          var comms = {\n            // TODO: this comms object needs data function, and a lot more. this is very weak.....\n            onData: function (onDataCb) {\n              handlers.dataHandler = onDataCb;\n            },\n          };\n          argObj.handler(comms);\n        }\n\n        return new Promise(function (res, rej) {\n          waitForConnect()\n            .then(function () {\n              return askGtw('do', { argObj });\n            })\n            .then(\n              function (askRes) {\n                handlers.errorHandler = function (e) {\n                  delete msgOptions.waitingCbsByConvId[askRes.conversationId];\n                  delete msgOptions.waitingHandlersByConvId[askRes.conversationId];\n                  return rej(e);\n                };\n\n                msgOptions.waitingCbsByConvId[askRes.conversationId] = function (answer) {\n                  delete msgOptions.waitingCbsByConvId[askRes.conversationId];\n                  delete msgOptions.waitingHandlersByConvId[askRes.conversationId];\n                  return res(answer);\n                };\n\n                msgOptions.waitingHandlersByConvId[askRes.conversationId] = handlers;\n              },\n              function (error) {\n                msgOptions.log(error);\n                rej(error.message + '\\n' + error.stack);\n              },\n            );\n        });\n      }\n\n      function objOn(cmd, handler) {\n        var argObj = { cmd, handler };\n        return new Promise(function (res, rej) {\n          return msgOptions.createSocketRule(argObj);\n        });\n      }\n\n      function distObj(_options) {\n        let gotInitValue = false;\n        let readOnlyClients = false;\n\n        const waitForInitValues = () =>\n          new Promise((res, rej) => {\n            const check = () => {\n              // TODO: there are better ways than recursive timeout loops...\n              if (gotInitValue) return res();\n              msgOptions.timeoutIds.waitForInitValues = setTimeout(check, 100);\n            };\n            check();\n          });\n        const options =\n          typeof _options === 'string'\n            ? {\n                name: _options,\n              }\n            : _options;\n\n        if (isFunction(options.onChange === 'function')) options.onChange = [options.onChange];\n        if (!options.onChange) options.onChange = [];\n        if (!options.store) options.store = {};\n\n        Object.keys(options.store).forEach((k) => {\n          if (typeof options.store[k] === 'object') {\n            const subDistObj = distObj({\n              name: options.name + '\\\\' + k,\n              store: options.store[k],\n              dontGetInitVal: true,\n            });\n            options.store[k] = subDistObj.data;\n            options.onChange.forEach(subDistObj.onChange);\n          }\n        });\n\n        const data = new Proxy(options.store, {\n          set: function (obj, prop, value) {\n            // The default behavior to store the value\n            obj[prop] = value;\n            waitForInitValues()\n              .then(\n                readOnlyClients\n                  ? () => {}\n                  : () => objDo('$$MSG_DISTOBJ_CHANGE_' + options.name, { name: options.name, prop, value }),\n              )\n              .then(function (re) {\n                options.onChange.forEach((fn) => fn({ prop, value, self: true }));\n\n                if (typeof value === 'object') {\n                  const subDistObj = distObj({\n                    name: options.name + '\\\\' + prop,\n                    store: value,\n                    dontGetInitVal: true,\n                  });\n\n                  obj[prop] = subDistObj.data;\n                  options.onChange.forEach(subDistObj.onChange);\n                }\n              }, console.error);\n\n            // Indicate success\n            return true;\n          },\n          deleteProperty: function (obj, prop) {\n            delete obj[prop];\n\n            (readOnlyClients\n              ? Promise.resolve()\n              : objDo('$$MSG_DISTOBJ_CHANGE_' + options.name, { name: options.name, prop, deleted: true })\n            ).then(function () {\n              options.onChange.forEach((fn) => fn({ prop, deleted: true, self: true }));\n            }, console.error);\n            return true;\n          },\n        });\n\n        if (options.dontGetInitVal) gotInitValue = true;\n        if (!options.dontGetInitVal)\n          objDo('$$MSG_GET_DISTOBJ_' + options.name, { name: options.name, value: options.store }).then(\n            ({ store: obj, readOnlyClients: _readOnlyClients }) => {\n              readOnlyClients = _readOnlyClients;\n              Object.keys(obj).forEach((k) => {\n                options.store[k] = obj[k];\n                if (typeof obj[k] === 'object') {\n                  const subDistObj = distObj({\n                    name: options.name + '\\\\' + k,\n                    store: obj[k],\n                    dontGetInitVal: true,\n                  });\n                  options.store[k] = subDistObj.data;\n                  options.onChange.forEach(subDistObj.onChange);\n                }\n                options.onChange.forEach((fn) => fn({ prop: k, value: obj[k] }));\n              });\n              gotInitValue = true;\n            },\n            msgOptions.log,\n          );\n\n        // console.log('signing up for $$MSG_DISTOBJ_CHANGE_' + options.name);\n        objOn('$$MSG_DISTOBJ_CHANGE_' + options.name, function (data, comms) {\n          const prop = data.prop;\n          const value = data.value;\n          const deleted = data.deleted;\n\n          options.store[prop] = value;\n          if (deleted) delete options.store[prop];\n\n          if (typeof value === 'object') {\n            const subDistObj = distObj({\n              name: options.name + '\\\\' + prop,\n              store: value,\n              dontGetInitVal: true,\n            });\n\n            options.store[prop] = subDistObj.data;\n            options.onChange.forEach(subDistObj.onChange);\n          }\n\n          options.onChange.forEach((fn) => fn({ prop, value, deleted }));\n\n          comms.send({\n            message: 'Change on distObj ' + options.name + ' registered',\n            prop,\n          });\n        });\n\n        const onChange = function (fn) {\n          options.onChange.push(fn);\n        };\n\n        return {\n          data,\n          onChange,\n          options,\n          waitForReady: waitForInitValues,\n        };\n      }\n\n      function subscribe(cmd, handler) {\n        var argObj = { cmd, handler };\n\n        wsOptions.subscribedTo[argObj.cmd] = {\n          cmd,\n          argObj: argObj,\n          handler,\n        };\n\n        return objDo('msg:subscribe', { event: cmd }, function (comms) {\n          comms.onData(function (data) {\n            wsOptions.subscribedTo[cmd].handler(data);\n          });\n        });\n      }\n\n      function unsubscribe(cmd) {\n        delete wsOptions.subscribedTo[cmd];\n        return objDo('msg:unsubscribe', { event: cmd });\n      }\n\n      return {\n        do: objDo,\n        on: objOn,\n        distObj: distObj,\n        onConnect: (fn) => (wsOptions.onConnect = fn),\n        onReConnect: (fn) => (wsOptions.onReConnect = fn),\n        subscribe,\n        unsubscribe,\n        options: wsOptions,\n      };\n    },\n  };\n\n  return msgClient;\n})({\n  serviceName: 'client-' + getRandomId(),\n  PORT: 9876,\n  log: console.log,\n});\n\nif (typeof self !== 'undefined') self.msgClient = msgClient;\n\n\n//# sourceURL=webpack://chss-service-workers/../msg/src/client.js?");

/***/ }),

/***/ "../msg/src/lib/cookies.js":
/*!*********************************!*\
  !*** ../msg/src/lib/cookies.js ***!
  \*********************************/
/***/ ((module) => {

eval("const cookies = {\n  set(cname, cvalue, exdays = 365) {\n    if (!exdays) return document.cookie = cname + '=' + cvalue;\n    var d = new Date();\n    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));\n    var expires = 'expires=' + d.toUTCString();\n    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';\n  },\n\n  delete(cname) {\n    var d = new Date(2000, 1, 1);\n    var expires = 'expires=' + d.toUTCString();\n    document.cookie = cname + '=' + ';' + expires + ';path=/';  },\n\n  get(cname) {\n    var name = cname + '=';\n    var ca = document.cookie.split(';');\n    for (var i = 0; i < ca.length; i += 1) {\n      var c = ca[i];\n      while (c.charAt(0) === ' ') {\n        c = c.substring(1);\n      }\n      if (c.indexOf(name) === 0) {\n        return c.substring(name.length, c.length);\n      }\n    }\n    return '';\n  }\n};\n\nmodule.exports = cookies;\n\n\n//# sourceURL=webpack://chss-service-workers/../msg/src/lib/cookies.js?");

/***/ }),

/***/ "../msg/src/lib/createSocketRule.js":
/*!******************************************!*\
  !*** ../msg/src/lib/createSocketRule.js ***!
  \******************************************/
/***/ ((module) => {

eval("module.exports = function createSocketRuleCreator(msgOptions){\n\n  return function createSocketRule(argObj, rule = {}){\n    rule.type = argObj.publicSocket ? 'publicSocket' : 'socket';\n    rule.publicSocketRoute = argObj.publicSocket ? argObj.publicSocket.route : undefined;\n    rule.cmd = argObj.cmd;\n    if (rule.publicSocketRoute) {\n      if (!msgOptions.myPublicSocketRules[rule.publicSocketRoute]) msgOptions.myPublicSocketRules[rule.publicSocketRoute] = {};\n      msgOptions.myPublicSocketRules[rule.publicSocketRoute][rule.cmd] = argObj;\n    }\n    msgOptions.mySocketRules[rule.cmd] = argObj;\n    return rule;\n  };\n};\n\n//# sourceURL=webpack://chss-service-workers/../msg/src/lib/createSocketRule.js?");

/***/ }),

/***/ "../msg/src/lib/getRandomId.js":
/*!*************************************!*\
  !*** ../msg/src/lib/getRandomId.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const uuid = __webpack_require__(/*! uuid-random */ \"../msg/node_modules/uuid-random/index.js\");\nmodule.exports = uuid;\n\n// faster solution would be better\n\n// module.exports = () => `${Date.now()}${Math.random()}`;\n// module.exports = () => Date.now() + Math.random();\n// module.exports = () => Math.random();\n\n//# sourceURL=webpack://chss-service-workers/../msg/src/lib/getRandomId.js?");

/***/ }),

/***/ "../msg/src/lib/isfunction.js":
/*!************************************!*\
  !*** ../msg/src/lib/isfunction.js ***!
  \************************************/
/***/ ((module) => {

eval("module.exports = function isFunction(functionToCheck) {\n  var getType = {};\n  return functionToCheck && ['[object Function]', '[object AsyncFunction]'].includes(getType.toString.call(functionToCheck));\n};\n\n\n//# sourceURL=webpack://chss-service-workers/../msg/src/lib/isfunction.js?");

/***/ }),

/***/ "?800d":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

eval("/* (ignored) */\n\n//# sourceURL=webpack://chss-service-workers/crypto_(ignored)?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/clientController.ts");
/******/ 	
/******/ })()
;