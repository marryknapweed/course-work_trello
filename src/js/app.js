import {renderData, $, $$, setTodosToLocalstorage} from './helpers.js';
import {todosData, STATUS} from './data.js';
import {
  handleSaveChanges,
  handleClickRemoveButton,
  handleStatusChange,
  handleClickEditButton,
  handleDeleteAllDone,
} from './handlers.js';

// Вызовы
const todoListElement = $$('.todo__content');
const addTodoListElement = $('#todoList');
const inProgressListElement = $('.in-progress__content');
const doneListElement = $('.done__content');
const saveChangesButtonAddElement = $('#saveChanges');
const modalTitleInputElement = $('#addCardTitle');
const modalDescriptionInputElement = $('#addCardDescription');
const modalAddUserSelectElement = $('#addUserSelect');
const cardSelectorElement = $('.cardSelectorElement');
const deleteAllButtonElement = $('.deleteTodoBtn');
const deleteAllDoneModal = $('#deleteAllDoneModal');
const confirmDeleteButtonElement = $('#confirmDelete');

export {
  todoListElement,
  addTodoListElement,
  inProgressListElement,
  doneListElement,
  saveChangesButtonAddElement,
  modalTitleInputElement,
  modalDescriptionInputElement,
  modalAddUserSelectElement,
  cardSelectorElement,
  deleteAllButtonElement,
  deleteAllDoneModal,
  confirmDeleteButton,
};

if (todosData.length > 0) {
  renderData();
}

// События

saveChangesButtonAddElement.addEventListener('click', handleSaveChanges);

todoListElement.forEach(element => {
  element.addEventListener('change', handleStatusChange);
});

todoListElement.forEach(button => {
  button.addEventListener('click', handleClickRemoveButton);
});

// $('.todo-item__edit-btn').addEventListener('click', handleClickEditButton);

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
// Функция для заполнения выпадающего списка
async function loadUsersAndPopulateSelect() {
  const modalAddUserSelectElement = document.getElementById('addUserSelect');
  const modalEditUserSelect = document.getElementById('editUserSelect');

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
