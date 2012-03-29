(function(){
	
	EnterFrame = (function(){
		
		if(!(!!document.createElement('canvas').getContext))
		{
			alert("O seu browser parece não suportar o elemento Canvas.");
			return;
		}
		
		//to render only when the browser actualy will redraw the screen
		window.requestAnimationFrame = (function(){
					//use the available function 
					//or defaults to the traditional (non performant) setTimeout function
			      return  window.requestAnimationFrame       || 
			              window.webkitRequestAnimationFrame || 
			              window.mozRequestAnimationFrame    || 
			              window.oRequestAnimationFrame      || 
			              window.msRequestAnimationFrame     || 
			              function(/* function */ callback, /* DOMElement */ element){
						  	//sets to about 16 fps
			                window.setTimeout(callback, 1000 / 33);
			              };
			    })();
		
		var eventDispatcher = new EventDispatcher();
		
		//start main loop
		(function animloop(time){
			requestAnimationFrame(animloop, document);
			eventDispatcher.dispatchEvent(EventDispatcher.events.ENTER_FRAME);
		  }());
		
		return {
			addEventListener:eventDispatcher.addEventListener,
			removeEventListener:eventDispatcher.removeEventListener
		};
	
	}());
	
}());