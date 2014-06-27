gulp-mixotroph
==============

bog-simple language-agnostic preprocessing.

usage:


example srcfile
```js
   function _add5(in) {
      //=T= console.log("in is " + in.toString();
      return in+5;
   }

 function(stdlib, ffi, heap) {
   "use asm"
   %MATH_MIXIN%
```

tooling/snippets/MATH_MIXIN.js
```js
   var imul = (stdlib.Math.imul);
   var sqrt = (stdlib.Math.sqrt);
```

gulpfile.js
```js
var mixotroph = require("gulp-mixotroph");

...

.pipe(mixotroph({mode: "T"; snippetPath: "tooling/snippets/"})

```

output
```js   
   function _add5(in) {
      console.log("in is " + in.toString();
      return in+5;
   }

 function(stdlib, ffi, heap) {
   "use asm"
   var imul = (stdlib.Math.imul);
   var sqrt = (stdlib.Math.sqrt);

```