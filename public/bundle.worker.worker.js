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

/***/ "./node_modules/@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm-threaded-simd.worker.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm-threaded-simd.worker.js ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"wasmWorkerContents\": () => (/* binding */ wasmWorkerContents)\n/* harmony export */ });\nconst wasmWorkerContents = 'var Module={};function threadPrintErr(){var text=Array.prototype.slice.call(arguments).join(\" \");console.error(text)}function threadAlert(){var text=Array.prototype.slice.call(arguments).join(\" \");postMessage({cmd:\"alert\",text:text,threadId:Module[\"_pthread_self\"]()})}var err=threadPrintErr;this.alert=threadAlert;Module[\"instantiateWasm\"]=function(info,receiveInstance){var instance=new WebAssembly.Instance(Module[\"wasmModule\"],info);Module[\"wasmModule\"]=null;receiveInstance(instance);return instance.exports};function moduleLoaded(){}this.onmessage=function(e){try{if(e.data.cmd===\"load\"){Module[\"wasmModule\"]=e.data.wasmModule;Module[\"wasmMemory\"]=e.data.wasmMemory;Module[\"buffer\"]=Module[\"wasmMemory\"].buffer;Module[\"ENVIRONMENT_IS_PTHREAD\"]=true;if(typeof e.data.urlOrBlob===\"string\"){importScripts(e.data.urlOrBlob)}else{var objectUrl=URL.createObjectURL(e.data.urlOrBlob);importScripts(objectUrl);URL.revokeObjectURL(objectUrl)}WasmBackendModuleThreadedSimd(Module).then(function(instance){Module=instance;moduleLoaded()})}else if(e.data.cmd===\"objectTransfer\"){Module[\"PThread\"].receiveObjectTransfer(e.data)}else if(e.data.cmd===\"run\"){Module[\"__performance_now_clock_drift\"]=performance.now()-e.data.time;Module[\"__emscripten_thread_init\"](e.data.threadInfoStruct,0,0);var max=e.data.stackBase;var top=e.data.stackBase+e.data.stackSize;Module[\"establishStackSpace\"](top,max);Module[\"_emscripten_tls_init\"]();Module[\"PThread\"].receiveObjectTransfer(e.data);Module[\"PThread\"].setThreadStatus(Module[\"_pthread_self\"](),1);try{var result=Module[\"invokeEntryPoint\"](e.data.start_routine,e.data.arg);if(!Module[\"getNoExitRuntime\"]())Module[\"PThread\"].threadExit(result)}catch(ex){if(ex===\"Canceled!\"){Module[\"PThread\"].threadCancel()}else if(ex!=\"unwind\"){if(ex instanceof Module[\"ExitStatus\"]){if(Module[\"getNoExitRuntime\"]()){}else{Module[\"PThread\"].threadExit(ex.status)}}else{Module[\"PThread\"].threadExit(-2);throw ex}}}}else if(e.data.cmd===\"cancel\"){if(Module[\"_pthread_self\"]()){Module[\"PThread\"].threadCancel()}}else if(e.data.target===\"setimmediate\"){}else if(e.data.cmd===\"processThreadQueue\"){if(Module[\"_pthread_self\"]()){Module[\"_emscripten_current_thread_process_queued_calls\"]()}}else{err(\"worker.js received unknown command \"+e.data.cmd);err(e.data)}}catch(ex){err(\"worker.js onmessage() captured an uncaught exception: \"+ex);if(ex&&ex.stack)err(ex.stack);throw ex}};if(typeof process===\"object\"&&typeof process.versions===\"object\"&&typeof process.versions.node===\"string\"){self={location:{href:__filename}};var onmessage=this.onmessage;var nodeWorkerThreads=require(\"worker_threads\");global.Worker=nodeWorkerThreads.Worker;var parentPort=nodeWorkerThreads.parentPort;parentPort.on(\"message\",function(data){onmessage({data:data})});var nodeFS=require(\"fs\");var nodeRead=function(filename){return nodeFS.readFileSync(filename,\"utf8\")};function globalEval(x){global.require=require;global.Module=Module;eval.call(null,x)}importScripts=function(f){globalEval(nodeRead(f))};postMessage=function(msg){parentPort.postMessage(msg)};if(typeof performance===\"undefined\"){performance={now:function(){return Date.now()}}}}';\n\n//# sourceURL=webpack://chss-service-workers/./node_modules/@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm-threaded-simd.worker.js?");

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
/******/ 	__webpack_modules__["./node_modules/@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm-threaded-simd.worker.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;