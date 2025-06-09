// ADD-LIST

const addListModalElement = document.getElementById('addListModal');
const addListModal = new bootstrap.Modal(addListModalElement);

const showBtn       = document.getElementById('show-add-list');
const form          = document.getElementById('add-list-form');
const titleInput    = document.getElementById('list-title');
const errorAlert    = document.getElementById('add-list-error');
const listContainer = document.getElementById('list-container');

showBtn.addEventListener('click', () => {
  titleInput.value = '';
  errorAlert.classList.add('d-none');
  addListModal.show();
});

form.addEventListener('submit', async e => {
  e.preventDefault();

  const title = titleInput.value.trim();
  if (!title) {
    errorAlert.textContent = 'First enter the title.';
    errorAlert.classList.remove('d-none');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);

  try {
    const resp = await fetch(LIST_ADD_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const data = await resp.json();

    if (!resp.ok || !data.success) {
      throw new Error(data.error || 'Unknown error');
    }

    // injecting new List
    listContainer.insertAdjacentHTML('beforeend', data.html);

    addListModal.hide();

  } catch (err) {
    errorAlert.textContent = err.message;
    errorAlert.classList.remove('d-none');
  }
});

// ADD - ITEM

document.addEventListener('DOMContentLoaded', () => {
  const listContainer = document.getElementById('list-container');

  listContainer.addEventListener('click', e => {
    const btn = e.target.closest('.add-item-btn');
    if (!btn || !listContainer.contains(btn)) return;

    const listId  = btn.dataset.listId;
    const postUrl = btn.dataset.addItemUrl;

    showAddItemForm(listId, postUrl);
  });
});


function showAddItemForm(listId, postUrl) {
  const card = document.getElementById(`card-${listId}`);
  if (!card) {
    console.error("Nie znaleziono karty listy:", listId);
    return;
  }

  if (card.querySelector('.add-item-form')) return;


  const ul = card.querySelector(`#item-container-${listId}`);
  if (!ul) {
    console.error("Nie znaleziono listy zadań:", listId);
    return;
  }

  const form = document.createElement('form');
  form.className = 'add-item-form mt-2';
  form.innerHTML = `
    <div class="input-group input-group-sm">
      <input type="text" name="title" class="form-control" placeholder="Add item" required>
      <button class="btn btn-primary" type="submit">OK</button>
      <button class="btn btn-outline-secondary" type="button" id="cancel-${listId}">✖</button>
    </div>
    <div class="invalid-feedback d-none">Title cannot be empty!/div>
  `;
  ul.after(form);

   form.addEventListener('submit', async e => {
    e.preventDefault();
    const titleInput = form.querySelector('input[name=title]');
    const errorDiv   = form.querySelector('.invalid-feedback');

    if (!titleInput.value.trim()) {
      errorDiv.textContent = 'Please add title';
      errorDiv.classList.remove('d-none');
      return;
    }

    const fd = new FormData();
    fd.append('title', titleInput.value.trim());

    try {
      const resp = await fetch(postUrl, {
        method: 'POST',
        body: fd,
        headers: { 'X-Requested-With':'XMLHttpRequest' }
      });
      const data = await resp.json();

      if (!resp.ok || !data.success) {
        throw new Error(data.error || 'Błąd serwera');
      }

      ul.insertAdjacentHTML('beforeend', data.html);
      form.remove();
    } catch (err) {
      errorDiv.textContent = err.message;
      errorDiv.classList.remove('d-none');
    }
  });

  form.querySelector(`#cancel-${listId}`)
      .addEventListener('click', () => form.remove());
}