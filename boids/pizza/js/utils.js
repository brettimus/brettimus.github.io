function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
    return xhr;
}

function onDomReady(next) {
  document.body.className += " javascript";

  /**
   * From: https://stackoverflow.com/questions/1795089/how-can-i-detect-dom-ready-and-add-a-class-without-jquery/1795167#1795167
   */
  // Mozilla, Opera, Webkit 
  if ( document.addEventListener ) {
    document.addEventListener( "DOMContentLoaded", function(){
      document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
      if (next) next();
    }, false );

  // If IE event model is used
  } else if ( document.attachEvent ) {
    // ensure firing before onload
    document.attachEvent("onreadystatechange", function(){
      if ( document.readyState === "complete" ) {
        document.detachEvent( "onreadystatechange", arguments.callee );
        if (next) next();
      }
    });
  }
}