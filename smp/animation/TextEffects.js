/**
 * namespace pattern
 * @class TextEffects
 * @namespace smp.animation
 */

(function(){
	
	smp.namespace("smp.animation.TextEffects");
	
	//constructor (instance creation)
	smp.animation.TextEffects = (function()
	{
		var _value;
		var Constructor;
		
		
		Constructor = function()
		{
		
		}
		
		Constructor.prototype = {
			//public properties
			value:_value,
			version:"1.0"
			
			//public methods
			
		};
		
		return Constructor;
		
	}());
	
	//static methods
	
	smp.animation.TextEffects.flowText = function(element, text, numberChar, miliseconds) {
			
		element.innerHTML = text;
		
		var totalChar = text.length;
		var posChar = 0;
		var textProg = "";
		var interval = miliseconds / (totalChar / numberChar);

		var timer = setInterval(incrementText, interval);
		
		//_calls.push({target:textField, timer:timer});
		
		
		function incrementText() {

			var n;
			if (posChar <= totalChar) {
								
				for (n = posChar; n <= posChar + numberChar; n++) {
					textProg += text.charAt(n);
				}
				
				element.innerHTML = textProg;

			} else {
				clearInterval(timer);
				
				//clearCall(textField, timer);
				
			}
			posChar += numberChar+1;
		}
	}

}());
    