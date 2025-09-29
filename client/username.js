document.addEventListener('DOMContentLoaded', () => {
    const unm = document.getElementById('userName');
    const token = JSON.parse(localStorage.getItem('token'));

    fetch('/getUserName', {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                unm.innerHTML = `<h5>${data.unm}</h5>`;
            } else {
                unm.innerHTML = "<h4>no UserName</h4>";
            }
        });
});
