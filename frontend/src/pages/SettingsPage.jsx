import { Button, Text, useToast } from '@chakra-ui/react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/userSlice'
import { useNavigate } from 'react-router-dom'

const SettingsPage = () => {
    const toast = useToast()
    const dispatch = useDispatch();
    const nav = useNavigate();
    const freezAccount = async () => {
        if (window.confirm('Are You Sure You Want To Fereez Yor Account')) {
            try {
                const res = await fetch('http://localhost:5000/api/users/freeze', {
                    method: 'PUT',
                    credentials: 'include'
                })
                const data = await res.json();
                if (data.success) {
                    toast({
                        description: 'Your Account was Frozen successfully',
                        status: 'success'
                    })
                    localStorage.removeItem('user-threads');
                    const res = await fetch('http://localhost:5000/api/users/logout', {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                    const data = await res.json()
                    dispatch(logout())
                    nav('/auth')
                }
            } catch (error) {
                toast({
                    description: error.message,
                    status: 'error'
                })
            }
        }
    }
    return (
        <>
            <Text fontWeight={'bold'} my={1}>Freezr Your Account </Text>
            <Text my={1}>
                you can unfreeze you account anytime by loggin in.
            </Text>
            <Button size={'sm'} onClick={freezAccount} colorScheme={'red'}>
                FREEZE
            </Button>
        </>
    )
}

export default SettingsPage