/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/aiClient.ts":
/*!*************************!*\
  !*** ./src/aiClient.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers_asciiSpinner_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/asciiSpinner.js */ \"./src/helpers/asciiSpinner.js\");\n/* harmony import */ var _aiClient_workers_createWorkers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./aiClient/workers/createWorkers */ \"./src/aiClient/workers/createWorkers.js\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (undefined && undefined.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (_) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\n\n\n// getWasmEngine()\n//   .then((we) => {\n//     console.log('amottan', { we });\n//     // @ts-expect-error we\n//     window.top.we = we;\n//     // @ts-expect-error we\n//     window.top.evaluateBoard = evaluateBoard;\n//   })\n//   .catch((e) => {\n//     console.error('itten', e);\n//   });\nsetInterval(function () {\n    var indicator = document.getElementById('indicator');\n    indicator.innerHTML = (0,_helpers_asciiSpinner_js__WEBPACK_IMPORTED_MODULE_0__.getNextSpinnerChar)(indicator.innerHTML || '|');\n}, 50);\nvar workers = {\n    mainWorker: (0,_aiClient_workers_createWorkers__WEBPACK_IMPORTED_MODULE_1__.createWorker)(),\n};\nObject.values(workers).forEach(function (worker) {\n    worker.onmessage = function (_a) {\n        var rawData = _a.data;\n        return __awaiter(void 0, void 0, void 0, function () {\n            var error, response, id;\n            return __generator(this, function (_b) {\n                try {\n                    error = rawData.error, response = rawData.response, id = rawData.id;\n                    if (!responseAwaiters[id] || (!error && !response))\n                        return [2 /*return*/];\n                    if (error) {\n                        responseAwaiters[id].reject(error);\n                        delete responseAwaiters[id];\n                        return [2 /*return*/];\n                    }\n                    responseAwaiters[id].resolve(response);\n                    delete responseAwaiters[id];\n                }\n                catch (e) {\n                    console.warn(e, { rawData: rawData });\n                }\n                return [2 /*return*/];\n            });\n        });\n    };\n});\nvar responseAwaiters = {};\nvar toWorker = function (topData, id) {\n    return new Promise(function (resolve, reject) {\n        var _a = topData, workerName = _a.workerName, cmd = _a.cmd, data = _a.data;\n        if (!workers[workerName])\n            throw new Error(\"Could not find \".concat(workerName, \" worker\"));\n        responseAwaiters[id] = { resolve: resolve, reject: reject };\n        workers[workerName].postMessage({ cmd: cmd, data: data, id: id });\n    });\n};\nvar methods = { toWorker: toWorker };\nwindow.addEventListener('message', function (_a) {\n    var rawData = _a.data;\n    return __awaiter(void 0, void 0, void 0, function () {\n        var cmd, data, id, response, error_1;\n        return __generator(this, function (_b) {\n            switch (_b.label) {\n                case 0:\n                    cmd = rawData.cmd, data = rawData.data, id = rawData.id;\n                    if (!methods[cmd])\n                        return [2 /*return*/];\n                    _b.label = 1;\n                case 1:\n                    _b.trys.push([1, 3, , 4]);\n                    return [4 /*yield*/, methods[cmd](data, id)];\n                case 2:\n                    response = _b.sent();\n                    window.top.postMessage({ id: id, response: response }, '*');\n                    return [3 /*break*/, 4];\n                case 3:\n                    error_1 = _b.sent();\n                    window.top.postMessage({ id: id, error: error_1 }, '*');\n                    return [3 /*break*/, 4];\n                case 4: return [2 /*return*/];\n            }\n        });\n    });\n}, false);\n\n\n//# sourceURL=webpack://chss-service-workers/./src/aiClient.ts?");

/***/ }),

/***/ "./src/aiClient/workers/aiClient.worker.js":
/*!*************************************************!*\
  !*** ./src/aiClient/workers/aiClient.worker.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Worker_fn)\n/* harmony export */ });\nfunction Worker_fn() {\n  return new Worker(__webpack_require__.p + \"aiClient.worker.js\");\n}\n\n\n//# sourceURL=webpack://chss-service-workers/./src/aiClient/workers/aiClient.worker.js?");

/***/ }),

/***/ "./src/aiClient/workers/createWorkers.js":
/*!***********************************************!*\
  !*** ./src/aiClient/workers/createWorkers.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createWorker\": () => (/* binding */ createWorker)\n/* harmony export */ });\n/* harmony import */ var _aiClient_worker_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./aiClient.worker.js */ \"./src/aiClient/workers/aiClient.worker.js\");\n\nconst createWorker = () => new _aiClient_worker_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n\n\n//# sourceURL=webpack://chss-service-workers/./src/aiClient/workers/createWorkers.js?");

/***/ }),

/***/ "./src/helpers/asciiSpinner.js":
/*!*************************************!*\
  !*** ./src/helpers/asciiSpinner.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"nextSpinnerChar\": () => (/* binding */ nextSpinnerChar),\n/* harmony export */   \"getNextSpinnerChar\": () => (/* binding */ getNextSpinnerChar)\n/* harmony export */ });\nconst nextSpinnerChar = {\n  '/': '-',\n  '-': '\\\\',\n  '\\\\': '|',\n  '|': '/',\n};\n\nconst getNextSpinnerChar = (char) => {\n  return nextSpinnerChar[char] || ''; //as string;\n};\n\n\n//# sourceURL=webpack://chss-service-workers/./src/helpers/asciiSpinner.js?");

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/aiClient.ts");
/******/ 	
/******/ })()
;