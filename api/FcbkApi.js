 		
(function(){
      
      FcbkApi = (function(){
    		 
    	//singleton
		var instance;
     	 
		/**
		 * include
		 * <div id="fb-root"></div>
		 * just before the closing </body> tag
		 */
     	     	
		var constructor = function(appid,modules){
				
			if(instance) return instance;
			instance  = this;
			
     		var _modules = modules.split(',');
     		
     		smp.events.extend(instance);
     		
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
	     			FcbkApi.modules[_modules[i]](instance);
			      }
			    
			      instance.dispatchEvent(FcbkApi.READY);
		    };

     	};
     	
     	
     	var _user_data;
     	resetUserData();
     	
     	function getProfileUrl(id){
     		return "https://graph.facebook.com/"+id+"/picture";
     	}
     	function resetUserData(){
     		_user_data = {id:undefined, name:'', photo:'', permissions:''};
     	}
     	function userData(){
     		return _user_data;
     	}
     	
     	constructor.prototype = {
     		userData : userData,
     		resetUserData:resetUserData,
     		getProfileUrl:getProfileUrl
     	}
     	
  		return constructor;
      	
      }()); 
      
      
      FcbkApi.READY = 'READY';
      FcbkApi.LOGIN = 'LOGIN';
      FcbkApi.LOGOUT = 'LOGOUT';
      FcbkApi.USER_GET = 'USER_GET';
      FcbkApi.USERPERMISSIONS_GET = 'USERPERMISSIONS_GET';
      FcbkApi.POST = 'POST';
      FcbkApi.FRIENDS_GET = 'FRIENDS_GET';
      FcbkApi.EVENTS_GET = 'EVENTS_GET';
      FcbkApi.EVENT_GET = 'EVENT_GET';
      FcbkApi.EVENT_POST = 'EVENT_POST';
      FcbkApi.EVENT_DELETE = 'EVENT_DELETE';
      FcbkApi.FRIENDS_INVITE = 'FRIENDS_INVITE';
      FcbkApi.PHOTO_POST = 'PHOTO_POST';
      
      function BuildModules(){
         
	      FcbkApi.modules = {};
	      FcbkApi.modules.auth = function(obj){
	    	  
	    	  var _self = obj;
	    	  
			  smp.clone({
	          	login: function(permissions){
	          		
	          		FB.login(onAuthResponse, {scope: permissions});
	          	},
	          	logout: function(){FB.logout();},
	          	getUser:function(){
	          			if(_self.userData().id == undefined){
	          				FB.api('/me', onUserReady);
	          				return null;
	          			}
	          			return _self.userData();
	          	},
	          	getPermissions:function(updateFromServer){
	          		if(_self.userData().id != undefined){
	          			if(_self.userData().permissions == "" || updateFromServer){
	          				FB.api('/me/permissions', onPermissionsReady);
	          				return null;
	          			}else{
	          				_self.dispatchEvent(FcbkApi.USERPERMISSIONS_GET, _self.userData().permissions);
	          				return _self.userData().permissions;
	          				
	          			}
          				
          			}
          			return null;
	          	}
	          }, obj);
			  
			  /** listen for and handle auth.statusChange events */
	          FB.Event.subscribe('auth.statusChange', onAuthResponse);
	          
			  /** event handlers */
	          	function onAuthResponse(response){
	          		
	          		if (response.authResponse) {

	   	              FB.api('/me', onUserReady);
	   	              onLogin();
	   	            } else {
	   	              onLogout();
	   	            }
	          	}
		      	function onLogin(data){
		      		_self.dispatchEvent(FcbkApi.LOGIN);
		   		}
		  		function onUserReady(response){

		  			if(!response.error){
		  				_self.userData().id = response.id;
			  			_self.userData().name = response.name;
			  			_self.userData().photo = _self.getProfileUrl(response.id);
		  			}
		  			
		  			_self.dispatchEvent(FcbkApi.USER_GET, response);
		       	}
		  		function onPermissionsReady(response){
		  			_self.userData().permissions = response.data[0];
		  			_self.dispatchEvent(FcbkApi.USERPERMISSIONS_GET, response.data[0]);
		  		}
		  		function onLogout(){
		  			_self.resetUserData();
		  			_self.dispatchEvent(FcbkApi.LOGOUT);
		  	    }
		  }
	      FcbkApi.modules.friend = function(obj){
	    	  smp.clone({
	    		  getFriends:function(){
	    			  FB.api('/me/friends', onFriendsReceived);
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
		    		FB.api('/me/events', onEventsReceived);
		    	  },
		    	  getEvent:function(id){
		    		FB.api('/'+id, onEventReceived);
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
			    		  if(end) data.end_time = end;
			    		  data.location = location;
			    		  if(venue) data.venue = venue;
			    		  if(privacy) {
			    			  data.privacy = privacy;
			    			  data.privacy_type = privacy;
			    		  }else{
			    			 data.privacy = 'SECRET';
			    			 data.privacy_type = 'SECRET';
			    		  }
			    		  if(picture) data.picture = picture;
			    		  

							
			    		  FB.api('/me/events', 'post', data, onEventPost);
		    	  },
		    	  deleteEvent:function(id){
		    		FB.api('/'+id, 'delete', onEventDelete);
		    	  },
		    	  inviteFriends:function(evtid,friendids){
		    		  FB.api('/'+evtid+'/invited?users='+friendids,'post', onFriendsInvited);
		    		  
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
	    	  
	    	  var _self = obj;
	    	  
	    	  smp.clone({
	    		  postUI:function(attname, attcaption, attdesc, attlink, attpicture, actionLinks, userPromptMsg, displayType){
	    			if(displayType == undefined){
	    					//also 'iframe'
	    					displayType = "popup";
	    			}

	    			if(_self.userData().id != 'undefined')
	    			{
	    					//requires scope 'publish_stream'
	    					FB.ui({
	    								display:displayType,
	    								method: 'stream.publish',
	    								attachment: {
	    									name: attname,
	    									caption: attcaption.replace(/<br\s*\/?\>/gi,'<center></center>'),
	    									description: attdesc.replace(/<br\s*\/?\>/gi,'<center></center>'),
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
	    	 
	    	  function onPostSent(response) {
					if (!response || response.error || response.post_id == null || response.post_id == "") {
						_self.dispatchEvent(FcbkApi.POST, {status:-1, response:response});
					} else {
						_self.dispatchEvent(FcbkApi.POST,  {status:1, response:response});
					}
				}
	    	
	      };
	      
	      FcbkApi.modules.photo = function(obj){
	    	  //http://developers.facebook.com/docs/reference/api/photo/
	    	  
	    	  var _self = obj;
	    	  
	    	  smp.clone({
	    		  postPhoto:function(caption, url){	

	    			if(_self.userData().id != 'undefined')
	    			{
	    				var data = {};
	    				data.name = caption;
	    				data.url = url;
	    				
	    				FB.api('/me/photos', 'POST', data, onPhotoPost);
	    					
    				}else{
    					return false;
    				}
	    		  }
	    	  },obj);
	    	  
	    	  /** event handlers */
	    	 
	    	  function onPhotoPost(response) {
					if (!response || response.error || response.post_id == null || response.post_id == "") {
						_self.dispatchEvent(FcbkApi.PHOTO_POST, {status:-1, response:response});
					} else {
						_self.dispatchEvent(FcbkApi.PHOTO_POST,  {status:1, response:response});
					}
				}
	    	
	      }
      }
      
      
}());
		