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

/***/ "../chss-module-engine/node_modules/@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm-threaded-simd.worker.js":
/*!***************************************************************************************************************************!*\
  !*** ../chss-module-engine/node_modules/@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm-threaded-simd.worker.js ***!
  \***************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"wasmWorkerContents\": () => (/* binding */ wasmWorkerContents)\n/* harmony export */ });\nconst wasmWorkerContents = '\"use strict\";var Module={};var ENVIRONMENT_IS_NODE=typeof process===\"object\"&&typeof process.versions===\"object\"&&typeof process.versions.node===\"string\";if(ENVIRONMENT_IS_NODE){var nodeWorkerThreads=require(\"worker_threads\");var parentPort=nodeWorkerThreads.parentPort;parentPort.on(\"message\",function(data){onmessage({data:data})});var fs=require(\"fs\");Object.assign(global,{self:global,require:require,Module:Module,location:{href:__filename},Worker:nodeWorkerThreads.Worker,importScripts:function(f){(0,eval)(fs.readFileSync(f,\"utf8\"))},postMessage:function(msg){parentPort.postMessage(msg)},performance:global.performance||{now:function(){return Date.now()}}})}function threadPrintErr(){var text=Array.prototype.slice.call(arguments).join(\" \");if(ENVIRONMENT_IS_NODE){fs.writeSync(2,text+\"\\n\");return}console.error(text)}function threadAlert(){var text=Array.prototype.slice.call(arguments).join(\" \");postMessage({cmd:\"alert\",text:text,threadId:Module[\"_pthread_self\"]()})}var err=threadPrintErr;self.alert=threadAlert;Module[\"instantiateWasm\"]=((info,receiveInstance)=>{var instance=new WebAssembly.Instance(Module[\"wasmModule\"],info);receiveInstance(instance);Module[\"wasmModule\"]=null;return instance.exports});self.onmessage=(e=>{try{if(e.data.cmd===\"load\"){Module[\"wasmModule\"]=e.data.wasmModule;Module[\"wasmMemory\"]=e.data.wasmMemory;Module[\"buffer\"]=Module[\"wasmMemory\"].buffer;Module[\"ENVIRONMENT_IS_PTHREAD\"]=true;if(typeof e.data.urlOrBlob===\"string\"){importScripts(e.data.urlOrBlob)}else{var objectUrl=URL.createObjectURL(e.data.urlOrBlob);importScripts(objectUrl);URL.revokeObjectURL(objectUrl)}WasmBackendModuleThreadedSimd(Module).then(function(instance){Module=instance})}else if(e.data.cmd===\"run\"){Module[\"__performance_now_clock_drift\"]=performance.now()-e.data.time;Module[\"__emscripten_thread_init\"](e.data.threadInfoStruct,0,0,1);Module[\"establishStackSpace\"]();Module[\"PThread\"].receiveObjectTransfer(e.data);Module[\"PThread\"].threadInit();try{var result=Module[\"invokeEntryPoint\"](e.data.start_routine,e.data.arg);if(Module[\"keepRuntimeAlive\"]()){Module[\"PThread\"].setExitStatus(result)}else{Module[\"__emscripten_thread_exit\"](result)}}catch(ex){if(ex!=\"unwind\"){if(ex instanceof Module[\"ExitStatus\"]){if(Module[\"keepRuntimeAlive\"]()){}else{Module[\"__emscripten_thread_exit\"](ex.status)}}else{throw ex}}}}else if(e.data.cmd===\"cancel\"){if(Module[\"_pthread_self\"]()){Module[\"__emscripten_thread_exit\"](-1)}}else if(e.data.target===\"setimmediate\"){}else if(e.data.cmd===\"processThreadQueue\"){if(Module[\"_pthread_self\"]()){Module[\"_emscripten_current_thread_process_queued_calls\"]()}}else if(e.data.cmd===\"processProxyingQueue\"){if(Module[\"_pthread_self\"]()){Module[\"_emscripten_proxy_execute_queue\"](e.data.queue)}}else{err(\"worker.js received unknown command \"+e.data.cmd);err(e.data)}}catch(ex){err(\"worker.js onmessage() captured an uncaught exception: \"+ex);if(ex&&ex.stack)err(ex.stack);if(Module[\"__emscripten_thread_crashed\"]){Module[\"__emscripten_thread_crashed\"]()}throw ex}});';\n\n//# sourceURL=webpack://chss-service-workers/../chss-module-engine/node_modules/@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm-threaded-simd.worker.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["../chss-module-engine/node_modules/@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm-threaded-simd.worker.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;