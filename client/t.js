document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const dateParam = segments[segments.length - 1];
    const token = JSON.parse(localStorage.getItem('token')) || {};
    const TitleOfPage = document.getElementById('TitleOfPage');
    const form1 = document.getElementById('logout');
    const FilterDisCategory = document.getElementById('FilterDisCategory');
    const taskDetailsModalEl = document.getElementById("taskDetailsModal");
    const taskContainer = document.getElementById('taskContainer');
    const taskDetailsModal = new bootstrap.Modal(taskDetailsModalEl);
    const modalCategory = taskDetailsModalEl.querySelector(".task-category");
    const modalPriority = taskDetailsModalEl.querySelector(".badge");
    const modalTitle = taskDetailsModalEl.querySelector("h4");
    const modalDate = taskDetailsModalEl.querySelector(".text-muted div");
    const modalDesc = taskDetailsModalEl.querySelector(".modal-body p");

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
                    FilterDisCategory.innerHTML += disCategory;
                }
            });
    }


    function displayTask(dateParam) {
        fetch('/d/getUserSpecificDateVisesTask', {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: token.uid, date: dateParam })
        })
            .then(res => res.json())
            .then(data => {
                if (!data.success) return;
                taskContainer.innerHTML = "";

                data.tasks.forEach(category => {
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
                        taskItem.setAttribute("data-taskid", t.taskID);   // ✅ added this line
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
            modalTitle.innerText = taskItem.querySelector(".task-title").innerText;
            modalCategory.innerText = taskItem.querySelector(".task-category").innerText;
            modalPriority.innerText = taskItem.getAttribute("data-priority");
            modalDate.innerHTML = `<span>📅</span> Created on ${taskItem.getAttribute("data-created")}`;
            modalDesc.innerText = taskItem.getAttribute("data-description");

            taskDetailsModal.show();
        }
    });

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

    TitleOfPage.innerText = dateParam;
    displayTask(dateParam);
    getcategory();
});