pinBoard.js
===========

A easy setup HTML5 canvas pin(drawing) board 


## Requirements
Jquery is required

## Installation
First, embedded the js and css fil into html file.
Then initiate function pinBoard with target DOM element as parameter, and it can be anyname.
In addition, try to configure the size of pinBoard with css style.


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
  pinBoard('.pinBoard');
</script>
</body>
```
