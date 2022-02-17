function Todo(title, description, dueDate, priority) {
    const obj = { title, description, dueDate, priority, complete: false };
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
    view.innerHTML = `<summary>${todo.title}</summary>${todo.description}`;
    document.body.appendChild(view);
}

export { Todo, todoView };