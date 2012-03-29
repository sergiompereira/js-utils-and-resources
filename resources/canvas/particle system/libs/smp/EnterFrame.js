(function(){
	
	smp.namespace("smp.utils.EnterFrame");
	
	//constructor (instance creation)
	smp.utils.EnterFrame = (function(){
		
		if(!smp.utils.EventDispatcher) {
			smp.log('EnterFrame -> EventDispatcher needed.');
			return false;
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
		
		var eventDispatcher = new smp.utils.EventDispatcher();
		smp.utils.EventDispatcher.events.ENTER_FRAME = "ENTER_FRAME";
		
		//start main loop
		(function animloop(time){
			requestAnimationFrame(animloop, document);
			eventDispatcher.dispatchEvent(smp.utils.EventDispatcher.events.ENTER_FRAME);
		  }());
		
		return {
			addEventListener:eventDispatcher.addEventListener,
			removeEventListener:eventDispatcher.removeEventListener
		};
	
	}());
	
}());