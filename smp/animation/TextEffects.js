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

		var d = document;
		var Constructor;
		var callsColl = [];
		
		Constructor = function()
		{
		
		}
		
		//remove current animations
		function clearEffects(target) 
		{
			var i,j,exists = false;
			for (i = 0; i < callsColl.length; i++) {
				if (callsColl[i].target == target) 
				{
					for(j=0; j<callsColl[i].timers.length; j++){
						clearInterval(callsColl[i].timers[j]);
					}
					
					callsColl.splice(i, 1);
					
					exists = true;
					return exists;
				}
			}
			return exists;
		}
		//helpers
		function isWhitespace( ch ) {
			return ch == '\r' || 
					ch == '\n' ||
					ch == '\f' || 
					ch == '\t' ||
					ch == ' '; 
		}
		
		/**
		 * @param	element
		 * @param	text
		 * @param	numberChar
		 * @param	duration : in miliseconds
		 */
		Constructor.prototype.flowText = function(element, text, numberChar, duration) {
				
			element.innerHTML = text;
			
			var totalChar = text.length;
			var posChar = 0;
			var textProg = "";
			var interval = duration / (totalChar / numberChar);

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
		
	
		Constructor.prototype.flowSentences = function(element, text, maxSentenceLength, numberCharactersIncrement, duration, nextLineDelay ) {
		
			clearEffects(element);
			element.innerHTML = "";
			
			var interval = duration / (maxSentenceLength / numberCharactersIncrement);
			
	
			var i = 0,j,sentences = [],textProg = [],txtFields=[];
			
			//constrói as linhas, garantindo que a quebra é feita num espaço branco:
			while (i < text.length) {
				
				var sentence = text.substr(i, maxSentenceLength);
				var breakposn = sentence.search("\\n");
				var breakposbr = sentence.search("<br/>");
				var breakposbr2 = sentence.search("<br>");
				
				if (breakposbr >= 0) 
				{
					sentence = sentence.substr(0, breakposbr - 1);
					sentences.push(sentence);
					i += sentence.length + 5;
				}else
				if (breakposbr2 >= 0) 
				{
					sentence = sentence.substr(0, breakposbr2 - 1);
					sentences.push(sentence);
					i += sentence.length + 6;
				}else
				if (breakposn >= 0) 
				{
					sentence = sentence.substr(0, breakposn - 1);
					sentences.push(sentence);
					i += sentence.length + 2;
					
				}else
				if (sentence.length >= maxSentenceLength)
				{
					j = sentence.length - 1;
					
					while (!isWhitespace(sentence.charAt(j))) 
					{
						if (j > 0) {
							j--;
						}else {
							break;
						}
					}
					
					sentence = sentence.substr(0, j);
					sentences.push(sentence);
					i += (j + 1);
				}
				else
				{
					sentences.push(sentence);
					i = text.length;
				}

			}
			
			var posChars = [];
			
			for (i = 0; i < sentences.length; i++) 
			{
				var txtField = d.createElement('span');
				txtField.style.display = 'block';
				
				element.appendChild(txtField);
				txtFields.push(txtField);
				textProg[i] = "";
				posChars.push(0);
				
			}
			
			var looplength = 1;
			var timer = setInterval(incrementText, interval);
		
			var timerdelay = null;
			if(nextLineDelay != undefined && nextLineDelay > 0){
				timerdelay = setInterval(incrementLoopLength,nextLineDelay);
			}else{
				looplength = txtFields.length;
			}
			
			callsColl.push({target:element, timers:[timer,timerdelay]});
			
			var n;
			function incrementText() {
				
				for (i = 0; i < looplength; i++) {
					
					if (posChars[i]<=maxSentenceLength) {
						for (n=posChars[i]; n<=posChars[i]+numberCharactersIncrement; n++) {
							textProg[i] += sentences[i].charAt(n);
						}
						txtFields[i].innerHTML = textProg[i];
						posChars[i] += numberCharactersIncrement + 1;
					} 
				}
				
				if (posChars[looplength - 1] > maxSentenceLength) {
					clearInterval(timer);
					
					clearEffects(element);
				}
				
			}
			
			function incrementLoopLength() {
				if (looplength < txtFields.length) {
					looplength++;
				}else {
					if(timerdelay) clearInterval(timerdelay);
				}
			}
			
		}
		
		return Constructor;
		
	}());
	

}());
    