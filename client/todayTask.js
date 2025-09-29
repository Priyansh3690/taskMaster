document.addEventListener("DOMContentLoaded", () => {
    const form1 = document.getElementById('logout');
    const taskAddForm = document.getElementById("taskAddForm");
    const taskTitle = document.getElementById('title');
    const description = document.getElementById('description');
    const error = document.getElementById('error');
    const categoryForm = document.getElementById('categoryForm');
    const categoryName = document.getElementById('categoryName');
    const categoryDis = document.getElementById('categoryDis');
    const taskContainer = document.getElementById('taskContainer');
    const token = JSON.parse(localStorage.getItem('token')) || {};
    const taskDetailsModalEl = document.getElementById("taskDetailsModal");
    const taskDetailsModal = new bootstrap.Modal(taskDetailsModalEl);
    const modalCategory = taskDetailsModalEl.querySelector(".task-category");
    const modalPriority = taskDetailsModalEl.querySelector(".badge");
    const modalTitle = taskDetailsModalEl.querySelector("h4");
    const modalDate = taskDetailsModalEl.querySelector(".text-muted div");
    const modalDesc = taskDetailsModalEl.querySelector(".modal-body p");
    const deleteBtn = document.getElementById("deleteTaskBtn");
    const editBtn = document.getElementById("editTaskBtn");
    let currentTaskId = null;

    // --------------------- Display Tasks ---------------------
    function displayTask() {
        fetch('/d/GetUserTodayTasks', {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: token.uid })
        })
            .then(res => res.json())
            .then(data => {
                if (!data.success) return;
                taskContainer.innerHTML = "";

                if (!data.todayTask || data.todayTask.length === 0) {
                    taskContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <h3>No tasks found</h3>
                    <p>There are no tasks Found Today.</p>
                    <button class="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#addTaskModal">
                        Create a new task
                    </button>
                </div>
            `;
                    return;
                }

                data.todayTask.forEach(category => {
                    if (!category.task || category.task.length === 0) return;

                    const section = document.createElement("div");
                    section.className = "task-section animate__animated animate__fadeInUp";

                    section.innerHTML = `
                <div class="task-header">
                    <h5 class="task-title">${category.category} 
                        <span class="task-count">${category.task.length}</span>
                    </h5>
                    <div class="task-actions">
                        <button class="btn-icon" title="Expand/Collapse"><span>▼</span></button>
                    </div>
                </div>
                <div class="task-card"></div>
            `;

                    const taskCard = section.querySelector(".task-card");

                    category.task.forEach(t => {
                        const taskItem = document.createElement("div");
                        taskItem.className = "task-item";
                        taskItem.setAttribute("data-taskid", t.taskID);
                        taskItem.setAttribute("data-description", t.discription || "No description");
                        taskItem.setAttribute("data-priority", t.priority || "Normal Priority");
                        taskItem.setAttribute("data-created", t.date_time ? new Date(t.date_time).toLocaleDateString() : new Date().toLocaleDateString());

                        taskItem.innerHTML = `
                    <div class="task-checkbox">
                        <input type="checkbox" id="task${t.taskID}" ${t.completed ? "checked" : ""}>
                        <label for="task${t.taskID}"></label>
                    </div>
                    <div class="task-content">
                        <div class="task-title">${t.task}</div>
                        <div class="task-meta">
                            <div class="task-category category-${category.category.toLowerCase()}">${category.category}</div>
                        </div>
                    </div>
                `;

                        taskCard.appendChild(taskItem);
                    });

                    taskContainer.appendChild(section);
                });
            });
    }

    // --------------------- Toggle Task Completion ---------------------
    taskContainer.addEventListener("change", async (e) => {
        const checkbox = e.target.closest("input[type='checkbox']");
        if (!checkbox) return;

        const taskItem = checkbox.closest(".task-item");
        if (!taskItem) return;

        const taskID = taskItem.getAttribute("data-taskid");
        const completed = checkbox.checked;

        try {
            const res = await fetch("/d/ToggleTaskCompletion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: token.uid, taskID, completed })
            });

            const data = await res.json();

            if (!data.success) {
                checkbox.checked = !completed; // revert if failed
                Swal.fire("Error", data.message || "Failed to update task", "error");
            }
        } catch (err) {
            console.error(err);
            checkbox.checked = !completed;
            Swal.fire("Error", "Server error", "error");
        }
    });

    // --------------------- Rest of Your Existing Code ---------------------
    function getcategory() {
        fetch('/d/GetUserCategory', {
            method: "post",
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify({ uid: token.uid })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    let disCategory = ``;
                    data.data.forEach(value => {
                        disCategory += `<option value='${value.Tcid}'>${value.category}</option>`;
                    });
                    categoryDis.innerHTML = disCategory;
                }
            });
    }

    function validateTaskTitle(taskTitle) {
        if (!taskTitle || taskTitle.trim().length === 0) {
            error.innerText = "Task title is required";
            return false;
        }

        if (taskTitle.length > 100) {
            error.innerText = "Task title is too long";
            return false;
        }

        error.innerText = "";
        return true;
    }

    form1.addEventListener('click', () => {
        const token = JSON.parse(localStorage.getItem("token"));
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token })
        }).then(res => res.json()).then(data => {
            localStorage.clear();
            if (data.success) {
                window.location.href = '/';
            }
        });
    });

    // --------------------- Task Card Click / Modal ---------------------
    taskContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-icon");
        if (btn) {
            const section = btn.closest(".task-section");
            const card = section.querySelector(".task-card");
            const icon = btn.querySelector("span");
            if (!card) return;

            if (card.style.display === 'none' || card.classList.contains("hidden")) {
                card.style.display = 'block';
                card.classList.remove("hidden");
                icon.textContent = "▼";
                card.classList.add('animate__animated', 'animate__fadeIn');
                setTimeout(() => card.classList.remove('animate__animated', 'animate__fadeIn'), 500);
            } else {
                card.classList.add('animate__animated', 'animate__fadeOut');
                icon.textContent = "▶";
                setTimeout(() => {
                    card.style.display = 'none';
                    card.classList.remove('animate__animated', 'animate__fadeOut');
                }, 500);
            }
        }

        const taskItem = e.target.closest(".task-item");
        if (taskItem && !e.target.closest(".task-checkbox")) {
            currentTaskId = taskItem.getAttribute("data-taskid");
            modalTitle.innerText = taskItem.querySelector(".task-title").innerText;
            modalCategory.innerText = taskItem.querySelector(".task-category").innerText;
            modalPriority.innerText = taskItem.getAttribute("data-priority");
            modalDate.innerHTML = `<span>📅</span> Created on ${taskItem.getAttribute("data-created")}`;
            modalDesc.innerText = taskItem.getAttribute("data-description");
            taskDetailsModal.show();
        }
    });

    // --------------------- Delete Task ---------------------
    deleteBtn.addEventListener("click", () => {
        if (!currentTaskId) return;

        Swal.fire({
            title: 'Are you sure?',
            text: "This task will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch("/d/DeleteTask", {
                    method: "post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ uid: token.uid, taskID: currentTaskId })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire("Deleted!", "Your task has been deleted.", "success");
                            taskDetailsModal.hide();
                            displayTask();
                        } else {
                            Swal.fire("Error!", "Failed to delete task.", "error");
                        }
                    });
            }
        });
    });

    // --------------------- Edit Task ---------------------
    editBtn.addEventListener("click", () => {
        if (!currentTaskId) return;

        taskDetailsModal.hide();
        document.querySelector(".edit-popup")?.remove();

        const editPopup = document.createElement("div");
        editPopup.className = "edit-popup";

        editPopup.innerHTML = `
            <div class="popup-content">
                <h3>Edit Task</h3>
                <input id="editTitle" type="text" value="${modalTitle.innerText}" placeholder="Task title" />
                <textarea id="editDesc" placeholder="Description">${modalDesc.innerText}</textarea>
                <select id="editCategory"></select>
                <div class="popup-actions">
                    <button id="cancelEdit">Cancel</button>
                    <button id="updateTask">Update</button>
                </div>
            </div>
        `;

        document.body.appendChild(editPopup);

        const editTitleInput = document.getElementById("editTitle");
        const editDescInput = document.getElementById("editDesc");
        const editCategorySelect = document.getElementById("editCategory");
        const updateBtn = document.getElementById("updateTask");

        editCategorySelect.innerHTML = categoryDis.innerHTML;
        for (let option of editCategorySelect.options) {
            if (option.text === modalCategory.innerText) option.selected = true;
        }

        setTimeout(() => { editTitleInput.focus(); editTitleInput.select(); }, 50);

        editPopup.querySelector("#cancelEdit").addEventListener("click", () => { editPopup.remove(); });

        const performUpdate = () => {
            const newTitle = editTitleInput.value.trim();
            const newDesc = editDescInput.value.trim();
            const newCategory = editCategorySelect.value;

            if (!newTitle) {
                Swal.fire("Error!", "Task title cannot be empty.", "error");
                return;
            }

            editPopup.remove();

            Swal.fire({
                title: "Are you sure?",
                text: "Do you want to update this task?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "Cancel",
                customClass: { popup: "swal-z-top" }
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch("/d/UpdateTask", {
                        method: "post",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            uid: token.uid,
                            taskID: currentTaskId,
                            task: newTitle,
                            discription: newDesc,
                            categoryID: newCategory
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                Swal.fire("Updated!", "Your task has been updated.", "success");
                                displayTask();
                            } else {
                                Swal.fire("Error!", "Failed to update task.", "error");
                            }
                        });
                }
            });
        };

        updateBtn.addEventListener("click", performUpdate);
        [editTitleInput, editDescInput].forEach(input => {
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    performUpdate();
                }
            });
        });
    });

    // --------------------- Add Task ---------------------
    taskAddForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const tt = taskTitle.value.trim();
        const ttf = tt.toLowerCase();
        const dis = description.value.trim();
        const disf = dis.toLowerCase();
        const cate = categoryDis.value;
        const resultTT = validateTaskTitle(tt);

        if (resultTT) {
            fetch('/d/AddTask', {
                method: "post",
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify({ task: ttf, description: disf, categoryID: cate, uid: token.uid })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({ title: 'Success', text: 'Task inserted successfuly', icon: 'success', timer: 1500, showConfirmButton: false })
                            .then(() => { description.value = " "; taskTitle.value = " "; displayTask(); });
                    } else {
                        Swal.fire({ title: 'Error', text: 'Something is Wrong,Task Already Exist or Internet IS very SLOW', icon: 'error', timer: 3000, showConfirmButton: false });
                    }
                });
        }
    });

    // --------------------- Add Category ---------------------
    categoryForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const tt = categoryName.value.trim();
        const ttf = tt.toLowerCase();
        const resultTT = validateTaskTitle(ttf);

        if (resultTT) {
            fetch('/d/AddCategories', {
                method: "post",
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify({ category: ttf, uid: token.uid })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({ title: 'Success', text: 'Category inserted successfuly', icon: 'success', timer: 1500, showConfirmButton: false })
                            .then(() => { categoryName.value = " "; getcategory(); });
                    } else {
                        Swal.fire({ title: 'Error', text: 'Something is Wrong,Task Already Exist or Internet IS very SLOW', icon: 'error', timer: 1500, showConfirmButton: false })
                            .then(() => { categoryName.value = " "; });
                    }
                });
        }
    });

    getcategory();
    displayTask();
});