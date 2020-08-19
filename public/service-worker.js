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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/service-worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../rbd/pnpm-volume/8ec7e3ca-4e3b-471a-a9a0-d989aba3c808/node_modules/.registry.npmjs.org/idb/5.0.4/node_modules/idb/build/esm/index.js":
/*!********************************************************************************************************************************************!*\
  !*** /rbd/pnpm-volume/8ec7e3ca-4e3b-471a-a9a0-d989aba3c808/node_modules/.registry.npmjs.org/idb/5.0.4/node_modules/idb/build/esm/index.js ***!
  \********************************************************************************************************************************************/
/*! exports provided: unwrap, wrap, deleteDB, openDB */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deleteDB\", function() { return deleteDB; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"openDB\", function() { return openDB; });\n/* harmony import */ var _wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wrap-idb-value.js */ \"../rbd/pnpm-volume/8ec7e3ca-4e3b-471a-a9a0-d989aba3c808/node_modules/.registry.npmjs.org/idb/5.0.4/node_modules/idb/build/esm/wrap-idb-value.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"unwrap\", function() { return _wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__[\"u\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"wrap\", function() { return _wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__[\"w\"]; });\n\n\n\n\n/**\n * Open a database.\n *\n * @param name Name of the database.\n * @param version Schema version.\n * @param callbacks Additional callbacks.\n */\nfunction openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {\n    const request = indexedDB.open(name, version);\n    const openPromise = Object(_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__[\"w\"])(request);\n    if (upgrade) {\n        request.addEventListener('upgradeneeded', (event) => {\n            upgrade(Object(_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__[\"w\"])(request.result), event.oldVersion, event.newVersion, Object(_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__[\"w\"])(request.transaction));\n        });\n    }\n    if (blocked)\n        request.addEventListener('blocked', () => blocked());\n    openPromise\n        .then((db) => {\n        if (terminated)\n            db.addEventListener('close', () => terminated());\n        if (blocking)\n            db.addEventListener('versionchange', () => blocking());\n    })\n        .catch(() => { });\n    return openPromise;\n}\n/**\n * Delete a database.\n *\n * @param name Name of the database.\n */\nfunction deleteDB(name, { blocked } = {}) {\n    const request = indexedDB.deleteDatabase(name);\n    if (blocked)\n        request.addEventListener('blocked', () => blocked());\n    return Object(_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__[\"w\"])(request).then(() => undefined);\n}\n\nconst readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];\nconst writeMethods = ['put', 'add', 'delete', 'clear'];\nconst cachedMethods = new Map();\nfunction getMethod(target, prop) {\n    if (!(target instanceof IDBDatabase &&\n        !(prop in target) &&\n        typeof prop === 'string')) {\n        return;\n    }\n    if (cachedMethods.get(prop))\n        return cachedMethods.get(prop);\n    const targetFuncName = prop.replace(/FromIndex$/, '');\n    const useIndex = prop !== targetFuncName;\n    const isWrite = writeMethods.includes(targetFuncName);\n    if (\n    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.\n    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||\n        !(isWrite || readMethods.includes(targetFuncName))) {\n        return;\n    }\n    const method = async function (storeName, ...args) {\n        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(\n        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');\n        let target = tx.store;\n        if (useIndex)\n            target = target.index(args.shift());\n        const returnVal = await target[targetFuncName](...args);\n        if (isWrite)\n            await tx.done;\n        return returnVal;\n    };\n    cachedMethods.set(prop, method);\n    return method;\n}\nObject(_wrap_idb_value_js__WEBPACK_IMPORTED_MODULE_0__[\"r\"])((oldTraps) => ({\n    ...oldTraps,\n    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),\n    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),\n}));\n\n\n\n\n//# sourceURL=webpack:////rbd/pnpm-volume/8ec7e3ca-4e3b-471a-a9a0-d989aba3c808/node_modules/.registry.npmjs.org/idb/5.0.4/node_modules/idb/build/esm/index.js?");

/***/ }),

/***/ "../rbd/pnpm-volume/8ec7e3ca-4e3b-471a-a9a0-d989aba3c808/node_modules/.registry.npmjs.org/idb/5.0.4/node_modules/idb/build/esm/wrap-idb-value.js":
/*!*****************************************************************************************************************************************************!*\
  !*** /rbd/pnpm-volume/8ec7e3ca-4e3b-471a-a9a0-d989aba3c808/node_modules/.registry.npmjs.org/idb/5.0.4/node_modules/idb/build/esm/wrap-idb-value.js ***!
  \*****************************************************************************************************************************************************/
/*! exports provided: a, i, r, u, w */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return reverseTransformCache; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"i\", function() { return instanceOfAny; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"r\", function() { return replaceTraps; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"u\", function() { return unwrap; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"w\", function() { return wrap; });\nconst instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);\n\nlet idbProxyableTypes;\nlet cursorAdvanceMethods;\n// This is a function to prevent it throwing up in node environments.\nfunction getIdbProxyableTypes() {\n    return (idbProxyableTypes ||\n        (idbProxyableTypes = [\n            IDBDatabase,\n            IDBObjectStore,\n            IDBIndex,\n            IDBCursor,\n            IDBTransaction,\n        ]));\n}\n// This is a function to prevent it throwing up in node environments.\nfunction getCursorAdvanceMethods() {\n    return (cursorAdvanceMethods ||\n        (cursorAdvanceMethods = [\n            IDBCursor.prototype.advance,\n            IDBCursor.prototype.continue,\n            IDBCursor.prototype.continuePrimaryKey,\n        ]));\n}\nconst cursorRequestMap = new WeakMap();\nconst transactionDoneMap = new WeakMap();\nconst transactionStoreNamesMap = new WeakMap();\nconst transformCache = new WeakMap();\nconst reverseTransformCache = new WeakMap();\nfunction promisifyRequest(request) {\n    const promise = new Promise((resolve, reject) => {\n        const unlisten = () => {\n            request.removeEventListener('success', success);\n            request.removeEventListener('error', error);\n        };\n        const success = () => {\n            resolve(wrap(request.result));\n            unlisten();\n        };\n        const error = () => {\n            reject(request.error);\n            unlisten();\n        };\n        request.addEventListener('success', success);\n        request.addEventListener('error', error);\n    });\n    promise\n        .then((value) => {\n        // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval\n        // (see wrapFunction).\n        if (value instanceof IDBCursor) {\n            cursorRequestMap.set(value, request);\n        }\n        // Catching to avoid \"Uncaught Promise exceptions\"\n    })\n        .catch(() => { });\n    // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This\n    // is because we create many promises from a single IDBRequest.\n    reverseTransformCache.set(promise, request);\n    return promise;\n}\nfunction cacheDonePromiseForTransaction(tx) {\n    // Early bail if we've already created a done promise for this transaction.\n    if (transactionDoneMap.has(tx))\n        return;\n    const done = new Promise((resolve, reject) => {\n        const unlisten = () => {\n            tx.removeEventListener('complete', complete);\n            tx.removeEventListener('error', error);\n            tx.removeEventListener('abort', error);\n        };\n        const complete = () => {\n            resolve();\n            unlisten();\n        };\n        const error = () => {\n            reject(tx.error || new DOMException('AbortError', 'AbortError'));\n            unlisten();\n        };\n        tx.addEventListener('complete', complete);\n        tx.addEventListener('error', error);\n        tx.addEventListener('abort', error);\n    });\n    // Cache it for later retrieval.\n    transactionDoneMap.set(tx, done);\n}\nlet idbProxyTraps = {\n    get(target, prop, receiver) {\n        if (target instanceof IDBTransaction) {\n            // Special handling for transaction.done.\n            if (prop === 'done')\n                return transactionDoneMap.get(target);\n            // Polyfill for objectStoreNames because of Edge.\n            if (prop === 'objectStoreNames') {\n                return target.objectStoreNames || transactionStoreNamesMap.get(target);\n            }\n            // Make tx.store return the only store in the transaction, or undefined if there are many.\n            if (prop === 'store') {\n                return receiver.objectStoreNames[1]\n                    ? undefined\n                    : receiver.objectStore(receiver.objectStoreNames[0]);\n            }\n        }\n        // Else transform whatever we get back.\n        return wrap(target[prop]);\n    },\n    set(target, prop, value) {\n        target[prop] = value;\n        return true;\n    },\n    has(target, prop) {\n        if (target instanceof IDBTransaction &&\n            (prop === 'done' || prop === 'store')) {\n            return true;\n        }\n        return prop in target;\n    },\n};\nfunction replaceTraps(callback) {\n    idbProxyTraps = callback(idbProxyTraps);\n}\nfunction wrapFunction(func) {\n    // Due to expected object equality (which is enforced by the caching in `wrap`), we\n    // only create one new func per func.\n    // Edge doesn't support objectStoreNames (booo), so we polyfill it here.\n    if (func === IDBDatabase.prototype.transaction &&\n        !('objectStoreNames' in IDBTransaction.prototype)) {\n        return function (storeNames, ...args) {\n            const tx = func.call(unwrap(this), storeNames, ...args);\n            transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);\n            return wrap(tx);\n        };\n    }\n    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In\n    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the\n    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense\n    // with real promises, so each advance methods returns a new promise for the cursor object, or\n    // undefined if the end of the cursor has been reached.\n    if (getCursorAdvanceMethods().includes(func)) {\n        return function (...args) {\n            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use\n            // the original object.\n            func.apply(unwrap(this), args);\n            return wrap(cursorRequestMap.get(this));\n        };\n    }\n    return function (...args) {\n        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use\n        // the original object.\n        return wrap(func.apply(unwrap(this), args));\n    };\n}\nfunction transformCachableValue(value) {\n    if (typeof value === 'function')\n        return wrapFunction(value);\n    // This doesn't return, it just creates a 'done' promise for the transaction,\n    // which is later returned for transaction.done (see idbObjectHandler).\n    if (value instanceof IDBTransaction)\n        cacheDonePromiseForTransaction(value);\n    if (instanceOfAny(value, getIdbProxyableTypes()))\n        return new Proxy(value, idbProxyTraps);\n    // Return the same value back if we're not going to transform it.\n    return value;\n}\nfunction wrap(value) {\n    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because\n    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.\n    if (value instanceof IDBRequest)\n        return promisifyRequest(value);\n    // If we've already transformed this value before, reuse the transformed value.\n    // This is faster, but it also provides object equality.\n    if (transformCache.has(value))\n        return transformCache.get(value);\n    const newValue = transformCachableValue(value);\n    // Not all types are transformed.\n    // These may be primitive types, so they can't be WeakMap keys.\n    if (newValue !== value) {\n        transformCache.set(value, newValue);\n        reverseTransformCache.set(newValue, value);\n    }\n    return newValue;\n}\nconst unwrap = (value) => reverseTransformCache.get(value);\n\n\n\n\n//# sourceURL=webpack:////rbd/pnpm-volume/8ec7e3ca-4e3b-471a-a9a0-d989aba3c808/node_modules/.registry.npmjs.org/idb/5.0.4/node_modules/idb/build/esm/wrap-idb-value.js?");

/***/ }),

/***/ "./app/service-worker.js":
/*!*******************************!*\
  !*** ./app/service-worker.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { getIdb } = __webpack_require__(/*! ./util */ \"./app/util.js\");\n\nself.addEventListener(\"install\", e => e.waitUntil(self.skipWaiting()));\nself.addEventListener(\"activate\", e => e.waitUntil(self.clients.claim()));\n\n// show notification when push received\nself.addEventListener(\"push\", event => {\n  const json = event.data.json();\n  let getPayload;\n  if (json.publicKey) {\n    const crypto = self.crypto.subtle;\n    const iv = new Uint8Array(\n      json.iv.match(/[\\da-f]{2}/gi).map(h => parseInt(h, 16))\n    );\n    const data = new Uint8Array(\n      json.payload.match(/[\\da-f]{2}/gi).map(h => parseInt(h, 16))\n    );\n    getPayload = Promise.all([\n      getIdb()\n        .then(db => db.get(\"settings\", \"ECDHkeys\"))\n        .then(k =>\n          crypto.importKey(\n            \"jwk\",\n            k.privateKey,\n            { name: \"ECDH\", namedCurve: \"P-256\" },\n            false,\n            [\"deriveKey\"]\n          )\n        ),\n      crypto.importKey(\n        \"jwk\",\n        json.publicKey,\n        { name: \"ECDH\", namedCurve: \"P-256\" },\n        false,\n        []\n      )\n    ])\n      .then(([priv, pub]) =>\n        crypto.deriveKey(\n          { name: \"ECDH\", namedCurve: \"P-256\", public: pub },\n          priv,\n          { name: \"AES-GCM\", length: 256 },\n          false,\n          [\"decrypt\"]\n        )\n      )\n      .then(key =>\n        crypto.decrypt({ name: \"AES-GCM\", iv, tagLength: 128 }, key, data)\n      )\n      .then(p => JSON.parse(new TextDecoder().decode(p)));\n  } else {\n    getPayload = Promise.resolve(json);\n  }\n  event.waitUntil(\n    getPayload.then(payload => {\n      let noptions = {\n        body: payload.body,\n        icon: payload.icon,\n        image: payload.image,\n        timestamp: payload.timestamp,\n        data: { channel: payload.channel },\n        requireInteraction: true,\n        vibrate: [200, 100, 200, 100, 100, 50, 100, 50, 200]\n      };\n      if (payload.actions) {\n        const icon =\n          \"https://cdn.glitch.com/b4e27fdf-cea7-4879-91d5-ab40d3ab44d6%2Flink.png\";\n        let acts = [{ action: \"Btn1\", title: payload.actions[0].title, icon }];\n        let d = { Btn1: payload.actions[0].url };\n        if (payload.actions.length > 1) {\n          acts.push({ action: \"Btn2\", title: payload.actions[1].title, icon });\n          d[\"Btn2\"] = payload.actions[1].url;\n        }\n        noptions.actions = acts;\n        noptions.data.actions = d;\n      }\n      const dbdata = {\n        title: payload.title,\n        body: payload.body,\n        icon: payload.icon,\n        image: payload.image,\n        actions: payload.actions,\n        timestamp: payload.timestamp,\n        channel: payload.channel,\n        publicKey: json.publicKey\n      };\n      Promise.all([\n        getIdb().then(db => db.add(\"notifications\", dbdata)),\n        self.clients.matchAll({ type: \"window\", includeUncontrolled: true })\n      ]).then(([id, clients]) => {\n        noptions.data.id = id;\n        return Promise.all([\n          self.registration.showNotification(payload.title, noptions),\n          ...clients.map(c =>\n            c.postMessage({\n              type: \"newNotification\",\n              data: { ...dbdata, id }\n            })\n          )\n        ]);\n      });\n    })\n  );\n});\n\n// resubscripe when subscriptions is due to expiration\nself.addEventListener(\"pushsubscriptionchange\", event =>\n  event.waitUntil(\n    self.registration.pushManager.subscribe({ userVisibleOnly: true })\n    /*.then(sub =>\n      fetch(\"register\", {\n        method: \"post\",\n        headers: { \"Content-type\": \"application/json\" },\n        // ToDo: Resubscribe to correct channels here\n        body: JSON.stringify(Object.assign({}, sub.toJSON(), {channels: [\"KittenNews\"]}))\n      })\n    )*/\n  )\n);\n\nself.addEventListener(\"notificationclick\", event => {\n  if (event.action === \"Btn1\" || event.action === \"Btn2\") {\n    self.clients.openWindow(event.notification.data.actions[event.action]);\n  } else {\n    event.waitUntil(\n      self.clients\n        .matchAll({ type: \"window\", includeUncontrolled: true })\n        .then(clients => {\n          if (clients.length > 0) {\n            return clients[0].focus().then(wc =>\n              wc.postMessage({\n                type: \"changeChannel\",\n                channel: event.notification.data.channel,\n                id: event.notification.data.id\n              })\n            );\n          }\n          return self.clients.openWindow(\n            \"/#\" + event.notification.data.channel\n          );\n        })\n    );\n  }\n});\n\n\n//# sourceURL=webpack:///./app/service-worker.js?");

/***/ }),

/***/ "./app/util.js":
/*!*********************!*\
  !*** ./app/util.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const idb = __webpack_require__(/*! idb */ \"../rbd/pnpm-volume/8ec7e3ca-4e3b-471a-a9a0-d989aba3c808/node_modules/.registry.npmjs.org/idb/5.0.4/node_modules/idb/build/esm/index.js\");\n\nmodule.exports = {\n  getIdb: () =>\n    idb.openDB(\"Purrer\", 1, {\n      upgrade(db) {\n        const store = db.createObjectStore(\"notifications\", {\n          keyPath: \"id\",\n          autoIncrement: true\n        });\n        store.createIndex(\"channel\", \"channel\", { unique: false });\n        db.createObjectStore(\"settings\", {keyPath: \"id\"});\n      }\n    }),\n  defaultTheme: {\n    primary: { main: \"#043911\" },\n    secondary: { main: \"#66d95e\" },\n    type: \"dark\"\n  }\n};\n\n\n//# sourceURL=webpack:///./app/util.js?");

/***/ })

/******/ });