
/** jQuery dependency */

(function(jq){
	
	smp.createNamespace("smp.ui.CrossFadeGallery");
	
	/**
		Advisable structure:
		<viewport>
			<container>
				<slide> ...
			</container>
		</viewport>
	*/
	//constructor (instance creation)
	smp.ui.CrossFadeGallery = (function()
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

			var slides,count,i,cell,cellcol = [];
			
			function init(){
				slides = container.children();
				count = slides.length;
				updateGallery();
			}
			
			this.reset = function(newcontainer){
				if(typeof newcontainer !== 'undefined') container = jq(newcontainer);
				state = 0;
				init();
			}
		
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
			this.goToItem = function(id){
				if(id < count && id >= 0){
					state = id;
					updateGallery();
				}
			}

			function updateGallery(){
				slides.css({'display' : 'none','opacity':'0'});
				slides.eq(state).css('display' , 'block').animate({'opacity':'1'}, duration, easing);
			}
		}
		
		Constructor.prototype = {
			
		};
		
		return Constructor;
		
	}());

	
}(jQuery));