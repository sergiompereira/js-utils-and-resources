 		
(function(){
      
      FcbkApi = (function(){
    		 
    	//singleton
		var instance;
     	
		var constructor; 
     	
     	     	
     	constructor = function(appid,modules){
				
			if(instance) return instance;
			instance  = this;
			
			var _self = this;
     		var _modules = modules.split(',');
     		
     		smp.events.extend(this);
     		
			(function(d){
		       var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
		       if (d.getElementById(id)) {return;}
		       js = d.createElement('script'); js.id = id; js.async = true;
		       js.src = "//connect.facebook.net/pt_PT/all.js";
		       ref.parentNode.insertBefore(js, ref);
		     }(document));

		    // Init the SDK upon load
		    window.fbAsyncInit = function() {
		    	
		      FB.init({
		        appId      : appid, // App ID
		        channelUrl : '//'+window.location.hostname+'/channel.txt', // Path to your Channel File
		        status     : true, // check login status
		        cookie     : true, // enable cookies to allow the server to access the session
		        xfbml      : true  // parse XFBML
		      });
		      
		      BuildModules();
		      
		      var i,length = _modules.length;
		      for(i=0; i<length; i++){
     			FcbkApi.modules[_modules[i]](_self);
		      }
		    
		      
		      _self.dispatchEvent(FcbkApi.READY);
		    };
		    
     		
     		

     	};
     	
     	
     	var _user_data   = {id:undefined, name:'', photo:''};
     	function getProfileUrl(id){
     		return "https://graph.facebook.com/"+id+"/picture";
     	}
     	
     	constructor.prototype = {
     		user_data : _user_data,
     		getProfileUrl:getProfileUrl
     	}
     	
  		return constructor;
      	
      }()); 
      
      function BuildModules(){
    	  
    	  FcbkApi.READY = 'READY';
	      FcbkApi.LOGIN = 'LOGIN';
	      FcbkApi.LOGOUT = 'LOGOUT';
	      FcbkApi.USER_GET = 'USER_GET';
	      FcbkApi.POST = 'POST';
	      FcbkApi.FRIENDS_GET = 'FRIENDS_GET';
	      FcbkApi.EVENTS_GET = 'EVENTS_GET';
	      FcbkApi.EVENT_GET = 'EVENT_GET';
	      FcbkApi.EVENT_POST = 'EVENT_POST';
	      FcbkApi.EVENT_DELETE = 'EVENT_DELETE';
	      FcbkApi.FRIENDS_INVITE = 'FRIENDS_INVITE';
	      
	      
	      FcbkApi.modules = {};
	      FcbkApi.modules.auth = function(obj){
			  smp.clone({
	          	login: function(scope){
	          		
	          		FB.login(null, {scope: scope});
	          	},
	          	logout: function(){FB.logout();},
	          	getUser:function(){return obj.user_data;}
	          }, obj);
			  
			  /** listen for and handle auth.statusChange events */
	          FB.Event.subscribe('auth.statusChange', function(response) {
	            if (response.authResponse) {
	              FB.api('/me', onUserReady);
	              onLogin();
	            } else {
	              onLogout();
	            }
	          });
	          
			  /** event handlers */
	          var _self = obj;
		      	function onLogin(data){
		      		_self.dispatchEvent(FcbkApi.LOGIN);
		   		}
		  		function onUserReady(user){
		  			_self.user_data.id = user.id;
		  			_self.user_data.name = user.name;
		  			_self.user_data.photo = _self.getProfileUrl(user.id);
		  			_self.dispatchEvent(FcbkApi.USER_GET, user);
		       	}
		  		function onLogout(){
		  			_self.user_data = undefined;
		  			_self.dispatchEvent(FcbkApi.LOGOUT);
		  	    }
		  }
	      FcbkApi.modules.friend = function(obj){
	    	  smp.clone({
	    		  getFriends:function(){
	    			  FB.api('https://graph.facebook.com/me/friends', onFriendsReceived);
	    		  }
	    	  },obj);
	    	  
	    	  /** event handlers */
	    	  var _self = obj;
	    	  function onFriendsReceived(response){
	    		  smp.each(response.data,function(key,value){
	    			  value.photo = _self.getProfileUrl(value.id);
	    		  },this);
	    		  _self.dispatchEvent(FcbkApi.FRIENDS_GET, response.data);
	    	  }
	      };
	      FcbkApi.modules.event = function(obj){
	    	  //requires scope 'user_events,create_event'
	    	  smp.clone({
		    	  getEvents:function(){
		    		FB.api('https://graph.facebook.com/me/events', onEventsReceived);
		    	  },
		    	  getEvent:function(id){
		    		FB.api('https://graph.facebook.com/'+id, onEventReceived);
		    	  },
		    	  postEvent:function(name,description,start,end,location,venue,privacy,picture){
		    		  	/**
						 * a documentação diz 'privacy'
						 * mas o que funciona é privacy_type (!!)
						 */
			    		  
			    		  var data = {};
			    		  data.name = name;
			    		  data.description = description;
			    		  data.start_time = start;
			    		  if(end != undefined) data.end_time = end;
			    		  data.location = location;
			    		  if(venue != undefined) data.venue = venue;
			    		  (privacy != undefined) ? data.privacy = privacy : data.privacy = 'SECRET';
			    		  if(picture != undefined) data.picture = picture;
			    				 
							
			    		  FB.api('https://graph.facebook.com/me/events', 'post', data, onEventPost);
		    	  },
		    	  deleteEvent:function(id){
		    		FB.api('https://graph.facebook.com/'+id, 'delete', onEventDelete);
		    	  },
		    	  inviteFriends:function(evtid,friendids){
		    		  FB.api('https://graph.facebook.com/'+evtid+'/invited?users='+friendids,'post', onFriendsInvited);
		    		  
		    	  }
	    	  }, obj);
	    	  
	    	  /** event handlers */
	    	  var _self = obj;
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
		   		function onFriendsInvited(response){
		   			_self.dispatchEvent(FcbkApi.FRIENDS_INVITE, response);
		   		}
	      };
	      
	      FcbkApi.modules.post = function(obj){
	    	  smp.clone({
	    		  postUI:function(attname, attcaption, attdesc, attlink, attpicture, actionLinks, userPromptMsg, displayType){
	    			if(displayType == undefined){
	    					//also 'iframe'
	    					displayType = "popup";
	    			}
	    			if(obj.user_data.id != 'undefined')
	    			{
	    					//requires scope 'publish_stream'
	    					FB.ui({
	    								display:displayType,
	    								method: 'stream.publish',
	    								attachment: {
	    									name: attname,
	    									caption: attcaption,
	    									description: attdesc,
	    									href: attlink,
	    									media: [{'type':'image','src':attpicture,'href':attlink}]
	    								},
	    								action_links:actionLinks,
	    								user_prompt_message: userPromptMsg
	    							},
	    							onPostSent
	    						);
	    					
	    				}else{
	    					return false;
	    				}
	    		  }
	    	  },obj);
	    	  
	    	  /** event handlers */
	    	  var _self = obj;
	    	  function onPostSent(response) {
					if (!response || response.error || response.post_id == null || response.post_id == "") {
						_self.dispatchEvent(FcbkApi.POST, {status:-1, response:response});
					} else {
						_self.dispatchEvent(FcbkApi.POST,  {status:1, response:response});
					}
				}
	    	
	      }
      }
      
      
}());
		