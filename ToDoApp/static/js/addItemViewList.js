export function initAddItemViewList() {
  const form = document.getElementById('add-item-form');
  if (!form) return;

  const listId = form.dataset.listId;
  const postUrl = `/list/${listId}/item/add`;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const titleInput = form.querySelector('input[name=title]');
    const detailsInput = form.querySelector('textarea[name=details]');
    const dateInput = form.querySelector('input[name=due_date]');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback d-block';
    form.append(errorDiv);

    if (!titleInput.value.trim()) {
      errorDiv.textContent = 'Please add title';
      return;
    }

    const fd = new FormData();
    fd.append('title', titleInput.value.trim());
    fd.append('details', detailsInput.value.trim());
    fd.append('from_list', 'true')
    if (dateInput.value) fd.append('due_date', dateInput.value);

    try {
      const resp = await fetch(postUrl, {
        method: 'POST',
        body: fd,
        headers: {'X-Requested-With':'XMLHttpRequest'}
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) throw new Error(data.error || 'Server error');

      const ul = document.getElementById(`item-container-${listId}`);
      ul.insertAdjacentHTML('afterbegin', data.html);

      form.reset();
      errorDiv.remove();
    } catch (err) {
      errorDiv.textContent = err.message;
    }
  });
}