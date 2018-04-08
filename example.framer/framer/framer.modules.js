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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3N0ZXBoZW5ydWl6L0RvY3VtZW50cy9HaXRIdWIvZm9udGxvYWRlci9leGFtcGxlLmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3N0ZXBoZW5ydWl6L0RvY3VtZW50cy9HaXRIdWIvZm9udGxvYWRlci9leGFtcGxlLmZyYW1lci9tb2R1bGVzL2ZvbnRsb2FkZXIuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyBteU1vZHVsZSA9IHJlcXVpcmUgXCJteU1vZHVsZVwiXG4jIFJlZmVyZW5jZSB0aGUgY29udGVudHMgYnkgbmFtZSwgbGlrZSBteU1vZHVsZS5teUZ1bmN0aW9uKCkgb3IgbXlNb2R1bGUubXlWYXJcblxuZXhwb3J0cy5teVZhciA9IFwibXlWYXJpYWJsZVwiXG5cbmV4cG9ydHMubXlGdW5jdGlvbiA9IC0+XG5cdHByaW50IFwibXlGdW5jdGlvbiBpcyBydW5uaW5nXCJcblxuZXhwb3J0cy5teUFycmF5ID0gWzEsIDIsIDNdIiwiIyMjXG5cbkZvbnRsb2FkZXJcbkBzdGV2ZXJ1aXpva1xuXG5cbiMgSW50cm9kdWN0aW9uXG5cblVzaW5nIG5vbi1zdGFuZGFyZCBmb250cyBjYW4gY3JlYXRlIGJpZyBoZWFkYWNoZXMgZm9yIHlvdXIgRnJhbWVyIHByb2plY3RzLiBUaGlzXG5tb2R1bGUgZW5zdXJlcyB0aGF0IGFsbCBvZiB5b3VyIGxvY2FsIG9yIHdlYiBmb250cyBhcmUgY29ycmVjdGx5IGxvYWRlZCBiZWZvcmUgXG55b3VyIGNvZGUgcnVucy5cblxuXG4jIEluc3RhbGxhdGlvblxuXG4xLiBEcm9wIGBmb250bG9hZGVyLmNvZmZlZWAgaW50byB5b3VyIHByb2plY3QncyBtb2R1bGVzIGZvbGRlclxuMi4gUGxhY2UgbG9jYWwgY29waWVzIG9mIHlvdXIgZm9udHMgKGllLCAnWW91ckZvbnQtUmVndWxhci50dGYpIGludG8geW91ciBwcm9qZWN0J3MgZm9sZGVyXG4zLiBSZXF1aXJlIHRoaXMgbW9kdWxlIGF0IHRoZSB0b3AgeW91ciBwcm9qZWN0J3MgY29kZS5cblxuSWYgeW91J3JlIGxvYWRpbmcgbG9jYWwgZmlsZXMuLi5cblxuYGBgY29mZmVlc2NyaXB0XG5cbnsgbG9hZExvY2FsRm9udHMgfSA9IHJlcXVpcmUgJ2ZvbnRsb2FkZXInXG5cbmBgYFxuXG5JZiB5b3UncmUgbG9hZGluZyB3ZWIgZm9udHMuLi5cblxuYGBgY29mZmVlc2NyaXB0XG5cbnsgbG9hZFdlYkZvbnRzIH0gPSByZXF1aXJlICdmb250bG9hZGVyJ1xuXG5gYGBcblxuXG4jIFVzYWdlXG5cblRoZSBtb2R1bGUncyB0d28gZnVuY3Rpb25zLCBsb2FkTG9jYWxGb250cyBhbmQgbG9hZFdlYkZvbnRzLCBib3RoIHRha2Ugb25lIG9yIG1vcmUgb2JqZWN0c1xuYXMgc2VwYXJhdGUgYXJndW1lbnRzLiBUaGVzZSBvYmplY3RzIHNoYXJlIHR3byBwcm9wZXJ0aWVzOiBgZm9udEZhbWlseWAgKHRoZSBuYW1lIG9mIHRoZSBmb250KVxuYW5kIGBmb250V2VpZ2h0YCAodGhlIHdlaWdodCB0byBsb2FkKS4gSWYgeW91J3JlIGxvYWRpbmcgbG9jYWwgZm9udHMsIHlvdSdsbCBhbHNvIG5lZWQgdG9cbnByb3ZpZGUgYHNyY2AsIHRoZSBwYXRoIGZvciB0aGUgZmlsZSB0byBsb2FkLlxuXG4jIyBsb2FkV2ViRm9udHMoZm9udHMpXG5cbmBgYGNvZmZlZXNjcmlwdFxuXG5hbWl0YVJlZ3VsYXIgPVxuXHRmb250RmFtaWx5OiBcIkFtaXRhXCJcblx0Zm9udFdlaWdodDogNDAwXG5cbmFtaXRhQm9sZCA9XG5cdGZvbnRGYW1pbHk6IFwiQW1pdGFcIlxuXHRmb250V2VpZ2h0OiA3MDBcblxubW9ub3RvbiA9XG5cdGZvbnRGYW1pbHk6IFwiTW9ub3RvblwiXG5cdGZvbnRXZWlnaHQ6IDUwMFxuXG5sb2FkV2ViRm9udHMoW2FtaXRhUmVndWxhciwgYW1pdGFCb2xkLCBtb25vdG9uXSlcblxuXG4jIyBsb2FkTG9jYWxGb250cyhmb250cylcblxuYGBgY29mZmVlc2NyaXB0XG5cbmFtaXRhUmVndWxhciA9XG5cdGZvbnRGYW1pbHk6IFwiQW1pdGFcIlxuXHRmb250V2VpZ2h0OiA0MDBcblx0c3JjOiBcIkFtaXRhLVJlZ3VsYXIudHRmXCJcblxuYW1pdGFCb2xkID1cblx0Zm9udEZhbWlseTogXCJBbWl0YVwiXG5cdGZvbnRXZWlnaHQ6IDcwMFxuXHRzcmM6IFwiQW1pdGEtQm9sZC50dGZcIlxuXG5tb25vdG9uID1cblx0Zm9udEZhbWlseTogXCJNb25vdG9uXCJcblx0Zm9udFdlaWdodDogNTAwXG5cdHNyYzogXCJNb25vdG9uLVJlZ3VsYXIudHRmXCJcblxubG9hZExvY2FsRm9udHMoW2FtaXRhUmVndWxhciwgYW1pdGFCb2xkLCBtb25vdG9uXSlcblxuYGBgXG5cbiMjIExvY2FsIFBhdGhzXG5cbkJ5IGRlZmF1bHQsIHRoaXMgbW9kdWxlIHdpbGwgbG9vayBmb3IgZm9udHMgaW4gdGhlIHJvb3Qgb2YgeW91ciBwcm9qZWN0J3NcbmZvbGRlciAoaS5lLiBteVByb2plY3QuZnJhbWVyL01vbm90b24tUmVndWxhci50dGYpLiBJZiBJIHdhbnRlZCB0byBwdXQgdGhlXG5mb250IHNvbWV3aGVyZSBlbHNlLCBzdWNoIGFzIGEgZm9sZGVyIGNhbGxlZCBmb250cywgSSB3b3VsZCBpbmNsdWRlIHRoaXNcbmluIHRoZSBgc3JjYC5cblxuXG5gYGBjb2ZmZWVzY3JpcHRcblxubG9hZExvY2FsRm9udHNcblx0Zm9udEZhbWlseTogXCJNb25vdG9uXCJcblx0Zm9udFdlaWdodDogNTAwXG5cdHNyYzogXCJmb250cy9Nb25vdG9uLVJlZ3VsYXIudHRmXCJcblxuXG5gYGBcblxuIyBBYm91dCBcblxuVGV4dExheWVycyBhdXRvbWF0aWNhbGx5IHNldCB0aGVpciBzaXplIGJhc2VkIG9uIHRoZSB0ZXh0IHRoZXkgY29udGFpbi5cbklmIHlvdXIgVGV4dExheWVycyBnZXQgY3JlYXRlZCBiZWZvcmUgdGhlIGZvbnQgaXMgYWN0dWFsbHkgbG9hZGVkLCB0aGVuXG50aGV5J2xsIHNldCB0aGVpciBzaXplIGJhc2VkIG9uIHRoZSBzdGFuZGFyZCBkZXZpY2UgZm9udC4gVGhlbiwgYXMgdGhlXG5mb250IGFjdHVhbGx5IGxvYWRzLCB0aGUgdGV4dCBpbnNpZGUgb2YgdGhlIFRleHRMYXllciB3aWxsIGFkanVzdCB0byB0aGVcbmNvcnJlY3Qgc2l6ZSBhbmQgYXBwZWFyYW5jZSwgYnV0IHRoZSBUZXh0TGF5ZXIgd2lsbCByZW1haW4gYXQgdGhlIGZpcnN0IHNpemUuXG5cblxuXHQxLiBUaGUgVGV4dExheWVyIGluc3RhbmNlIGlzIGNyZWF0ZWQsIHNpemVkIHVzaW5nIHRoZSBzdGFuZGFyZCBzaXplLlxuXHQgX19fX19fX19fX19fX19cblx0WyBoZWxsbyB3b3JsZCEgXVxuXG5cblx0Mi4gVGhlIG5vbi1zdGFuZGFyZCBmb250IGxvYWRzLCBidXQgdGhlIFRleHRMYXllciBkb2Vzbid0IHVwZGF0ZS5cblx0IF9fX19fX19fX19fX19fXG5cdFsgaCBlIGwgbCBvICB3IF1vIHIgbCBkICFcblxuXG5JbiBhZGRpdGlvbiB0byBnaXZpbmcgYW4gZWFzeSB3YXkgdG8gbG9hZCBsb2NhbCBmb250cywgdGhpcyBtb2R1bGUgdGVzdHNcbnRvIHNlZSB3aGV0aGVyIGVhY2ggb2YgeW91ciBmb250cyBoYXZlIGxvYWRlZCwgdGhlbiByZXN0YXJ0cyB0aGUgcHJvdG90eXBlIFxub25jZSB0aGV5IGhhdmUgYWxsIGxvYWRlZC5cblxuIyMjXG5cblxuXG4jIExvYWQgTG9jYWwgRm9udHNcblxuXG5leHBvcnRzLmxvYWRMb2NhbEZvbnRzID0gKGZvbnRzKSAtPlxuXG5cdGlmIG5vdCBfLmlzQXJyYXkoZm9udHMpIHRoZW4gZm9udHMgPSBbZm9udHNdXG5cblx0RnJhbWVyLkRlZmF1bHRDb250ZXh0LnZpc2libGUgPSBmYWxzZVxuXHRcblx0IyAtLS0tLS0tLS0tLS0tLS0tXG5cdCMgQ1NTIEluc2VydFxuXHRcblx0Y3NzU3RyaW5nID0gXCJcIlxuXHRcblx0Zm9yIGZvbnQgaW4gZm9udHNcblx0XG5cdFx0Y3NzU3RyaW5nICs9IFwiXCJcIlxuXHRcdFx0QGZvbnQtZmFjZSB7XG5cdFx0XHRcdGZvbnQtZmFtaWx5OiAje2ZvbnQuZm9udEZhbWlseX07XG5cdFx0XHRcdGZvbnQtd2VpZ2h0OiAje2ZvbnQuZm9udFdlaWdodCA/IDQwMH07XG5cdFx0XHRcdGZvbnQtc3R5bGU6ICN7Zm9udC5mb250U3R5bGUgPyBcIm5vcm1hbFwifTtcblx0XHRcdFx0c3JjOiB1cmwoI3tmb250LnNyY30pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFwiXCJcIlxuXHRcdFx0XG5cdFV0aWxzLmluc2VydENTUyhjc3NTdHJpbmcpXG5cblx0bG9hZEZvbnRzKGZvbnRzKVxuXG5cbiMgTG9hZCBXZWIgRm9udHNcblxuZXhwb3J0cy5sb2FkV2ViRm9udHMgPSAoZm9udHMpIC0+XG5cblx0aWYgbm90IF8uaXNBcnJheShmb250cykgdGhlbiBmb250cyA9IFtmb250c11cblxuXHRGcmFtZXIuRGVmYXVsdENvbnRleHQudmlzaWJsZSA9IGZhbHNlXG5cdFxuXHQjIC0tLS0tLS0tLS0tLS0tLS1cblx0IyBDU1MgSW5zZXJ0XG5cdFxuXHRmb3IgZm9udCBpbiBmb250c1xuXHRcdFV0aWxzLmxvYWRXZWJGb250KGZvbnQuZm9udEZhbWlseSwgZm9udC5mb250V2VpZ2h0ID8gNDAwKVxuXG5cdGxvYWRGb250cyhmb250cylcblxuXG5sb2FkRm9udHMgPSAoZm9udHMpIC0+XG5cblx0IyAtLS0tLS0tLS0tLS0tLS0tXG5cdCMgVGVzdCBFbGVtZW50c1xuXG5cblx0dGVzdEJlZCA9IG5ldyBMYXllclxuXHRcblx0Y29udHJvbExheWVyID0gbmV3IFRleHRMYXllclxuXHRcdG5hbWU6IFwiQ29udHJvbCBUZXN0XCJcblx0XHRwYXJlbnQ6IHRlc3RCZWRcblx0XHR0ZXh0OiBcIkhlbGxvIHdvcmxkIVwiXG5cdFx0Zm9udEZhbWlseTogXCJ0aGlzSXNOb3RBRm9udFwiXG5cdFx0Zm9udFNpemU6IDEwMFxuXHRcblx0IyAtLS0tLS0tLS0tLS0tLS0tXG5cdCMgRnVuY3Rpb25zXG5cblx0IyBUZXN0IGZvciBmb250c1xuXG5cdHRlc3RzID0gW11cblxuXHR0ZXN0Rm9yRm9udHMgPSAtPlxuXHRcblx0XHQjIGNyZWF0ZSB0ZXN0IGRpdnNcblxuXHRcdGxheWVyPy5kZXN0cm95KCkgZm9yIGxheWVyIGluIHRlc3RzXG5cblx0XHR0ZXN0cyA9IGZvbnRzLm1hcCAoZikgLT5cblxuXHRcdFx0cmV0dXJuIG5ldyBUZXh0TGF5ZXJcblx0XHRcdFx0bmFtZTogXCJGb250IEZhbWlseSBUZXN0XCJcblx0XHRcdFx0cGFyZW50OiB0ZXN0QmVkXG5cdFx0XHRcdHRleHQ6IFwiSGVsbG8gd29ybGQhXCJcblx0XHRcdFx0Zm9udFNpemU6IDEwMFxuXHRcdFx0XHRmb250RmFtaWx5OiBmLmZvbnRGYW1pbHlcblx0XHRcblx0XHRyZXN1bHRzID0gdGVzdHMubWFwICh0ZXN0TGF5ZXIpIC0+XG5cdFx0XHRyZXR1cm4gdGVzdExheWVyLndpZHRoIGlzIGNvbnRyb2xMYXllci53aWR0aFxuXHRcdFxuXHRcdHJldHVybiAhXy5zb21lKHJlc3VsdHMpXG5cdFxuXHQjIExvb3AgdGhlIHRlc3QgdW50aWwgdGhlIGZvbnQgaXMgZm91bmRcblx0XG5cdGxvb3BGb3JGb250cyA9IChpKSAtPlxuXHRcdGlmIGkgPiAyMFxuXHRcdFx0dGhyb3cgXCJDb3VsZG4ndCBmaW5kIHRoYXQgZm9udC5cIlxuXHRcdFxuXHRcdGkrK1xuXHRcdGZvbnRzQXJlTG9hZGVkID0gdGVzdEZvckZvbnRzKClcblx0XHRcblx0XHRpZiBmb250c0FyZUxvYWRlZFxuXHRcdFx0Y29tcGxldGUodHJ1ZSlcblx0XHRcdHJldHVyblxuXHRcdFxuXHRcdFV0aWxzLmRlbGF5IC41LCAtPiBsb29wRm9yRm9udHMoaSlcblx0XG5cdCMgRmluaXNoIHVwIC0gY2xlYXIgZGl2cyBhbmQgcmVzdGFydCB0aGUgcHJvdG90eXBlIGlmIHdlIGxvb3BlZFxuXG5cdGNvbXBsZXRlID0gKHJlc2V0ID0gZmFsc2UpIC0+XG5cdFx0dGVzdEJlZC5kZXN0cm95KClcblxuXHRcdEZyYW1lci5EZWZhdWx0Q29udGV4dC52aXNpYmxlID0gdHJ1ZVxuXG5cdFx0aWYgcmVzZXRcblx0XHRcdFV0aWxzLmRlbGF5IC4wMSwgLT5cblx0XHRcdFx0RnJhbWVyLkN1cnJlbnRDb250ZXh0LnJlc2V0KClcblx0XHRcdFx0Q29mZmVlU2NyaXB0LmxvYWQoXCJhcHAuY29mZmVlXCIpXG5cdFx0XG5cdCMgLS0tLS0tLS0tLS0tLS0tLVxuXHQjIEtpY2tvZmZcblxuXHQjIEJlZm9yZSB0cnlpbmcgdG8gbG9vcCwgc2VlIGlmIHRoZSBmb250cyBhcmUgYWxyZWFkeSBsb2FkZWQuIElmXG5cdCMgdGhleSBhcmUsIGNsZWFuIHVwIGFuZCBkb24ndCBsb29wIGFnYWluOyBpZiBub3QsIHN0YXJ0IHRoZSBsb29wLlxuXHQjIFNpbmNlIHRoaXMgY29kZSB3aWxsIHJ1biBldmVuIGFmdGVyIG91ciBsb29wIGNvbXBsZXRlcywgd2Ugd2FudCBcblx0IyB0byBiZSBzdXJlIG5vdCB0byBnZXQgc3R1Y2sgaW4gYW4gZW5kbGVzcyByZWxvYWQgbG9vcC5cblxuXHRmb250c0FyZUxvYWRlZCA9IHRlc3RGb3JGb250cygpXG5cblx0aWYgZm9udHNBcmVMb2FkZWRcblx0XHRjb21wbGV0ZSgpXG5cdGVsc2Vcblx0XHRsb29wRm9yRm9udHMoMClcbiIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBRUFBOztBREFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBOztBQXFJQSxPQUFPLENBQUMsY0FBUixHQUF5QixTQUFDLEtBQUQ7QUFFeEIsTUFBQTtFQUFBLElBQUcsQ0FBSSxDQUFDLENBQUMsT0FBRixDQUFVLEtBQVYsQ0FBUDtJQUE2QixLQUFBLEdBQVEsQ0FBQyxLQUFELEVBQXJDOztFQUVBLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBdEIsR0FBZ0M7RUFLaEMsU0FBQSxHQUFZO0FBRVosT0FBQSx1Q0FBQTs7SUFFQyxTQUFBLElBQWEsOEJBQUEsR0FFSSxJQUFJLENBQUMsVUFGVCxHQUVvQixtQkFGcEIsR0FHRyx5Q0FBbUIsR0FBbkIsQ0FISCxHQUcwQixrQkFIMUIsR0FJRSwwQ0FBa0IsUUFBbEIsQ0FKRixHQUk2QixlQUo3QixHQUtBLElBQUksQ0FBQyxHQUxMLEdBS1M7QUFQdkI7RUFZQSxLQUFLLENBQUMsU0FBTixDQUFnQixTQUFoQjtTQUVBLFNBQUEsQ0FBVSxLQUFWO0FBekJ3Qjs7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
