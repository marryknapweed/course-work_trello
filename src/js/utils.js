import {STATUS, todosData} from './data.js';
import {$} from './helpers.js';

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
  $('.header__clock').textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();

export {updateTaskCount};
