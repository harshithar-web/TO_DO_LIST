// In-memory task store.
// Note: this resets on page refresh. Once you're comfortable with the basics,
// a great next step is learning localStorage so tasks persist — try it yourself!
let tasks = [];
let nextId = 1;

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const taskCount = document.getElementById('task-count');
const clearDoneBtn = document.getElementById('clear-done');
const dateLabel = document.getElementById('today-date');

// Show today's date in the eyebrow, e.g. "06 JUL"
dateLabel.textContent = new Date().toLocaleDateString('en-US', {
  day: '2-digit',
  month: 'short'
}).toUpperCase();

function addTask(text) {
  tasks.push({ id: nextId++, text, done: false });
  render();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.done = !task.done;
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  render();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.done);
  render();
}

function render() {
  list.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : '');

    li.innerHTML = `
      <div class="checkbox ${task.done ? 'checked' : ''}" data-id="${task.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <span class="task-text">${escapeHtml(task.text)}</span>
      <button class="delete-btn" data-id="${task.id}">remove</button>
    `;

    list.appendChild(li);
  });

  // Wire up checkbox + delete clicks for the freshly rendered items
  list.querySelectorAll('.checkbox').forEach(box => {
    box.addEventListener('click', () => toggleTask(Number(box.dataset.id)));
  });

  list.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteTask(Number(btn.dataset.id)));
  });

  emptyState.style.display = tasks.length === 0 ? 'block' : 'none';

  const doneCount = tasks.filter(t => t.done).length;
  taskCount.textContent = `${doneCount} of ${tasks.length} done`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  addTask(value);
  input.value = '';
  input.focus();
});

clearDoneBtn.addEventListener('click', clearCompleted);

// Initial render
render();