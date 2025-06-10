
export function initEditList() {
  document.body.addEventListener('click', e => {
    if (!e.target.classList.contains('edit-list-title')) return;
    const id = e.target.dataset.listId;
    startTitleEdit(id);
  });
}

function startTitleEdit(listId) {
  const textEl    = document.getElementById(`list-title-text-${listId}`);
  const inputEl   = document.getElementById(`list-title-input-${listId}`);
  const saveBtn   = document.getElementById(`save-title-${listId}`);
  const cancelBtn = document.getElementById(`cancel-title-${listId}`);

  textEl.classList.add('d-none');
  inputEl.classList.remove('d-none');
  saveBtn.classList.remove('d-none');
  cancelBtn.classList.remove('d-none');

  inputEl.focus();
  inputEl.select();

  saveBtn.onclick = async () => {
    const newTitle = inputEl.value.trim();
    if (!newTitle) return alert('Tytuł nie może być pusty');
    try {
      const fd = new FormData();
      fd.append('title', newTitle);
      const resp = await fetch(`/list/${listId}/edit`, {
        method: 'POST',
        body: fd,
        headers: {'X-Requested-With':'XMLHttpRequest'}
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Server error');
      textEl.textContent = data.title;
      cancelTitleEdit(listId);
    } catch (err) {
      alert(err.message);
    }
  };

  cancelBtn.onclick = () => cancelTitleEdit(listId);
}

function cancelTitleEdit(listId) {
  document.getElementById(`list-title-text-${listId}`).classList.remove('d-none');
  document.getElementById(`list-title-input-${listId}`).classList.add('d-none');
  document.getElementById(`save-title-${listId}`).classList.add('d-none');
  document.getElementById(`cancel-title-${listId}`).classList.add('d-none');
}

export function initToggleFav() {
  document.body.addEventListener('click', async e => {
    if (!e.target.classList.contains('toggle-list-fav')) return;
    const listId = e.target.dataset.listId;
    await toggleListFav(listId, e.target);
  });
}

async function toggleListFav(listId, iconEl) {
  try {
    const resp = await fetch(`/list/${listId}/toggle-fav`, {
      method: 'POST',
      headers: {'X-Requested-With':'XMLHttpRequest'}
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Server error');
    const fav = data.is_favorite;
    iconEl.classList.toggle('bi-star-fill', fav);
    iconEl.classList.toggle('text-warning', fav);
    iconEl.classList.toggle('bi-star', !fav);
    iconEl.classList.toggle('text-secondary', !fav);
  } catch (err) {
    alert(err.message);
  }
}