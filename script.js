/* ============================================
   LEARNING MATERIALS HUB
   Stores materials in localStorage.
   Files are converted to base64 data URLs.
   No external APIs required.
   ============================================ */

const STORAGE_KEY = 'learning_materials';

/* ---------- Load & Save ---------- */
function loadMaterials() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveMaterials(materials) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
  } catch (e) {
    alert('Storage is full. Try removing some large files or use links instead.');
  }
}

/* ---------- Render All Categories ---------- */
function renderAll() {
  const materials = loadMaterials();

  // Clear all lists
  document.querySelectorAll('.materials-list').forEach(list => {
    list.innerHTML = '';
  });

  // Group by category
  const byCategory = {};
  materials.forEach(m => {
    if (!byCategory[m.category]) byCategory[m.category] = [];
    byCategory[m.category].push(m);
  });

  // Render each category
  document.querySelectorAll('.materials-list').forEach(list => {
    const cat = list.dataset.category;
    const items = byCategory[cat] || [];

    if (items.length === 0) {
      list.innerHTML = '<p class="empty-message">No materials yet. Add one above.</p>';
      return;
    }

    items.forEach(item => {
      list.appendChild(createCard(item));
    });
  });
}

/* ---------- Create a Material Card ---------- */
function createCard(item) {
  const card = document.createElement('div');
  card.className = 'material-card';

  const title = document.createElement('h3');
  title.textContent = item.title;

  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = item.description || '';

  const meta = document.createElement('p');
  meta.className = 'meta';
  const date = new Date(item.date).toLocaleDateString();
  meta.textContent = `Added ${date}` + (item.fileName ? ` • ${item.fileName}` : '');

  const actions = document.createElement('div');
  actions.className = 'actions';

  // Open button
  const openBtn = document.createElement('button');
  openBtn.className = 'small';
  openBtn.textContent = 'Open';
  openBtn.onclick = () => {
    if (item.dataUrl) {
      // Open uploaded file in new tab
      const w = window.open();
      w.document.write(
        `<iframe src="${item.dataUrl}" style="border:0;width:100%;height:100vh;"></iframe>`
      );
    } else if (item.link) {
      window.open(item.link, '_blank');
    }
  };
  actions.appendChild(openBtn);

  // Download button (only for uploaded files)
  if (item.dataUrl) {
    const dlBtn = document.createElement('button');
    dlBtn.className = 'small secondary';
    dlBtn.textContent = 'Download';
    dlBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = item.dataUrl;
      a.download = item.fileName || 'material';
      a.click();
    };
    actions.appendChild(dlBtn);
  }

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.className = 'small danger';
  delBtn.textContent = 'Delete';
  delBtn.onclick = () => deleteMaterial(item.id);
  actions.appendChild(delBtn);

  card.appendChild(title);
  card.appendChild(desc);
  card.appendChild(meta);
  card.appendChild(actions);

  return card;
}

/* ---------- Add Material ---------- */
document.getElementById('upload-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const category = document.getElementById('category').value;
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const fileInput = document.getElementById('file-input');
  const link = document.getElementById('link-input').value.trim();

  if (!category || !title) {
    alert('Please choose a category and enter a title.');
    return;
  }

  if (!fileInput.files.length && !link) {
    alert('Please upload a file or paste a link.');
    return;
  }

  const material = {
    id: Date.now().toString(),
    category,
    title,
    description,
    link: link || '',
    fileName: '',
    dataUrl: '',
    date: new Date().toISOString()
  };

  // If a file was uploaded, convert to base64
  if (fileInput.files.length) {
    const file = fileInput.files[0];
    material.fileName = file.name;

    const reader = new FileReader();
    reader.onload = function (event) {
      material.dataUrl = event.target.result;
      const materials = loadMaterials();
      materials.push(material);
      saveMaterials(materials);
      renderAll();
      resetForm();
    };
    reader.readAsDataURL(file);
  } else {
    const materials = loadMaterials();
    materials.push(material);
    saveMaterials(materials);
    renderAll();
    resetForm();
  }
});

/* ---------- Delete Material ---------- */
function deleteMaterial(id) {
  if (!confirm('Delete this material?')) return;
  const materials = loadMaterials().filter(m => m.id !== id);
  saveMaterials(materials);
  renderAll();
}

/* ---------- Clear All ---------- */
function clearAllMaterials() {
  if (!confirm('Delete ALL materials? This cannot be undone.')) return;
  localStorage.removeItem(STORAGE_KEY);
  renderAll();
}

/* ---------- Reset Form ---------- */
function resetForm() {
  document.getElementById('upload-form').reset();
}

/* ---------- Smooth Scroll ---------- */
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ---------- Initialize ---------- */
renderAll();
