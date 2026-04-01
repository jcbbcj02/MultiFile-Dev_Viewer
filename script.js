let allFiles = [];
let userPlan = "free";

const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const preview = document.getElementById("preview");
const fileTree = document.getElementById("fileTree");
const searchInput = document.getElementById("searchInput");
const loginBtn = document.getElementById("loginBtn");
const upgradeBtn = document.getElementById("upgradeBtn");
const infoPanel = document.getElementById("infoPanel");

// Upload
uploadBtn.onclick = () => fileInput.click();
fileInput.addEventListener("change", e => handleFiles(e.target.files));

// Login
loginBtn.onclick = async () => {
const email = prompt("Enter email:");
if (!email) return;
userPlan = await fetchUserPlan(email);
alert(`Logged in as ${email} (${userPlan})`);
};

// Upgrade
upgradeBtn.onclick = () => {
window.location.href = "https://buy.stripe.com/test_link"; // replace later
};

// Fetch user plan
async function fetchUserPlan(email) {
const res = await fetch(`/api/check-user?email=${email}`);
const data = await res.json();
return data.plan;
}

// Handle files
function handleFiles(files) {
allFiles = Array.from(files);

if (userPlan === "free" && allFiles.length > 1) {
alert("Free plan allows only 1 file");
allFiles = [allFiles[0]];
}

renderTree(allFiles);
renderInfo(allFiles);
}

// File tree
function renderTree(files) {
fileTree.innerHTML = "";
files.forEach(file => {
const item = document.createElement("div");
item.textContent = file.name;
item.onclick = () => showFile(file);
fileTree.appendChild(item);
});
}

// Preview
function showFile(file) {
const reader = new FileReader();
reader.onload = () => {
let content = reader.result;
if (file.name.endsWith(".json")) {
try { content = JSON.stringify(JSON.parse(content), null, 2); }
catch { content = "❌ Invalid JSON"; }
} else if (file.name.endsWith(".xml")) {
content = content.replace(/(>)(<)(\/*)/g, "$1\n$2$3");
}
preview.innerHTML = `<pre>${content}</pre>`;
};
if (file.type.startsWith("image/")) {
reader.onload = () => {
const img = document.createElement("img");
img.src = reader.result;
img.style.maxWidth = "100%";
preview.innerHTML = "";
preview.appendChild(img);
};
reader.readAsDataURL(file);
} else {
reader.readAsText(file);
}
}

// Info panel
function renderInfo(files) {
const total = files.length;
const size = files.reduce((a,f)=>a+f.size,0);
infoPanel.innerHTML = `<strong>${total}</strong> files • ${(size/1024).toFixed(2)} KB`;
}

// Pro search
searchInput.addEventListener("input", e => {
if (userPlan !== "pro") {
alert("Search is a Pro feature");
return;
}
const query = e.target.value.toLowerCase();
preview.innerHTML = "";
allFiles.forEach(file => {
const reader = new FileReader();
reader.onload = () => {
if (reader.result.toLowerCase().includes(query)) {
const div = document.createElement("div");
div.textContent = "Match: " + file.name;
preview.appendChild(div);
}
};
reader.readAsText(file);
});
});
