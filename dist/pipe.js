function t(n){return t=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},t(n)}function n(t,r){return n=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,n){return t.__proto__=n,t},n(t,r)}function r(t,e,i){return r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}()?Reflect.construct.bind():function(t,r,e){var i=[null];i.push.apply(i,r);var u=new(Function.bind.apply(t,i));return e&&n(u,e.prototype),u},r.apply(null,arguments)}function e(i){var u="function"==typeof Map?new Map:void 0;return e=function(e){if(null===e||!function(t){try{return-1!==Function.toString.call(t).indexOf("[native code]")}catch(n){return"function"==typeof t}}(e))return e;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==u){if(u.has(e))return u.get(e);u.set(e,i)}function i(){return r(e,arguments,t(this).constructor)}return i.prototype=Object.create(e.prototype,{constructor:{value:i,enumerable:!1,writable:!0,configurable:!0}}),n(i,e)},e(i)}var i=/*#__PURE__*/function(t){var r,e;function i(n){var r;return(r=t.call(this,n)||this).name="PipeError",r}return e=t,(r=i).prototype=Object.create(e.prototype),r.prototype.constructor=r,n(r,e),i}(/*#__PURE__*/e(Error));module.exports=/*#__PURE__*/function(){function t(){this.argDelimiter=":",this.functionDelimiter="|",this.lastFilter="emptyStringToNull",this.handlers={required:function(){return function(t,n){if(!t)throw new i("Required value is empty: "+n);return t}},toNull:function(){return function(t){return t||null}},toInt:function(){return function(t){return t?+t:0}},toBool:function(){return function(t){return"true"===t||"false"!==t&&!!t}},emptyStringToNull:function(){return function(t){return""===t?null:t}},upper:function(){return function(t){return t.toUpperCase()}},lower:function(){return function(t){return t.toLowerCase()}},trim:function(){return function(t){return t.trim()}},trimEnd:function(){return function(t){return t.trimEnd()}},trimStart:function(){return function(t){return t.trimStart()}},at:function(t){return void 0===t&&(t=0),function(n){return n.at(t)}},startsWith:function(t,n){return void 0===t&&(t=" "),function(r){return r.startsWith(t,n)}},endsWith:function(t,n){return void 0===t&&(t="!"),function(r){return r.endsWith(t,n)}},includes:function(t,n){return void 0===t&&(t=" "),function(r){return r.includes(t,n)}},indexOf:function(t,n){return void 0===t&&(t=" "),function(r){return r.indexOf(t,n)}},lastIndexOf:function(t,n){return void 0===t&&(t=" "),function(r){return r.lastIndexOf(t,n)}},repeat:function(t){return void 0===t&&(t=2),function(n){return n.repeat(t)}},replace:function(t,n){return void 0===t&&(t="  "),void 0===n&&(n=" "),function(r){return r.replace(t,n)}},padStart:function(t,n){return void 0===t&&(t=10),void 0===n&&(n="."),function(r){return r.padStart(t,n)}},padEnd:function(t,n){return void 0===t&&(t=10),void 0===n&&(n="."),function(r){return r.padEnd(t,n)}}}}var n=t.prototype;return n.addHandler=function(t,n){return this.handlers[t]=n,this},n.removeHandler=function(t){return delete this.handlers[t],this},n.getHandler=function(t){return this.handlers[t]},n.getHandlerNames=function(){return Object.keys(this.handlers)},n.setArgDelimiter=function(t){return this.argDelimiter=t,this},n.setFunctionDelimiter=function(t){return this.functionDelimiter=t,this},n.setLastFilter=function(t){return this.lastFilter=t,this},n.getFunctionFromString=function(t){var n=t.split(this.argDelimiter),r=n[0],e=n.slice(1),i=this.handlers[r];return i?function(t,n){return i.apply(void 0,e)(t,n)}:function(t){return t}},n.checkLastFilter=function(){return!!this.lastFilter&&this.lastFilter.split(this.argDelimiter)[0]in this.handlers},n.pipes=function(t){var n=this;return this.checkLastFilter()&&t.push(this.lastFilter),function(r,e){return t.reduce(function(t,r){return n.getFunctionFromString(r)(t,e)},r)}},n.pipeString=function(t){var n=t.split(this.functionDelimiter),r=n[0],e=n.slice(1);return this.pipes(e)(r,r)},n.pipeMap=function(t,n){var r=this;void 0===n&&(n="");var e=new Map;return t.forEach(function(t,i){e.set(i,r.pipeString(t)||n)}),e},n.pipeObject=function(t,n){var r=this;if(void 0===n&&(n=""),!t)return t;var e={};return Object.entries(t).forEach(function(t){e[t[0]]=r.pipeString(t[1])||n}),e},n.pipeArray=function(t,n){var r=this;return void 0===n&&(n=""),t.map(function(t){return r.pipeString(t)||n})},n.pipeSet=function(t,n){return void 0===n&&(n=""),new Set(this.pipeArray([].concat(t),n))},n.pipe=function(t,n){return void 0===n&&(n=""),"string"==typeof t?this.pipeString(t):t?Array.isArray(t)?this.pipeArray(t,n):t instanceof Map?this.pipeMap(t,n):t instanceof Set?this.pipeSet(t,n):"object"==typeof t?this.pipeObject(t,n):t:n},t}();
//# sourceMappingURL=pipe.js.map