import {
  modalTitleInputElement,
  modalDescriptionInputElement,
  modalAddUserSelectElement,
} from './app.js';
import {STATUSES, Tasks, todosData} from './data.js';
import {setTodosToLocalstorage, $, renderData} from './helpers.js';

// функция для сохрания данных введенных в модальное окно и создания новой задачи
function handleSaveAddTask() {
  const title = modalTitleInputElement.value;
  const description = modalDescriptionInputElement.value;
  const user = modalAddUserSelectElement.value;
  const status = STATUSES.TODO;

  const newTodo = new Tasks(title, description, user, status);
  todosData.push(newTodo);

  modalTitleInputElement.value = '';
  modalDescriptionInputElement.value = '';
  modalAddUserSelectElement.value = '';

  setTodosToLocalstorage(todosData);
  renderData();
}

// функция удаления задачи при клике на кнопку delete
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

function handleStatusChange(event) {
  const target = event.target;

  // Проверяем, является ли целевой элемент выпадающим списком задач
  if (target.classList.contains('cardSelector')) {
    const taskId = target.closest('.todo-item').dataset.id;
    const newStatus = target.value;

    const inProgressCount = todosData.filter(task => task.status === STATUSES.IN_PROGRESS).length;

    // Если новый статус "IN_PROGRESS" и превышено максимальное количество задач в этом статусе
    if (newStatus === STATUSES.IN_PROGRESS && inProgressCount >= 6) {
      alert(
        'К сожалению, вы не можете добавить больше 6 карточек в раздел "IN PROGRESS". Сначала выполните начатые задачи.'
      );
      renderData();
      return;
    }

    const task = todosData.find(task => task.id === +taskId);

    // Если задача найдена, обновляем её статус
    if (task) {
      task.status = newStatus;

      renderData();
      setTodosToLocalstorage(todosData);
    }
  }
}

// функция для редактировании задачи при нажатии на кнопку edit и сохранения изменений в задаче

// Переменная для хранения выбранной задачи
let currentTask = null;

// Функция для обработки нажатия на кнопку edit и отрисовка данных в форме редактирования
function handleClickEditButton({target}) {
  const {role} = target.dataset;

  if (role === 'edit') {
    const todoElement = target.closest('.todo-item');
    const id = todoElement.dataset.id;
    currentTask = todosData.find(task => task.id === +id);

    // Заполняем поля формы данными, которые были в задаче
    $('#editCardTitle').value = currentTask.title;
    $('#editCardDescription').value = currentTask.description;
    $('#editUserSelect').value = currentTask.user;
  }
}

// Обработчик события submit для формы редактирования задачи
function handleEditFormSubmit(event) {
  event.preventDefault();
  if (!currentTask) return;

  // Получаем новые значения из полей формы
  const editedTitle = $('#editCardTitle').value;
  const editedDescription = $('#editCardDescription').value;
  const editedUser = $('#editUserSelect').value;

  // Обновляем данные задачи
  currentTask.title = editedTitle;
  currentTask.description = editedDescription;
  currentTask.user = editedUser;

  setTodosToLocalstorage(todosData);
  renderData();
  console.log('jdfsfw');
}
// const todoWrapElement = $('.todo__wrap');
// todoWrapElement.addEventListener('click', handleClickEditButton);

// editFormElement.addEventListener('submit', handleEditFormSubmit);

// функция удаления всех выполненных задач из Done

function handleDeleteAllDone() {
  const filteredTodosData = todosData.filter(task => task.status !== STATUSES.DONE); // все задачи кроме выполненных
  todosData.length = 0;
  filteredTodosData.forEach(task => todosData.push(task));
  setTodosToLocalstorage(todosData);
  renderData();
}

export {
  handleSaveAddTask,
  handleClickRemoveButton,
  handleStatusChange,
  handleClickEditButton,
  handleDeleteAllDone,
  handleEditFormSubmit,
};
