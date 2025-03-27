const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

let allTodos = getTodos();

updateTodoList();

const initSortableList = (e) => {
    e.preventDefault();
    const draggingItem = todoListUL.querySelector(".dragging");

    // getting all items except currently dragging and making array of them
    const todos = [...todoListUL.querySelectorAll(".todo:not(.dragging)")];

    // Finding the sibling after which the dragging item should be place
    let nextTodo = todos.find(todo => {
        return e.clientY <= todo.offsetTop + todo.offsetHeight / 2;
    })

    todoListUL.insertBefore(draggingItem, nextTodo);

    // lưu lại thứ tự
    const newTodos = [...todoListUL.querySelectorAll(".todo")];
    allTodos = newTodos.map(todoLI =>{
        const text = todoLI.querySelector(".todo-text").innerText;
        const completed = todoLI.querySelector("input").checked;
        return { text, completed };
    });
    saveTodos();
    // updateTodoList();
}

todoListUL.addEventListener("dragover", initSortableList);
todoListUL.addEventListener("dragenter", e => e.preventDefault());

// form tag lắng nghe sự kiện submit và thực hiện hàm thêm todo
todoForm.addEventListener('submit', function(e) {
    e.preventDefault();  
    addTodo();
});

// lấy dữ liệu từ input và push vào mảng
// mỗi lần push dữ liệu mới sẽ update <ul> và save vào localStorage
function addTodo() {
    const todoText = todoInput.value.trim();
    if(todoText.length > 0) {
        const todoObject = {
            text: todoText,
            completed: false
        }
        allTodos.push(todoObject);
        updateTodoList();
        saveTodos();
        todoInput.value = "";
    }
}

// update từ trong mảng để tạo <li> cho từng todo và add vào <ul>
function updateTodoList() {
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex) => {
        let todoItem = createTodoItem(todo, todoIndex);
        todoListUL.append(todoItem);
    });
    initDragAndDrop();
}

// tạo <li> chứa content theo format và return về <li>
function createTodoItem(todo, todoIndex) {
    const todoId = "todo-" + todoIndex;
    const todoLI = document.createElement("li");
    const todoText = todo.text;
    
    todoLI.className = "todo";
    todoLI.setAttribute("draggable", "true");
    todoLI.innerHTML = `
            <input type="checkbox" id="${todoId}">
            <label class="custom-checkbox" for="${todoId}">
                <i class="fa-solid fa-check"></i>
            </label>
            <label for="${todoId}" class="todo-text">
                ${todoText}
            </label>
            <button class="delete-button">
                <i class="fa-solid fa-trash"></i>
            </button>
    `;
    // access vào delete-button
    const deleteButton = todoLI.querySelector(".delete-button");
    // add click event to delete-button
    deleteButton.addEventListener("click", () => {
        deleteTodoItem(todoIndex);
    }); 
    // access input checkbox and add event 'change' nếu có thay đổi về checkbox thì cập nhật thuộc tính completed của object todo
    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", () => {
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
    });
    checkbox.checked = todo.completed;
    return todoLI;
}

// delete todo item
function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    saveTodos();
    updateTodoList();
}

// lưu dữ liệu vào localStorage
function saveTodos() {
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson);
}

// lấy dữ liệu đã lưu từ localStorage
function getTodos() {
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}

function initDragAndDrop() {
    const todoItems = todoListUL.querySelectorAll(".todo");
    if(todoItems.length != 0) {
        todoItems.forEach(todo => {
            todo.addEventListener("dragstart", () => {
                todo.classList.add("dragging");
            })
            todo.addEventListener("dragend", () => {
                todo.classList.remove("dragging");
            })
        })
    } 
}