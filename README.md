paintBoard.js
===========

A easy setup HTML5 canvas paint(pin) board 
* [See Demo Here](http://hsinpa.github.io/paintBoard.js/),

## Requirements
Jquery is required

## Installation
First, embedded the js, css and image file into html file.

Then to initiate function, call pinBoard() first, and put class="pinBoard" to target DOM element.

In addition, try to configure the size of pinBoard with css style and include the button image to folder.


```html
<head>
<link rel="stylesheet" href="stylesheets/pinBoard.min.css">
<style>
	.pinBoard {
		width: 400px;
		height: 350px;
	}
</style>
</head>
<body>
<div class="pinBoard"></div>

<script src="js/pinBoard.min.js"></script>

<script>
  pinBoard();
</script>
</body>
```
## License
[MIT licensed](LICENSE).

Free of Charge
