// Load the SDK Asynchronously
/**
Include the following tag after the body tag:
<div id="fb-root"></div>

Define an init() function in the window/global namespace

*/    
	(function(d){
       var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement('script'); js.id = id; js.async = true;
       js.src = "//connect.facebook.net/en_US/all.js";
       ref.parentNode.insertBefore(js, ref);
     }(document));

    // Init the SDK upon load
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '264757703414', // App ID
        channelUrl : '//'+window.location.hostname+'/channel.txt', // Path to your Channel File
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
      });
      
      init();
    };