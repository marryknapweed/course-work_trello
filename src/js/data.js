import {getTodosFromLocalstorage} from './helpers.js';

const todosData = getTodosFromLocalstorage();

class Tasks {
  constructor(title, description, user, status) {
    this.id = Date.now();
    this.title = title;
    this.description = description;
    this.user = user;
    this.createdAt = new Date();
    this.status = status;
  }
}

const STATUSES = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
};
export {todosData, STATUSES, Tasks};
