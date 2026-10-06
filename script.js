// 1. Chọn các thành phần giao diện
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// 2. Hàm thêm công việc mới
function addTask() {
    const taskText = input.value.trim(); // Lấy chữ trong ô nhập và xóa khoảng trắng thừa

    if (taskText === "") {
        alert("Vui lòng nhập công việc!");
        return;
    }

    // Tạo một thẻ <li> mới
    const li = document.createElement('li');
    
    // Nội dung bên trong thẻ li
    li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <button class="delete-btn">Xóa</button>
    `;

    // Sự kiện khi bấm vào chữ để gạch bỏ (hoàn thành)
    li.querySelector('.task-text').addEventListener('click', function() {
        this.parentElement.classList.toggle('completed');
    });

    // Sự kiện khi bấm nút Xóa
    li.querySelector('.delete-btn').addEventListener('click', function() {
        li.remove();
    });

    // Thêm thẻ li vào danh sách ul
    todoList.appendChild(li);

    // Xóa nội dung ô nhập sau khi thêm xong
    input.value = "";
    input.focus();
}

// 3. Sự kiện khi click nút "Thêm"
addBtn.addEventListener('click', addTask);

// 4. (Tùy chọn) Nhấn phím Enter cũng thêm được việc
input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});