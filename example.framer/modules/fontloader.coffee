###

Fontloader
@steveruizok


# Introduction

Using non-standard fonts can create big headaches for your Framer projects. This
module ensures that all of your local or web fonts are correctly loaded before 
your code runs.


# Installation

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


# Usage

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

# About 

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

###



# Load Local Fonts


exports.loadLocalFonts = (fonts) ->

	if not _.isArray(fonts) then fonts = [fonts]

	Framer.DefaultContext.visible = false
	
	# ----------------
	# CSS Insert
	
	cssString = ""
	
	for font in fonts
	
		cssString += """
			@font-face {
				font-family: #{font.fontFamily};
				font-weight: #{font.fontWeight ? 400};
				font-style: #{font.fontStyle ? "normal"};
				src: url(#{font.src});
				}

			"""
			
	Utils.insertCSS(cssString)

	loadFonts(fonts)


# Load Web Fonts

exports.loadWebFonts = (fonts) ->

	if not _.isArray(fonts) then fonts = [fonts]

	Framer.DefaultContext.visible = false
	
	# ----------------
	# CSS Insert
	
	for font in fonts
		Utils.loadWebFont(font.fontFamily, font.fontWeight ? 400)

	loadFonts(fonts)



loadFonts = (fonts) ->

	# ----------------
	# Test Elements


	testBed = document.createElement "div"

	_.assign testBed.style,
		position: "absolute"
		fontFamily: "nonsense"
		padding: 0
		opacity: 0

	document.body.appendChild(testBed)


	controlSpan = document.createElement "span"

	_.assign controlSpan.style,	
		position: "absolute"
		fontSize: "200px"	
		top: 0
		left: 0

	controlSpan.textContent = "Hello world!"

	testBed.appendChild(controlSpan)	


	tests = fonts.map (f, i) ->

		testSpan = document.createElement "span"

		testSpan.textContent = "Hello world!"

		_.assign testSpan.style,
			fontFamily: f.fontFamily
			position: "absolute"
			fontSize: "200px"
			top: (100 * i) + "px"
			left: 0

		testBed.appendChild(testSpan)

		return testSpan

	
	# ----------------
	# Functions


	# Test for fonts

	testForFonts = ->
	
		results = tests.map (testSpan) ->
			return testSpan.clientWidth isnt controlSpan.clientWidth

		for result in results
			unless result
				return false

		return true
	

	# Loop the test until the font is found
	
	loopForFonts = (i) ->
		if i > 20
			throw "Couldn't find that font."
		
		i++
		fontsAreLoaded = testForFonts()
		
		if fontsAreLoaded
			complete(true)
			return
		
		Utils.delay .5, -> loopForFonts(i)
	

	# Finish up - clear divs and restart the prototype if we looped

	complete = (reset = false) ->
		document.body.removeChild(testBed)

		Framer.DefaultContext.visible = true

		if reset
			Utils.delay .01, ->
				Framer.CurrentContext.reset()
				CoffeeScript.load("app.coffee")
		
	
	# ----------------
	# Kickoff

	# Before trying to loop, see if the fonts are already loaded. If
	# they are, clean up and don't loop again; if not, start the loop.
	# Since this code will run even after our loop completes, we want 
	# to be sure not to get stuck in an endless reload loop.


	

	fontsAreLoaded = testForFonts()

	if fontsAreLoaded
		complete()
	else
		loopForFonts(0)
