const projects = {};

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
    view.innerHTML = `<summary><p class="todo-title">${todo.title}</p><p>${todo.dueDate.getFullYear()}</p></summary>`;
    view.innerHTML += `<p>${todo.description}</p><p>Priority: ${todo.priority}</p>`;

    const markAsCompleteBtn = document.createElement('button');
    markAsCompleteBtn.classList.add('mark-as-complete');
    markAsCompleteBtn.textContent = 'Mark as complete';
    markAsCompleteBtn.addEventListener('click', todo.markAsComplete);
    view.appendChild(markAsCompleteBtn);

    const removeTodoBtn = document.createElement('button');
    removeTodoBtn.classList.add('remove-todo-btn');
    removeTodoBtn.textContent = 'Remove todo';
    removeTodoBtn.addEventListener('click', () => {
        projects[todo.project].removeTodo(todo.title);
        view.remove();
    });
    view.appendChild(removeTodoBtn);

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
        removeTodo: function(todoTitle) {
            const index = this.todos.findIndex(todo => todo.title === todoTitle);
            this.todos.splice(index, 1);
        },
    }

    const projectObj = Object.assign(Object.create(proto), obj);
    projects[title] = projectObj;
    return projectObj;
}

function projectView(project) {
    const projectDiv = document.createElement('div');
    projectDiv.classList.add('project');
    projectDiv.setAttribute('data-id', project.title);
    projectDiv.innerHTML = `<h1>${project.title}</h1>`;

    const addTodoBtn = document.createElement('button');
    addTodoBtn.classList.add('add-todo-btn');
    addTodoBtn.textContent = 'Add todo';
    addTodoBtn.addEventListener('click', () => {
        const todoTitle = prompt('Enter todo title:', 'todo title');
        const todoDescription = prompt('Enter todo description:', 'todo desc');
        const todo = Todo(todoTitle, todoDescription, new Date(), 1, project.title);
        project.addTodo(todo);
        todoView(todo);
    });
    projectDiv.appendChild(addTodoBtn);

    document.body.appendChild(projectDiv);
    project.todos.forEach(todo => {
        todoView(todo);
    });
}

export { Todo, todoView, Project, projectView };