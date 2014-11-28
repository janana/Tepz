var Block = {
	Create: function(nr) {
		Block.randomNr = 0;
		
		// Event för att spara undan referens till den aktuella kvadraten i figuren vid klick på den
		document.addEventListener("mousedown", clickFunction, false);
		function clickFunction(e) {
			if (e.target.classList.contains("square")) {
				// Variabel för att komma åt den även vid drop på spelplanen
				Block.Target = e.target;
			}
		}
		// Skapa randomNr om inte parameter skickats med
		if (!nr) {
			//Genererat nr som beslutar formen på blocket
			Block.randomNr = this.Random();
		}
		
		// Skapa referens till blockets form i form-arrayen
		var shape = Shapes[Block.randomNr];
		
		// Skapa div som håller ihop blocket, och som är draggable
		var $blockDiv = $("<div/>", {
			"class": "block"
		}).draggable({
			containment: "#gameboard",
			start: function(event, ui) {
				// Testa så klicket kommer från en synlig kvadrat - annars dra inte
				if (!Block.Target.classList.contains("visible")) {
					event.preventDefault();
				}
			}
		});
		
		// Loopar och skapar fyra kvadrater (div), sätter klass och lägger till dem i block-diven
		for (var x = 0; x < 4; x++) {
			for (var y = 0; y < 4; y++) {
				var classes = "block_"+ x +"_"+ y +" square";
				if (shape[x][y] === true){
					classes += " visible";
				}
					
				$blockDiv.append($("<div/>", {
					"class": classes
				}));
			}
			$blockDiv.append($("<br/>"));
		}
		
		$("#sideboard").append($blockDiv);
	},
	Random: function() {
		// Returnerar ett tal mellan ett och 19
		var randomNr = Math.floor(Math.random() * 19) + 1; 
		return randomNr;
	}
}