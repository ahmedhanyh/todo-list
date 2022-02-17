import { Todo, todoView } from "./todo/todo";

const todo = Todo('todo title', 'desc', new Date(), 1);
todoView(todo);
