
/** jQuery dependency */

(function(jq){
	
	smp.createNamespace("smp.ui.HGallery");
	
	/**
		Advisable structure:
		<viewport>
			<container>
				<slide> ...
			</container>
		</viewport>
		
		Set the width of the viewport and of each slide in the css.
		
	*/
	//constructor (instance creation)
	smp.ui.HGallery = (function()
	{
		
		var Constructor;
		
		var easingFunctions = {
				easeInOutCubic : function(x, t, b, c, d) {
					if ((t/=d/2) < 1) return c/2*t*t*t + b;
					return c/2*((t-=2)*t*t + 2) + b;
				}
		};
		/**
		 * gallery is the container
		 * easing is a function
		 */
		Constructor = function(gallery,easing,duration)
		{
			var d = document;
			
			if(easing == undefined) easing = easingFunctions.easeInOutCubic;
			if(duration == undefined) duration = 500;
			
			var	container = jq(gallery);
			var parent = container.parent();
			var state,slides,slideWidth,pages,containerWidth;
			
			parent.css('overflow','hidden');
			var span = parent.innerWidth();
			build();
			
			function build(){
				state = 0;
				updateGallery();
				slides = container.children();
				slideWidth = slides.eq(0).innerWidth();
				pages = Math.ceil(slides.length/(span/slideWidth));
				containerWidth = slides.length*slideWidth;
				for(var i=0;i<slides.length; i++){
					slides.eq(i).css('float' , 'left');
				}
				container.css('width' , containerWidth+'px');
				container.append(jq(d.createElement('div')).css('clear','both'));
			}
			
			
			//public interface
			this.getNumPages = function(){
				return pages;
			}
			this.getCurrentPage = function(){
				return state+1;
			}
			this.update = function(){
				build();
			}
		
			this.prev = function(){
				if(state>0){
					state--;
					updateGallery();
				}
			}
			this.next = function(){				
				if(state<pages-1){
					state++;
					updateGallery();
				}
			}
			this.goto = function(id){
				if(id < pages && id >= 0){
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