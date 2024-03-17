import {renderData, $, $$} from './helpers.js';
import {todosData} from './data.js';
import {
  handleSaveAddTask,
  handleClickRemoveButton,
  handleStatusChange,
  handleClickEditButton,
  handleDeleteAllDone,
} from './handlers.js';
import {Modal, Select} from 'bootstrap';

const todoListElement = $$('.todo__content');
const addTodoListElement = $('#todoList');
const inProgressListElement = $('.in-progress__content');
const doneListElement = $('.done__content');
const modalTitleInputElement = $('#addCardTitle');
const modalDescriptionInputElement = $('#addCardDescription');
const modalAddUserSelectElement = $('#addUserSelect');
const confirmDeleteButtonElement = $('#confirmDelete');
const addFormELement = $('#todoForm');
const editFormElement = $('#editTodoForm');

export {
  todoListElement,
  addTodoListElement,
  inProgressListElement,
  doneListElement,
  modalTitleInputElement,
  modalDescriptionInputElement,
  modalAddUserSelectElement,
  confirmDeleteButtonElement,
  editFormElement,
};

// проверяем наличие данных в списке задач и рендерим их, если они есть
if (todosData.length > 0) {
  renderData();
}

addFormELement.addEventListener('submit', handleSaveAddTask);

todoListElement.forEach(element => {
  element.addEventListener('change', handleStatusChange);
});

todoListElement.forEach(button => {
  button.addEventListener('click', handleClickRemoveButton);
});

todoListElement.forEach(button => {
  button.addEventListener('click', handleClickEditButton);
});

confirmDeleteButtonElement.addEventListener('click', handleDeleteAllDone);

// Функция для загрузки пользователей с сервера
async function fetchUsers() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (response.status === 200) {
      const users = await response.json();
      return users;
    }
    return Promise.reject(`Error: ${response.status}: ${response.statusText}`);
  } catch (error) {
    console.error(error);
  }
}
// Функция для заполнения выпадающего списка после загрузки с сервера
async function loadUsersAndPopulateSelect() {
  const modalAddUserSelectElement = $('#addUserSelect');
  const modalEditUserSelect = $('#editUserSelect');

  try {
    const users = await fetchUsers();
    users.forEach(user => {
      const optionAdd = document.createElement('option');
      const optionEdit = optionAdd.cloneNode(true);

      optionAdd.textContent = user.name;
      optionEdit.textContent = user.name;

      modalAddUserSelectElement.append(optionAdd);
      modalEditUserSelect.append(optionEdit);
    });
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadUsersAndPopulateSelect();
});
