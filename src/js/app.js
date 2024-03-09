const STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
};
// $
function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return [...document.querySelectorAll(selector)];
}
// Вызовы
todoListElement = $$('.todo__content');
addTodoListItem = $('#todoList');
inProgressListElement = $('.in-progress__content');
doneListElement = $('.done__content');
saveChangesBtnEdit = $('#editSaveChanges');
modalTitleInput = $('#addCardTitle');
modalDescriptionInput = $('#addCardDescription');
modalAddUserSelect = $('#addUserSelect');
todoForms = $('#todoForm');
cardSelector = $('.cardSelector');
todoElement = $('.todo-item');
deleteButtomElement = $('.delete');
deleteAllButton = $('.deleteTodoBtn');
deleteAllDoneModal = $('#deleteAllDoneModal');
confirmDeleteButton = $('#confirmDelete');

// События
// saveChangesBtnEdit.addEventListener('click', handleClickEditButton);
todoListElement.forEach(element => {
  element.addEventListener('change', handleStatusChange);
});
// deleteAllButtomElement.addEventListener('click', handleDeleteAllDone);

const todosData = getTodosFromLocalstorage();

if (todosData.length > 0) {
  renderData(); // Отобразить данные из localStorage, если они есть
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

  todosData.forEach(todo => {
    const item = buildTemplate(todo);
    todo.status === STATUS.TODO && todoHtml.push(item);
    todo.status === STATUS.IN_PROGRESS && progressHtml.push(item);
    todo.status === STATUS.DONE && doneHtml.push(item);
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
      // modalEditUserSelect.append(option.cloneNode(true));
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

  // Создаем новую задачу
  const newTodo = createTodo(title, description, user, status);

  // Добавляем новую задачу в массив
  todosData.push(newTodo);

  // Сбрасываем значения полей ввода
  modalTitleInput.value = '';
  modalDescriptionInput.value = '';
  modalAddUserSelect.value = '';

  // Закрываем модальное окно
  const closeButton = $('.btn-close');
  closeButton.click();

  // Обновляем локальное хранилище и отрисовываем задачи
  setTodosToLocalstorage(todosData);
  renderData();

  // После обновления данных проверяем счетчики и показываем сообщение об ошибке, если нужно
  updateTaskCount();
}

// удаление задачи
function handleClickRemoveButton({target}) {
  const {role} = target.dataset;

  if (role !== 'delete') return;

  const todoElement = target.closest('.todo-item');
  const id = todoElement.dataset.id;

  const index = todosData.findIndex(todo => todo.id == +id);
  todosData.splice(index, 1);
  setTodosToLocalstorage(todosData);
  renderData();
}
// todoListElement.addEventListener('click', handleClickRemoveButton);
todoListElement.forEach(button => {
  button.addEventListener('click', handleClickRemoveButton);
});

// изменение задачи

// изменение задачи и открытие модального окна редактирования
// function handleClickEditButton(event) {
//   const {role} = event.target.dataset;

//   if (role === 'edit') {
//     const todoElement = event.target.closest('.todo-item');
//     const id = todoElement.dataset.id;
//     const task = todosData.find(task => task.id === +id);

//     // Заполните модальное окно данными выбранного задания
//     document.getElementById('editCardTitle').value = task.title;
//     document.getElementById('editCardDescription').value = task.description;
//     // document.getElementById('addUserSelect').value = task.user;
//     // Здесь можно добавить код для заполнения других полей формы модального окна, если есть

//     // Показать модальное окно
//     const editModal = new bootstrap.Modal(document.getElementById('editModal'));
//     editModal.show();
//   }
// }

// // Добавляем обработчик событий для кнопок "Edit"
// document.querySelectorAll('.todo-item__edit-btn').forEach(button => {
//   button.addEventListener('click', handleClickEditButton);
// });

function handleClickEditButton(event) {
  const {role} = event.target.dataset;

  if (role === 'edit') {
    const todoElement = event.target.closest('.todo-item');
    const id = todoElement.dataset.id;
    const task = todosData.find(task => task.id === +id);

    // Заполняем модальное окно данными задания
    document.getElementById('editCardTitle').value = task.title;
    document.getElementById('editCardDescription').value = task.description;
    document.getElementById('addUserSelect').value = task.user;

    // Показать модальное окно
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();

    // Добавляем обработчик события для кнопки "Save" внутри модального окна редактирования
    document.getElementById('editSaveChanges').addEventListener('click', function () {
      // Получаем значения из полей формы
      const editedTitle = document.getElementById('editCardTitle').value;
      const editedDescription = document.getElementById('editCardDescription').value;
      const editedUser = document.getElementById('editUserSelect').value;

      // Обновляем данные задачи
      task.title = editedTitle;
      task.description = editedDescription;
      task.user = editedUser;

      // Закрываем модальное окно редактирования
      editModal.hide();

      // Перерисовываем задачи на странице
      renderData();

      // Обновляем локальное хранилище и отрисовываем задачи
      setTodosToLocalstorage(todosData);
    });
  }
}

// Добавляем обработчик событий для кнопок "Edit"
document.querySelectorAll('.todo-item__edit-btn').forEach(button => {
  button.addEventListener('click', handleClickEditButton);
});

// // Добавляем обработчик события для кнопки "Save" в модальном окне редактирования
// document.getElementById('editSaveChanges').addEventListener('click', handleEditSaveChanges);

// функция обработки изменения статуса
function handleStatusChange(event) {
  const target = event.target;
  if (target.classList.contains('cardSelector')) {
    const taskId = target.closest('.todo-item').dataset.id;
    const newStatus = target.value;

    // Проверяем количество карточек в разделе "IN_PROGRESS"
    const inProgressCount = todosData.filter(todo => todo.status === STATUS.IN_PROGRESS).length;

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
    // Изменение цвета фона в зависимости от статуса
    // const taskElement = document.querySelector(`[data-id="${taskId}"]`);
    // const colors = {
    //   TODO: 'rgb(174, 255, 178)',
    //   IN_PROGRESS: 'rgb(75, 255, 14)',
    //   DONE: 'rgb(25, 174, 174)',
    // };

    // const backgroundColor = colors[newStatus];
    // taskElement.style.backgroundColor = backgroundColor;
  }
}

// подумать еще как сделать удаление всех выполненных
// deleteAllButtomElement.addEventListener('click', handleDeleteAllDone);

// function handleDeleteAllDone() {
//   const confirmed = confirm('Are you sure you want to delete all tasks from the DONE section?');
//   if (confirmed) {
//     const filteredTodosData = todosData.filter(todo => todo.status !== STATUS.DONE);
//     todosData.length = 0;
//     filteredTodosData.forEach(todo => todosData.push(todo));
//     setTodosToLocalstorage(todosData);
//     renderData();
//   }
// }

// удаляем задания из Done
// Получаем модальное окно
const modal = new bootstrap.Modal(deleteAllDoneModal);

deleteAllButton.addEventListener('click', function () {
  // Показываем модальное окно
  modal.show();
});

confirmDeleteButton.addEventListener('click', function () {
  handleDeleteAllDone();
  modal.hide();
});

// Функция для удаления всех задач из "DONE"
function handleDeleteAllDone() {
  const filteredTodosData = todosData.filter(todo => todo.status !== STATUS.DONE);
  todosData.length = 0;
  filteredTodosData.forEach(todo => todosData.push(todo));
  setTodosToLocalstorage(todosData);
  renderData();
}

// счетчик задач
function updateTaskCount() {
  const todoCount = todosData.filter(todo => todo.status === STATUS.TODO).length;
  const inProgressCount = todosData.filter(todo => todo.status === STATUS.IN_PROGRESS).length;
  const doneCount = todosData.filter(todo => todo.status === STATUS.DONE).length;

  $('#todoCount').textContent = todoCount;
  $('#inProgressCount').textContent = inProgressCount;
  $('#doneCount').textContent = doneCount;

  // // Проверяем количество задач в разделе "IN_PROGRESS"
  // const inProgressCount1 = todosData.filter(todo => todo.status === STATUS.IN_PROGRESS).length;

  // if (inProgressCount1 > 6) {
  //   alert(
  //     'К сожалению, вы не можете добавить больше 6 карточек. Сначала выполните начатые задачи.'
  //   );
  //   return;
  // }
}

// время счет настоящее

// 1 способ
// function updateClock() {
//   const now = new Date();
//   const hours = String(now.getHours()).padStart(2, "0");
//   const minutes = String(now.getMinutes()).padStart(2, "0");
//   const seconds = String(now.getSeconds()).padStart(2, "0");
//   const timeString = `${hours}:${minutes}:${seconds}`;
//   document.querySelector(".header__clock").textContent = timeString;
// }

// // Update the clock every second
// setInterval(updateClock, 1000);

// // Initial call to display the clock immediately
// updateClock();

// 2 способ

function updateClock() {
  const now = new Date();
  const timeString = new Intl.DateTimeFormat('ru', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now);
  $('.header__clock').textContent = timeString;
}

// вызываем функцию каждую секунду
setInterval(updateClock, 1000);
updateClock();
