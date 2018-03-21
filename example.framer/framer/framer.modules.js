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
  var complete, controlLayer, fontsAreLoaded, loopForFonts, testBed, testForFonts, tests;
  testBed = new Layer;
  controlLayer = new TextLayer({
    name: "Control Test",
    parent: testBed,
    text: "Hello world!",
    fontFamily: "thisIsNotAFont",
    fontSize: 100
  });
  tests = [];
  testForFonts = function() {
    var j, layer, len, results;
    for (j = 0, len = tests.length; j < len; j++) {
      layer = tests[j];
      if (layer != null) {
        layer.destroy();
      }
    }
    tests = fonts.map(function(f) {
      return new TextLayer({
        name: "Font Family Test",
        parent: testBed,
        text: "Hello world!",
        fontSize: 100,
        fontFamily: f.fontFamily
      });
    });
    results = tests.map(function(testLayer) {
      return testLayer.width === controlLayer.width;
    });
    return !_.some(results);
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
    testBed.destroy();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3N0ZXBoZW5ydWl6L0dpdEh1Yi9mb250bG9hZGVyL2V4YW1wbGUuZnJhbWVyL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc3RlcGhlbnJ1aXovR2l0SHViL2ZvbnRsb2FkZXIvZXhhbXBsZS5mcmFtZXIvbW9kdWxlcy9mb250bG9hZGVyLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cbmV4cG9ydHMubXlWYXIgPSBcIm15VmFyaWFibGVcIlxuXG5leHBvcnRzLm15RnVuY3Rpb24gPSAtPlxuXHRwcmludCBcIm15RnVuY3Rpb24gaXMgcnVubmluZ1wiXG5cbmV4cG9ydHMubXlBcnJheSA9IFsxLCAyLCAzXSIsIiMjI1xuXG5Gb250bG9hZGVyXG5Ac3RldmVydWl6b2tcblxuXG4jIEludHJvZHVjdGlvblxuXG5Vc2luZyBub24tc3RhbmRhcmQgZm9udHMgY2FuIGNyZWF0ZSBiaWcgaGVhZGFjaGVzIGZvciB5b3VyIEZyYW1lciBwcm9qZWN0cy4gVGhpc1xubW9kdWxlIGVuc3VyZXMgdGhhdCBhbGwgb2YgeW91ciBsb2NhbCBvciB3ZWIgZm9udHMgYXJlIGNvcnJlY3RseSBsb2FkZWQgYmVmb3JlIFxueW91ciBjb2RlIHJ1bnMuXG5cblxuIyBJbnN0YWxsYXRpb25cblxuMS4gRHJvcCBgZm9udGxvYWRlci5jb2ZmZWVgIGludG8geW91ciBwcm9qZWN0J3MgbW9kdWxlcyBmb2xkZXJcbjIuIFBsYWNlIGxvY2FsIGNvcGllcyBvZiB5b3VyIGZvbnRzIChpZSwgJ1lvdXJGb250LVJlZ3VsYXIudHRmKSBpbnRvIHlvdXIgcHJvamVjdCdzIGZvbGRlclxuMy4gUmVxdWlyZSB0aGlzIG1vZHVsZSBhdCB0aGUgdG9wIHlvdXIgcHJvamVjdCdzIGNvZGUuXG5cbklmIHlvdSdyZSBsb2FkaW5nIGxvY2FsIGZpbGVzLi4uXG5cbmBgYGNvZmZlZXNjcmlwdFxuXG57IGxvYWRMb2NhbEZvbnRzIH0gPSByZXF1aXJlICdmb250bG9hZGVyJ1xuXG5gYGBcblxuSWYgeW91J3JlIGxvYWRpbmcgd2ViIGZvbnRzLi4uXG5cbmBgYGNvZmZlZXNjcmlwdFxuXG57IGxvYWRXZWJGb250cyB9ID0gcmVxdWlyZSAnZm9udGxvYWRlcidcblxuYGBgXG5cblxuIyBVc2FnZVxuXG5UaGUgbW9kdWxlJ3MgdHdvIGZ1bmN0aW9ucywgbG9hZExvY2FsRm9udHMgYW5kIGxvYWRXZWJGb250cywgYm90aCB0YWtlIG9uZSBvciBtb3JlIG9iamVjdHNcbmFzIHNlcGFyYXRlIGFyZ3VtZW50cy4gVGhlc2Ugb2JqZWN0cyBzaGFyZSB0d28gcHJvcGVydGllczogYGZvbnRGYW1pbHlgICh0aGUgbmFtZSBvZiB0aGUgZm9udClcbmFuZCBgZm9udFdlaWdodGAgKHRoZSB3ZWlnaHQgdG8gbG9hZCkuIElmIHlvdSdyZSBsb2FkaW5nIGxvY2FsIGZvbnRzLCB5b3UnbGwgYWxzbyBuZWVkIHRvXG5wcm92aWRlIGBzcmNgLCB0aGUgcGF0aCBmb3IgdGhlIGZpbGUgdG8gbG9hZC5cblxuIyMgbG9hZFdlYkZvbnRzKGZvbnRzKVxuXG5gYGBjb2ZmZWVzY3JpcHRcblxuYW1pdGFSZWd1bGFyID1cblx0Zm9udEZhbWlseTogXCJBbWl0YVwiXG5cdGZvbnRXZWlnaHQ6IDQwMFxuXG5hbWl0YUJvbGQgPVxuXHRmb250RmFtaWx5OiBcIkFtaXRhXCJcblx0Zm9udFdlaWdodDogNzAwXG5cbm1vbm90b24gPVxuXHRmb250RmFtaWx5OiBcIk1vbm90b25cIlxuXHRmb250V2VpZ2h0OiA1MDBcblxubG9hZFdlYkZvbnRzKFthbWl0YVJlZ3VsYXIsIGFtaXRhQm9sZCwgbW9ub3Rvbl0pXG5cblxuIyMgbG9hZExvY2FsRm9udHMoZm9udHMpXG5cbmBgYGNvZmZlZXNjcmlwdFxuXG5hbWl0YVJlZ3VsYXIgPVxuXHRmb250RmFtaWx5OiBcIkFtaXRhXCJcblx0Zm9udFdlaWdodDogNDAwXG5cdHNyYzogXCJBbWl0YS1SZWd1bGFyLnR0ZlwiXG5cbmFtaXRhQm9sZCA9XG5cdGZvbnRGYW1pbHk6IFwiQW1pdGFcIlxuXHRmb250V2VpZ2h0OiA3MDBcblx0c3JjOiBcIkFtaXRhLUJvbGQudHRmXCJcblxubW9ub3RvbiA9XG5cdGZvbnRGYW1pbHk6IFwiTW9ub3RvblwiXG5cdGZvbnRXZWlnaHQ6IDUwMFxuXHRzcmM6IFwiTW9ub3Rvbi1SZWd1bGFyLnR0ZlwiXG5cbmxvYWRMb2NhbEZvbnRzKFthbWl0YVJlZ3VsYXIsIGFtaXRhQm9sZCwgbW9ub3Rvbl0pXG5cbmBgYFxuXG4jIyBMb2NhbCBQYXRoc1xuXG5CeSBkZWZhdWx0LCB0aGlzIG1vZHVsZSB3aWxsIGxvb2sgZm9yIGZvbnRzIGluIHRoZSByb290IG9mIHlvdXIgcHJvamVjdCdzXG5mb2xkZXIgKGkuZS4gbXlQcm9qZWN0LmZyYW1lci9Nb25vdG9uLVJlZ3VsYXIudHRmKS4gSWYgSSB3YW50ZWQgdG8gcHV0IHRoZVxuZm9udCBzb21ld2hlcmUgZWxzZSwgc3VjaCBhcyBhIGZvbGRlciBjYWxsZWQgZm9udHMsIEkgd291bGQgaW5jbHVkZSB0aGlzXG5pbiB0aGUgYHNyY2AuXG5cblxuYGBgY29mZmVlc2NyaXB0XG5cbmxvYWRMb2NhbEZvbnRzXG5cdGZvbnRGYW1pbHk6IFwiTW9ub3RvblwiXG5cdGZvbnRXZWlnaHQ6IDUwMFxuXHRzcmM6IFwiZm9udHMvTW9ub3Rvbi1SZWd1bGFyLnR0ZlwiXG5cblxuYGBgXG5cbiMgQWJvdXQgXG5cblRleHRMYXllcnMgYXV0b21hdGljYWxseSBzZXQgdGhlaXIgc2l6ZSBiYXNlZCBvbiB0aGUgdGV4dCB0aGV5IGNvbnRhaW4uXG5JZiB5b3VyIFRleHRMYXllcnMgZ2V0IGNyZWF0ZWQgYmVmb3JlIHRoZSBmb250IGlzIGFjdHVhbGx5IGxvYWRlZCwgdGhlblxudGhleSdsbCBzZXQgdGhlaXIgc2l6ZSBiYXNlZCBvbiB0aGUgc3RhbmRhcmQgZGV2aWNlIGZvbnQuIFRoZW4sIGFzIHRoZVxuZm9udCBhY3R1YWxseSBsb2FkcywgdGhlIHRleHQgaW5zaWRlIG9mIHRoZSBUZXh0TGF5ZXIgd2lsbCBhZGp1c3QgdG8gdGhlXG5jb3JyZWN0IHNpemUgYW5kIGFwcGVhcmFuY2UsIGJ1dCB0aGUgVGV4dExheWVyIHdpbGwgcmVtYWluIGF0IHRoZSBmaXJzdCBzaXplLlxuXG5cblx0MS4gVGhlIFRleHRMYXllciBpbnN0YW5jZSBpcyBjcmVhdGVkLCBzaXplZCB1c2luZyB0aGUgc3RhbmRhcmQgc2l6ZS5cblx0IF9fX19fX19fX19fX19fXG5cdFsgaGVsbG8gd29ybGQhIF1cblxuXG5cdDIuIFRoZSBub24tc3RhbmRhcmQgZm9udCBsb2FkcywgYnV0IHRoZSBUZXh0TGF5ZXIgZG9lc24ndCB1cGRhdGUuXG5cdCBfX19fX19fX19fX19fX1xuXHRbIGggZSBsIGwgbyAgdyBdbyByIGwgZCAhXG5cblxuSW4gYWRkaXRpb24gdG8gZ2l2aW5nIGFuIGVhc3kgd2F5IHRvIGxvYWQgbG9jYWwgZm9udHMsIHRoaXMgbW9kdWxlIHRlc3RzXG50byBzZWUgd2hldGhlciBlYWNoIG9mIHlvdXIgZm9udHMgaGF2ZSBsb2FkZWQsIHRoZW4gcmVzdGFydHMgdGhlIHByb3RvdHlwZSBcbm9uY2UgdGhleSBoYXZlIGFsbCBsb2FkZWQuXG5cbiMjI1xuXG5cblxuIyBMb2FkIExvY2FsIEZvbnRzXG5cblxuZXhwb3J0cy5sb2FkTG9jYWxGb250cyA9IChmb250cykgLT5cblxuXHRpZiBub3QgXy5pc0FycmF5KGZvbnRzKSB0aGVuIGZvbnRzID0gW2ZvbnRzXVxuXG5cdEZyYW1lci5EZWZhdWx0Q29udGV4dC52aXNpYmxlID0gZmFsc2Vcblx0XG5cdCMgLS0tLS0tLS0tLS0tLS0tLVxuXHQjIENTUyBJbnNlcnRcblx0XG5cdGNzc1N0cmluZyA9IFwiXCJcblx0XG5cdGZvciBmb250IGluIGZvbnRzXG5cdFxuXHRcdGNzc1N0cmluZyArPSBcIlwiXCJcblx0XHRcdEBmb250LWZhY2Uge1xuXHRcdFx0XHRmb250LWZhbWlseTogI3tmb250LmZvbnRGYW1pbHl9O1xuXHRcdFx0XHRmb250LXdlaWdodDogI3tmb250LmZvbnRXZWlnaHQgPyA0MDB9O1xuXHRcdFx0XHRmb250LXN0eWxlOiAje2ZvbnQuZm9udFN0eWxlID8gXCJub3JtYWxcIn07XG5cdFx0XHRcdHNyYzogdXJsKCN7Zm9udC5zcmN9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcIlwiXCJcblx0XHRcdFxuXHRVdGlscy5pbnNlcnRDU1MoY3NzU3RyaW5nKVxuXG5cdGxvYWRGb250cyhmb250cylcblxuXG4jIExvYWQgV2ViIEZvbnRzXG5cbmV4cG9ydHMubG9hZFdlYkZvbnRzID0gKGZvbnRzKSAtPlxuXG5cdGlmIG5vdCBfLmlzQXJyYXkoZm9udHMpIHRoZW4gZm9udHMgPSBbZm9udHNdXG5cblx0RnJhbWVyLkRlZmF1bHRDb250ZXh0LnZpc2libGUgPSBmYWxzZVxuXHRcblx0IyAtLS0tLS0tLS0tLS0tLS0tXG5cdCMgQ1NTIEluc2VydFxuXHRcblx0Zm9yIGZvbnQgaW4gZm9udHNcblx0XHRVdGlscy5sb2FkV2ViRm9udChmb250LmZvbnRGYW1pbHksIGZvbnQuZm9udFdlaWdodCA/IDQwMClcblxuXHRsb2FkRm9udHMoZm9udHMpXG5cblxubG9hZEZvbnRzID0gKGZvbnRzKSAtPlxuXG5cdCMgLS0tLS0tLS0tLS0tLS0tLVxuXHQjIFRlc3QgRWxlbWVudHNcblxuXG5cdHRlc3RCZWQgPSBuZXcgTGF5ZXJcblx0XG5cdGNvbnRyb2xMYXllciA9IG5ldyBUZXh0TGF5ZXJcblx0XHRuYW1lOiBcIkNvbnRyb2wgVGVzdFwiXG5cdFx0cGFyZW50OiB0ZXN0QmVkXG5cdFx0dGV4dDogXCJIZWxsbyB3b3JsZCFcIlxuXHRcdGZvbnRGYW1pbHk6IFwidGhpc0lzTm90QUZvbnRcIlxuXHRcdGZvbnRTaXplOiAxMDBcblx0XG5cdCMgLS0tLS0tLS0tLS0tLS0tLVxuXHQjIEZ1bmN0aW9uc1xuXG5cdCMgVGVzdCBmb3IgZm9udHNcblxuXHR0ZXN0cyA9IFtdXG5cblx0dGVzdEZvckZvbnRzID0gLT5cblx0XG5cdFx0IyBjcmVhdGUgdGVzdCBkaXZzXG5cblx0XHRsYXllcj8uZGVzdHJveSgpIGZvciBsYXllciBpbiB0ZXN0c1xuXG5cdFx0dGVzdHMgPSBmb250cy5tYXAgKGYpIC0+XG5cblx0XHRcdHJldHVybiBuZXcgVGV4dExheWVyXG5cdFx0XHRcdG5hbWU6IFwiRm9udCBGYW1pbHkgVGVzdFwiXG5cdFx0XHRcdHBhcmVudDogdGVzdEJlZFxuXHRcdFx0XHR0ZXh0OiBcIkhlbGxvIHdvcmxkIVwiXG5cdFx0XHRcdGZvbnRTaXplOiAxMDBcblx0XHRcdFx0Zm9udEZhbWlseTogZi5mb250RmFtaWx5XG5cdFx0XG5cdFx0cmVzdWx0cyA9IHRlc3RzLm1hcCAodGVzdExheWVyKSAtPlxuXHRcdFx0cmV0dXJuIHRlc3RMYXllci53aWR0aCBpcyBjb250cm9sTGF5ZXIud2lkdGhcblx0XHRcblx0XHRyZXR1cm4gIV8uc29tZShyZXN1bHRzKVxuXHRcblx0IyBMb29wIHRoZSB0ZXN0IHVudGlsIHRoZSBmb250IGlzIGZvdW5kXG5cdFxuXHRsb29wRm9yRm9udHMgPSAoaSkgLT5cblx0XHRpZiBpID4gMjBcblx0XHRcdHRocm93IFwiQ291bGRuJ3QgZmluZCB0aGF0IGZvbnQuXCJcblx0XHRcblx0XHRpKytcblx0XHRmb250c0FyZUxvYWRlZCA9IHRlc3RGb3JGb250cygpXG5cdFx0XG5cdFx0aWYgZm9udHNBcmVMb2FkZWRcblx0XHRcdGNvbXBsZXRlKHRydWUpXG5cdFx0XHRyZXR1cm5cblx0XHRcblx0XHRVdGlscy5kZWxheSAuNSwgLT4gbG9vcEZvckZvbnRzKGkpXG5cdFxuXHQjIEZpbmlzaCB1cCAtIGNsZWFyIGRpdnMgYW5kIHJlc3RhcnQgdGhlIHByb3RvdHlwZSBpZiB3ZSBsb29wZWRcblxuXHRjb21wbGV0ZSA9IChyZXNldCA9IGZhbHNlKSAtPlxuXHRcdHRlc3RCZWQuZGVzdHJveSgpXG5cblx0XHRGcmFtZXIuRGVmYXVsdENvbnRleHQudmlzaWJsZSA9IHRydWVcblxuXHRcdGlmIHJlc2V0XG5cdFx0XHRVdGlscy5kZWxheSAuMDEsIC0+XG5cdFx0XHRcdEZyYW1lci5DdXJyZW50Q29udGV4dC5yZXNldCgpXG5cdFx0XHRcdENvZmZlZVNjcmlwdC5sb2FkKFwiYXBwLmNvZmZlZVwiKVxuXHRcdFxuXHQjIC0tLS0tLS0tLS0tLS0tLS1cblx0IyBLaWNrb2ZmXG5cblx0IyBCZWZvcmUgdHJ5aW5nIHRvIGxvb3AsIHNlZSBpZiB0aGUgZm9udHMgYXJlIGFscmVhZHkgbG9hZGVkLiBJZlxuXHQjIHRoZXkgYXJlLCBjbGVhbiB1cCBhbmQgZG9uJ3QgbG9vcCBhZ2FpbjsgaWYgbm90LCBzdGFydCB0aGUgbG9vcC5cblx0IyBTaW5jZSB0aGlzIGNvZGUgd2lsbCBydW4gZXZlbiBhZnRlciBvdXIgbG9vcCBjb21wbGV0ZXMsIHdlIHdhbnQgXG5cdCMgdG8gYmUgc3VyZSBub3QgdG8gZ2V0IHN0dWNrIGluIGFuIGVuZGxlc3MgcmVsb2FkIGxvb3AuXG5cblx0Zm9udHNBcmVMb2FkZWQgPSB0ZXN0Rm9yRm9udHMoKVxuXG5cdGlmIGZvbnRzQXJlTG9hZGVkXG5cdFx0Y29tcGxldGUoKVxuXHRlbHNlXG5cdFx0bG9vcEZvckZvbnRzKDApXG4iLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUVBQTs7QURBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQTs7QUFxSUEsT0FBTyxDQUFDLGNBQVIsR0FBeUIsU0FBQyxLQUFEO0FBRXhCLE1BQUE7RUFBQSxJQUFHLENBQUksQ0FBQyxDQUFDLE9BQUYsQ0FBVSxLQUFWLENBQVA7SUFBNkIsS0FBQSxHQUFRLENBQUMsS0FBRCxFQUFyQzs7RUFFQSxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQXRCLEdBQWdDO0VBS2hDLFNBQUEsR0FBWTtBQUVaLE9BQUEsdUNBQUE7O0lBRUMsU0FBQSxJQUFhLDhCQUFBLEdBRUksSUFBSSxDQUFDLFVBRlQsR0FFb0IsbUJBRnBCLEdBR0cseUNBQW1CLEdBQW5CLENBSEgsR0FHMEIsa0JBSDFCLEdBSUUsMENBQWtCLFFBQWxCLENBSkYsR0FJNkIsZUFKN0IsR0FLQSxJQUFJLENBQUMsR0FMTCxHQUtTO0FBUHZCO0VBWUEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsU0FBaEI7U0FFQSxTQUFBLENBQVUsS0FBVjtBQXpCd0I7O0FBOEJ6QixPQUFPLENBQUMsWUFBUixHQUF1QixTQUFDLEtBQUQ7QUFFdEIsTUFBQTtFQUFBLElBQUcsQ0FBSSxDQUFDLENBQUMsT0FBRixDQUFVLEtBQVYsQ0FBUDtJQUE2QixLQUFBLEdBQVEsQ0FBQyxLQUFELEVBQXJDOztFQUVBLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBdEIsR0FBZ0M7QUFLaEMsT0FBQSx1Q0FBQTs7SUFDQyxLQUFLLENBQUMsV0FBTixDQUFrQixJQUFJLENBQUMsVUFBdkIsMENBQXFELEdBQXJEO0FBREQ7U0FHQSxTQUFBLENBQVUsS0FBVjtBQVpzQjs7QUFldkIsU0FBQSxHQUFZLFNBQUMsS0FBRDtBQU1YLE1BQUE7RUFBQSxPQUFBLEdBQVUsSUFBSTtFQUVkLFlBQUEsR0FBbUIsSUFBQSxTQUFBLENBQ2xCO0lBQUEsSUFBQSxFQUFNLGNBQU47SUFDQSxNQUFBLEVBQVEsT0FEUjtJQUVBLElBQUEsRUFBTSxjQUZOO0lBR0EsVUFBQSxFQUFZLGdCQUhaO0lBSUEsUUFBQSxFQUFVLEdBSlY7R0FEa0I7RUFZbkIsS0FBQSxHQUFRO0VBRVIsWUFBQSxHQUFlLFNBQUE7QUFJZCxRQUFBO0FBQUEsU0FBQSx1Q0FBQTs7O1FBQUEsS0FBSyxDQUFFLE9BQVAsQ0FBQTs7QUFBQTtJQUVBLEtBQUEsR0FBUSxLQUFLLENBQUMsR0FBTixDQUFVLFNBQUMsQ0FBRDtBQUVqQixhQUFXLElBQUEsU0FBQSxDQUNWO1FBQUEsSUFBQSxFQUFNLGtCQUFOO1FBQ0EsTUFBQSxFQUFRLE9BRFI7UUFFQSxJQUFBLEVBQU0sY0FGTjtRQUdBLFFBQUEsRUFBVSxHQUhWO1FBSUEsVUFBQSxFQUFZLENBQUMsQ0FBQyxVQUpkO09BRFU7SUFGTSxDQUFWO0lBU1IsT0FBQSxHQUFVLEtBQUssQ0FBQyxHQUFOLENBQVUsU0FBQyxTQUFEO0FBQ25CLGFBQU8sU0FBUyxDQUFDLEtBQVYsS0FBbUIsWUFBWSxDQUFDO0lBRHBCLENBQVY7QUFHVixXQUFPLENBQUMsQ0FBQyxDQUFDLElBQUYsQ0FBTyxPQUFQO0VBbEJNO0VBc0JmLFlBQUEsR0FBZSxTQUFDLENBQUQ7QUFDZCxRQUFBO0lBQUEsSUFBRyxDQUFBLEdBQUksRUFBUDtBQUNDLFlBQU0sMkJBRFA7O0lBR0EsQ0FBQTtJQUNBLGNBQUEsR0FBaUIsWUFBQSxDQUFBO0lBRWpCLElBQUcsY0FBSDtNQUNDLFFBQUEsQ0FBUyxJQUFUO0FBQ0EsYUFGRDs7V0FJQSxLQUFLLENBQUMsS0FBTixDQUFZLEVBQVosRUFBZ0IsU0FBQTthQUFHLFlBQUEsQ0FBYSxDQUFiO0lBQUgsQ0FBaEI7RUFYYztFQWVmLFFBQUEsR0FBVyxTQUFDLEtBQUQ7O01BQUMsUUFBUTs7SUFDbkIsT0FBTyxDQUFDLE9BQVIsQ0FBQTtJQUVBLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBdEIsR0FBZ0M7SUFFaEMsSUFBRyxLQUFIO2FBQ0MsS0FBSyxDQUFDLEtBQU4sQ0FBWSxHQUFaLEVBQWlCLFNBQUE7UUFDaEIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUF0QixDQUFBO2VBQ0EsWUFBWSxDQUFDLElBQWIsQ0FBa0IsWUFBbEI7TUFGZ0IsQ0FBakIsRUFERDs7RUFMVTtFQWtCWCxjQUFBLEdBQWlCLFlBQUEsQ0FBQTtFQUVqQixJQUFHLGNBQUg7V0FDQyxRQUFBLENBQUEsRUFERDtHQUFBLE1BQUE7V0FHQyxZQUFBLENBQWEsQ0FBYixFQUhEOztBQS9FVzs7OztBRDlLWixPQUFPLENBQUMsS0FBUixHQUFnQjs7QUFFaEIsT0FBTyxDQUFDLFVBQVIsR0FBcUIsU0FBQTtTQUNwQixLQUFBLENBQU0sdUJBQU47QUFEb0I7O0FBR3JCLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQIn0=
