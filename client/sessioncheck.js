async function checkSession() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
        window.location.href = "/";
        return;
    }
    try {
        const res = await fetch("/check-session", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "session": JSON.stringify(token)
            }
        });
        const data = await res.json();
        if (res.status === 401 || !data.success) {
            localStorage.removeItem("token");
            window.location.href = "/";
        } else {
            return;
        }
    } catch (err) {
        console.error("Network error:", err);
        window.location.href = "/";
    }
}

checkSession();

document.addEventListener('DOMContentLoaded', () => {
    const token = JSON.parse(localStorage.getItem('token')) || {};
    const dateList = document.getElementById('dateList');
    fetch('/d/GetUserPrevDates', {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: token.uid })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                let dates = "";
                data.date.forEach(element => {
                    dates += `<a href='/d/t/${element.task_date}' class='date-link'>${element.task_date}</a>`;
                });
                dateList.innerHTML = dates;
            }
        });
});