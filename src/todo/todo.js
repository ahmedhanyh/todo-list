function Todo(title, description, dueDate, priority, project = 'project title') {
    const obj = { title, description, dueDate, priority, complete: false, project };
    const proto = {
        markAsComplete: function() {
            this.complete = !this.complete;
            console.log(this.complete);
        },
    }
    const todoObj = Object.assign(Object.create(proto), obj);
    return todoObj;
}

function todoView(todo) {
    const view = document.createElement('details');
    view.innerHTML = `<summary>${todo.title}</summary>${todo.description}`
    document.querySelector(`.project[data-id="${todo.project}"]`)
      .appendChild(view);
}

function Project(title) {
    const todos = [];

    const obj = { title, todos };
    const proto = {
        addTodo: function(todo) {
            this.todos.push(todo);
        },
        removeTodo: function(todo) {
            const index = this.todos.findIndex(todo);
            this.todos.splice(index, 1);
        },
    }

    const projectObj = Object.assign(Object.create(proto), obj);
    return projectObj;
}

function projectView(project) {
    const projectDiv = document.createElement('div');
    projectDiv.classList.add('project');
    projectDiv.setAttribute('data-id', project.title);
    projectDiv.innerHTML = `<h1>${project.title}</h1>`;
    document.body.appendChild(projectDiv);
    project.todos.forEach(todo => {
        todoView(todo);
    });
}

export { Todo, todoView, Project, projectView };