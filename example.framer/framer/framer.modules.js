require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"fontloader":[function(require,module,exports){

/*

Fontloader
@steveruizok


 * Introduction

Using non-standard fonts can create big headaches for your Framer projects. This
module ensures that all of your local or web fonts are correctly loaded before 
your code runs.


 * Installation

1. Drop `fontloader.coffee` into your project's modules folder
2. Place local copies of your fonts (ie, 'YourFont-Regular.ttf) into your project's folder
3. Require this module at the top your project's code.

If you're loading local files...

```coffeescript

{ loadLocalFonts } = require 'fontloader'

```

If you're loading web fonts...

```coffeescript

{ loadWebFonts } = require 'fontloader'

```


 * Usage

The module's two functions, loadLocalFonts and loadWebFonts, both take one or more objects
as separate arguments. These objects share two properties: `fontFamily` (the name of the font)
and `fontWeight` (the weight to load). If you're loading local fonts, you'll also need to
provide `src`, the path for the file to load.

## loadWebFonts(fonts)

```coffeescript

amitaRegular =
	fontFamily: "Amita"
	fontWeight: 400

amitaBold =
	fontFamily: "Amita"
	fontWeight: 700

monoton =
	fontFamily: "Monoton"
	fontWeight: 500

loadWebFonts([amitaRegular, amitaBold, monoton])


## loadLocalFonts(fonts)

```coffeescript

amitaRegular =
	fontFamily: "Amita"
	fontWeight: 400
	src: "Amita-Regular.ttf"

amitaBold =
	fontFamily: "Amita"
	fontWeight: 700
	src: "Amita-Bold.ttf"

monoton =
	fontFamily: "Monoton"
	fontWeight: 500
	src: "Monoton-Regular.ttf"

loadLocalFonts([amitaRegular, amitaBold, monoton])

```

## Local Paths

By default, this module will look for fonts in the root of your project's
folder (i.e. myProject.framer/Monoton-Regular.ttf). If I wanted to put the
font somewhere else, such as a folder called fonts, I would include this
in the `src`.


```coffeescript

loadLocalFonts
	fontFamily: "Monoton"
	fontWeight: 500
	src: "fonts/Monoton-Regular.ttf"


```

 * About 

TextLayers automatically set their size based on the text they contain.
If your TextLayers get created before the font is actually loaded, then
they'll set their size based on the standard device font. Then, as the
font actually loads, the text inside of the TextLayer will adjust to the
correct size and appearance, but the TextLayer will remain at the first size.


	1. The TextLayer instance is created, sized using the standard size.
	 ______________
	[ hello world! ]


	2. The non-standard font loads, but the TextLayer doesn't update.
	 ______________
	[ h e l l o  w ]o r l d !


In addition to giving an easy way to load local fonts, this module tests
to see whether each of your fonts have loaded, then restarts the prototype 
once they have all loaded.
 */
var loadFonts;

exports.loadLocalFonts = function(fonts) {
  var cssString, font, j, len, ref, ref1;
  if (!_.isArray(fonts)) {
    fonts = [fonts];
  }
  Framer.DefaultContext.visible = false;
  cssString = "";
  for (j = 0, len = fonts.length; j < len; j++) {
    font = fonts[j];
    cssString += "@font-face {\n	font-family: " + font.fontFamily + ";\n	font-weight: " + ((ref = font.fontWeight) != null ? ref : 400) + ";\n	font-style: " + ((ref1 = font.fontStyle) != null ? ref1 : "normal") + ";\n	src: url(" + font.src + ");\n	}\n";
  }
  Utils.insertCSS(cssString);
  return loadFonts(fonts);
};

exports.loadWebFonts = function(fonts) {
  var font, j, len, ref;
  if (!_.isArray(fonts)) {
    fonts = [fonts];
  }
  Framer.DefaultContext.visible = false;
  for (j = 0, len = fonts.length; j < len; j++) {
    font = fonts[j];
    Utils.loadWebFont(font.fontFamily, (ref = font.fontWeight) != null ? ref : 400);
  }
  return loadFonts(fonts);
};

loadFonts = function(fonts) {
  var complete, controlSpan, fontsAreLoaded, loopForFonts, testBed, testForFonts, tests;
  testBed = document.createElement("div");
  _.assign(testBed.style, {
    position: "absolute",
    fontFamily: "nonsense",
    padding: 0,
    opacity: 0
  });
  document.body.appendChild(testBed);
  controlSpan = document.createElement("span");
  _.assign(controlSpan.style, {
    position: "absolute",
    fontSize: "200px",
    top: 0,
    left: 0
  });
  controlSpan.textContent = "Hello world!";
  testBed.appendChild(controlSpan);
  tests = fonts.map(function(f, i) {
    var testSpan;
    testSpan = document.createElement("span");
    testSpan.textContent = "Hello world!";
    _.assign(testSpan.style, {
      fontFamily: f.fontFamily,
      position: "absolute",
      fontSize: "200px",
      top: (100 * i) + "px",
      left: 0
    });
    testBed.appendChild(testSpan);
    return testSpan;
  });
  testForFonts = function() {
    var j, len, result, results;
    results = tests.map(function(testSpan) {
      return testSpan.clientWidth !== controlSpan.clientWidth;
    });
    for (j = 0, len = results.length; j < len; j++) {
      result = results[j];
      if (!result) {
        return false;
      }
    }
    return true;
  };
  loopForFonts = function(i) {
    var fontsAreLoaded;
    if (i > 20) {
      throw "Couldn't find that font.";
    }
    i++;
    fontsAreLoaded = testForFonts();
    if (fontsAreLoaded) {
      complete(true);
      return;
    }
    return Utils.delay(.5, function() {
      return loopForFonts(i);
    });
  };
  complete = function(reset) {
    if (reset == null) {
      reset = false;
    }
    document.body.removeChild(testBed);
    Framer.DefaultContext.visible = true;
    if (reset) {
      return Utils.delay(.01, function() {
        Framer.CurrentContext.reset();
        return CoffeeScript.load("app.coffee");
      });
    }
  };
  fontsAreLoaded = testForFonts();
  if (fontsAreLoaded) {
    return complete();
  } else {
    return loopForFonts(0);
  }
};


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3N0ZXBoZW5ydWl6L0dpdEh1Yi9mb250bG9hZGVyL2V4YW1wbGUuZnJhbWVyL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc3RlcGhlbnJ1aXovR2l0SHViL2ZvbnRsb2FkZXIvZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy9mb250bG9hZGVyLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cbmV4cG9ydHMubXlWYXIgPSBcIm15VmFyaWFibGVcIlxuXG5leHBvcnRzLm15RnVuY3Rpb24gPSAtPlxuXHRwcmludCBcIm15RnVuY3Rpb24gaXMgcnVubmluZ1wiXG5cbmV4cG9ydHMubXlBcnJheSA9IFsxLCAyLCAzXSIsIiMjI1xuXG5Gb250bG9hZGVyXG5Ac3RldmVydWl6b2tcblxuXG4jIEludHJvZHVjdGlvblxuXG5Vc2luZyBub24tc3RhbmRhcmQgZm9udHMgY2FuIGNyZWF0ZSBiaWcgaGVhZGFjaGVzIGZvciB5b3VyIEZyYW1lciBwcm9qZWN0cy4gVGhpc1xubW9kdWxlIGVuc3VyZXMgdGhhdCBhbGwgb2YgeW91ciBsb2NhbCBvciB3ZWIgZm9udHMgYXJlIGNvcnJlY3RseSBsb2FkZWQgYmVmb3JlIFxueW91ciBjb2RlIHJ1bnMuXG5cblxuIyBJbnN0YWxsYXRpb25cblxuMS4gRHJvcCBgZm9udGxvYWRlci5jb2ZmZWVgIGludG8geW91ciBwcm9qZWN0J3MgbW9kdWxlcyBmb2xkZXJcbjIuIFBsYWNlIGxvY2FsIGNvcGllcyBvZiB5b3VyIGZvbnRzIChpZSwgJ1lvdXJGb250LVJlZ3VsYXIudHRmKSBpbnRvIHlvdXIgcHJvamVjdCdzIGZvbGRlclxuMy4gUmVxdWlyZSB0aGlzIG1vZHVsZSBhdCB0aGUgdG9wIHlvdXIgcHJvamVjdCdzIGNvZGUuXG5cbklmIHlvdSdyZSBsb2FkaW5nIGxvY2FsIGZpbGVzLi4uXG5cbmBgYGNvZmZlZXNjcmlwdFxuXG57IGxvYWRMb2NhbEZvbnRzIH0gPSByZXF1aXJlICdmb250bG9hZGVyJ1xuXG5gYGBcblxuSWYgeW91J3JlIGxvYWRpbmcgd2ViIGZvbnRzLi4uXG5cbmBgYGNvZmZlZXNjcmlwdFxuXG57IGxvYWRXZWJGb250cyB9ID0gcmVxdWlyZSAnZm9udGxvYWRlcidcblxuYGBgXG5cblxuIyBVc2FnZVxuXG5UaGUgbW9kdWxlJ3MgdHdvIGZ1bmN0aW9ucywgbG9hZExvY2FsRm9udHMgYW5kIGxvYWRXZWJGb250cywgYm90aCB0YWtlIG9uZSBvciBtb3JlIG9iamVjdHNcbmFzIHNlcGFyYXRlIGFyZ3VtZW50cy4gVGhlc2Ugb2JqZWN0cyBzaGFyZSB0d28gcHJvcGVydGllczogYGZvbnRGYW1pbHlgICh0aGUgbmFtZSBvZiB0aGUgZm9udClcbmFuZCBgZm9udFdlaWdodGAgKHRoZSB3ZWlnaHQgdG8gbG9hZCkuIElmIHlvdSdyZSBsb2FkaW5nIGxvY2FsIGZvbnRzLCB5b3UnbGwgYWxzbyBuZWVkIHRvXG5wcm92aWRlIGBzcmNgLCB0aGUgcGF0aCBmb3IgdGhlIGZpbGUgdG8gbG9hZC5cblxuIyMgbG9hZFdlYkZvbnRzKGZvbnRzKVxuXG5gYGBjb2ZmZWVzY3JpcHRcblxuYW1pdGFSZWd1bGFyID1cblx0Zm9udEZhbWlseTogXCJBbWl0YVwiXG5cdGZvbnRXZWlnaHQ6IDQwMFxuXG5hbWl0YUJvbGQgPVxuXHRmb250RmFtaWx5OiBcIkFtaXRhXCJcblx0Zm9udFdlaWdodDogNzAwXG5cbm1vbm90b24gPVxuXHRmb250RmFtaWx5OiBcIk1vbm90b25cIlxuXHRmb250V2VpZ2h0OiA1MDBcblxubG9hZFdlYkZvbnRzKFthbWl0YVJlZ3VsYXIsIGFtaXRhQm9sZCwgbW9ub3Rvbl0pXG5cblxuIyMgbG9hZExvY2FsRm9udHMoZm9udHMpXG5cbmBgYGNvZmZlZXNjcmlwdFxuXG5hbWl0YVJlZ3VsYXIgPVxuXHRmb250RmFtaWx5OiBcIkFtaXRhXCJcblx0Zm9udFdlaWdodDogNDAwXG5cdHNyYzogXCJBbWl0YS1SZWd1bGFyLnR0ZlwiXG5cbmFtaXRhQm9sZCA9XG5cdGZvbnRGYW1pbHk6IFwiQW1pdGFcIlxuXHRmb250V2VpZ2h0OiA3MDBcblx0c3JjOiBcIkFtaXRhLUJvbGQudHRmXCJcblxubW9ub3RvbiA9XG5cdGZvbnRGYW1pbHk6IFwiTW9ub3RvblwiXG5cdGZvbnRXZWlnaHQ6IDUwMFxuXHRzcmM6IFwiTW9ub3Rvbi1SZWd1bGFyLnR0ZlwiXG5cbmxvYWRMb2NhbEZvbnRzKFthbWl0YVJlZ3VsYXIsIGFtaXRhQm9sZCwgbW9ub3Rvbl0pXG5cbmBgYFxuXG4jIyBMb2NhbCBQYXRoc1xuXG5CeSBkZWZhdWx0LCB0aGlzIG1vZHVsZSB3aWxsIGxvb2sgZm9yIGZvbnRzIGluIHRoZSByb290IG9mIHlvdXIgcHJvamVjdCdzXG5mb2xkZXIgKGkuZS4gbXlQcm9qZWN0LmZyYW1lci9Nb25vdG9uLVJlZ3VsYXIudHRmKS4gSWYgSSB3YW50ZWQgdG8gcHV0IHRoZVxuZm9udCBzb21ld2hlcmUgZWxzZSwgc3VjaCBhcyBhIGZvbGRlciBjYWxsZWQgZm9udHMsIEkgd291bGQgaW5jbHVkZSB0aGlzXG5pbiB0aGUgYHNyY2AuXG5cblxuYGBgY29mZmVlc2NyaXB0XG5cbmxvYWRMb2NhbEZvbnRzXG5cdGZvbnRGYW1pbHk6IFwiTW9ub3RvblwiXG5cdGZvbnRXZWlnaHQ6IDUwMFxuXHRzcmM6IFwiZm9udHMvTW9ub3Rvbi1SZWd1bGFyLnR0ZlwiXG5cblxuYGBgXG5cbiMgQWJvdXQgXG5cblRleHRMYXllcnMgYXV0b21hdGljYWxseSBzZXQgdGhlaXIgc2l6ZSBiYXNlZCBvbiB0aGUgdGV4dCB0aGV5IGNvbnRhaW4uXG5JZiB5b3VyIFRleHRMYXllcnMgZ2V0IGNyZWF0ZWQgYmVmb3JlIHRoZSBmb250IGlzIGFjdHVhbGx5IGxvYWRlZCwgdGhlblxudGhleSdsbCBzZXQgdGhlaXIgc2l6ZSBiYXNlZCBvbiB0aGUgc3RhbmRhcmQgZGV2aWNlIGZvbnQuIFRoZW4sIGFzIHRoZVxuZm9udCBhY3R1YWxseSBsb2FkcywgdGhlIHRleHQgaW5zaWRlIG9mIHRoZSBUZXh0TGF5ZXIgd2lsbCBhZGp1c3QgdG8gdGhlXG5jb3JyZWN0IHNpemUgYW5kIGFwcGVhcmFuY2UsIGJ1dCB0aGUgVGV4dExheWVyIHdpbGwgcmVtYWluIGF0IHRoZSBmaXJzdCBzaXplLlxuXG5cblx0MS4gVGhlIFRleHRMYXllciBpbnN0YW5jZSBpcyBjcmVhdGVkLCBzaXplZCB1c2luZyB0aGUgc3RhbmRhcmQgc2l6ZS5cblx0IF9fX19fX19fX19fX19fXG5cdFsgaGVsbG8gd29ybGQhIF1cblxuXG5cdDIuIFRoZSBub24tc3RhbmRhcmQgZm9udCBsb2FkcywgYnV0IHRoZSBUZXh0TGF5ZXIgZG9lc24ndCB1cGRhdGUuXG5cdCBfX19fX19fX19fX19fX1xuXHRbIGggZSBsIGwgbyAgdyBdbyByIGwgZCAhXG5cblxuSW4gYWRkaXRpb24gdG8gZ2l2aW5nIGFuIGVhc3kgd2F5IHRvIGxvYWQgbG9jYWwgZm9udHMsIHRoaXMgbW9kdWxlIHRlc3RzXG50byBzZWUgd2hldGhlciBlYWNoIG9mIHlvdXIgZm9udHMgaGF2ZSBsb2FkZWQsIHRoZW4gcmVzdGFydHMgdGhlIHByb3RvdHlwZSBcbm9uY2UgdGhleSBoYXZlIGFsbCBsb2FkZWQuXG5cbiMjI1xuXG5cblxuIyBMb2FkIExvY2FsIEZvbnRzXG5cblxuZXhwb3J0cy5sb2FkTG9jYWxGb250cyA9IChmb250cykgLT5cblxuXHR1bmxlc3MgXy5pc0FycmF5KGZvbnRzKVxuXHRcdGZvbnRzID0gW2ZvbnRzXVxuXG5cdEZyYW1lci5EZWZhdWx0Q29udGV4dC52aXNpYmxlID0gZmFsc2Vcblx0XG5cdCMgLS0tLS0tLS0tLS0tLS0tLVxuXHQjIENTUyBJbnNlcnRcblx0XG5cdGNzc1N0cmluZyA9IFwiXCJcblx0XG5cdGZvciBmb250IGluIGZvbnRzXG5cdFxuXHRcdGNzc1N0cmluZyArPSBcIlwiXCJcblx0XHRcdEBmb250LWZhY2Uge1xuXHRcdFx0XHRmb250LWZhbWlseTogI3tmb250LmZvbnRGYW1pbHl9O1xuXHRcdFx0XHRmb250LXdlaWdodDogI3tmb250LmZvbnRXZWlnaHQgPyA0MDB9O1xuXHRcdFx0XHRmb250LXN0eWxlOiAje2ZvbnQuZm9udFN0eWxlID8gXCJub3JtYWxcIn07XG5cdFx0XHRcdHNyYzogdXJsKCN7Zm9udC5zcmN9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcIlwiXCJcblx0XHRcdFxuXHRVdGlscy5pbnNlcnRDU1MoY3NzU3RyaW5nKVxuXG5cdGxvYWRGb250cyhmb250cylcblxuXG4jIExvYWQgV2ViIEZvbnRzXG5cbmV4cG9ydHMubG9hZFdlYkZvbnRzID0gKGZvbnRzKSAtPlxuXG5cdGlmIG5vdCBfLmlzQXJyYXkoZm9udHMpIHRoZW4gZm9udHMgPSBbZm9udHNdXG5cblx0RnJhbWVyLkRlZmF1bHRDb250ZXh0LnZpc2libGUgPSBmYWxzZVxuXHRcblx0IyAtLS0tLS0tLS0tLS0tLS0tXG5cdCMgQ1NTIEluc2VydFxuXHRcblx0Zm9yIGZvbnQgaW4gZm9udHNcblx0XHRVdGlscy5sb2FkV2ViRm9udChmb250LmZvbnRGYW1pbHksIGZvbnQuZm9udFdlaWdodCA/IDQwMClcblxuXHRsb2FkRm9udHMoZm9udHMpXG5cblxuXG5sb2FkRm9udHMgPSAoZm9udHMpIC0+XG5cblx0IyAtLS0tLS0tLS0tLS0tLS0tXG5cdCMgVGVzdCBFbGVtZW50c1xuXG5cblx0dGVzdEJlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgXCJkaXZcIlxuXG5cdF8uYXNzaWduIHRlc3RCZWQuc3R5bGUsXG5cdFx0cG9zaXRpb246IFwiYWJzb2x1dGVcIlxuXHRcdGZvbnRGYW1pbHk6IFwibm9uc2Vuc2VcIlxuXHRcdHBhZGRpbmc6IDBcblx0XHRvcGFjaXR5OiAwXG5cblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXN0QmVkKVxuXG5cblx0Y29udHJvbFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwic3BhblwiXG5cblx0Xy5hc3NpZ24gY29udHJvbFNwYW4uc3R5bGUsXHRcblx0XHRwb3NpdGlvbjogXCJhYnNvbHV0ZVwiXG5cdFx0Zm9udFNpemU6IFwiMjAwcHhcIlx0XG5cdFx0dG9wOiAwXG5cdFx0bGVmdDogMFxuXG5cdGNvbnRyb2xTcGFuLnRleHRDb250ZW50ID0gXCJIZWxsbyB3b3JsZCFcIlxuXG5cdHRlc3RCZWQuYXBwZW5kQ2hpbGQoY29udHJvbFNwYW4pXHRcblxuXG5cdHRlc3RzID0gZm9udHMubWFwIChmLCBpKSAtPlxuXG5cdFx0dGVzdFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwic3BhblwiXG5cblx0XHR0ZXN0U3Bhbi50ZXh0Q29udGVudCA9IFwiSGVsbG8gd29ybGQhXCJcblxuXHRcdF8uYXNzaWduIHRlc3RTcGFuLnN0eWxlLFxuXHRcdFx0Zm9udEZhbWlseTogZi5mb250RmFtaWx5XG5cdFx0XHRwb3NpdGlvbjogXCJhYnNvbHV0ZVwiXG5cdFx0XHRmb250U2l6ZTogXCIyMDBweFwiXG5cdFx0XHR0b3A6ICgxMDAgKiBpKSArIFwicHhcIlxuXHRcdFx0bGVmdDogMFxuXG5cdFx0dGVzdEJlZC5hcHBlbmRDaGlsZCh0ZXN0U3BhbilcblxuXHRcdHJldHVybiB0ZXN0U3BhblxuXG5cdFxuXHQjIC0tLS0tLS0tLS0tLS0tLS1cblx0IyBGdW5jdGlvbnNcblxuXG5cdCMgVGVzdCBmb3IgZm9udHNcblxuXHR0ZXN0Rm9yRm9udHMgPSAtPlxuXHRcblx0XHRyZXN1bHRzID0gdGVzdHMubWFwICh0ZXN0U3BhbikgLT5cblx0XHRcdHJldHVybiB0ZXN0U3Bhbi5jbGllbnRXaWR0aCBpc250IGNvbnRyb2xTcGFuLmNsaWVudFdpZHRoXG5cblx0XHRmb3IgcmVzdWx0IGluIHJlc3VsdHNcblx0XHRcdHVubGVzcyByZXN1bHRcblx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRyZXR1cm4gdHJ1ZVxuXHRcblxuXHQjIExvb3AgdGhlIHRlc3QgdW50aWwgdGhlIGZvbnQgaXMgZm91bmRcblx0XG5cdGxvb3BGb3JGb250cyA9IChpKSAtPlxuXHRcdGlmIGkgPiAyMFxuXHRcdFx0dGhyb3cgXCJDb3VsZG4ndCBmaW5kIHRoYXQgZm9udC5cIlxuXHRcdFxuXHRcdGkrK1xuXHRcdGZvbnRzQXJlTG9hZGVkID0gdGVzdEZvckZvbnRzKClcblx0XHRcblx0XHRpZiBmb250c0FyZUxvYWRlZFxuXHRcdFx0Y29tcGxldGUodHJ1ZSlcblx0XHRcdHJldHVyblxuXHRcdFxuXHRcdFV0aWxzLmRlbGF5IC41LCAtPiBsb29wRm9yRm9udHMoaSlcblx0XG5cblx0IyBGaW5pc2ggdXAgLSBjbGVhciBkaXZzIGFuZCByZXN0YXJ0IHRoZSBwcm90b3R5cGUgaWYgd2UgbG9vcGVkXG5cblx0Y29tcGxldGUgPSAocmVzZXQgPSBmYWxzZSkgLT5cblx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRlc3RCZWQpXG5cblx0XHRGcmFtZXIuRGVmYXVsdENvbnRleHQudmlzaWJsZSA9IHRydWVcblxuXHRcdGlmIHJlc2V0XG5cdFx0XHRVdGlscy5kZWxheSAuMDEsIC0+XG5cdFx0XHRcdEZyYW1lci5DdXJyZW50Q29udGV4dC5yZXNldCgpXG5cdFx0XHRcdENvZmZlZVNjcmlwdC5sb2FkKFwiYXBwLmNvZmZlZVwiKVxuXHRcdFxuXHRcblx0IyAtLS0tLS0tLS0tLS0tLS0tXG5cdCMgS2lja29mZlxuXG5cdCMgQmVmb3JlIHRyeWluZyB0byBsb29wLCBzZWUgaWYgdGhlIGZvbnRzIGFyZSBhbHJlYWR5IGxvYWRlZC4gSWZcblx0IyB0aGV5IGFyZSwgY2xlYW4gdXAgYW5kIGRvbid0IGxvb3AgYWdhaW47IGlmIG5vdCwgc3RhcnQgdGhlIGxvb3AuXG5cdCMgU2luY2UgdGhpcyBjb2RlIHdpbGwgcnVuIGV2ZW4gYWZ0ZXIgb3VyIGxvb3AgY29tcGxldGVzLCB3ZSB3YW50IFxuXHQjIHRvIGJlIHN1cmUgbm90IHRvIGdldCBzdHVjayBpbiBhbiBlbmRsZXNzIHJlbG9hZCBsb29wLlxuXG5cblx0XG5cblx0Zm9udHNBcmVMb2FkZWQgPSB0ZXN0Rm9yRm9udHMoKVxuXG5cdGlmIGZvbnRzQXJlTG9hZGVkXG5cdFx0Y29tcGxldGUoKVxuXHRlbHNlXG5cdFx0bG9vcEZvckZvbnRzKDApXG4iLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUVBQTs7QURBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQTs7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
