

 
  
 //class declaration
 /**
 *@modules : array of strings with the desired modules.
 */
function facebookFlashInterface(){
	
	//private
	var swfName = "";
	var fbclient;
	new FBAPIClient("core", "friends", "photos", "post", "fbql", handleFbClient);
	
	
	//callbacks
	function handleFbClient(obj){
		fbclient = obj;
		fbclient.debugMode = true;
		
	}
	
	//\callbacks
	
	//utilities
	
	var movie = function () {
 
		if(document.embeds[swfName]){
			return document.embeds[swfName];
		}
		if(window.document[swfName]){
			return window.document[swfName];
		}
		if(window[swfName]){
			return window[swfName];
		}
		if(document[swfName]){
			return document[swfName];
		}
		
	}
	
	//\utilities
	
	
	//public
	this.setSwfName = function(value){
		swfName = value;
	}
	
	
	this.init = function(apikey, lang, callback){
		
		var callback = callback;
		
		//fbclient.init("442076e9821f37358675788e8a8fb828", "pt_PT");
		fbclient.addEventListener(FBAPIClient.events.LIBRARY_LOADED, onLibraryLoaded);
		fbclient.init(apikey, lang);
		
		function onLibraryLoaded(evt)
		{
			fbclient.removeEventListener(FBAPIClient.events.LIBRARY_LOADED, onLibraryLoaded);
			
			if(callback != null && callback != "undefined"){
				movie()[callback]();
			}
			
		}
	}
	
	this.getLoginStatus = function(permissions, callback){
		
		
		var callback = callback;
		
		fbclient.addEventListener(FBAPIClient.events.USER_LOGGEDON, onUserOn);
		fbclient.addEventListener(FBAPIClient.events.USER_LOGGEDOFF, onUserOff);
		//fbclient.getLoginStatus("publish_stream, email");
		fbclient.getLoginStatus(permissions);
		
		function onUserOn(evt){
			fbclient.removeEventListener(FBAPIClient.events.USER_LOGGEDON, onUserOn);
			
			if(callback != null && callback != "undefined"){
				movie()[callback](evt.data);
			}
			
		}
		
		function onUserOff(evt){
			fbclient.removeEventListener(FBAPIClient.events.USER_LOGGEDOFF, onUserOff);
			
			if(callback != null && callback != "undefined"){
				movie()[callback](evt.data);
			}
		}
	}
	
	this.login = function (permissions, callback){
		
		var callback = callback;
		
		fbclient.addEventListener(FBAPIClient.events.USER_LOGGEDON, onUserOn);
		fbclient.login(permissions);
		
		function onUserOn(evt){
			fbclient.removeEventListener(FBAPIClient.events.USER_LOGGEDON, onUserOn);
			if(callback != null && callback != "undefined"){
				movie()[callback](evt.data);
			}
		}
	}
	
	this.logout = function(callback){
		
		var callback = callback;
		
		fbclient.addEventListener(FBAPIClient.events.USER_LOGGEDOUT, onUserLogedOut);
		fbclient.logout();
		
		function onUserLogedOut(evt){
			fbclient.removeEventListener(FBAPIClient.events.USER_LOGGEDOUT, onUserLogedOut);
			if(callback != null && callback != "undefined"){
				movie()[callback](evt.data);
			}
		}
	}
	
	this.getPermissions = function(permissions){
		movie().userPermissions(fbclient.getPermissions(permissions));
	}
	
	this.getFriends = function(callback){
		
		var callback = callback;
		
		fbclient.addEventListener(FBAPIClient.events.FRIENDS_LOADED, onFriendsLoaded);
		fbclient.getFriends();
		
		function onFriendsLoaded(evt){
			fbclient.removeEventListener(FBAPIClient.events.FRIENDS_LOADED, onFriendsLoaded);
			
			if(callback != null && callback != "undefined"){
				movie()[callback](evt.data);
			}
		}
	}
	
	this.getProfile = function(id, callback){
		
		var callback = callback;
		
		fbclient.addEventListener(FBAPIClient.events.PROFILE_LOADED, onProfileLoaded);
		fbclient.getProfile(id);
		
		function onProfileLoaded(evt){
			fbclient.removeEventListener(FBAPIClient.events.FRIENDS_LOADED, onProfileLoaded);
			
			if(callback != null && callback != "undefined"){
				movie()[callback](evt.data);
			}
		
		}
	}
	
	this.getProfilePhoto = function(size, id){
		return fbclient.getProfilePhoto(size, id);
	}
	
	this.getAlbums = function(id, callback){
		
		var callback = callback;
		
		fbclient.addEventListener(FBAPIClient.events.ALBUMS_LOADED, onAlbumsLoaded);
		if(!fbclient.getAlbums(id)){
		
			fbclient.addEventListener(FBAPIClient.events.USER_LOGGEDON, friendsPermissionsHnd)
			fbclient.login("user_photos,friends_photos");
		}
		
		function friendsPermissionsHnd(){
			fbclient.removeEventListener(FBAPIClient.events.USER_LOGGEDON, friendsPermissionsHnd)
			if(fbclient.getPermissions("user_photos,friends_photos").length==0){
				fbclient.getAlbums(id);
			}
		}
		
		function onAlbumsLoaded(evt){
			fbclient.removeEventListener(FBAPIClient.events.ALBUMS_LOADED, onAlbumsLoaded);
			if(callback != null && callback != "undefined"){
				movie()[callback](evt.data);
			}
		}
	}
	
	this.getPhotos = function(id, callback){
		
		var callback = callback;
		
		fbclient.addEventListener(FBAPIClient.events.PHOTOS_LOADED, onPhotosLoaded);
		fbclient.getPhotos(id);
		
		function onPhotosLoaded(evt){
			fbclient.removeEventListener(FBAPIClient.events.PHOTOS_LOADED, onPhotosLoaded);
			if(callback != null && callback != "undefined"){
				movie()[callback](evt.data);
			}
		}
	}
	
	this.postUI = function(body, attname, attcaption, attdesc, attlink, attpicture, actionLinks, userPromptMsg, displayType, completeCallback, errorCallback){
		
		var completeCallback = completeCallback;
		var errorCallback = errorCallback;
		
		fbclient.addEventListener(FBAPIClient.events.POST_COMPLETE, onPostComplete);
		fbclient.addEventListener(FBAPIClient.events.POST_ERROR, onPostError);
		fbclient.postUI(body, attname, attcaption, attdesc, attlink, attpicture, actionLinks, userPromptMsg, displayType);
		
		function onPostComplete(evt){
			fbclient.removeEventListener(FBAPIClient.events.POST_COMPLETE, onPostComplete);
			fbclient.removeEventListener(FBAPIClient.events.POST_ERROR, onPostError);
			if(completeCallback != null && completeCallback != "undefined"){
				movie()[completeCallback](evt.data);
			}
		}
		
		function onPostError(evt){
			fbclient.removeEventListener(FBAPIClient.events.POST_COMPLETE, onPostComplete);
			fbclient.removeEventListener(FBAPIClient.events.POST_ERROR, onPostError);
			if(errorCallback != null && errorCallback != "undefined"){
				movie()[errorCallback](evt.data);
			}
		}
	}
	
	this.query = function(callback){
		
		var callback = callback;
		
		fbclient.addEventListener(FBAPIClient.events.QUERY_RESPONSE, onQueryComplete);
		fbclient.query();
		
		function onQueryComplete(evt){
			fbclient.removeEventListener(FBAPIClient.events.QUERY_RESPONSE, onQueryComplete);
			
			if(callback != null && callback != "undefined"){
				movie()[callback](evt.data);
			}
		}
		
	}
	
	//\public
	
	
	if(!(this instanceof facebookFlashInterface)){
		return new facebookFlashInterface();
	}
	
	
};

	  

 

  