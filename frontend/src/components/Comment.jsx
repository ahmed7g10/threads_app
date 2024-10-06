import { Avatar, Divider, Flex, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'

import Loader from './Loader';
import { formatDistanceToNow } from 'date-fns';
import apiUrl from '../MY_ENV/API.JS';

const Comment = ({ userAvatar, username, comment, createdAt, likes }) => {
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);

    const toast = useToast()
    const [user, setUser] = useState(null)
    const getUser = async () => {
        try {
            setLoading(true)
            const res = await fetch(`http://localhost:5000/api/users/profile/${userAvatar}`, {
                method: 'GET'
            })
            const data = await res.json()
            if (data.message != 'profile') {
                toast({
                    description: data.message, status: 'error'
                })

                return
            }
            setUser(data.user)
        } catch (error) {
            toast({
                description: error.message, status: 'error'
            })

        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getUser()
    }, [userAvatar]);
    if (loading) {
        return <Loader />
    }
    return (
        <>
            <Flex justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'center'} >
                    <Avatar size={'sm'} name={username} src={`${apiUrl}/${user?.profilePic}`} />
                    <Text>
                        {user?.username}
                    </Text>
                </Flex>
                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'} fontSize={'sm'}>{formatDistanceToNow(new Date(createdAt))}</Text>

                </Flex>
            </Flex>
            <Flex gap={4} flexDirection={'column'} ml={10}>
                <Text opacity={'0.8'}>
                    {comment}
                </Text>

            </Flex>
            <Divider my={4} />

        </>
    )
}

export default Comment