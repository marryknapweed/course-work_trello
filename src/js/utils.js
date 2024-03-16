import {STATUSES, todosData} from './data.js';
import {$} from './helpers.js';

// функция для обновления счетчика задач. Подсчет количества задач в каждом статусе и обновляет соответствующий счетчик
function updateTaskCount() {
  const todoCount = todosData.filter(task => task.status === STATUSES.TODO).length;
  const inProgressCount = todosData.filter(task => task.status === STATUSES.IN_PROGRESS).length;
  const doneCount = todosData.filter(task => task.status === STATUSES.DONE).length;

  $('#todoCount').textContent = todoCount;
  $('#inProgressCount').textContent = inProgressCount;
  $('#doneCount').textContent = doneCount;
}

// функция для обновления времени. Обновляет текущее время каждую секунду и отображает его в header

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;
  $('.header__clock').textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();

export {updateTaskCount};
