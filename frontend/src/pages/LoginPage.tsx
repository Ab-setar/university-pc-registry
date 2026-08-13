import React from 'react';
import Login from '../components/Login';

interface Props {
    onLogin: (role: string, username: string) => void;
}

export default function LoginPage({ onLogin }: Props) {
    return <Login onLogin={onLogin} />;
}
