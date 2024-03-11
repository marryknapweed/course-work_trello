import {
  modalTitleInputElement,
  modalDescriptionInputElement,
  modalAddUserSelectElement,
} from './app.js';
import {STATUS, Tasks, todosData} from './data.js';
import {setTodosToLocalstorage, $, renderData} from './helpers.js';

function handleSaveChanges() {
  const title = modalTitleInputElement.value;
  const description = modalDescriptionInputElement.value;
  const user = modalAddUserSelectElement.value;
  const status = STATUS.TODO;

  const newTodo = new Tasks(title, description, user, status);
  todosData.push(newTodo);

  modalTitleInputElement.value = '';
  modalDescriptionInputElement.value = '';
  modalAddUserSelectElement.value = '';

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

// функция обработки изменения статуса
function handleStatusChange(event) {
  const target = event.target;
  if (target.classList.contains('cardSelectorElement')) {
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

// редактирование задачи

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

// удаляем задания из Done

function handleDeleteAllDone() {
  const filteredTodosData = todosData.filter(task => task.status !== STATUS.DONE);
  todosData.length = 0;
  filteredTodosData.forEach(task => todosData.push(task));
  setTodosToLocalstorage(todosData);
  renderData();
}

export {
  handleSaveChanges,
  handleClickRemoveButton,
  handleStatusChange,
  handleClickEditButton,
  handleDeleteAllDone,
};
