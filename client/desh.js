document.addEventListener('DOMContentLoaded', () => {
    const form1 = document.getElementById('log');
    const token = JSON.parse(localStorage.getItem('token')) || {};
    const TotalTaks = document.getElementById('TotalTaks');
    const CompletedTask = document.getElementById('CompletedTask');
    const PendingTask = document.getElementById('PendingTask');
    const TelegramAlert = document.getElementById('TelegramAlert');
    const distask = document.getElementById('distask');

    fetch('/d/fetchAALLCounts', {
        method: 'post',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify({ token: token.uid })
    })
        .then(res => res.json())
        .then(data => {
            TotalTaks.innerText = data.totalTask;
            CompletedTask.innerText = data.completedTask;
            PendingTask.innerText = data.PendingTask;
            TelegramAlert.innerText = data.telegramAlert
        });

    fetch('/d/fetchTodayTask', {
        method: 'post',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify({ token: token.uid })
    }).then(res => res.json()).then(data => {
        if (data.success) {
            let dis = ``;
            data.todayTask.forEach(element => {
                dis += `<div class="message-item">
              <div class="message-content" style="color: #ffffff;">
                <div class="message-text">${element.task}</div>
              </div>
            </div>`;
            });
            distask.innerHTML = dis;
        } else {
            let dis = `<div class="message-item">
              <div class="message-content" style="color: #ffffff;">
                <div class="message-text">No Task Found!</div>
                <div class="message-time">There are no tasks Found Today.</div>
              </div>
            </div>`;
            distask.innerHTML = dis;
        }
    });


    form1.addEventListener('submit', (e) => {
        e.preventDefault();
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
});