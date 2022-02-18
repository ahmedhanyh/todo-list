import { Project, eventAggregator } from "./todo/todo";

const addProjectBtn = document.createElement('button');
addProjectBtn.textContent = 'Add project';
addProjectBtn.addEventListener('click', () => {
    const projectTitle = prompt('Enter a title for your project:');
    eventAggregator.publish('projectAdded', projectTitle);
});
document.body.appendChild(addProjectBtn);

Project('project title');