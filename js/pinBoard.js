var pinBoard = (function($) {
	var pinBoardCover,
		canvas,
		context,
		height,
		width,
		pinPos=[],
		pencilPos=[],

		//Default pencil size
		pencilSize = 1,
		//Default Color
		color = "#2ecc71",
		//Default function (change between pin or pencil)
		functionality = "pencil",
		//Dynamic Color Panel (From Flat UI Color)
		optionColor = ["#2ecc71", "#27ae60", "#3498db", "#2980b9", "#9b59b6", "#8e44ad", "#f1c40f", "#f39c12", "#e67e22", "#d35400",
				"#e74c3c", "#c0392b", "#34495e", "#ecf0f1", "#bdc3c7", "#95a5a6", "#7f8c8d"];

	/*Prepare Stage
	** Build the infrastructure
	*/

	var Environment = {
		colorOptions : function() {
			var optionTemplate = "";
				for (var i = 0; i < optionColor.length; i++) {
					optionTemplate += '<li value="'+optionColor[i]+'" style="background-color:'+optionColor[i]+';">&nbsp;</li>';
				}
			return optionTemplate;
		},
		toolTemplate : function() {
			var content = "";
				content +='<div>'+
					'<button functionality="pin"></button>'+
					'<button functionality="pencil"></button>'+
					'<button functionality="backward"></button>'+
					'<button functionality="trashcan"></button>'+
					'<button functionality="download"></button>'+
					'<button functionality="upload"></button>'+
					'<input type="file">'+
					'<input type="range" min="1" max="10" value="1" />'+
					'<ul class="pinBoard-color">';

				content += this.colorOptions();

				content+='</ul></div>';
				return content;
		},

		canvasTemplate : function() {
			return '<canvas width="'+width+'" height="'+height+'"></canvas>';
		},

		//Create Pinboard Canvas
		buildCanvas : function() {

			pinBoardCover.append(this.toolTemplate());
			pinBoardCover.append(this.canvasTemplate());

		    canvas = pinBoardCover.find("canvas");
		    context = canvas[0].getContext('2d');
		}
	};


	/*Utitliy Function
	*/
	function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }

    /* =========================    User Interaction (Events) =================================*/
	function Init() {
		    //Pick Functionality
		    pinBoardCover.on("click", "button", function () {
		    	switch($(this).attr("functionality")) {
		    		case "backward":
		    			Tools.backward();
		    		break;

		    		case "trashcan":
		    			Tools.trashcan();
		    		break;

		    		case "download":
		    			Tools.download();
		    		break;

		    		case "upload":
		    			$('input[type=file]').trigger('click');
		    		break;

		    		default:
		    		functionality = $(this).attr("functionality");
		    	}
		    });

		    //Handle image Upload
		    pinBoardCover.on("change", "input[type=file]", function () {
		    		Tools.upload(this.files[0]);
		    });

		    //Select Pencil Size
		    pinBoardCover.on("mouseup", "input[type=range]", function () {
		    	pencilSize = $(this).val();
		    });

			//Pick Color
			pinBoardCover.on("click", ".pinBoard-color li", function () {
				color = $(this).attr("value");
				$(".pinBoard-color li").css("border", "none");
				$(this).css("border-right", "5px solid black");
		    });

		    //CORE FUNCTION
			pinBoardCover.on("mousedown", "canvas",function (evt) {
				var mousePos = getMousePos(this, evt);

				switch(functionality) {
					case 'pin' :
					    //Pin Something
					    Tools.createPin(mousePos.x, mousePos.y, color);
						pinPos.push({ 'x' : mousePos.x, 'y': mousePos.y, 'color': color});
					break;

					case 'pencil' :
						//Set pos to tempPencilPos and push it topencilpos when mouseUp
							isDown = true;
							context.lineWidth = pencilSize;
							context.lineCap = 'round';
							context.beginPath();
							context.moveTo(mousePos.x-0.01, mousePos.y-0.01);
							context.lineTo(mousePos.x , mousePos.y );
							context.strokeStyle = color;
							context.stroke();
					    	pencilPos.push([{ 'x' : mousePos.x, 'y': mousePos.y, 'color': color, "lineWidth" : pencilSize}]);

						pinBoardCover.on("mousemove", "canvas",function (evt) {
							if (isDown) {
								var lastIndex = pencilPos.length -1;
						    	mousePos = getMousePos(this, evt);
								context.lineTo(mousePos.x, mousePos.y);
								context.strokeStyle = color;
								context.stroke();
						    	pencilPos[lastIndex].push({ 'x' : mousePos.x, 'y': mousePos.y});
						    }
						});

					    $(document).on("mouseup",function () {
							isDown = false;
							context.closePath();
					   	});
					break;
				}
			});
		}
	
	//END OF User Interactions

	var Tools = {
		createPin : function (x, y, color) {
		    context.save();
		    context.translate(x,y);

		    context.beginPath();
		    context.moveTo(0,0);
		    context.bezierCurveTo(2,-10,-20,-25,0,-30);
		    context.bezierCurveTo(20,-25,-2,-10,0,0);

		    context.fillStyle=color;
		    context.fill();
		    context.strokeStyle="black";
		    context.lineWidth=0.5;
		    context.stroke();

		    context.beginPath();
		    context.arc(0,-21,3,0,Math.PI*2);
		    context.closePath();
		    context.fillStyle="black";
		    context.fill();

		   	context.restore();
	    },
	    createPencil : function (line) {
	    	var linePoints = line.length;

			context.lineCap = 'round';
			context.lineWidth = line[0].lineWidth;
	    	context.beginPath();
	    	context.moveTo(line[0].x, line[0].y);
		    	for (var j = 1; j < linePoints; j++) {
					context.lineTo(line[j].x, line[j].y);
				}
			//context.closePath();
			context.strokeStyle = line[0].color;
			context.stroke();
	    },

	    reDraw : function () {
			context.clearRect ( 0 , 0 , width , height);

		  	var pinCounts = pinPos.length,
		  		pencilTraceCounts = pencilPos.length;
		  	//Pin
			for (var i = 0; i < pinCounts; i++) {
				this.createPin( pinPos[i].x, pinPos[i].y, pinPos[i].color );
			}

			//Pencil
			for (var i = 0; i < pencilTraceCounts; i++) {
				this.createPencil(pencilPos[i]);
			}
		},
		//BACKWARD FUNCTION - clear the last step of current function
		backward : function() {
			if (functionality === 'pin') {
				pinPos.pop();
				this.reDraw();
			} else {
				pencilPos.pop();
				this.reDraw();
			}
		},
		//Clear Canvas and array
		trashcan : function() {
			context.clearRect ( 0 , 0 , width , height);
			pinPos = [];
			pencilPos = [];
		},
		//Redirect to new page with image info
		download : function() {
			window.location = canvas[0].toDataURL("image/png");
		},

		upload : function(file) {
			var reader = new FileReader(),
    			image  = new Image();

    			reader.readAsDataURL(file);
    		reader.onload = function(_file) {
    			image.src = _file.target.result;
    			image.onload = function() {
     			   context.drawImage(image, 0, 0, width, height);
   			   };
			}
		}
	}//END OF BACKWARD FUNCTION


	return function () {
			pinBoardCover = $(".pinBoard");
			if (pinBoardCover && pinBoardCover.length != 0) {
				height = pinBoardCover.height();
				width = pinBoardCover.width();
				pinBoardCover.css("height", height);

				//Additional 45px for colorpanel
				pinBoardCover.css("width", width+45);
				Environment.buildCanvas();
				Init();
		}
	}

})(jQuery);
