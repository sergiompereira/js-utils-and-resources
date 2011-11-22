 
      
      function init() {
    	  
    	 /**
    	  * simpler constructors
    	  */ 
         var   b2Vec2 = Box2D.Common.Math.b2Vec2
         	,	b2World = Box2D.Dynamics.b2World
         	,	b2Body = Box2D.Dynamics.b2Body
            ;
         
        /**
         * eval canvas support
         */
         if(!(!!document.createElement('canvas').getContext))
		{
			var wrapper = document.getElementById("canvasWrapper");
			wrapper.innerHTML = "Your browser does not appear to support the HTML5 Canvas element";
			return;
		}
         
        /**
         * set app main properties
         */
        var canvas = document.getElementById("canvas");
        //create the view  (easel)
        var stage = new Stage(canvas);
        var ballCount = 10;
 		var ballCol = [];
        //create the controller  (box2D)
         var world = new b2World(
               new b2Vec2(0, 9.8)    //gravity
            ,  true                 //allow sleep
         );

        
        
         
        /**
         * set ground and walls
         */
         var esp = 10;
         var espWall = 5;
         
        var ground = new Actor(world,stage);
        ground.defineFixture();
        ground.defineShape("rect",(canvas.width+2*esp),esp, "#009900");
        ground.defineBody(0, canvas.height-esp);
        var left = new Actor(world,stage);
        left.defineFixture();
        left.defineShape("rect",espWall, canvas.height, "#009900");
        left.defineBody(0, 0);
        var right = new Actor(world,stage);
        right.defineFixture();
        right.defineShape("rect",espWall+1, canvas.height, "#009900");
        right.defineBody(canvas.width-espWall, 0);
    	
   
         
        /**
         * create some objects
         */
        for(var i = 0; i < ballCount; ++i) {
       
        	var radius = (Math.random() + 0.1)*30;
        	var cr = Math.round(Math.random()*255);
    		var cg = Math.round(Math.random()*255);
    		var cb = Math.round(Math.random()*255);
    		var color = Graphics.getRGB(cr,cg,cb,0.7);
        	
    		var ball = new Actor(world, stage);
        	ball.defineFixture();
        	ball.defineShape("circle",radius,null,color,1,1,"rgba(255,255,255,0.7)");
        	ball.defineBody(espWall+Math.random() * 15*30, Math.random() * 10*20,0,"dynamic","true");
          
        	ballCol.push(ball);
        	
        	var rect = new Actor(world, stage);
        	rect.defineFixture();
        	rect.defineShape("rect",radius*2,radius,color,1,1,"rgba(255,255,255,0.7)");
        	rect.defineBody(espWall+Math.random() * 15*30, Math.random() * 10*20,0,"dynamic","true");
        	
        	ballCol.push(rect);
        }
        
       
    	
    	
    	/**
    	 * first render
    	 */
    	var mouseHandler = new MouseHandler(canvas,world);
        updateWorld();
        updateStage();
        
         /**
          * init continuous updates
          */
         window.setInterval(updateWorld, 1000 / 60);
         
         
         
         
         
     /**
      * update view (Easel)
      */
        var listener = {};
       
        listener.tick = function()
 		{
        	updateStage();
 		}

        function updateStage(){
        	
        	//update actors
        	var i,total;
        	total = ballCol.length;
        	for(i=0;i<total;i++){
        		ballCol[i].update();
        	};
        	
        	//mouse enabled hint
        	var mouseTarget = stage.getObjectUnderPoint(stage.mouseX, stage.mouseY);
	       	 if(mouseTarget && mouseTarget.mouseEnabled){
	       		canvas.style.cursor = "move"; 
	       	 }else{
     			canvas.style.cursor = "default";
     		}
        	
	       	 //update (redraw) the view
        	 stage.update();
        	
        }
         
        Ticker.setFPS(24);

		//Subscribe to the Tick class. This will call the tick
		//method at a set interval (similar to ENTER_FRAME with
		//the Flash Player)
		Ticker.addListener(listener);
         
	 /**
      * END: update view
      */
        
		
	 /**
      * update controller (Box2D)
      */
         function updateWorld() {
         
        	 mouseHandler.update();
	            
            world.Step(1 / 60, 10, 10);
            world.ClearForces();
         };
         
     	
	 /**
      * END: update controller
      */
         


};
   
