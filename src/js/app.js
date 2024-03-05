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
todoListElement = $('.todo__content');
saveChangesBtn = $('#saveChanges');
modalTitleInput = $('#cardTitle');
modalDescriptionInput = $('#cardDescription');
modalUserSelect = $('#userSelect');
todoForms = $('#todoForm');
cardSelector = $('.cardSelector');
todoElement = $('.todo-item');
deleteButtomElement = $('.delete');

// События
saveChangesBtn.addEventListener('click', handleSaveChanges);

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
        <option ${status === 'TODO' ? 'selected' : ''}>TODO</option>
        <option ${status === 'IN PROGRESS' ? 'selected' : ''}>IN PROGRESS</option>
        <option ${status === 'DONE' ? 'selected' : ''}>DONE</option>
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
  let html = '';
  todosData.forEach(todo => {
    const template = buildTemplate(todo);
    html += template;
  });

  todoListElement.innerHTML = html;
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
todoListElement.addEventListener('click', handleClickRemoveButton);

// function handleCardSelectorChange({target}) {
//   const newStatus = target.value;
//   const taskId = target.closest('.todo-item').dataset.id;

//   todosData.forEach(todo => {
//     todo.tasks.forEach(task => {
//       if (task.id == taskId) {
//         task.status = newStatus;
//       }
//     });
//   });

//   setTodosToLocalstorage(todosData);
//   renderData();
// }

// function handleCardSelectorChange({target}) {
//   const newStatus = target.value;
//   const taskId = target.closest('.todo-item').dataset.id;

//   todosData.forEach(category => {
//     const task = category.tasks.find(task => task.id == taskId);
//     if (task) {
//       const taskIndex = category.tasks.indexOf(task);
//       category.tasks.splice(taskIndex, 1);

//       if (newStatus === 'TODO') {
//         todosData[0].tasks.push(task);
//       } else if (newStatus === 'IN PROGRESS') {
//         todosData[1].tasks.push(task);
//       } else if (newStatus === 'DONE') {
//         todosData[2].tasks.push(task);
//       }
//     }
//   });

//   setTodosToLocalstorage(todosData);
//   renderData();
// }

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
