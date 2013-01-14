Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
}

String.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
}

Notification = {
	
	generic : function(msg, header, type) {
		if (typeof(header) == 'undefined')
			header = type;
			
		$.jGrowl(msg, {header : header, life:8000, theme: type});
	},
	
	info : function(msg, header) {
		Notification.generic(msg, header, 'info');
	},
	
	error : function(msg, header) {
		Notification.generic(msg, header, 'error');
	},
	
	help : function(msg, header) {
		Notification.generic(msg, header, 'help');
	},
	
	alert : function(msg, header) {
		Notification.generic(msg, header, 'alert');
	}
	
}


function getUrlVars(varName)
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    
	return varName? vars[varName] : vars;
}