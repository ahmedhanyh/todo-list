import { Project, eventAggregator } from "./todo";

const addProjectBtn = document.createElement('button');
addProjectBtn.textContent = 'Add project';
addProjectBtn.addEventListener('click', () => {
    const projectTitle = prompt('Enter a title for your project:');
    eventAggregator.publish('projectAdded', projectTitle);
});
document.body.appendChild(addProjectBtn);

localStorage.setItem("projects", JSON.stringify({}));

Project('project title');