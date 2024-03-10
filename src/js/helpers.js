import {todosData, STATUS} from './data.js';
import {buildTemplate} from './templates.js';
import {addTodoListItem, inProgressListElement, doneListElement} from './app.js';
import {updateTaskCount} from './utils.js';

// $
function $(selector) {
  return document.querySelector(selector);
}
// $$
function $$(selector) {
  return [...document.querySelectorAll(selector)];
}

function getTodosFromLocalstorage() {
  const todosData = localStorage.getItem('todosData');

  if (todosData) {
    const parseTodos = JSON.parse(todosData);

    parseTodos.forEach(task => {
      task.createdAt = new Date(task.createdAt);
    });
    return parseTodos;
  }
  return [];
}

function setTodosToLocalstorage(todosData) {
  localStorage.setItem('todosData', todosData ? JSON.stringify(todosData) : '');
}

function renderData() {
  let todoHtml = [],
    progressHtml = [],
    doneHtml = [];

  todosData.forEach(task => {
    const item = buildTemplate(task);
    task.status === STATUS.TODO && todoHtml.push(item);
    task.status === STATUS.IN_PROGRESS && progressHtml.push(item);
    task.status === STATUS.DONE && doneHtml.push(item);
  });

  addTodoListItem.innerHTML = todoHtml.join('');
  inProgressListElement.innerHTML = progressHtml.join('');
  doneListElement.innerHTML = doneHtml.join('');

  updateTaskCount();
}

export {$, $$, getTodosFromLocalstorage, setTodosToLocalstorage, renderData};
