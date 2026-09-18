import React, { useState } from 'react';
import './RegisterPage.css';

import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const { setIsLoggedIn, setUserName } = useAppContext();

    const handleRegister = async () => {
        try {
            setErrorMessage('');

            const response = await fetch(
                `${urlConfig.backendUrl}/api/auth/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(
                    data.error || 'Registration failed'
                );
                return;
            }

            // Store user details in session storage
            sessionStorage.setItem('auth-token', data.authtoken);
            sessionStorage.setItem('email', data.email);
            sessionStorage.setItem('name', firstName);

            // Update authentication context
            setIsLoggedIn(true);
            setUserName(firstName);

            // Navigate to main page
            navigate('/app');

        } catch (e) {
            console.log('Error fetching details: ' + e.message);
            setErrorMessage('Unable to register. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">

                        <h2 className="text-center mb-4 font-weight-bold">
                            Register
                        </h2>

                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            {errorMessage && (
                                <div className="text-danger mt-2">
                                    {errorMessage}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            className="btn btn-primary btn-block"
                            onClick={handleRegister}
                        >
                            Register
                        </button>

                        <p className="mt-4 text-center">
                            Already a member?{' '}
                            <a
                                href="/app/login"
                                className="text-primary"
                            >
                                Login
                            </a>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;