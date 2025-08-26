import { useState } from "react";
import styles from './Login.module.css';
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [credentials, setCredentials] = useState<any>({});
    const [isSignUp, setIsSignUp] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = async () => {
        let user;
        if (isSignUp) {
            user = await client.signup(credentials);
            if(!user) return;
            dispatch(setCurrentUser(user));
            navigate(`/pantry/${user.username}`);
        } else {
            user = await client.signin(credentials);
            if(!user) return;
            dispatch(setCurrentUser(user));
            navigate(`/pantry/${user.username}`);
        }

    };

    return (
        <div className={styles.page}>
            <form className={styles.login} onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
                <img src="/logo.png" alt="logo" height="45px" width="45px" className="mt-5"/>
                <h4 style={{fontWeight: '550'}}>Welcome to Pantry Pal</h4>
                <input type="text" className={styles.field} id="username" placeholder="Username" value={credentials.username} onChange={(e) => setCredentials({...credentials, username: e.target.value})}/>
                <input type="password" className={styles.field} id="password" placeholder="Password" value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})}/>
                <button className={styles.btn} type="submit">{isSignUp ? 'Sign Up' : 'Log In'}</button>
                <p style={{fontSize: '10px'}}>{isSignUp ? 'Already have an account?' : 'Not on Pantry Pal yet?'}{' '}
                    <button className="btn btn-link p-0" type="button" style={{textDecoration: 'underline', cursor: 'pointer', fontSize: '10px' }} onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? 'Log In' : 'Sign Up'}</button>
                </p>
            </form>
        </div>
    )
}