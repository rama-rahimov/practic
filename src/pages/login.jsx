import { useState } from "react";
import {useNavigate} from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const goToChat = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        navigate("/chat");
    }
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
                credentials: "include"
            });
            const data = await res.json();
            localStorage.removeItem("token");
            localStorage.setItem("token", data.token);
            if (!res.ok) {
                alert(data.message || "Ошибка входа");
                return;
            }
            alert("Успешный вход!");
            navigate("/chat");
        } catch (err) {
            console.error(err);
            alert("Ошибка сервера");
        }
    };
    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>Login</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />

                <button type="submit" style={styles.button}>
                    Login
                </button>
                <p style={{cursor:'pointer'}} onClick={() => navigate('/register')}><b>Registration</b></p>
                <p style={{cursor:'pointer'}} onClick={goToChat}><b>Chat with Admin</b></p>
            </form>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f4f4"
    },
    form: {
        background: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "300px"
    },
    input: {
        padding: "10px",
        fontSize: "16px"
    },
    button: {
        padding: "10px",
        background: "#007bff",
        color: "#fff",
        border: "none",
        cursor: "pointer"
    }
};