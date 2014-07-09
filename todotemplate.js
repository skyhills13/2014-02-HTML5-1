var Template = {
	todoList : function(data){
		var str = [];
		str.push("<# for(var i = 0, l = list.length; i < l; i++){ #>");
			str.push("<li class='<#= list[i].completed==\"1\"?\"completed\":\"\" #>' data-key='<#= list[i].id #>'>");
				str.push("<div class='view'>");
					str.push("<input class='toggle' type='checkbox'");
					str.push("<# if(list[i].completed==\"1\"){ #> checked <# } #>");
					str.push(">");
					str.push("<label><#= list[i].todo #></label>");
					str.push("<button class='destroy'></button>");
				str.push("</div>");
			str.push("</li>");
		str.push("<# } #>");
		return parseTemplate(str.join(""),{"list":data});						
	}
};