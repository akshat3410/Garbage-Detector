// script.js
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const resultCard = document.getElementById('result-card');
const previewImg = document.getElementById('preview');
const categorySpan = document.getElementById('category');

let selectedFile = null;

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length) {
    selectedFile = e.target.files[0];
    uploadBtn.disabled = false;
  } else {
    uploadBtn.disabled = true;
  }
});

uploadBtn.addEventListener('click', async () => {
  if (!selectedFile) return;
  uploadBtn.textContent = 'Analyzing…';
  uploadBtn.disabled = true;

  // Preview locally
  const reader = new FileReader();
  reader.onload = () => {
    previewImg.src = reader.result;
    resultCard.classList.remove('hidden');
  };
  reader.readAsDataURL(selectedFile);

  // Prepare FormData
  const formData = new FormData();
  formData.append('image', selectedFile);

  try {
    // TODO: Replace with your actual ML backend endpoint
    const res = await fetch('/api/classify', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    // Expect data.category to be one of: biodegradable, cardboard, glass, metal, paper, plastic, other
    categorySpan.textContent = data.category || 'Unknown';
  } catch (err) {
    categorySpan.textContent = 'Error';
    console.error(err);
  } finally {
    uploadBtn.textContent = 'Analyze';
    uploadBtn.disabled = false;
  }
});
