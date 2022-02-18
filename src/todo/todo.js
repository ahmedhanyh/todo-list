const projects = {};

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
    return todoObj;
}

function todoView(todo) {
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