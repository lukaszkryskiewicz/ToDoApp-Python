
export function initAddItem() {
  const container = document.getElementById('list-container');
  if (!container) return;

  container.addEventListener('click', e => {
    const btn = e.target.closest('.add-item-btn');
    if (!btn) return;
    const listId  = btn.dataset.listId;
    const postUrl = btn.dataset.addItemUrl;
    showAddItemForm(listId, postUrl);
  });
}

function showAddItemForm(listId, postUrl) {
  const card = document.getElementById(`card-${listId}`);
  if (!card || card.querySelector('.add-item-form')) return;

  const ul = card.querySelector(`#item-container-${listId}`);
  if (!ul) return;

  const form = document.createElement('form');
  form.className = 'add-item-form mt-2';
  form.innerHTML = `
    <div class="input-group input-group-sm">
      <input type="text" name="title" class="form-control" placeholder="Add item" required>
      <button class="btn btn-primary" type="submit">OK</button>
      <button class="btn btn-outline-secondary" type="button" id="cancel-${listId}">✖</button>
    </div>
    <div class="invalid-feedback d-none">Title cannot be empty!</div>
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
    const fd = new FormData(form);
    try {
      const resp = await fetch(postUrl, {
        method: 'POST',
        body: fd,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) throw new Error(data.error || 'Server error');
      ul.insertAdjacentHTML('beforeend', data.html);
      form.remove();
    } catch (err) {
      errorDiv.textContent = err.message;
      errorDiv.classList.remove('d-none');
    }
  });

  form.querySelector(`#cancel-${listId}`).addEventListener('click', () => form.remove());
}