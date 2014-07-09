var TODOSync = {
	url : "http://ui.nhnnext.org:3333/",
	add : function(param,callback){
		var xhr = new XMLHttpRequest();
		xhr.open('PUT', this.url+param.id, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load",function(e) {
			if (this.status == 200) {
				callback(JSON.parse(this.responseText));
			}
		});
		xhr.send("todo="+param.todo);
	},
	completed : function(param,callback){
		var xhr = new XMLHttpRequest();
		xhr.open('POST', this.url+param.id+"/"+param.key, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load",function(e) {
			if (this.status == 200) {
				callback(JSON.parse(this.responseText));
			}
		});
		xhr.send("completed="+param.completed);
	},
	remove : function(param,callback){
		var xhr = new XMLHttpRequest();
		xhr.open('DELETE', this.url+param.id+"/"+param.key, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load",function(e) {
			if (this.status == 200) {
				callback(JSON.parse(this.responseText));
			}
		});

		xhr.send();
	},
	get : function(param,callback){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', this.url+param.id, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load",function(e) {
			if (this.status == 200) {
				callback(JSON.parse(this.responseText));
			}
		});
		xhr.send();
	}
};

var TODO = {
	ENTER_KEYCODE :13,
	init : function(){
		document.addEventListener("DOMContentLoaded",function(){
			var todoInput = document.getElementById("new-todo");
			TODO.todoInput = todoInput;
			todoInput.addEventListener("keydown",TODO.add.bind(TODO));
		});
	},
	build : function(key,todo){
		var li = document.createElement("li");
		li.dataset.key = key;

		var div = document.createElement("div");
		div.className = "view";

		var input = document.createElement("input");
		input.className = "toggle";
		input.setAttribute("type","checkbox");
		input.addEventListener("click",this.completed);

		var label = document.createElement("label");
		label.innerText = todo;

		var button = document.createElement("button");
		button.className = "destroy";
		button.addEventListener("click",this.remove);

		div.appendChild(input);
		div.appendChild(label);
		div.appendChild(button);

		li.appendChild(div);

		return li;
	},
	completed : function(e){
		var input = e.currentTarget;
		var li = input.parentNode.parentNode;
		if(input.checked){
			li.className = "completed";

		}else{
			li.className = "";		
		}
	},
	remove : function(e){
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
	},
	add : function(e){
		if(e.keyCode === this.ENTER_KEYCODE){
			TODOSync.add({
				id : "mixed",
				todo : this.todoInput.value
			},function(data){
				var todo = this.build(data.insertId,this.todoInput.value);
				todo.style.opacity = 0;
				document.getElementById("todo-list").appendChild(todo);

				var i = 0;
				var key = setInterval(function(){
					if(i===50){
						clearInterval(key);
					}
					todo.style.opacity = i*0.02;
					i++;
				},16);

				document.getElementById("new-todo").value = "";
			}.bind(this));
		}
	}
};

TODO.init();


