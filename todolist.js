var ENTER_KEYCODE = 13;

function makeTODO(todo){

	var li = document.createElement("li");

	var div = document.createElement("div");
	div.className = "view";

	var input = document.createElement("input");
	input.className = "toggle";
	input.setAttribute("type","checkbox");
	input.addEventListener("click",completedTODO);

	var label = document.createElement("label");
	label.innerText = todo;

	var button = document.createElement("button");
	button.className = "destroy";
	button.addEventListener("click",removeTODO);

	div.appendChild(input);
	div.appendChild(label);
	div.appendChild(button);

	li.appendChild(div);

	return li;
}

function completedTODO(e){
	var input = e.currentTarget;
	var li = input.parentNode.parentNode;
	if(input.checked){
		li.className = "completed";

	}else{
		li.className = "";		
	}
}

function removeTODO(e){
	var li = e.currentTarget.parentNode.parentNode;
	var i = 0;
	var key = setInterval(function(){
		if(i===50){
			clearInterval(key);
			li.parentNode.removeChild(li);
		}else{
			li.style.opacity = 1 - i*0.02;
		}
		i++;
	},16);

}


function addTODO(e){
	if(e.keyCode === ENTER_KEYCODE){
		var todo = makeTODO(document.getElementById("new-todo").value);
		todo.style.opacity = 0;
		document.getElementById("todo-list").appendChild(todo);

		var i = 0;
		var key = setInterval(function(){
			if(i===50){
				clearInterval(key);
			}else{
				todo.style.opacity = i*0.02;
			}
			i++;
		},16);


		document.getElementById("new-todo").value = "";

	}
}

document.addEventListener("DOMContentLoaded",function(){
	document.getElementById("new-todo").addEventListener("keydown",addTODO);
});



