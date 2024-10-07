import { Button, useToast } from '@chakra-ui/react'
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/userSlice';
import { API_URL } from '../MY_ENV/API.JS';

const LogoutButton = () => {
    const toast = useToast();
    const nav = useNavigate();
    const dispatch = useDispatch()
    const handleLogout = async () => {
        try {
            localStorage.removeItem('user-threads');
            const res = await fetch(`${API_URL}/users/logout`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await res.json()
            dispatch(logout())
            toast({
                description: 'user loged out successfully', status: 'success'
            })
            nav('/auth')
        } catch (error) {
            console.log(error.message);

        }
    }
    return (
        <Button onClick={handleLogout} top={'30px'} right={"30px"} size={'sm'}
            position={'fixed'}>LogoutButton</Button>
    )
}

export default LogoutButton