import { Todo, Project, todoView, projectView } from "./todo/todo";

const todo = Todo('todo title', 'desc', new Date(), 1);
const project = Project('project title');
project.addTodo(todo);
projectView(project);
