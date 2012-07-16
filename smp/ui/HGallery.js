
/** jQuery dependency */

(function(jq){
	
	smp.namespace("smp.ui.HGallery");
	
	/**
		Advisable structure:
		<viewport>
			<container>
				<slide> ...
			</container>
		</viewport>
	*/
	//constructor (instance creation)
	smp.ui.HGallery = (function()
	{
		
		var Constructor;
		
		/**
		 * gallery is the container
		 * easing is a function
		 */
		Constructor = function(gallery,easing,duration)
		{
			var d = document;
			
			if(easing == undefined) easing = 'linear';
			if(duration == undefined) duration = 500;
			
			var	container = jq(gallery);
			var state = 0;
			container.parent().css('overflow','hidden');
			var slides = container.children();

			var count = slides.length;
			var span = slides.eq(0).outerWidth(true);
			//console.log(span)
			//var span = slideWidth;
			var width = count*span;
			var i,cell,cellcol = [];
			for(i=0;i<slides.length; i++){
				slides.eq(i).css('float' , 'left');
			}
			container.css('width' , width+'px');
			var cleardiv = d.createElement('div');
			container.append(jq(cleardiv).css('clear','both'));
		
		
			this.prev = function(){
				if(state>0){
					state--;
					updateGallery();
				}
			}
			this.next = function(){
				if(state<count-1){
					state++;
					updateGallery();
				}
			}
			this.goto = function(id){
				if(id < count && id >= 0){
					state = id;
					updateGallery();
				}
			}

			function updateGallery(){
				container.animate({'margin-left':'-'+(span*state).toString()+'px'}, duration, easing);
			}
		}
		
		Constructor.prototype = {
			
		};
		
		return Constructor;
		
	}());

	
}(jQuery));