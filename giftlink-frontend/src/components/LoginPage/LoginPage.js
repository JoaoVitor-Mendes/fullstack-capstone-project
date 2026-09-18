import React, { useState } from 'react';
import './LoginPage.css';

import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('auth-token');

    const {
        setIsLoggedIn,
        setUserName
    } = useAppContext();

    if (bearerToken) {
        navigate('/app');
    }

    const handleLogin = async () => {
        try {
            setErrorMessage('');

            const response = await fetch(
                `${urlConfig.backendUrl}/api/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setPassword('');
                setErrorMessage(data.error || 'Invalid email or password');
                return;
            }

            sessionStorage.setItem('auth-token', data.authtoken);
            sessionStorage.setItem('name', data.userName);
            sessionStorage.setItem('email', data.userEmail);

            setIsLoggedIn(true);
            setUserName(data.userName);

            navigate('/app');

        } catch (e) {
            console.log('Error fetching details: ' + e.message);
            setPassword('');
            setErrorMessage('Unable to login. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">

                        <h2 className="text-center mb-4 font-weight-bold">
                            Login
                        </h2>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {errorMessage && (
                                <div className="text-danger mt-2">
                                    {errorMessage}
                                </div>
                            )}
                        </div>

                        <button
                            className="btn btn-primary btn-block"
                            onClick={handleLogin}
                        >
                            Login
                        </button>

                        <p className="mt-4 text-center">
                            New here?{' '}
                            <a
                                href="/app/register"
                                className="text-primary"
                            >
                                Register
                            </a>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;