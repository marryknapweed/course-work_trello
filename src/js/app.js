const STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
};
// $
function $(selector) {
  return document.querySelector(selector);
}
// $$
function $$(selector) {
  return [...document.querySelectorAll(selector)];
}
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

// События
saveChangesBtnAdd.addEventListener('click', handleSaveChanges);

todoListElement.forEach(element => {
  element.addEventListener('change', handleStatusChange);
});

const todosData = getTodosFromLocalstorage();

if (todosData.length > 0) {
  renderData();
}

function buildTemplate({id, title, description, user, createdAt, status}) {
  const time = `${createdAt.getDate()}.${
    createdAt.getMonth() + 1
  }.${createdAt.getFullYear()} ${createdAt.getHours()}:${createdAt.getMinutes()}:${createdAt.getSeconds()}`;
  return `
  <div class="todo-item" data-id="${id}">
    <h3 class="todo-item__title" >${title}</h3>
    <p class="todo-item__description">${description}</p>

    <p class="todo-item__user">
      ${user}<time class="todo-item__date">${time}</time>
    </p>
    <div class="todo-item__buttom">
      <button class="todo-item__edit-btn" data-role="edit">Edit</button>
      <button class="todo-item__delete-btn" data-role="delete">Delete</button>
      <select class="form-control cardSelector" data-id="${id}">
      <option value="TODO" ${status === 'TODO' ? 'selected' : ''}>TODO</option>
      <option value="IN_PROGRESS" ${status === 'IN_PROGRESS' ? 'selected' : ''}>IN PROGRESS</option>
      <option value="DONE" ${status === 'DONE' ? 'selected' : ''}>DONE</option>
      </select>
    </div>
  </div>
  `;
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

function handleSaveChanges() {
  const title = modalTitleInput.value;
  const description = modalDescriptionInput.value;
  const user = modalAddUserSelect.value;
  const status = STATUS.TODO;

  const newTodo = createTodo(title, description, user, status);

  todosData.push(newTodo);

  modalTitleInput.value = '';
  modalDescriptionInput.value = '';
  modalAddUserSelect.value = '';

  const closeButton = $('.btn-close');
  closeButton.click();

  setTodosToLocalstorage(todosData);
  renderData();
}

// удаление задачи
function handleClickRemoveButton({target}) {
  const {role} = target.dataset;

  if (role !== 'delete') return;

  const todoElement = target.closest('.todo-item');
  const id = todoElement.dataset.id;

  const index = todosData.findIndex(task => task.id == +id);
  todosData.splice(index, 1);
  setTodosToLocalstorage(todosData);
  renderData();
}
todoListElement.forEach(button => {
  button.addEventListener('click', handleClickRemoveButton);
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

// функция обработки изменения статуса
function handleStatusChange(event) {
  const target = event.target;
  if (target.classList.contains('cardSelector')) {
    const taskId = target.closest('.todo-item').dataset.id;
    const newStatus = target.value;

    // Проверяем количество карточек в разделе "IN_PROGRESS"
    const inProgressCount = todosData.filter(task => task.status === STATUS.IN_PROGRESS).length;

    if (newStatus === STATUS.IN_PROGRESS && inProgressCount >= 6) {
      alert(
        'К сожалению, вы не можете добавить больше 6 карточек в раздел "IN PROGRESS". Сначала выполните начатые задачи.'
      );
      return;
    }

    updateTaskStatus(taskId, newStatus);
  }
  setTodosToLocalstorage(todosData);
}

// изменение статуса
function updateTaskStatus(taskId, newStatus) {
  const task = todosData.find(task => task.id === +taskId);
  if (task) {
    task.status = newStatus;
    setTodosToLocalstorage(todosData);
    renderData();
  }
}

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

// счетчик задач
function updateTaskCount() {
  const todoCount = todosData.filter(task => task.status === STATUS.TODO).length;
  const inProgressCount = todosData.filter(task => task.status === STATUS.IN_PROGRESS).length;
  const doneCount = todosData.filter(task => task.status === STATUS.DONE).length;

  $('#todoCount').textContent = todoCount;
  $('#inProgressCount').textContent = inProgressCount;
  $('#doneCount').textContent = doneCount;
}

// время счет настоящее

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;
  document.querySelector('.header__clock').textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();
