import { Avatar, Box, Button, Flex, Image, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link, NavLink } from 'react-router-dom'
import Loader from './Loader'
import Actions from './Actions'
import { formatDistanceToNow } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux'
import { AiFillDelete } from 'react-icons/ai'
import { deleteUserPost } from '../store/slices/postSlice'
import apiUrl from '../MY_ENV/API.JS'
const Post = ({ post, userId }) => {
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [postCreator, setPostCreator] = useState();
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch()

    const toast = useToast();

    useEffect(() => {
        const getUser = async () => {
            setLoading(true)
            try {


                const res = await fetch(`http://localhost:5000/api/users/profile/${post?.postedBy}`); //here stoped
                const data = await res.json();

                if (data?.message == 'profile') {
                    setPostCreator(data.user);
                    return
                }
                alert('error')

            } catch (error) {
                console.log(error.message);

            } finally {
                setLoading(false)
            }
        }
        getUser()
    }, [userId])
    if (loading) {
        return <Loader />
    }
    const handleDelete = async () => {
        try {

            dispatch(deleteUserPost(post?._id))
            toast({
                description: 'deleted',
                status: 'success'
            })

            // setUserPosts((prevPosts) => prevPosts.filter((p) => p._id !== post?._id));
        } catch (error) {
            console.log(error.message);

        }
    }
    return (
        <Link to={`/${postCreator?.username}/post/${post?._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={'column'} alignItems={'center'}>
                    <NavLink to={`/${postCreator?.username}`}>
                        <Avatar size={'md'} name={postCreator?.name}
                            src={`${apiUrl}/${postCreator?.profilePic}` || ""} />
                    </NavLink>
                    <Box w={'1px'} h={'full'} my={2} bg={'gray.light'} ></Box>
                    <Box position={'relative'} w={'full'}>
                        {post?.replies[0] &&
                            <Avatar name={post?.replies[0]?.username}
                                size={'xs'}
                                src={`${apiUrl}/${post?.replies[0]?.profilePic}`} padding={'2px'}
                                position={'absolute'}
                                top={'0px'} left={'15px'} />
                        }

                        {post?.replies[1] &&
                            <Avatar name={post?.replies[1]?.username}
                                size={'xs'}
                                src={`${apiUrl}/${post?.replies[1]?.profilePic}`} padding={'2px'}
                                position={'absolute'}
                                bottom={'0px'} right={'-5px'} />
                        }
                        {post?.replies[2] &&
                            <Avatar name={post?.replies[2]?.username}
                                size={'xs'}
                                src={`${apiUrl}/${post?.replies[2]?.profilePic}`} padding={'2px'}
                                position={'absolute'}
                                bottom={'0px'} left={'4px'} />
                        }
                        {
                            post?.replies.length === 0 && <Text textAlign={'center'}>
                                no replies
                            </Text>
                        }

                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={'column'} gap={2}>
                    <Flex w={'full'} justifyContent={'space-between'}>
                        <Flex gap={1} w={'full'} alignItems={'center'}>
                            <NavLink to={`/${postCreator?.username}`}>
                                <Text fontSize={'sm'}
                                    fontWeight={'bold'}> @{postCreator?.username}
                                </Text>
                            </NavLink>
                            <Image src='/verified.png' w={4}
                                h={4} name='ahmed' />
                        </Flex>
                        <Flex gap={4} alignItems={'center'}>
                            <Text fontSize={'xs'} width={36} textAlign={'right'} color={'gray.light'}>
                                {post?.createdAt? formatDistanceToNow(new Date(post?.createdAt)):""}
                            </Text>
                            {user?._id == postCreator?._id &&
                                <Button onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete()
                                }} bg={'red.400'}>
                                    <AiFillDelete />
                                </Button>
                            }
                            {/* <BsThreeDots /> */}
                        </Flex>
                    </Flex>
                    <Text fontSize={'sm'}>{post?.text}</Text>
                    {
                        post?.img && (
                            <Box borderRadius={6} maxHeight={'30rem'} borderColor={'gray.ligth'}
                                overflow={'hidden'} border={'1px solid '}>
                                <Image src={`${apiUrl}/${post?.img}`} w={'full'} />
                            </Box>
                        )
                    }
                    <Flex gap={3} my={1}>
                        <Actions liked={liked} post={post} setLiked={setLiked} />
                    </Flex>
                    {/* <Flex gap={2} alignItems={'center'}>
                        <Text color={'gray.light'} fontSize={'sm'}>
                            {post?.replies.length} replies
                        </Text>
                        <Box w={0.5} h={0.5} borderRadius={'full'}
                            bg={'gray.light'}>

                        </Box>
                        <Text color={'gray.light'} fontSize={'sm'}>
                            {post?.likes.lenght} likes
                        </Text>
                    </Flex> */}
                </Flex>
            </Flex>
        </Link>
    )
}

export default Post