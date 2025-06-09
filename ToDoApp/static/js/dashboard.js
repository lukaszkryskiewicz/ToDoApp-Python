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
