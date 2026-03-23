let form = document.getElementById("form");
let todos = document.getElementById("todos");

let store = JSON.parse(localStorage.getItem("todos")) || [];

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
    alert("Enter Some To-Do!");
  } else {
    store.push(uservalue);
    saveToLocal();
    renderTodo();
  }
  form.reset();
});

function updateTodo(id) {
  let updateValue = prompt("Enter your updated todo", store[id]);
  if (updateValue !== null && updateValue.trim() !== "") {
    store[id] = updateValue.trim();
    saveToLocal();
    renderTodo();
  }
}

function deleteTodo(id) {
  store.splice(id, 1);
  saveToLocal();
  renderTodo();
}
