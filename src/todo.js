const projects = {};

function Event(name) {
    this._handlers = [];
    this.name = name;
}
Event.prototype.addHandler = function(handler) {
    this._handlers.push(handler);
};
Event.prototype.removeHandler = function(handler) {
    for (var i = 0; i < handlers.length; i++) {
        if (this._handlers[i] == handler) {
            this._handlers.splice(i, 1);
            break;
        }
    }
};
Event.prototype.fire = function(eventArgs) {
    this._handlers.forEach(function(h) {
        h(eventArgs);
    });
};

var eventAggregator = (function() {
    var events = [];

    function getEvent(eventName) {
        return events.find(event => event.name === eventName);
    }

    return {
        publish: function(eventName, eventArgs) {
            var event = getEvent(eventName);

            if (!event) {
                event = new Event(eventName);
                events.push(event);
            }
            event.fire(eventArgs);
        },

        subscribe: function(eventName, handler) {
            var event = getEvent(eventName);

            if (!event) {
                event = new Event(eventName);
                events.push(event);
            }

            event.addHandler(handler);
        }
    };
})();

function Todo(title, description, dueDate, priority, project = 'project title') {
    const obj = { title, description, dueDate, priority, complete: false, project };
    const proto = {
        markAsComplete: function() {
            this.complete = !this.complete;
        },
        changePriority: function(newPriority) {
            this.priority = newPriority;
        },
    }
    const todoObj = Object.assign(Object.create(proto), obj);
    eventAggregator.publish('todoAdded', todoObj);
    return todoObj;
}

const todoView = (function() {
    eventAggregator.subscribe('todoAdded', function(todo) {
        const view = document.createElement('details');
        view.innerHTML = `<summary><p class="todo-title">${todo.title}</p><p>${todo.dueDate.getFullYear()}</p></summary>`;
        view.innerHTML += `<p class="todo-description">${todo.description}</p><p>Priority: <span class="priority">${todo.priority}</span></p>`;
    
        const markAsCompleteBtn = document.createElement('button');
        markAsCompleteBtn.textContent = 'Mark as complete';
        markAsCompleteBtn.addEventListener('click', () => {
            todo.markAsComplete();
            if (todo.complete) {
                view.style.color = 'green';
                markAsCompleteBtn.textContent = 'Mark as incomplete';
            } else {
                view.style.color = 'black';
                markAsCompleteBtn.textContent = 'Mark as complete';
            }
        });
    
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
            const todoTitle = prompt('Enter todo title (Press enter to skip):', todo.title);
            const todoDescription = prompt('Enter todo description (Press enter to skip):', todo.description);
            todo.title = todoTitle;
            todo.description = todoDescription;
            view.querySelector('.todo-title').textContent = todoTitle;
            view.querySelector('.todo-description').textContent = todoDescription;
        });
        
        const changePriorityBtn = document.createElement('button');
        changePriorityBtn.textContent = 'Change priority';
        changePriorityBtn.addEventListener('click', () => {
            let todoPriority = prompt('Enter a number from 1 through 3', todo.priority);
            while (todoPriority < 1 || todoPriority > 3) {
                todoPriority = prompt('Try again. Enter a number from 1 through 3', todo.priority);
            }
            todo.changePriority(todoPriority);
            view.querySelector('.priority').textContent = todoPriority;
        });
        
        const removeTodoBtn = document.createElement('button');
        removeTodoBtn.textContent = 'Remove todo';
        removeTodoBtn.addEventListener('click', () => {
            projects[todo.project].removeTodo(todo.title);
            view.remove();
        });
        
        view.appendChild(markAsCompleteBtn);
        view.appendChild(editBtn);
        view.appendChild(changePriorityBtn);
        view.appendChild(removeTodoBtn);
    
        document.querySelector(`.project[data-id="${todo.project}"]`)
          .appendChild(view);
    });
})();

const todoCreator = (function() {
    eventAggregator.subscribe('todoCreated', function(todoObj) {
        const { todoTitle, todoDescription, dueDate, todoPriority, project } = todoObj;
        Todo(todoTitle, todoDescription, dueDate, todoPriority, project);
    });
})();

const projectController = (function() {
    eventAggregator.subscribe('todoAdded', function(todo) {
        projects[todo.project].addTodo(todo);
    });
})();

function Project(title) {
    const todos = [];

    const obj = { title, todos };
    const proto = {
        addTodo: function(todo) {
            this.todos.push(todo);
        },
        removeTodo: function(todoTitle) {
            const index = this.todos.findIndex(todo => todo.title === todoTitle);
            this.todos.splice(index, 1);
        },
    }

    const projectObj = Object.assign(Object.create(proto), obj);
    projects[title] = projectObj;
    eventAggregator.publish('projectCreated', projectObj);
    return projectObj;
}

const projectCreator = (function() {
    eventAggregator.subscribe('projectAdded', function(projectTitle) {
        Project(projectTitle);
    });
})();

const projectView = (function() {
    eventAggregator.subscribe('projectCreated', function(project) {
        const projectDiv = document.createElement('details');
        projectDiv.classList.add('project');
        projectDiv.setAttribute('data-id', project.title);
        projectDiv.innerHTML = `<summary><h1>${project.title}</h1></summary>`;
    
        const addTodoBtn = document.createElement('button');
        addTodoBtn.classList.add('add-todo-btn');
        addTodoBtn.textContent = 'Add todo';
        addTodoBtn.addEventListener('click', () => {
            const todoTitle = prompt('Enter todo title:', 'todo title');
            const todoDescription = prompt('Enter todo description:', 'todo desc');
            let todoPriority = prompt('Enter a number from 1 through 3', 1);
            while (todoPriority < 1 || todoPriority > 3) {
                todoPriority = prompt('Try again. Enter a number from 1 through 3', 1);
            }
            eventAggregator.publish('todoCreated', { todoTitle, todoDescription, dueDate: new Date(), todoPriority, project: project.title });
        });
        projectDiv.appendChild(addTodoBtn);
    
        document.body.appendChild(projectDiv);
    });
})();

const storeProject = (function() {
    eventAggregator.subscribe('projectCreated', function(project) {
        const projects = JSON.parse(localStorage.getItem("projects"));
        projects[project.title] = project;
        localStorage.setItem("projects", JSON.stringify(projects));
    });
})();

const storeTodo = (function() {
    eventAggregator.subscribe('todoAdded', function(todo) {
        const projects = JSON.parse(localStorage.getItem("projects"));
        const projectObj = projects[todo.project];
        projectObj.todos.push(todo);
        localStorage.setItem("projects", JSON.stringify(projects));
    });
})();

export { Project, eventAggregator };