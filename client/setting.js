document.addEventListener('DOMContentLoaded', () => {
    const form1 = document.getElementById('log');
    const chatid = document.getElementById('chatId');
    const token = JSON.parse(localStorage.getItem('token')) || {};
    const Checkbtn = document.getElementById('checkMessage');


    fetch('/d/getChatID', {
        method: "post",
        headers: {
            "content-Type": "application/json"
        },
        body: JSON.stringify({ uid: token.uid })
    })
        .then(res => res.json())
        .then(data => {
            chatid.value = data.chatid;
        });


    Checkbtn.addEventListener('click', () => {
        fetch('/d/sendExampleSMS', {
            method: "post",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({ uid: token.uid })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: "Successfuly send SMS",
                        icon: "success",
                        draggable: true
                    });
                } else {
                    Swal.fire({
                        title: "Somthing is wrong!",
                        icon: "error",
                        draggable: true
                    });
                }
            });
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