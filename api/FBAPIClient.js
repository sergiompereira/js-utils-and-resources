/**
 * typical uses:
 *  1. new FBAPIClient(["user", "friend"], function(obj){//handle obj as an instance of FBClient});
 *  2. new FBAPIClient("user", "friend", myFunction);
 *  //callback
 *  function myFunction(obj){//idem}
 *  3. new FBAPIClient("*", myFunction);
 *  
 *  
 * @example 
 *  var fbclient;
	new FBAPIClient("core", handleFbClient);
	function handleFbClient(obj){
		fbclient = obj;
		fbclient.debugMode = true;
		fbclient.addEventListener(FBAPIClient.events.LIBRARY_LOADED, onLibraryLoaded);
		fbclient.init("442076e9821f37358675788e8a8fb828", "pt_PT");
	}
	function onLibraryLoaded(){
		fbclient.removeEventListener(FBAPIClient.events.LIBRARY_LOADED, onLibraryLoaded);
		fbclient.addEventListener(FBAPIClient.events.USER_LOGGEDON, onUserReady);
		fbclient.addEventListener(FBAPIClient.events.USER_LOGGEDOFF, onUserOff);
		fbclient.getLoginStatus("publish_stream, email");
	}
	function onUserOff(){
		fbclient.removeEventListener(FBAPIClient.events.USER_LOGGEDOFF, onUserOff);
		showLoginBtn();
	}
	function onUserReady(evt){
		fbclient.removeEventListener(FBAPIClient.events.USER_LOGGEDON, onUserReady);
		if (fbclient.getPermissions("publish_stream, email").length > 0) {	
			showLoginBtn();
		}else{	
			hideLoginBtn();
			buildPage();
		}
	}
	function showLoginBtn(){
		document.getElementById("loginbtn").setAttribute("style", "display:block");
	}
	function hideLoginBtn(){
		document.getElementById("loginbtn").setAttribute("style", "display:none");
	}
	
	//called froam a user click event onclick="handleFBLogin()"
	
	function handleFBLogin(){
		fbclient.addEventListener(FBAPIClient.events.USER_LOGGEDON, onUserReady);
		fbclient.login("publish_stream, email");
	}
 *  
 *  
 */


/**
 * @constructor
 */
function FBAPIClient(args){
	
	//private properties (and methods with var mymethod = function(){})
	var args = Array.prototype.slice.call(arguments);
	//get the callback (should be the last argument)
	var callback = args.pop();
	//modules can be passed as an array or as string
	//no modules, or *, both mean "use all modules available" (see below) 
	var modules = (args[0] && typeof args[0] === "string") ? args : args[0];
	var i;

	//force the function to be used as a constructor (if "new" is omitted by the client)
	if(!(this instanceof FBAPIClient)){
		return new FBAPIClient(modules, callback);
	}

	
	//if no modules (see above)
	if(!modules || modules ==="*"){
		modules = [];
		for(i in FBAPIClient.modules){
			if(FBAPIClient.modules.hasOwnProperty(i)){
				modules.push(i);
			}
		}
	}
	
	//add the modules to "this" object
	//initialize modules
	//each module accept the current instance as parameter 
	//and may add additional properties and methods to that instance
	for(i=0; i<modules.length; i++){
		FBAPIClient.modules[modules[i]](this);
	}
	
	//when ready, call the callback (initialization complete)
	//and pass this instance, an object with all the requested functionality
	callback(this);
		
}


//public properties and methods 
//(also as this.myprop or this.mymethod, inside the constructor, but not recommended)
//prototype is the return of an anonymous function (self called), an object...
FBAPIClient.prototype = (function(){
		//return an object with the desired properties and methods
	
		//some utils
		if (typeof window.console == 'undefined') {
			window.console = {};
			window.console.log = function(msg) {
				return;
			};
		}
		
		if(typeof String.prototype.trim !== 'function'){
			String.prototype.trim = function trim()
			{
				var l=0; var r=this.length -1;
				while(l < this.length && this[l] == ' ')
				{	l++; }
				while(r > l && this[r] == ' ')
				{	r-=1;	}
				return this.substring(l, r+1);
			}
		}

		
		return {
			//any public properties or methods
			//myprop:"myvalue"
			//mymethod:function(){}
			
			//properties
			apiKey:"",
			debugMode: false,
			userData:{
				permissions:[],
				profilePhotoUrl:""
			},
			app_access_token:"",
			
			//methods
			debug: function(value){
				if(this.debugMode){
					window.console.log("FBAPIClient : "+value);
				}
			}
			
		}
	}())

	
//event object
function FBAPIEvent(){
	this.name = "";
	this.data = {};
}
//static constants (actually properties, but using the const convention.
FBAPIClient.events = {};
FBAPIClient.events.LIBRARY_LOADED = "LIBRARY_LOADED";
FBAPIClient.events.USER_LOGGEDON = "USER_LOGGEDON";
FBAPIClient.events.USER_PERMISSIONSNONE = "USER_PERMISSIONSNONE";
FBAPIClient.events.USER_PERMISSIONSPARTIAL = "USER_PERMISSIONSPARTIAL";
FBAPIClient.events.USER_PERMISSIONSALL = "USER_PERMISSIONSALL";
FBAPIClient.events.USER_PERMISSIONSERROR = "USER_PERMISSIONSERROR";
FBAPIClient.events.USER_LOGGEDOFF = "USER_LOGGEDOFF";
FBAPIClient.events.USER_LOGGEDOUT = "USER_LOGGEDOUT";
FBAPIClient.events.PROFILE_LOADED = "PROFILE_LOADED";
FBAPIClient.events.FRIENDS_LOADED = "FRIENDS_LOADED";
FBAPIClient.events.ALBUMS_LOADED = "ALBUMS_LOADED";
FBAPIClient.events.PHOTOS_LOADED = "PHOTOS_LOADED";
FBAPIClient.events.POST_COMPLETE = "POST_COMPLETE";
FBAPIClient.events.POST_ERROR = "POST_ERROR";
FBAPIClient.events.POSTS_LOADED = "POSTS_LOADED";
FBAPIClient.events.POSTS_ERROR = "POSTS_ERROR";
FBAPIClient.events.WALLFEED_LOADED = "WALLFEED_LOADED";
FBAPIClient.events.WALLFEED_ERROR = "WALLFEED_ERROR";
FBAPIClient.events.HOMEFEED_LOADED = "HOMEFEED_LOADED";
FBAPIClient.events.HOMEFEED_ERROR = "HOMEFEED_ERROR";
FBAPIClient.events.INVITATION_ERROR = "INVITATION_ERROR";
FBAPIClient.events.INVITATION_COMPLETE = "INVITATION_COMPLETE";
FBAPIClient.events.APP_TOKEN_RESPONSE = "APP_TOKEN_RESPONSE";
FBAPIClient.events.QUERY_RESPONSE = "QUERY_RESPONSE";




FBAPIClient.modules = {};
//obj is an instance of FacebookAPIClient (see above). 
//The instance will receive the module functionality directly.
FBAPIClient.modules.core = function(obj){
	//declare public properties or methods of this module
	
	obj.listeners = [];
	obj.addEventListener = function(evt,callback){
		obj.listeners.push([evt,callback]);
	};
	obj.removeEventListener = function(evt, callback){
		var j;
		for(j=0; j<obj.listeners.length; j++){
			if(obj.listeners[j][0] == evt && obj.listeners[j][1] == callback){
				obj.listeners.splice(j,1);
				//no break is used because there might have been redundancy of listeners
			}
		}
	};
	obj.dispatchEvent = function(evt, data)
	{
		var j, eventObj;
		for(j=0; j<obj.listeners.length; j++){
			if(obj.listeners[j][0] == evt){
				if(typeof obj.listeners[j][1] === "function"){
					eventObj = new FBAPIEvent();
					eventObj.name = evt;
					eventObj.data = data;
					obj.listeners[j][1](eventObj);
				}
			}
		}
	}
	obj.JsonP = function(src, callback)
    {
		var _callabackName = 'FBAPIClient'+(Math.round(Math.random()*9999)).toString(); 
		window[_callabackName] = function(data){callback(data);};
		
	        var headID = document.getElementsByTagName("head")[0];         
	        var newScript = document.createElement('script');
	        newScript.type = 'text/javascript';
	        //newScript.onload = callback;
	        newScript.src = src+'?jsonp='+_callabackName;
	        headID.appendChild(newScript);   
	}
	
	
	/**
	 * Ensure that <div id="fb-root"></div> is included in the html
	 * 
	 * api_key	:
	 * lang	: for portuguese Portugal, use "pt_PT". Also en_US, en_UK, pt_BR,...
	 */
	obj.init =	function (api_key, lang)
	{	
		obj.apiKey = api_key;
		if(window.FB){delete window.FB;};
		
		window.fbAsyncInit = function() {
			obj.debug("Library initialized")
			FB.init({appId: obj.apiKey, status: true, cookie: true, xfbml: true});
			obj.dispatchEvent(FBAPIClient.events.LIBRARY_LOADED, null);
		}

		var e = document.createElement('script'); 
		e.async = true;
		e.src = document.location.protocol + '//connect.facebook.net/'+lang+'/all.js';
		document.getElementById("fb-root").appendChild(e);
	}
	
	/**
	 * @permissions : comma separated list of permissions
	 * eg. "publish_stream, email"
	 */
	obj.getLoginStatus = function (permissions)
	{
		obj.debug("status call");
		
		FB.getLoginStatus(loginStatusHandler, {perms:permissions});
				
		function loginStatusHandler(response) 
		{
			obj.debug("Session status response received")
			//user with facebook session in browser
			if (response.session) {	
				obj.debug("Sesssion available");
				
				if(permissions!="undefined" && permissions!=null){
					
					var aRequestedPerms = permissions.split(",");
				
					if(aRequestedPerms.length>0){
						//permissions have been requested.
						obj.debug("Permissions have been requested");
						//check whether there is permissions info.
						if(response.perms == null || response.perms == ""){
							obj.debug("No permissions granted");
							obj.dispatchEvent(FBAPIClient.events.USER_PERMISSIONSNONE, null);
							obj.getUser([]);
						}else{
							//getLoginStatus return a string
							var grantedPermissions = [];
							try{
								var perms = eval("("+response.perms+")");
								var userPerms = "";
								if(perms.extended != null){
									if(perms.extended.length > 0){
										userPerms = perms.extended[0];
										for(var i = 1; i<perms.extended.length; i++){
											userPerms = userPerms+","+perms.extended[i];
										}
									}
								}
								grantedPermissions = userPerms.split(",");
								
								
							}catch(error){
								obj.debug("Error when reading permissions")
								obj.dispatchEvent(FBAPIClient.events.USER_PERMISSIONSERROR, null);
							}
							
							var permissionsNotGranted = aRequestedPerms.slice(0);
							var j,i,k;
							for(j= 0; j<aRequestedPerms.length; j++){
								for(i=0; i<grantedPermissions.length; i++){
									if(grantedPermissions[i].toLowerCase() ==  aRequestedPerms[j].trim().toLowerCase()){
										for(k=0; k<permissionsNotGranted.length; k++){
											if(permissionsNotGranted[k] == aRequestedPerms[j]){
												permissionsNotGranted.splice(k, 1);
											}
											
											break;
										}
										break;
									}
								}
							}
							if(permissionsNotGranted.length>0){
								obj.debug("USER_PERMISSIONSPARTIAL");
								obj.dispatchEvent(FBAPIClient.events.USER_PERMISSIONSPARTIAL, permissionsNotGranted);
							}else{
								obj.debug("USER_PERMISSIONSALL");
								obj.dispatchEvent(FBAPIClient.events.USER_PERMISSIONSALL, null);
							}
							
							obj.getUser(grantedPermissions);
						}
					}else{
						//no permissions were requested
						obj.debug("No permissions were requested");
						obj.getUser([]);
					}
				}else{
					//no permissions were requested
					obj.debug("No permissions were requested");
					obj.getUser([]);
				}
				
			} else {
				obj.debug("No session available yet.")
				// no user session available
				obj.dispatchEvent(FBAPIClient.events.USER_LOGGEDOFF, null);
				
			}
			
		
		};
		
		
	}
	
	/**
	 * If there is an active session, 
	 * facebook bypasses the user/password step 
	 * and shows the extended permissions dialog box. 
	 */
	obj.login = function (permissions)
	{
		obj.debug("login call");
		
		
		//call facebook login dialog box and pass requested permissions 			
		FB.login(loginCallHandler,{perms:permissions});
		
		//The previous call encloses this call, but with display set to 'popup'.
		//Setting it to 'iframe', results on a facebook error due to assumed 'clickjacking'
		/*
		FB.ui(
				{
					display:"iframe",
					method: 'permissions.request'
				},
				loginCallHandler
			);
		*/
		
		function loginCallHandler(response){
			obj.debug("Login response received")
			//user logged in 
			if (response.session) {
				obj.debug("Session available")
				//read granted permissions : coma separeted values
				if(response.perms!=null && response.perms !== "") 
				{
					obj.getUser(response.perms.split(","));
				}
				else
				{
					obj.getUser([]);
				}
				
			  } else {
				  	obj.debug("User cancelled")
					// user cancelled login, no way further...
					obj.dispatchEvent(FBAPIClient.events.USER_LOGGEDOFF, null);
			  }
			
		}
	}
	
	/**
	 * permissions should be an array
	 */
	obj.getUser = function (permissions){

		FB.api('/me', function(response) {
			//read user data 
			//alert(evt.data.response.name);
			obj.debug("getUser response received");
			var j, k;
			for(j in response){
				obj.userData[j] = response[j];
			}
			for(k=0; k<permissions.length; k++){
				obj.userData.permissions.push(permissions[k]);
			}
			
			obj.userData.photoUrl = "https://graph.facebook.com/"+obj.userData.id+"/picture";
			
			obj.dispatchEvent(FBAPIClient.events.USER_LOGGEDON, {permissions:permissions, response:response});
			
		});

	}

	
	/**
	 * string	@permissions	: coma separated list
	 * array	@return			: list of permissions not granted
	 */
	obj.getPermissions = function(permissions)
	{
		if(permissions != "undefined" && permissions != null){
			if(obj.userData.id != 'undefined'){
				obj.debug("getPermissions userData ok");
				var grantedPermissions = obj.userData.permissions;
				var aRequestedPerms = permissions.split(",");
				console.log("aRequestedPerms "+aRequestedPerms);
				var permissionsNotGranted = aRequestedPerms.slice(0);
				console.log("a permissionsNotGranted "+permissionsNotGranted);
				var j,i,k;
				
				for(j= 0; j<aRequestedPerms.length; j++){
					
					for(i=0; i<grantedPermissions.length; i++){
						
						if(grantedPermissions[i].toLowerCase() ==  aRequestedPerms[j].trim().toLowerCase()){
							for(k=0; k<permissionsNotGranted.length; k++){
								if(permissionsNotGranted[k] == aRequestedPerms[j]){
									console.log("permissionsNotGranted[k] "+permissionsNotGranted[k]);
									permissionsNotGranted.splice(k, 1);
									console.log("b permissionsNotGranted "+permissionsNotGranted);
								}
								
								//break;
							}
							//break;
						}
					}
				}
				obj.debug("permissionsNotGranted: "+permissionsNotGranted);
				return permissionsNotGranted;
			}
		}
		return null;
	}
	
	obj.logout = function(){
		FB.logout(function(response) {
			obj.dispatchEvent(FBAPIClient.events.USER_LOGGEDOUT, response);

		});
	}
	
	
	
}

FBAPIClient.modules.friends = function(obj){
	
	obj.getFriends = function(){
		
		if(obj.userData.id != 'undefined')
		{
			FB.api('/me/friends', getFriendsHandler);
			
		}
		
		function getFriendsHandler(response) 
		{
			if (!response || response.error) {
				obj.debug("getFriends error: "+response.error);
				obj.dispatchEvent(FBAPIClient.events.FRIENDS_LOADED, null);
			} else {
				obj.debug("getFriends ok");
				var i;
				for(i=0; i<response.data.length; i++){
					response.data[i].photo = obj.getProfilePhoto(null, response.data[i].id);
				}
				
				response.data.sort(function(a,b)
					{
						if (a.name < b.name)
						     return -1;
						  if (a.name > b.name)
						    return 1;
						  return 0;

					});
				
				obj.dispatchEvent(FBAPIClient.events.FRIENDS_LOADED, response.data);
			}
			
		};
	}
	
	obj.getProfile = function(id){
		
		if(obj.userData.id != 'undefined')
		{
			FB.api('/'+id, getProfileHandler);

		}
		
		function getProfileHandler(response) {
			//read user data 
			//alert(evt.data.response.name);
			obj.debug("getProfile response received");			
			obj.dispatchEvent(FBAPIClient.events.PROFILE_LOADED, response);
			
		};
	}
	
	/**
	 * @size	: small, normal, large
	 * @return : photo url
	 */
	obj.getProfilePhoto = function(size, id){
		
		var url;
		if(id != null){
			if(size == null || size == ""){
				size = "small";
			}
			return "https://graph.facebook.com/"+id+"/picture?type="+size;
		}
		else if(obj.userData.id !== undefined)
		{
			if(size == null || size == ""){
				size = "small";
			}
			url = "https://graph.facebook.com/"+obj.userData.id+"/picture";
			return url+"?type="+size;
			/* 
			//callback doesn't work
			FB.api('/me/picture?type='+size, null, function(response){
				obj.dispatchEvent(FBAPIClient.events.USER_PHOTO, response);
			});
			*/
		}
	}
	
}

FBAPIClient.modules.photos = function(obj){
	
	/**
	 * requires "user_photos,friends_photos"
	 */
	obj.getAlbums = function(id){
		
		if(obj.userData.id != 'undefined')
		{
			
			if(obj.getPermissions("user_photos,friends_photos").length>0){
				
				return false;
			}
			if(id != null){
				FB.api('/'+id+'/albums', getAlbumsHandler);
				
			}else{
				FB.api('/me/albums', getAlbumsHandler);
			}
			
		}else{
			return false;
		}
		
		function getAlbumsHandler(response) {
			//read user data 
			//alert(evt.data.response.name);
			obj.debug("getAlbums response received");
			if(response.data){
				obj.dispatchEvent(FBAPIClient.events.ALBUMS_LOADED, response.data);
			}
			
		};
		
		return true;
	}
	
	/**
	 * requires "user_photos,friends_photos"
	 * 
	 * url size format	:	t, q, n
	 * ex	:	<xxx>_t.jpg
	 */
	
	obj.getPhotos = function(id){
		
		if(obj.userData.id != 'undefined')
		{
			
			if(obj.getPermissions("user_photos,friends_photos").length>0){
				
				return false;
			}
			
			FB.api('/'+id+'/photos', getPhotosHandler);
				
			
		}else{
			return false;
		}
		
		function getPhotosHandler(response) {
			//read user data 
			//alert(evt.data.response.name);
			obj.debug("getPhotos response received");
			if(response.data){
				obj.dispatchEvent(FBAPIClient.events.PHOTOS_LOADED, response.data);
			}
			
		};
		
		return true;
	}
	
	
	/**
	 * @url
	 * @size 	:	(String) small, medium, large
	 */
	obj.getSizedPhotoUrl = function(url, size){
		console.log(url)
		var start = url.length-6;
		
		var sizestr = url.substr(start,2);
		console.log(sizestr)
		var length;
		if(sizestr == "_t" || sizestr == "_q" || sizestr == "_n"){
			length = url.length - 6;
		}else{
			length = url.length - 4;
		}
		
		var baseurl = url.substr(0,length);
		
		switch(size){
			case "small":
				return baseurl+"_t.jpg"
				break;
			
			case "medium":
				return baseurl+"_q.jpg"
				break;
				
			case "large":
				return baseurl+"_n.jpg"
				break;
				
			default:
				return baseurl+".jpg"
				break;
		}
		return url;
	}

	
};

FBAPIClient.modules.post = function(obj){
	
	/**
	 * requires "publish_stream" and/or "read_stream"
	 */
	
	obj.postUI = function(body, attname, attcaption, attdesc, attlink, attpicture, actionLinks, userPromptMsg, displayType)
	{
				
		//action links signature...
		//var actionLinks = [{'href':'http://www.website.com','text':'My website'}];
		//var actionlinks = null;
		
		//older API ...
		//FB.Connect.streamPublish(message, attachment, actionLinks, "", "", function(){movie().postComplete();});
		
		/*
		 * @options	 : popup, iframe, page, wap,...
		 */
		if(displayType == null){
			displayType = "iframe";
		}
		
		
		if(obj.userData.id != 'undefined')
		{
			
			if(obj.getPermissions("publish_stream").length>0){
				
				return false;
			}
		
			FB.ui(
					{
						display:displayType,
						method: 'stream.publish',
						message: body,
						attachment: {
							name: attname,
							caption: attcaption,
							description: (attdesc),
							href: attlink,
							media: [{'type':'image','src':attpicture,'href':attlink}]
						},
						
						action_links:actionLinks,
						user_prompt_message: userPromptMsg
					},
					function(response) {
					
					
						if (!response || response.error || response.post_id == null || response.post_id == "") {
							obj.debug('PostUI: Error occured');
							obj.dispatchEvent(FBAPIClient.events.POST_ERROR, response);
						} else {
							obj.debug('PostUI: post ID - ' + response.id);
							obj.dispatchEvent(FBAPIClient.events.POST_COMPLETE, response);
						}
					}
				);
			
		}else{
			return false;
		}
		
		return true;
		
	}
		
	/**
	 * 
	 * 
	 * requires "publish_stream" and/or "read_stream"
	 * 
		Graph API ainda n�o suporta action links !
	
		actionlinks t�m o formato de arrays de objectos com as propriedades text e href.
		Ex:
		[
			{ text: 'My website', href: 'http://www.mysite.com'},
			{ text: 'Your website', href: 'http://www.yoursite.com' }
		] 
		
		@id : the user id into which wall the post will be inserted.
	*/
	obj.post = function (body, attname, attcaption, attdesc, attlink, attpicture, actionLinks, id)
	{
			//friend wall
			var postdata = { 
						message: body, 
						name:attname, 
						caption:attcaption, 
						description:attdesc, 
						link:attlink, 
						picture:attpicture,  
						actions: actionLinks
						
					};
			
			if(obj.userData.id != 'undefined')
			{
				
				if(obj.getPermissions("publish_stream").length>0){
					
					return false;
				}
				
				if(id != "" && id != "undefined" && id != null){
					FB.api('/'+id+'/feed', 'post', postdata, postFeedComplete);
				}else{
					//self wall
					FB.api('/me/feed', 'post', postdata, postFeedComplete);
				}
			}else{
				return false;
			}
		   
		   function postFeedComplete(response)
		   {
				if (!response || response.error) {
					obj.debug('Post: Error occured');
					obj.dispatchEvent(FBAPIClient.events.POST_ERROR, null);
				} else {
					obj.debug('Post: post ID - ' + response.id);
					obj.dispatchEvent(FBAPIClient.events.POST_COMPLETE, response);
				}
		   }
		   
		   return true;
	
	}
	
	/**
	 * Returns a collection of posts (only, no status messages) 
	 * authored by the current user ('me') if no id is specified. 
	 * The id may be of a user, application or public page.
	 * Only posts sent to "everyone"(public) will be returned.
	 * These posts usually show up in the Wall of the user/application/page with the id specified
	 */
	obj.getPosts = function (id, offset, limit, since, until){
		
		var params = {};
		if(offset != null){
			params.offset = offset;
		}
		if(limit != null){
			params.limit = limit;
		}
		if(since != null){
			params.since = since;
		}
		if(until != null){
			params.until = until;
		}
		
		if(obj.userData.id != 'undefined')
		{
			
			if(obj.getPermissions("read_stream").length>0){
				
				return false;
			}
			
			if(id != "" && id != "undefined" && id != null){
				FB.api('/'+id+'/posts', params, getPostsComplete);
			}else{
			   FB.api('/me/posts', params, getPostsComplete);
			}
		}else{
			return false;
		}
		
		function getPostsComplete(response)
	   {
			if (!response || response.error) {
				obj.debug('getPosts: Error occured');
				obj.dispatchEvent(FBAPIClient.events.POSTS_ERROR, null);
			} else {
				obj.debug('getPosts: response received');
				obj.dispatchEvent(FBAPIClient.events.POSTS_LOADED, response);
			}
	   }
		
		return true;
	}
	
	/**
	 * Returns a collection of status messages (only, no posts) 
	 * authored by the current user ('me') if no id is specified. 
	 * The id may be of a user, application or public page.
	 * Only status messages sent to "everyone"(public) will be returned.
	 * These status messages usually show up in the Wall of the user/application/page with the id specified
	 */
	obj.getStatuses = function (id, offset, limit, since, until){
		
	}
	
	/**
	 * Returns a collection of posts and status messages authored by the current user or published on her wall or page wall.
	 * Only posts and status messages sent to "everyone"(public) will be returned.
	 * These posts and status messages usually show up in the Wall of the current user.
	 */
	obj.getWallFeed = function (id, offset, limit, since, until, ispublic, isowner){
		
		var params = {};
		if(offset != null){
			params.offset = offset;
		}
		if(limit != null){
			params.limit = limit;
		}
		if(since != null){
			params.since = since;
		}
		if(until != null){
			params.until = until;
		}
		
		//se n�o for uma wall p�blica (Page ou App)
		if(!ispublic && ispublic === undefined)
		{
			//s� se existir um user em sess�o
			if(obj.userData.id != 'undefined')
			{
				//e as permiss�es aplic�veis tiverem sido dadas
				if(obj.getPermissions("read_stream").length>0){
					return false;
				}
				
				if(id != "" && id != "undefined" && id != null){
					if(typeof isowner === 'undefined'){
						FB.api('/'+id+'/feed', params, getFeedComplete);
					}else{
						FB.api('/'+id+'/posts', params, getFeedComplete);
					}
				}else{
					if(typeof isowner === 'undefined'){
						FB.api('/me/feed', params, getFeedComplete);
					}else{
						FB.api('/me/posts', params, getFeedComplete);
					}
				}
			
			}else{
				return false;
			}
		}else{
			obj.debug('getWallFeed: public');
			//� uma p�gina p�blica...
			//s� se tiver sido fornecido um id
			if(id != "" && id !== undefined && id != null){
				obj.debug('getWallFeed: id ok');
				//se n�o houver um user em sess�o (n�o existe um token activo),
				//usa a app token (m�dulo application)
				if(!obj.userData.id || obj.userData.id === undefined)
				{
					obj.debug('getWallFeed: no user');
					//s� continua se houver um token j� previamente pedido e guardado (m�dulo application)
					if(obj.app_access_token != ""){
						obj.debug('getWallFeed: token ok,param set');
						params.access_token = obj.app_access_token;
					}else{
						return false;
					}	
				}
				obj.debug('getWallFeed: about to send');
				if(typeof isowner === 'undefined'){
					FB.api('/'+id+'/feed', params, getFeedComplete);
				}else{
					FB.api('/'+id+'/posts', params, getFeedComplete);
				}
				
			}else{
				return false;
			}
		}
			
		
		function getFeedComplete(response)
	   {
			if (!response || response.error) {
				obj.debug('getWallFeed: Error occured');
				obj.dispatchEvent(FBAPIClient.events.WALLFEED_ERROR, null);
			} else {
				obj.debug('getWallFeed: response received');
				obj.dispatchEvent(FBAPIClient.events.WALLFEED_LOADED, response);
			}
	   }
		
		return true;
	}
	
	/**
	 * Returns a collection of posts and status messages that usually show up on the current user Home.
	 * This include content authored by the user herself (that are also returned by the above method getWallFeed)
	 * and content from friends and facebook entities to which the user is connected (for instance, pages she likes or apps she is using)
	 * Only content sent to "everyone"(public) or to the current logged user (if from a friend) will be returned.
	 */
	obj.getHomeFeed = function (offset, limit, since, until){
		
		var params = {};
		if(offset != null){
			params.offset = offset;
		}
		if(limit != null){
			params.limit = limit;
		}
		if(since != null){
			params.since = since;
		}
		if(until != null){
			params.until = until;
		}
		
		if(obj.userData.id != 'undefined')
		{
			
			if(obj.getPermissions("read_stream").length>0){
				
				return false;
			}
			FB.api('/me/home', params, getFeedComplete);
		}else{
			return false;
		}
		
		function getFeedComplete(response)
	   {
			if (!response || response.error) {
				obj.debug('getHomeFeed: Error occured');
				obj.dispatchEvent(FBAPIClient.events.HOMEFEED_ERROR, null);
			} else {
				obj.debug('getHomeFeed: response received');
				obj.dispatchEvent(FBAPIClient.events.HOMEFEED_LOADED, response);
			}
	   }
		
		return true;
	}
}

FBAPIClient.modules.application = function(obj){
	
	//Be sure to set the apy key and apy secret in the server file.
	obj.getAppToken = function (proxy){
		
		obj.JsonP(proxy,handleResponse);
		
		function handleResponse(response){
			obj.app_access_token = response;
			obj.dispatchEvent(FBAPIClient.events.APP_TOKEN_RESPONSE, response);
			
		};
			     
	};
	
	obj.inviteFriendsToApp = function (message, title){
		
		if(obj.userData.id != 'undefined')
		{
				
			FB.ui(
					{
						method: 'apprequests',
					    message: message,
					    data: 'convite para a extraordin�ria aplica��o',
					    filters: ['all','app_non_users','app_users'],
						title: title
					}, 
					inviteFriendsHandler);
		}else{
			return false;
		}
		
		function inviteFriendsHandler(response) {
			
			if (!response || response.error || response.request_ids == null || response.request_ids == "") {
				obj.debug('PostUI: Error occured');
				obj.dispatchEvent(FBAPIClient.events.INVITATION_ERROR, response);
			} else {
				obj.debug('PostUI: post ID - ' + response.id);
				obj.dispatchEvent(FBAPIClient.events.INVITATION_COMPLETE, response);
			}
		}

		return true;
	};
	
	
};

FBAPIClient.modules.fbql = function(obj){
	
	/**
		arguments: query:String, args...
		Parameters may be used in the query, e.g.:
		query("SELECT uid, name, pic_square FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me()) and last_name = {0} and sex = {1}", "Smith", "female");
		
	*/
	obj.query = function (query){
		
		var params = {};
		if(obj.app_access_token != ""){
			obj.debug('getWallFeed: token ok,param set');
			params.access_token = obj.app_access_token;
		}else{
			return false;
		}
		
		FB.api('/fql?q='+encodeURIComponent(query), params, getQueryComplete);
		
		function getQueryComplete(response)
		{
			if (!response || response.error) {
				obj.debug('query: error occured');
				obj.dispatchEvent(FBAPIClient.events.QUERY_RESPONSE, null);
			} else {
				obj.debug('query: response received');
				obj.dispatchEvent(FBAPIClient.events.QUERY_RESPONSE, response);
			}
		}
	}

	
	
}


