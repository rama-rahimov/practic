import './pages.css';
import {io} from "socket.io-client";
import {useEffect, useState} from "react";
import apiFetch from "../../api.js"
export default function Chat() {
    const [conversation, setConversation] = useState([]);
    const [activeInput, setActiveInput] = useState(true);
    const [roomId, setRoomId] = useState(null);
    const [myData, setMyData] = useState({});
    const [value, setValue] = useState("");
    const [msg, setMsg] = useState([]);
    const socket = io("http://localhost:3002/chat", {
        withCredentials: true,
        auth: {
            token: localStorage.getItem("token"),
        }
    });
    socket.on("connect", () => {
        console.log("connect");
    });
    socket.on("take_msg", (data) => {
        setMsg((prevMsg) => [...prevMsg, data]);
    });
    socket.on("disconnect", () => {
        console.log("disconnect");
    });
    function sendMessage (e) {
        e.preventDefault();
        socket.emit("msg", {roomId, message:value});
        setMsg(prevMsg => [...prevMsg, { type: myData?.role || 1, msg: value }]);
        setValue("");
    }

   async function showChat(e, roomId) {
        e.preventDefault();
        const getMessages = await apiFetch('chat',`/messages/${roomId}`);
        socket.emit("join_room", roomId);
        const messages = await getMessages.json();
        setRoomId(roomId);
        setMsg(messages.data);
        setActiveInput(false);
    }
    useEffect( () => {
        try {
            (async () => {
                const userJson = await apiFetch('chat',"/profile");
                const user = await userJson.json();
                setMyData(user.data)
                if(user.data && (user.data || {}).role === 10){
                    const conver = await apiFetch('chat','/conversation');
                    const takeConversation = await conver.json();
                    setConversation(takeConversation.data);
                }
            if(!user.data || (user.data || {}).role === 1){
                const clientMsg = await apiFetch('chat',`/messages`);
                const messages = await clientMsg.json();
                setMsg(messages.data);
            }})()
        }
    catch(err) {
        console.log(err);
    }
    }, []);
    return myData?.role > 1 ? (
        <div className="chat-header">
            <div className="chat-left-bar">
                {
                    (conversation || []).map((c, index) => (
                        <p key={index} style={{cursor:"pointer"}}
                           onClick={(e) => showChat(e, c._id)}>{`Chat number ${index+1}`}</p>
                    ))
                }
            </div>
            <div className="chat-container">
                <div className="messages" id="messages">
                    {(msg || []).map((c, index) => (
                        <div key={index} className={myData?.role === c.type ? 'right-side-chat' : 'left-side-chat'}>{c.msg}</div>
                    ))}
                </div>
                <div className="input-area">
                    <input type="text" value={value} disabled={activeInput} onChange={(e) => setValue(e.target.value)} id="messageInput" placeholder="Напиши сообщение..."/>
                    <button style={{background: activeInput ? "#888": "#007bff"}} disabled={activeInput} onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    ):<div className="chat-container">
        <div className="messages" id="messages">
            {(msg || []).map((c, index) => (
                <div key={index} className={(!myData?.role && c.type === 1) ? 'right-side-chat' : myData?.role === c.type ? 'right-side-chat' : 'left-side-chat'}>{c.msg}</div>
            ))}
        </div>
        <div className="input-area">
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} id="messageInput" placeholder="Напиши сообщение..."/>
            <button onClick={sendMessage}>Send</button>
        </div>
    </div>
}