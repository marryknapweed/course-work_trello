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

// функция обработки изменения статуса задачи
function handleStatusChange(event) {
  const target = event.target;

  // Если кликнули на select, то обрабатываем его событие
  if (target.classList.contains('cardSelector')) {
    const taskId = target.closest('.todo-item').dataset.id;
    const newStatus = target.value;

    // Проверяем, не превышено ли максимальное количество задач в статусе "IN_PROGRESS"
    const inProgressCount = todosData.filter(task => task.status === STATUSES.IN_PROGRESS).length;
    // Если превышено, выводим предупреждение и не добавляем задачу
    if (newStatus === STATUSES.IN_PROGRESS && inProgressCount >= 6) {
      alert(
        'К сожалению, вы не можете добавить больше 6 карточек в раздел "IN PROGRESS". Сначала выполните начатые задачи.'
      );
      renderData();
      return;
    }

    updateTaskStatus(taskId, newStatus);
  }
  setTodosToLocalstorage(todosData);
}

// функция для обновления статуса задачи для перемещения задачи в другую колонку
function updateTaskStatus(taskId, newStatus) {
  const task = todosData.find(task => task.id === +taskId);
  if (task) {
    task.status = newStatus;
    setTodosToLocalstorage(todosData);
    renderData();
  }
}

// функция для редактировании задачи при нажатии на кнопку edit и сохранения изменений в задаче

function handleClickEditButton({target}) {
  const {role} = target.dataset;

  if (role === 'edit') {
    const todoElement = target.closest('.todo-item');
    const id = todoElement.dataset.id;
    const task = todosData.find(task => task.id === +id);

    // Заполняем поля формы данными которые были в задаче
    $('#editCardTitle').value = task.title;
    $('#editCardDescription').value = task.description;
    $('#addUserSelect').value = task.user;

    $('#editSaveChanges').addEventListener('click', function () {
      // Получаем новые значения из полей формы
      const editedTitle = $('#editCardTitle').value;
      const editedDescription = $('#editCardDescription').value;
      const editedUser = $('#editUserSelect').value;

      // Обновляем данные задачи
      task.title = editedTitle;
      task.description = editedDescription;
      task.user = editedUser;

      setTodosToLocalstorage(todosData);
      renderData();
    });
  }
}

// функция удаления всех выполненных задач из Done

function handleDeleteAllDone() {
  const filteredTodosData = todosData.filter(task => task.status !== STATUSES.DONE);
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
};
