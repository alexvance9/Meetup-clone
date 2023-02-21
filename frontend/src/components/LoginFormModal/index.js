import React, { useState } from "react";
import { useHistory } from "react-router-dom"
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .then(history.push('/home'))
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
    };

    const handleDemo = (e) => {
        e.preventDefault()
        setErrors([]);
        const credential = "demo@user.io";
        const password = "password"
        
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .then(history.push('/home'))
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
    }

    return (
        <div className="login-modal">
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <label>
                    Username or Email
                    <input
                        type="text"
                        name="credential"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                        />
                        </label>
                <label>
                    Password
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                        </label>
                        
                <button type="submit">Log In</button>
                <button onClick={handleDemo}>Demo User</button>
            </form>
            
        </div>
    );
}

export default LoginFormModal;