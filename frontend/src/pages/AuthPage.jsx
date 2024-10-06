import { useEffect, useState } from 'react'
import React from 'react'
import { useSelector } from 'react-redux';

import SignupCard from '../components/SignupCard'
import LoginCard from '../components/LoginCard'
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const AuthPage = () => {
    const [value, setValue] = useState('login');
    const [loading, setLoading] = useState(true);
    const { user, isLoggedIn } = useSelector(state => state.user);
    const nav = useNavigate()
    useEffect(() => {
        if (isLoggedIn) {
            nav('/')
        } else {
            setLoading(false)
        }
    }, [user])
    if (loading) {
        return <Loader />
    }
    return (
        <>
            {value == 'login' ? <LoginCard setValue={setValue} /> : <SignupCard setValue={setValue} />}
        </>
    )
}

export default AuthPage;