var TODO = {
	ENTER_KEYCODE : 13,
	init : function(){
		document.addEventListener("DOMContentLoaded",function(){
			this.get(function(){
				document.getElementById("new-todo").addEventListener("keydown",this.add.bind(this));	
			}.bind(this));
		}.bind(this));
	},
	initEventBind : function(){
		document.getElementById("todo-list").addEventListener("click",this.eventFilter.bind(this));
	},
	eventFilter : function(e){
		var ele = e.target;
		var tagName = ele.tagName.toLowerCase();
		if(tagName=="input"){
			this.completed(ele);
		}else if(tagName=="button"){
			this.remove(ele.parentNode.parentNode);
		}
	},
	build : function(todo,key){
		var li = document.createElement("li");
		li.dataset.key = key;
		var div = document.createElement("div");
		div.className = "view";

		var input = document.createElement("input");
		input.className = "toggle";
		input.setAttribute("type","checkbox");
		// input.addEventListener("click",this.completed);

		var label = document.createElement("label");
		label.innerText = todo;

		var button = document.createElement("button");
		button.className = "destroy";
		// button.addEventListener("click",this.remove);

		div.appendChild(input);
		div.appendChild(label);
		div.appendChild(button);

		li.appendChild(div);

		return li;
	},
	completed : function(input){
		// var input = e.currentTarget;
		var li = input.parentNode.parentNode;
		var completed = input.checked?"1":"0";

		TODOSync.completed({
			"key" : li.dataset.key,
			"completed" : completed
		},function(){
			if(completed==="1"){
				li.className = "completed";
			}else{
				li.className = "";		
			}	
		});
	},
	remove : function(li){

		TODOSync.remove(li.dataset.key, function(json){
			var i = 0;
			var key = setInterval(function(){
				if(i===50){
					clearInterval(key);
					li.parentNode.removeChild(li);
				}
				li.style.opacity = 1 - i*0.02;
				i++;
			},16);
		});
		
	},
	add : function(e){
		if(e.keyCode === this.ENTER_KEYCODE){
			var todo = document.getElementById("new-todo").value;

			TODOSync.add(todo, function(json){
				var todoLi = this.build(todo,json.insertId);
				todoLi.style.opacity = 0;
				var todoUl = document.getElementById("todo-list");
				todoUl.insertBefore(todoLi, todoUl.firstChild);
				var i = 0;
				var key = setInterval(function(){
					if(i===50){
						clearInterval(key);
					}else{
						todoLi.style.opacity = i*0.02;
					}
					i++;
				},16);

				document.getElementById("new-todo").value = "";
			}.bind(this));
		}
	},
	get:function(callback){
		TODOSync.get(function(json){
			document.getElementById("todo-list").innerHTML = Template.todoList(json);
			this.initEventBind();
			callback();
		}.bind(this));
	}
};
TODO.init();
