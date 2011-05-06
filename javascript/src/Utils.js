Array.prototype.contains = function(obj) {
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