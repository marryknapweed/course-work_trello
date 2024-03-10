import {modalTitleInput, modalDescriptionInput, modalAddUserSelect} from './app.js';
import {STATUS, createTodo, todosData} from './data.js';
import {setTodosToLocalstorage, $, $$, renderData} from './helpers.js';

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

export {handleSaveChanges, handleClickRemoveButton, handleStatusChange};
