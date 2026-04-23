let form = document.getElementById("form");
let todos = document.getElementById("todos");

let store = JSON.parse(localStorage.getItem("todos")) || [];

function showToast(message) {
  let toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: #fff;
    padding: 12px 24px;
    border-radius: 50px;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 9999;
    white-space: nowrap;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => (toast.style.opacity = "1"));
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function saveToLocal() {
  localStorage.setItem("todos", JSON.stringify(store));
}

function renderTodo() {
  todos.innerHTML = "";
  store.map((item, index) => {
    todos.innerHTML += `
      <div class="todo">
        <p>${item}</p>
        <div class="btn">
          <i onclick="updateTodo(${index})" class="fa-solid fa-pen"></i>
          <i onclick="deleteTodo(${index})" class="fa-solid fa-trash"></i>
        </div>
      </div>
    `;
  });
}

renderTodo();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let uservalue = e.target.userinput.value.trim().replace(/\s+/g, " ");
  if (uservalue === "") {
    showToast("⚠️ Please enter a to-do!");
  } else {
    store.push(uservalue);
    saveToLocal();
    renderTodo();
  }
  form.reset();
});

function updateTodo(id) {
  const todoDiv = document.querySelectorAll(".todo")[id];
  const p = todoDiv.querySelector("p");
  const editIcon = todoDiv.querySelector(".fa-pen, .fa-check");

  // Already editing — save it
  if (p.contentEditable === "true") {
    const newValue = p.textContent.trim();
    if (newValue !== "") {
      store[id] = newValue;
      saveToLocal();
    }
    p.contentEditable = "false";
    p.style.outline = "";
    p.style.borderRadius = "";
    p.style.padding = "";
    editIcon.classList.replace("fa-check", "fa-pen");
    return;
  }

  // Start editing
  p.contentEditable = "true";
  p.focus();

  // Move cursor to end
  const range = document.createRange();
  range.selectNodeContents(p);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  p.style.outline = "2px solid #d299c2";
  p.style.borderRadius = "4px";
  p.style.padding = "2px 6px";
  editIcon.classList.replace("fa-pen", "fa-check");

  // Save on Enter key
  p.addEventListener("keydown", function handler(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      p.removeEventListener("keydown", handler);
      updateTodo(id);
    }
  });
}

function deleteTodo(id) {
  store.splice(id, 1);
  saveToLocal();
  renderTodo();
}
