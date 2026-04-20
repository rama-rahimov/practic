import './pages.css';
import {io} from "socket.io-client";
export default function Chat() {
    const socket = io("http://localhost:3000/chat", {
        withCredentials: true,
        auth: {
            token: localStorage.getItem("token"),
        }
    });
    socket.on("connect", () => {
        console.log("connect");
    });
    socket.on("vpered", (data) => {
        console.log(data, 'urraaaaaa');
    });
    socket.on("take_msg", (data) => {
        const messages = document.getElementById('messages');
        const div = document.createElement('div');
        div.style.padding = "5px";
        div.textContent = data;
        // 👉 если это моё сообщение
        if (data.id === socket.id) {
            div.style.textAlign = "right";
            div.style.background = "#007bff";
            div.style.color = "white";
        } else {
            div.style.textAlign = "left";
            div.style.background = "#eee";
        }

        div.style.padding = "8px";
        div.style.margin = "5px";
        div.style.borderRadius = "10px";
        messages.appendChild(div);
    });
    socket.on("disconnect", () => {
        console.log("disconnect");
    });
    function sendMessage () {
        const input = document.getElementById('messageInput');
        socket.emit("msg", input.value);
    }
    return (
        <div className="chat-container">
            <div className="messages" id="messages"></div>
            <div className="input-area">
                <input type="text" id="messageInput" placeholder="Напиши сообщение..."/>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}