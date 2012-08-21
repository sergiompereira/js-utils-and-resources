(function(){

	/*
	Dependencies:
	smp.math.ColorUtils
	*/
	
	smp.createNamespace("smp.animation.ColorEffects");
	
	//constructor (instance creation)
	smp.animation.ColorEffects = (function()
	{
		var Constructor;
		
		
		Constructor = function()
		{
			/**
			* @param	initcolor	: String	the initial hexadecimal color
			* @param	endcolor	: String	the final hexadecimal color
			* @param	coeff		: Number	the ease of change (reference value would be 5)
			* @param 	callback	: Function	the function to call on each iteration.
			* @example:
			<pre>
				var box = document.getElementById("box");
				var eff = new smp.animation.ColorEffects();
				eff.crossColors("#993300","#0066dd", 12, onColorUpdate);
				
				function onColorUpdate(color){
					box.style.backgroundColor = "#"+color.r+color.g+color.b;
				}
			</pre>
			*/
			function _crossColors(initcolor, endcolor, coeff, callback) {
		
				var initHexParts = smp.math.ColorUtils.serializeColor(initcolor,10);
				var endHexParts = smp.math.ColorUtils.serializeColor(endcolor,10);
				var tempColor = {r:initHexParts.r, g:initHexParts.g, b:initHexParts.b};
				var tempHexColor = {};
				
				var timer = setInterval(updateColor, 200);
			
				
				function updateColor() {	
				
					if(Math.abs(tempColor.r-endHexParts.r)>=1 || Math.abs(tempColor.g-endHexParts.g)>=1 || Math.abs(tempColor.b-endHexParts.b)>=1){
					
						tempColor.r = tempColor.r + getNewValue(tempColor.r, endHexParts.r);
						tempColor.g = tempColor.g + getNewValue(tempColor.g, endHexParts.g);
						tempColor.b = tempColor.b + getNewValue(tempColor.b, endHexParts.b);
						if(tempColor.r > 255) tempColor.r = 255;
						if(tempColor.g > 255) tempColor.g = 255;
						if(tempColor.b > 255) tempColor.b = 255;
						if(tempColor.r < 0) tempColor.r = 0;
						if(tempColor.g < 0) tempColor.g = 0;
						if(tempColor.b < 0) tempColor.b = 0;
						
						tempHexColor.r = smp.math.ColorUtils.normalizeHexaValues(Math.round(tempColor.r).toString(16),2);
						tempHexColor.g = smp.math.ColorUtils.normalizeHexaValues(Math.round(tempColor.g).toString(16),2);
						tempHexColor.b = smp.math.ColorUtils.normalizeHexaValues(Math.round(tempColor.b).toString(16),2);
						
						callback(tempHexColor);
					
					}else {
						clearInterval(timer);
					}
					
					
				}
				
				function getNewValue(orig, dest) {
					
					return (dest - orig) / coeff;
					
				}
				
				
			}
			
			
			this.crossColors =  _crossColors;
		}
		
		Constructor.prototype = {
			//public properties
			version:"1.0"
			
			//public methods
			
		};
		
		return Constructor;
		
	}());
	

	
}());