
(function(){
	
	GraphicsFactory = (function(){
			
	
		var Constructor;
		
		Constructor = function()
		{
			
			
		};
		
		
		Constructor.prototype = {
			/*
			createCircle:_createCircle,
			createRect:_createRect
			*/
		};
		
		return Constructor;
				
	}());
	
	/**
	 * 
	 * @param w		Number : width
	 * @param h		Number: height
	 * @param c		String : fill color, ex. "#FF0000" or rgba(255,0,0,0.5)
	 * @param a		Number : alpha transparency
	 * @param s		Number : stroke width
	 * @param sc	String : stroke color, ex. "#FF0000" or rgba(255,0,0,0.5)
	 * @returns		Graphics
	 */
	GraphicsFactory.createRect = function(w,h,c,a,s,sc)
	{
		var graphics = new Graphics();
		graphics.setStrokeStyle(s);
		graphics.beginStroke(sc);
		graphics.beginFill(c);

		//the registration point is at the upper left corner in rects
		var width = w;
		var height = h;
		graphics.drawRect(-w/2,-h/2, w, h);			
		if(a) graphics.alpha = a;
		/*
		graphics.width = function(){return _radius*1.5};
		graphics.height = function(){return _radius*1.5};
		*/
		
		return graphics;
	}
	
	/**
	 * 
	 * @param r		Number : radius
	 * @param c		String : fill color, ex. "#FF0000" or rgba(255,0,0,0.5)
	 * @param a		Number : alpha transparency
	 * @param s		Number : stroke width
	 * @param sc	String : stroke color, ex. "#FF0000" or rgba(255,0,0,0.5)
	 * @returns		Graphics
	 */
	GraphicsFactory.createCircle = function(r,c,a,s,sc)
	{
		var graphics = new Graphics();
		
		graphics.setStrokeStyle(s);
		graphics.beginStroke(sc);
		graphics.beginFill(c);
		//the registration point is at the center in circles
		graphics.drawCircle(0,0, r);
		if(a) graphics.alpha = a;
		/*
		graphics.width = function(){return _radius*1.5};
		graphics.height = function(){return _radius*1.5};
		*/
		
		return graphics;
	}
}());