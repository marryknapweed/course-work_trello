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
          <option value="IN_PROGRESS" ${
            status === 'IN_PROGRESS' ? 'selected' : ''
          }>IN PROGRESS</option>
          <option value="DONE" ${status === 'DONE' ? 'selected' : ''}>DONE</option>
          </select>
        </div>
      </div>
      `;
}

export {buildTemplate};
