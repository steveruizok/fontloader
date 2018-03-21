fontloader = require 'fontloader'

# Load local fonts

amitaRegular =
	fontFamily: "Amita"
	fontWeight: 400
	src: "fonts/Amita-Regular.ttf"

amitaBold =
	fontFamily: "Amita"
	fontWeight: 700
	src: "fonts/Amita-Bold.ttf"

fontloader.loadLocalFonts([amitaRegular, amitaBold])

# Load Web Fonts

roboto0 =
	fontFamily: "Roboto"
	fontWeight: 500

roboto1 =
	fontFamily: "Roboto"
	fontWeight: 600

rokkitt =
	fontFamily: "Rokkitt"
	fontWeight: 500

fontloader.loadWebFonts([roboto0, roboto1, rokkitt])

# Examples

new TextLayer
	fontFamily: "Amita"
	fontWeight: 600
	x: 32
	y: 48
	text: "Fontloader"

new TextLayer
	fontFamily: "Roboto"
	x: 32
	y: 96
	fontSize: 18
	text: "A module by @steveruizok"

new TextLayer
	fontFamily: "Rokkitt"
	x: 32
	y: 160
	width: Screen.width - 96
	fontSize: 22
	text: "● Add custom fonts to Framer projects"

new TextLayer
	fontFamily: "Rokkitt"
	x: 32
	y: 220
	width: Screen.width - 96
	fontSize: 22
	text: "● Use your own local or web fonts"

new TextLayer
	fontFamily: "Rokkitt"
	x: 32
	y: 280
	width: Screen.width - 96
	fontSize: 22
	text: "● Works in Framer Studio, on devices and in Framer Cloud"

new TextLayer
	fontFamily: "Roboto"
	x: 32
	y: Align.bottom(-48)
	fontSize: 18
	text: "github.com/steveruizok/fontloader"