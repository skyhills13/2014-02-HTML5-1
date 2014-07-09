var ENTER_KEYCODE = 13;

function makeTODO(todo){

	var li = document.createElement("li");

	var div = document.createElement("div");
	div.className = "view";

	var input = document.createElement("input");
	input.className = "toggle";
	input.setAttribute("type","checkbox");

	var label = document.createElement("label");
	label.innerText = todo;

	var button = document.createElement("button");
	button.className = "destroy";

	div.appendChild(input);
	div.appendChild(label);
	div.appendChild(button);

	li.appendChild(div);

	return li;
}


function addTODO(e){
	if(e.keyCode === ENTER_KEYCODE){
		var todo = makeTODO(document.getElementById("new-todo").value);
		document.getElementById("todo-list").appendChild(todo);
		document.getElementById("new-todo").value = "";

	}
}

document.addEventListener("DOMContentLoaded",function(){
	document.getElementById("new-todo").addEventListener("keydown",addTODO);
});
