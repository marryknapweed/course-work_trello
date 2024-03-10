import {renderData, $, $$, setTodosToLocalstorage} from './helpers.js';
import {todosData, STATUS} from './data.js';
import {handleSaveChanges, handleClickRemoveButton, handleStatusChange} from './handlers.js';

// Вызовы
todoListElement = $$('.todo__content');
addTodoListItem = $('#todoList');
inProgressListElement = $('.in-progress__content');
doneListElement = $('.done__content');
saveChangesBtnAdd = $('#saveChanges');
modalTitleInput = $('#addCardTitle');
modalDescriptionInput = $('#addCardDescription');
modalAddUserSelect = $('#addUserSelect');
cardSelector = $('.cardSelector');
deleteAllButton = $('.deleteTodoBtn');
deleteAllDoneModal = $('#deleteAllDoneModal');
confirmDeleteButton = $('#confirmDelete');

export {
  todoListElement,
  addTodoListItem,
  inProgressListElement,
  doneListElement,
  saveChangesBtnAdd,
  modalTitleInput,
  modalDescriptionInput,
  modalAddUserSelect,
  cardSelector,
  deleteAllButton,
  deleteAllDoneModal,
  confirmDeleteButton,
};

// События
saveChangesBtnAdd.addEventListener('click', handleSaveChanges);

todoListElement.forEach(element => {
  element.addEventListener('change', handleStatusChange);
});

todoListElement.forEach(button => {
  button.addEventListener('click', handleClickRemoveButton);
});

if (todosData.length > 0) {
  renderData();
}

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
  const modalAddUserSelect = document.getElementById('addUserSelect');
  const modalEditUserSelect = document.getElementById('editUserSelect');

  try {
    const users = await fetchUsers();
    users.forEach(user => {
      const optionAdd = document.createElement('option');
      const optionEdit = optionAdd.cloneNode(true);

      optionAdd.textContent = user.name;
      optionEdit.textContent = user.name;

      modalAddUserSelect.append(optionAdd);
      modalEditUserSelect.append(optionEdit);
    });
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadUsersAndPopulateSelect();
});

// изменение задачи

function handleClickEditButton({target}) {
  const {role} = target.dataset;

  if (role === 'edit') {
    const todoElement = target.closest('.todo-item');
    const id = todoElement.dataset.id;
    const task = todosData.find(task => task.id === +id);

    // Заполняем модальное окно данными задания
    $('#editCardTitle').value = task.title;
    $('#editCardDescription').value = task.description;
    $('#addUserSelect').value = task.user;

    // Показать модальное окно
    const editModal = new bootstrap.Modal($('#editModal'));
    editModal.show();

    // Добавляем обработчик события для кнопки "Save" внутри модального окна редактирования
    $('#editSaveChanges').addEventListener('click', function () {
      // Получаем значения из полей формы
      const editedTitle = $('#editCardTitle').value;
      const editedDescription = $('#editCardDescription').value;
      const editedUser = $('#editUserSelect').value;

      // Обновляем данные задачи
      task.title = editedTitle;
      task.description = editedDescription;
      task.user = editedUser;

      // Закрываем модальное окно
      editModal.hide();
      renderData();
      setTodosToLocalstorage(todosData);
    });
  }
}

// Добавляем обработчик событий для кнопок "Edit"
document.querySelectorAll('.todo-item__edit-btn').forEach(button => {
  button.addEventListener('click', handleClickEditButton);
});

// удаляем задания из Done
const modal = new bootstrap.Modal(deleteAllDoneModal);

deleteAllButton.addEventListener('click', function () {
  modal.show();
});

confirmDeleteButton.addEventListener('click', function () {
  handleDeleteAllDone();
  modal.hide();
});

// Функция для удаления всех задач из "DONE"
function handleDeleteAllDone() {
  const filteredTodosData = todosData.filter(task => task.status !== STATUS.DONE);
  todosData.length = 0;
  filteredTodosData.forEach(task => todosData.push(task));
  setTodosToLocalstorage(todosData);
  renderData();
}
