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
saveChangesBtn = $('#saveChanges');
modalTitleInput = $('#addCardTitle');
modalDescriptionInput = $('#addCardDescription');
modalUserSelect = $('#addUserSelect');
todoForms = $('#todoForm');
cardSelector = $('.cardSelector');
todoElement = $('.todo-item');
deleteButtomElement = $('.delete');

// События
saveChangesBtn.addEventListener('click', handleSaveChanges);
// addTodoListItem.addEventListener('change', handleStatusChange);
// inProgressListElement.addEventListener('change', handleStatusChange);
// doneListElement.addEventListener('change', handleStatusChange);
todoListElement.forEach(element => {
  element.addEventListener('change', handleStatusChange);
});

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
      <button class="todo-item__edit-btn">Edit</button>
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

function handleSaveChanges() {
  const title = modalTitleInput.value;
  const description = modalDescriptionInput.value;
  const user = modalUserSelect.value;
  const status = STATUS.TODO;

  const newTodo = createTodo(title, description, user, status);

  todosData.push(newTodo);

  modalTitleInput.value = '';
  modalDescriptionInput.value = '';
  modalUserSelect.value = '';

  const closeButton = $('.btn-close');
  closeButton.click();

  setTodosToLocalstorage(todosData);
  renderData();
}

function handleClickRemoveButton({target}) {
  const {role} = target.dataset;

  if (role !== 'delete') return;

  const todoElement = target.closest('.todo-item');
  const id = todoElement.dataset.id;

  const index = todosData.findIndex(todo => todo.id == +id);
  todosData.splice(index, 1);
  setTodosToLocalstorage();
  renderData();
}
// todoListElement.addEventListener('click', handleClickRemoveButton);
todoListElement.forEach(button => {
  button.addEventListener('click', handleClickRemoveButton);
});

// изменение задачи

// функция обработки изменения статуса
function handleStatusChange(event) {
  const target = event.target;
  if (target.classList.contains('cardSelector')) {
    const taskId = target.closest('.todo-item').dataset.id;
    const newStatus = target.value;
    updateTaskStatus(taskId, newStatus);
  }
  setTodosToLocalstorage(todosData);
}

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
