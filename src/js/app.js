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
cardSelector = $$('#cardSelector');

// События
saveChangesBtn.addEventListener('click', handleSaveChanges);

const todosData = [
  {
    title: 'TODO',
    tasks: [],
  },
  {
    title: 'IN PROGRESS',
    tasks: [],
  },
  {
    title: 'DONE',
    tasks: [],
  },
];

// let hasTasks = todosData.some((card) => card.tasks.length > 0);
// if (hasTasks) {
//   renterData();
// }

function buildTemplate({id, title, description, user, date, status}) {
  const time = `${date.getDate()}.${
    date.getMonth() + 1
  }.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return `
  <div class="todo-item" data-id="${id}">
    <h3 class="todo-item__title" >${title}</h3>
    <p class="todo-item__description">${description}</p>

    <p class="todo-item__user">
      ${user}<time class="todo-item__date">${time}</time>
    </p>
    <div class="todo-item__buttom">
      <button class="todo-item__edit-btn">Edit</button>
      <button class="todo-item__delete-btn">Delete</button>
      <select class="form-control" id="cardSelector">
        <option>TODO</option>
        <option>IN PROGRESS</option>
        <option>DONE</option>
      </select>
    </div>
  </div>
  `;
}

function getTodosFromLocalstorage() {
  const todosData = localStorage.getItem('todosData');
  if (todosData) {
    const parseTodos = JSON.parse(todosData);
    return parseTodos.map(todo => {
      todo.tasks.forEach(task => {
        task.date = new Date(task.date);
      });
      return todo;
    });
  } else {
    return [];
  }
}

function setTodosToLocalstorage(todosData) {
  localStorage.setItem('todosData', JSON.stringify(todosData));
}

function renterData() {
  let html = '';

  todosData.forEach(todo => {
    todo.tasks.forEach(task => {
      const template = buildTemplate(task);
      html += template;
    });
  });

  todoListElement.innerHTML = html;
  setTodosToLocalstorage(todosData);
}
function createTodo(title, description, user, status) {
  const tasks = {
    id: Date.now(),
    title,
    description,
    user,
    date: new Date(),
    status,
  };
  return tasks;
}

function handleSaveChanges() {
  const title = modalTitleInput.value;
  const description = modalDescriptionInput.value;
  const user = modalUserSelect.value;
  const status = cardSelector.value;

  const newTodo = createTodo(title, description, user, status);

  todosData[0].tasks.push(newTodo);

  modalTitleInput.value = '';
  modalDescriptionInput.value = '';
  modalUserSelect.value = '';

  const closeButton = $('.btn-close');
  closeButton.click();

  setTodosToLocalstorage(todosData);
  renterData();
}

cardSelector.forEach(element => {
  element.addEventListener('change', handleCardSelectorChange);
});

function handleCardSelectorChange(event) {
  const newStatus = event.target.value;
  const taskId = event.target.closest('.todo-item').dataset.id;

  todosData.forEach(todo => {
    todo.tasks.forEach(task => {
      if (task.id == taskId) {
        task.status = newStatus;
      }
    });
  });

  setTodosToLocalstorage(todosData);
  renterData();
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
