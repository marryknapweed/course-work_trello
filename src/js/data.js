import {getTodosFromLocalstorage} from './helpers.js';

const todosData = getTodosFromLocalstorage();

function createTodo(title, description, user, status) {
  const tasks = {
    id: Date.now(),
    title,
    description,
    user,
    createdAt: new Date(),
    status,
  };
  return tasks;
}

const STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
};
export {todosData, createTodo, STATUS};
