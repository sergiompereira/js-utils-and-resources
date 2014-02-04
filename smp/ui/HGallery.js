
/** jQuery dependency */

(function(jq){
	
	smp.createNamespace("smp.ui.HGallery");

	smp.ui.HGallery = (function()
	{
		
		/**
		Advisable structure:
		<viewport>
			<container>
				<slide> ...
			</container>
		</viewport>
		
		Set the width of the viewport and of each slide in the css.
		Pass the container to the constructor fnc.
		
		
		Use:
			
            var gallery = new smp.ui.HGallery(jq(".gallery-slides-container"));
            var numpages = gallery.getNumPages();
            
            backBtn = jq(".arrow-left-container");
                backBtn.on("click", handleBackButtonClick);
            forthBtn = jq(".arrow-right-container");
                forthBtn.on("click", handleForthButtonClick);
                handleBtnsStateOnUpdate();
                
            function handleForthButtonClick(evt){
                gallery.next();
                handleBtnsState();
            }
            function handleBackButtonClick(evt){
                gallery.prev();
                handleBtnsState();
            }
            
			function handleBtnsState(){
				if(gallery.getCurrentPage() === gallery.getNumPages()){
					forthBtn.hide();
					backBtn.show();
				}else if(gallery.getCurrentPage() === 1){
					backBtn.hide();
					forthBtn.show();
				}else{
					forthBtn.show();
					backBtn.show();
				}
			}
			function handleBtnsStateOnUpdate(){
				console.log(gallery.getNumPages());
			   if(gallery.getNumPages() > 1){
				   
					forthBtn.show();
					backBtn.hide();
			   }else{
					forthBtn.hide();
					backBtn.hide();
			   }
			}
        
			//on update
			gallery.update();
            handleBtnsStateOnUpdate();
	
		 */
		
		//internals
		var d = document;
		var easingFunctions = {
				easeInOutCubic : function(x, t, b, c, d) {
					if ((t/=d/2) < 1) return c/2*t*t*t + b;
					return c/2*((t-=2)*t*t + 2) + b;
				}
		};
		var defaults = {
				easing : easingFunctions.easeInOutCubic,
				duration : 500
			}

		var constructor = function(view, options){
			var opts = {};
			if(typeof options === "undefined") options = {};
			
			for(var prop in defaults){
				if(typeof options[prop] !== "undefined"){
					opts[prop] = options[prop];
				}else{
					opts[prop] = defaults[prop];
				}
			}
			
			//init
			view = jq(view);
			
			var parent = view.parent();
			var state,slides,slideWidth,pages,viewWidth;
			
			parent.css('overflow','hidden');
			var span = parent.innerWidth();
			
			build();
			view.parent().append(jq(d.createElement('div')).css('clear','both'));
            
			function build(){
				state = 0;
				updateGallery();
				slides = view.children();
				slideWidth = slides.eq(0).innerWidth();
				pages = Math.ceil(slides.length/(span/slideWidth));
				viewWidth = slides.length*slideWidth;
				for(var i=0;i<slides.length; i++){
					slides.eq(i).css('float' , 'left');
				}
				view.css('width' , viewWidth+'px');
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
			this.gotoPage = function(id){
				if(id < pages && id >= 0){
					state = id;
					updateGallery();
				}
			}

			function updateGallery(){
				view.animate({'margin-left':'-'+(span*state).toString()+'px'}, opts.duration, opts.easing);
			}
		}
		return constructor;
	
		
	}());

	
}(jQuery));