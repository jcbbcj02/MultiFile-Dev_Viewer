document.addEventListener('DOMContentLoaded', () => {
const fileInput = document.getElementById('fileInput');
const dropArea = document.getElementById('dropArea');
const previewContainer = document.getElementById('previewContainer');
const fileUploadBtn = document.getElementById('fileUploadBtn');
const upgradeBtn = document.getElementById('upgradeBtn');
const darkToggle = document.getElementById('darkToggle');

const FREE_TIER_LIMIT = 1;
let isPro = false; // Normally fetched from API

// Dark mode toggle
darkToggle.addEventListener('click', () => {
const body = document.body;
body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
});

// Handle files
function handleFiles(files) {
previewContainer.innerHTML = '';

if (!isPro && files.length > FREE_TIER_LIMIT) {
alert(`Free tier allows only ${FREE_TIER_LIMIT} file. Upgrade to Pro for more.`);
files = [files[0]];
}

Array.from(files).forEach(file => {
const card = document.createElement('div');
card.className = 'file-card';

const info = document.createElement('div');
info.innerHTML = `<strong>${file.name}</strong> (${file.type || 'Unknown'}) - ${(file.size/1024).toFixed(2)} KB`;
info.style.marginBottom='8px';
card.appendChild(info);

const copyBtn = document.createElement('button');
copyBtn.textContent='Copy';
card.appendChild(copyBtn);

const pre = document.createElement('pre');
card.appendChild(pre);

previewContainer.appendChild(card);

const reader = new FileReader();

reader.onload = () => {
let content = reader.result;

if(file.name.endsWith('.json')){
try {
content = JSON.stringify(JSON.parse(content), null, 2);
const status = document.createElement('div');
status.textContent='✅ Valid JSON';
status.style.color='green';
card.appendChild(status);
} catch(e){
const status = document.createElement('div');
status.textContent='❌ Invalid JSON';
status.style.color='red';
card.appendChild(status);
}
} else if(file.name.endsWith('.xml')){
content = content.replace(/(>)(<)(\/*)/g,'$1\n$2$3');
}

if(file.type.startsWith('image/')){
const img = document.createElement('img');
img.src=reader.result;
img.style.maxWidth='100%';
card.replaceChild(img,pre);
} else {
pre.textContent=content;
}

copyBtn.onclick = () => {
navigator.clipboard.writeText(content);
copyBtn.textContent='Copied!';
setTimeout(()=>copyBtn.textContent='Copy',1500);
};
};

reader.onerror=()=>{ pre.textContent='Error reading file'; };

if(file.type.startsWith('image/')){
reader.readAsDataURL(file);
} else {
reader.readAsText(file);
}
});
}

// File input click
fileUploadBtn.addEventListener('click', ()=>fileInput.click());

// Upgrade button click
upgradeBtn.addEventListener('click', ()=>{
window.location.href='https://your-stripe-checkout-link.com';
});

// File input change
fileInput.addEventListener('change', e => handleFiles(e.target.files));

// Drag & drop events
['dragenter','dragover'].forEach(ev => dropArea.addEventListener(ev,e=>{
e.preventDefault(); dropArea.classList.add('dragover');
}));
['dragleave','drop'].forEach(ev => dropArea.addEventListener(ev,e=>{
e.preventDefault(); dropArea.classList.remove('dragover');
}));
dropArea.addEventListener('drop', e=>handleFiles(e.dataTransfer.files));
});
