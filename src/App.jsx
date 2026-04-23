import {Routes, Route} from "react-router-dom";
import Files from "./pages/files.jsx";
import Chat from "./pages/chat.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";

export default function App() {
    return (
       <Routes>
           <Route path="/" element={<Login />} />
           <Route path="/files" element={<Files />} />
           <Route path="/chat" element={<Chat />} />
           <Route path="/register" element={<Register />} />
       </Routes>
    )
}