import React, { useEffect, useState } from 'react'

import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Post from '../components/Post';
import { getfeedPosts } from '../store/slices/postSlice';
import SuggestedUsers from '../components/SuggestedUsers';
import { logout } from '../store/slices/userSlice';
import * as jwtDecode from 'jwt-decode'
import Error from '../components/Error';

const HomePage = () => {
    const { user } = useSelector(state => state.user);
    // const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.posts)
    const data = useSelector((state) => state.posts.posts);
    const posts = data;
    useEffect(() => {
        dispatch(getfeedPosts());
    }, [dispatch])
    
    function getCookie() {
        setLoading(true)
        try {
            const value = document.cookie.split('=')[1];
            const decode = jwtDecode.jwtDecode(value || " ")
            if (decode == " ") {
                dispatch(logout());
                toast({
                    description: 'your token expire',
                    status: "error"
                })
            }

            const is_expire = new Date(decode.exp * 1000) < Date.now();
           

            if (is_expire) {
                dispatch(logout());
                Toast({
                    description: 'your token expire',
                    status: "error"
                })
            }
        } catch (error) {
            return true
        } finally {
            setLoading(false)
        }
    }
    if (status == 'loading') {
        return <Loader />
    }
    if (error) {
        return <Error er={error.message} />
    }
    if (status != 'loading' && !user) {
        toast({
            description: 'please login to see feed posts',
            status: 'error'
        })

        return <Flex w={'full'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
            <Link to={`/s`}>
                <Flex w={'full'} justifyContent={'center'} my={6}>
                    <Button mx={'auto'}>
                        see posts
                    </Button>
                </Flex>
            </Link>
            <Flex mt={10}>
                <Text fontWeight={'bold'} textAlign={'center'} fontSize={'xl'}>
                    Not Loged In
                </Text>
            </Flex>
        </Flex>

    }    
    return (
        <Flex gap={10} alignItems={'start'} width={'100%'} mt={4}>
            <Box flex={70}>
                {status != 'loading' && posts.length==0 &&
                <Text fontSize="lg" color="gray.500">
                Follow some users to see their posts in your feed!
                </Text>
                }
                {
                    user && posts?.length < 0 ? (
                        <h1>follow some user to see the feed</h1>
                    )
                        : (
                            <Flex flexDirection={'column'}>
                                {posts.length >= 1 && posts?.map((post) => {
                                    return (
                                        <Post width={'100%'} key={post._id} post={post} userId={post.postedBy} />
                                    )
                                })}</Flex>
                        )
                }
            </Box>
            <Box display={{
                base: 'none',
                md: 'block'
            }} flex={30}>
                <SuggestedUsers />
            </Box>
        </Flex>
    )
}

export default HomePage;

{/* <Link to={`/${user.username}`}>
            <Flex w={'full'} justifyContent={'center'} my={6}>
                <Button mx={'auto'}>
                    Viste Profile Page
                </Button>
            </Flex>
        </Link> */}