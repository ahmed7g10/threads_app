import { Avatar, Box, Button, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, VStack, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BsInstagram } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import { useSelector } from 'react-redux'
import Loader from './Loader'
import { NavLink } from 'react-router-dom'
import apiUrl from '../MY_ENV/API.JS'

const UserHeader = ({ user }) => {
    const toast = useToast();

    const copyURL = () => {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(() => {
            toast({ description: 'successfully copied', status: 'success' })
        })
    }
    const [updateing, setUpdateing] = useState(false)
    const currentUser = useSelector(state => state.user.user);

    const dofollow = async () => {

        if (!currentUser) {
            toast({
                description: 'please login to follow', status: 'error'
            });
            return
        }
        setUpdateing(true)
        try {
            const res = await fetch(`http://localhost:5000/api/users/follow/${user._id}`, {
                method: 'PUT',
                credentials: 'include'
            });
            const data = await res.json();
            toast({ description: following ? 'un followed successfully' : "followed successfully", status: 'success' });
            setFollowing(!following)
            console.log(data);

        } catch (error) {
            console.log(error);
            toast({ description: 'Failed to update follow status', status: 'error' });
        } finally {
            setUpdateing(false)
        }
    }
    const [following, setFollowing] = useState(user.followers.includes(currentUser?._id || false));


    return (
        <VStack gap={4} alignItems={'start'}>
            <Flex justifyContent={'space-between'} w={'full'}>
                <Box>
                    <Text fontWeight={'bold'} fontSize={'2xl'}>
                        {user?.username}
                    </Text>
                    <Flex gap={2} alignItems={'center'}>
                        <Text fontSize={'sm'}>
                            {user?.name}
                        </Text>  <Text
                            color={'gray.light'} p={1} borderRadius={'full'} bg={"gray.dark"} fontSize={'sm'}>
                            threead.next
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    <Avatar
                        name={user?.name}
                        src={`${apiUrl}/${user?.profilePic}`}
                        size={'xl'}
                    />
                </Box>
            </Flex>
            <Text>{user.bio || 'no bio'}</Text>
            {
                currentUser?.username == user.username ? (
                    <Flex>
                        <NavLink to={'/update'}>
                            <Button>Update Profile</Button>
                        </NavLink>
                    </Flex>
                ) : (
                    <Flex>
                        <Button isLoading={updateing} backgroundColor={following ? 'gray' : 'blue.500'}
                            onClick={dofollow}>
                            {following ? 'Un Follow' : 'Follow'}
                        </Button>
                    </Flex>
                )
            }
            <Flex justifyContent={'space-between'} w={'full'}>
                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'}>
                        {user.followers.length || 'no foolowers'} followers
                    </Text>
                    <Box w={1} h={1} borderRadius={'full'} bg={'gray.light'}></Box>
                    <Link color={'gray.light'}>
                        instagram.com
                    </Link>
                </Flex>
                <Flex>
                    <Box className='icon-container'>
                        <BsInstagram size={24}
                            cursor={'pointer'} />
                    </Box>
                    <Box className='icon-container'>
                        <Menu>

                            <MenuButton>
                                <CgMoreO size={24}
                                    cursor={'pointer'} />

                            </MenuButton>
                            <Portal>
                                <MenuList bg={'gray.dark'}>
                                    <MenuItem onClick={copyURL} bg={'gray.dark'}>
                                        copy link
                                    </MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>
            <Flex w={'full'}>
                <Flex borderBottom={"1.5px solid white"}
                    justifyContent={'center'}
                    flex={1} cursor={'pointer'}
                    pb={3}>
                    <Text fontWeight={'bold'} >
                        Threads
                    </Text>
                </Flex>
                <Flex color={'gray.light'} borderBottom={"1px solid gray"}
                    justifyContent={'center'}
                    flex={1} cursor={'pointer'}
                    pb={3}>
                    <Text fontWeight={'bold'} >
                        Replies
                    </Text>
                </Flex>
            </Flex>
        </VStack>
    )
}

export default UserHeader