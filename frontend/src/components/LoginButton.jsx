import { Button, useToast } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
    const toast = useToast();
    const nav = useNavigate();
    const handlenav = () => {
        nav('/auth');
    }
    return (
        <Button onClick={handlenav} top={'30px'} right={"30px"} size={'sm'}
            position={'fixed'}>LogIn</Button>
    )
}

export default LoginButton