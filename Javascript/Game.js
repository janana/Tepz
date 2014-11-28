// jQuerys window.onload

$(function() {
	// Initiera poängen och highscore
	$("#score").html("0");
	$("#highscore").html(Game.getHighscore());
	
	// Initiera knapparna med bekräftelse-rutor
	$("#newDialog").dialog({
		autoOpen: false,
		modal: true,
		resizable: false,
		title: "Börja om",
		buttons: [
			{
				text: "Ja",
				click: function() {
					document.location.reload(true);
				}
			},
			{
				text: "Nej",
				click: function() {
					// Stäng dialogen
					$(this).dialog("close");
				}
			}
		]
	});
	$("#cheatDialog").dialog({
		autoOpen: false,
		modal: true,
		resizable: false,
		title: "Fuska",
		buttons: [
			{
				text: "Ja",
				click: function() {
					// Ta bort aktuellt block
					$(".block").remove();
					
					// Skapa nytt block med parameter för att ej skapa randomnr (=enkel kvadrat)
					Block.Create(true);
					
					// Dra poäng från användaren
					var currentScore = +$("#score").text();
					currentScore -= 100;
					$("#score").text(currentScore);
					
					// Stäng dialogen
					$(this).dialog("close");
				}
			},
			{
				text: "Nej",
				click: function() {
					// Stäng dialogen
					$(this).dialog("close");
				}
			}
		]
	});
	$("#highscoreDialog").dialog({
		autoOpen: false,
		modal: true,
		resizeable: false,
		title: "Highscore",
		buttons: [
			{
				text: "Stäng",
				click: function() {
					// Stäng dialogen
					$(this).dialog("close");
				}
			}
		]
	});
	
	$("#NewButton").click(function() {
		// Låt användaren bekräfta nytt spel
		$("#newDialog").dialog("open");
	});
	
	$("#CheatButton").click(function() {
		// Låt användaren bekräfta fuskning
		$("#cheatDialog").dialog("open");
	});
	
	// Fixa hover-jquery-klass på knapparna
	$("#buttons input").hover(
		function() {
			$(this).addClass("ui-state-hover");
		},
		function() {
			$(this).removeClass("ui-state-hover");
		}
	);
	
	// Funktion för att kunna gömma instruktionerna
	$("#instructions h2").click(function() {
		$("#hideable").toggleClass("hide");
		$("#instructions h2").toggleClass("padding");
	})
	
	// Funktion för att kunna byta tema
	var themes = [{"name":"Original", "board": "", "block": "", "gameColor": "", "containerColor": ""}, {"name":"Grayscale", "board": "square-dark-gray.jpg", "block": "square-gray.jpg", "gameColor": "#cfcfcf", "containerColor": "#8e8d8d"}, {"name":"3D", "board": "square-pink1.jpg", "block": "square-yellow2.jpg", "gameColor": "", "containerColor": ""}];
	for (var a = 0; a < themes.length; a++) {
		$("#themes").append("<a href='#' class='theme'>"+themes[a].name+"</a><br/>");
	}
	$(".theme").click(function(e) {
		// Byt tema
		// .visible 
		// .dropped 
		// #gameboard
		// #container
		var theme = "";
		for (var b = 0; b < themes.length; b++) {
			if (e.target.innerText == themes[b].name) {
				theme = themes[b];
			}
		}
		$("style").remove();
		if (theme != "" && theme.name != "Original") {
			$("<style>.dropped {background: url(css/pics/"+theme.board+") no-repeat;} .visible {background: url(css/pics/"+theme.block+") no-repeat;} #gameboard {background: "+theme.gameColor+";} #container {background: "+theme.containerColor+";}</style>").appendTo("head");
		}
		e.preventDefault();
	});
	
	
	// Starta spelet
	Game.init();
	
});

var Game = {
	testHighscoreAlert: true,
	init: function() {
		// Skapar rutmönster på spelplanen och gör den droppable
		for (var y = 0; y < 12; y++) {
			for (var x = 0; x < 9; x++) {
				$("#game").append($("<div/>", {
					"class": "empty board_"+ y +"_"+ x
				}).droppable({
					// Väljer att droppa i rutan muspekaren är över
					tolerance: "pointer",
					// Lägger inte till någon jquery-class, bättre för prestandan
					addClasses: false,
					// Funktion för vad som sker när något blir dropped
					drop: function(event, ui) {
						
						// Ta ut koordinaterna från kvadraternas klasser - kvadraten som droppas och kvadraten som blir droppad på
						var coordRegex = /\d+\_\d+/;
						
						var boardCoordinates = event.target.className.match(coordRegex);
						boardCoordinates = boardCoordinates[0].split("_");
						
						var blockCoordinates = Block.Target.className.match(coordRegex);
						blockCoordinates = blockCoordinates[0].split("_");
						
						// Spara undan referens till blockets översta ruta (koordinat 0_0), vilken koordinat den rutan har på spelplanen efter drop
						var firstSquare = [
							boardCoordinates[0]-blockCoordinates[0],
							boardCoordinates[1]-blockCoordinates[1]
						];
						
						// Referens till det aktuella blockets form
						var currentBlock = Shapes[Block.randomNr];
	
						// Testa om rutan är något utanför spelplanen - isf avbryt
						if (firstSquare[0] < 0 || firstSquare[1] < 0) {
							return false;
						}
						else if (firstSquare[1] > 5 && currentBlock[0][3] == true ||
							firstSquare[0] > 8 && currentBlock[3][0] == true) {
								
							 return false;
						}
						else if (currentBlock[0][2] == true && Block.randomNr != 2 && firstSquare[0] > 10 
							|| currentBlock[0][2] == true && Block.randomNr != 2 && firstSquare[1] > 6) {
								
							return false;
						}
						else if (currentBlock[1][2] == true && firstSquare[0] > 10 ||
							 currentBlock[1][2] == true && firstSquare[1] > 6) {
							 	
							return false;
						}
						else if (Block.randomNr == 5 && firstSquare[0] > 10 || 
							Block.randomNr == 5 && firstSquare[1] > 7) {
								
							return false;
						}
						else if (currentBlock[2][1] == true && Block.randomNr != 1 && firstSquare[0] > 9 ||
							currentBlock[2][1] == true && Block.randomNr != 1 && firstSquare[1] > 7 ||
							currentBlock[2][0] == true && Block.randomNr != 1 && firstSquare[0] > 9 ||
							currentBlock[2][0] == true && Block.randomNr != 1 && firstSquare[1] > 7) {
								
							return false;
						}
						
						// Testa så rutorna inte är fyllda än - isf avbryt
						for (var j = 0; j < 4; j++) {
							for (var k = 0; k < 4; k++) {
								if (currentBlock[j][k] == true) {
									if (Board[firstSquare[0]+j][firstSquare[1]+k] == true) {
										return false;
									}
								}
							}
						}
						
						// Sätt klass och ändra referenserna i Board för aktuella kvadrater
						for (var l = 0; l < 4; l++) {
							for (var m = 0; m < 4; m++) {
								if (currentBlock[l][m] == true) {
									Board[firstSquare[0] + l][firstSquare[1] + m] = true;
									var bClass = ".board_" + (firstSquare[0]+l) + "_" + (firstSquare[1]+m);
									$(bClass).addClass("dropped");
								}
							}
						}
						
						// Testa om det finns fulla rader - isf lägg till en referens till den
						var fullRows = [];
						function isFull(element, index, array) {
							return (element === true);
						}
							
						// Testa horisontella rader
						for (var r = 0; r < 12; r++) {
							var full = Board[r].every(isFull);
							if (full) {
								fullRows.push("y_"+r);
							}
						}
						
						// Testa vertikala rader
						for (var column = 0; column < 9; column++) {
							for (var row = 0; row < 12; row++) {
								
								if (!Board[row][column]) {
									break;
								}
								
								if (row === 11 && Board[row][column]) {
									fullRows.push("x_"+column);
								}
							}
						}
						
						// Ta bort raderna och återställ referenserna till dem, om några fulla rader har registrerats
						if (fullRows.length) {
							// Gör raderna class=empty och referenserna i arrayen false
							// Plussa poängen med antalet rutor
							var nrRegex = /\d+/;
							
							// Referens till aktuella poängen innan drop
							var score = +$("#score").text();
							
							for (var n = 0; n < fullRows.length; n++) {
								if (fullRows[n].match(/y/) == "y") {
									// Få fram endast koordinaten
									var yCoordinate = fullRows[n].match(nrRegex);
									for (var o = 0; o < 9; o++) {
										var yClass = ".board_" + yCoordinate + "_" + o;
										$(yClass).removeClass("dropped");
										
										Board[yCoordinate][o] = false;
										
										// Lägg till poäng
										score += 1;
									}
								}
								else {
									var xCoordinate = fullRows[n].match(nrRegex);
									for (var p = 0; p < 12; p++) {
										var xClass = ".board_" + p + "_" + xCoordinate;
										$(xClass).removeClass("dropped", 700);
										
										Board[p][xCoordinate] = false;
										
										// Lägg till poäng
										score += 1;
									}
								}
							}
							
							// Visa poängen för användaren
							$("#score").text(score);
							
							// Testa om poängen är högre än highscore - isf sätt nytt highscore
							
							if (score > $("#highscore").text()) {
								$("#highscore").text(score);
								Game.setHighscore(score);
								
								// Testa om det är första gången highscore slås i spelet - isf meddela användaren
								if (Game.testHighscoreAlert) {
									$("#highscoreDialog").dialog("open");
									Game.testHighscoreAlert = false;
								}
							}
						}
						
						// Ta bort själva blocket med fade-effekt och timeout för att ge den tid att exekveras
						$(".block").effect("fade");
						window.setTimeout(function() {
							$(".block").remove();
							
							// Initiera ett nytt block
							Block.Create();
						}, 300);
					}
				}));
			}
		}
		// Initierar spelet med att skapa ett block
		Block.Create();
	},
	setHighscore: function (score) {
		// Räkna ut datum 30 dagar från nu - när cookien kommer förstöras
		var expireDate = new Date();
		expireDate.setTime(expireDate.getTime()+(30*24*60*60*1000));
		expireDate = expireDate.toUTCString();
		
		document.cookie = "highscore="+ score +"; expires="+ expireDate +"; path=/";
	},
	getHighscore: function() {
		var highscore = 0;
		if (document.cookie) {
			var cookies = document.cookie.split(";");
			var cookie = "";
			for (var i = 0; i < cookies.length; i++) {
				// Tar bort eventuella mellanslag
				cookies[i] = cookies[i].trimLeft(); 
				
				if (cookies[i].match(/highscore/)) {
					cookie = cookies[i];
				}
			}
			// Sätter highscore-cookies värde - från 10 tecken in i strängen
			highscore = cookie.substring(10);
		}
		return highscore;
	}
};

