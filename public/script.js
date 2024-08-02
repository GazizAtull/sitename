const balance = document.getElementById("balance");
const canDed = document.getElementById("canDeduced");
const senButton = document.getElementById("senButton");
const modal = document.getElementById('myModal');
const closeModal = document.getElementsByClassName('close')[0];
const inputElement = document.getElementById("input");
const sendToWallet = document.getElementById("sendToWallet");
const amountElement = document.getElementById("amount");
const add = document.getElementById("klk");
const usdtBalance = document.getElementById("usdt-amount");


function render(data) {
    balance.innerText = 'Balance: ' + data.balanceInfo + ' USDT';
    canDed.innerText = 'can be deduced: ' + data.canDedInfo + ' USDT';
    usdtBalance.innerText = 'Amount: ' + data.usdtInfo + ' USDT';
}

// Получение начальных значений с сервера
fetch('process.env.SERVER/api/info')
    .then(response => response.json())
    .then(data => {
        render(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

add.addEventListener('click', () => {
    fetch(`${process.env.SERVER}/api/info`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            render(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

senButton.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

sendToWallet.addEventListener('click', () => {
    let walletAddress = inputElement.value;
    let amount = parseFloat(amountElement.value);

    if (walletAddress !== '') {
        fetch('https://mountainous-lapis-barge.glitch.me/send-to-wallet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address: walletAddress, amount: amount })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    inputElement.value = '';
                    modal.style.display = 'none';
                    render(data);
                } else {
                    alert("Ошибка при отправке на сервер: " + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Произошла ошибка при отправке на сервер.");
            });
    } else {
        alert("Напишите адрес кошелька или закройте это окно");
    }
});
