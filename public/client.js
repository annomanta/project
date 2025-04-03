const socket = io();
let nickname = "";

function enterChat() {
    nickname = document.getElementById("nickname").value.trim();
    if (nickname !== "") {
        document.getElementById("nickname-container").classList.add("hidden");
        document.getElementById("chat-container").classList.remove("hidden");
        socket.emit("join", nickname);
    }
}

function sendMessage() {
    const message = document.getElementById("message").value.trim();
    if (message !== "") {
        socket.emit("chat message", { sender: nickname, text: message });
        document.getElementById("message").value = "";
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

socket.on("message", (msg) => {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    if (msg.sender === nickname) {
        messageElement.classList.add("my-message");
    } else {
        messageElement.classList.add("other-message");
    }

    messageElement.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});
