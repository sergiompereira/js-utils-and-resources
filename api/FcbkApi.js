 		
(function(){
      
      FcbkApi = (function(){
    		 
    	//static
    	var FB;
    	
     	var constructor; 
     	//singleton ...?
     	
     	if(constructor) return constructor;
     	
     	constructor = function(fb,scope){
     		FB = fb;
     		var _self = this;
     		var _user = undefined;
     		
     		smp.events.extend(this);
     		
     		/** event handlers */
        	function onLogin(data){
        		
        		_self.dispatchEvent(FcbkApi.LOGIN);
     		}
    		function onUserReady(user){
    			_user = user;
    			_self.dispatchEvent(FcbkApi.USER_GET, user);
         	}
    		function onLogout(){
    			_user = undefined;
    			_self.dispatchEvent(FcbkApi.LOGOUT);
    	    }
        	function onEventsReceived(response){
        		_self.dispatchEvent(FcbkApi.EVENTS_GET, response.data);
      		}	
        	function onEventPost(response){
        		if (!response || response.error) {
        			_self.dispatchEvent(FcbkApi.EVENT_POST, {status:'-1',response:response});
        		  } else {
        			_self.dispatchEvent(FcbkApi.EVENT_POST, {status:'1',response:response});
        		  }
        	}
     		function onEventReceived(response){
     			_self.dispatchEvent(FcbkApi.EVENT_GET, response);
     		}
     		function onEventDelete(response){
     			_self.dispatchEvent(FcbkApi.EVENT_DELETE, response);
     		}
     		
     		/** listen for and handle auth.statusChange events */
            FB.Event.subscribe('auth.statusChange', function(response) {
              if (response.authResponse) {
                FB.api('/me', onUserReady);
                onLogin();
              } else {
                onLogout();
              }
            });
           
            /** public methods*/
            smp.clone({
            	login: function(){ FB.login(null, {scope: scope});},
            	logout: function(){FB.logout();},
            	getUser:function(){return _user;},
            	getEvents:function(){
            		FB.api('https://graph.facebook.com/me/events', onEventsReceived);
            	},
            	getEvent:function(id){
            		FB.api('https://graph.facebook.com/'+id, onEventReceived);
            	},
            	postEvent:function(data){
            		FB.api('https://graph.facebook.com/me/events', 'post', data, onEventPost);
            	},
            	deleteEvent:function(id){
            		FB.api('https://graph.facebook.com/'+id, 'delete', onEventDelete);
            	}
            	
            }, this);
            
     	};
     	
  		return constructor;
      	
      }()); 
      
      FcbkApi.LOGIN = 'LOGIN';
      FcbkApi.LOGOUT = 'LOGOUT';
      FcbkApi.USER_GET = 'USER_GET';
      FcbkApi.EVENTS_GET = 'EVENTS_GET';
      FcbkApi.EVENT_GET = 'EVENT_GET';
      FcbkApi.EVENT_POST = 'EVENT_POST';
      FcbkApi.EVENT_DELETE = 'EVENT_DELETE';
     
}());
		