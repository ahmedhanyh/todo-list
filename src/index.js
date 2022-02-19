import { Todo, Project, eventAggregator } from "./todo";

const addProjectBtn = document.createElement('button');
addProjectBtn.textContent = 'Add project';
addProjectBtn.addEventListener('click', () => {
    const projectTitle = prompt('Enter a title for your project:');
    eventAggregator.publish('projectAdded', projectTitle);
});
document.body.appendChild(addProjectBtn);

if (!localStorage.length) {
    Project('project title');
} else {
    retrieveData();
}

function retrieveData() {
    const projects = JSON.parse(localStorage.getItem("projects"));
    Object.keys(projects)
      .forEach(projectTitle => {
          Project(projectTitle);
          projects[projectTitle].todos
            .forEach(todo => {
                const { title, description, dueDate, priority, project, complete } = todo;
                Todo(title, description, dueDate, priority, project, complete);
            });
      });
}