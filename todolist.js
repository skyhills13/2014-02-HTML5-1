var TODO = {
	ENTER_KEYCODE : 13,
	init : function(){
		this.navigators = document.querySelectorAll("#filters a");
		this.currentSelectedNavigator = 0;
		this.get(function(){
			document.getElementById("new-todo").addEventListener("keydown",this.add.bind(this));	
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

		var label = document.createElement("label");
		label.innerText = todo;

		var button = document.createElement("button");
		button.className = "destroy";

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
	},
	selectedNavigator : function(index){
		this.navigators[this.currentSelectedNavigator].classList.remove("selected");
		this.navigators[index].classList.add("selected");
		this.currentSelectedNavigator = index;
	},
	allView : function(){
		this.selectedNavigator(0);
		document.getElementById("todo-list").className = "";
	},
	activeView : function(){
		this.selectedNavigator(1);
		document.getElementById("todo-list").className = "";
		document.getElementById("todo-list").className = "all-active";
	},
	completedView : function(){
		this.selectedNavigator(2);
		document.getElementById("todo-list").className = "";
		document.getElementById("todo-list").className = "all-completed";
	}
};




var TODOHistory = {
	"init" : function(){
		window.addEventListener("popstate",this.historyFilter);
		document.getElementById("filters").addEventListener("click",this.clickFilter);

	},
	"clickFilter":function(e){
		e.preventDefault();
		var anchor = e.target;
		var tagName = e.target.tagName.toLowerCase();
		if(tagName=="li"){
			anchor = e.target.firstElementChild;
		}else if(tagName=="ul"){
			return;
		}
		
		var location = anchor.getAttribute("href");
		var method = location;
		if(location=="index.html"){method = "all"}
		history.pushState({"method":method}, null, location);

		TODO[method+"View"]();
	},
	"historyFilter" : function(e){
		var method;
		if(e.state==null){
			method = "all";
		}else{
			method = e.state.method;
		}
		TODO[method+"View"]();	
	}

};

document.addEventListener("DOMContentLoaded",function(){
	TODO.init();
	TODOHistory.init();
});











