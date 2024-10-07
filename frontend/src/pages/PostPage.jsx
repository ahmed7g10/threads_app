import React, { useEffect, useState } from 'react'
import { Avatar, Box, Button, Divider, Flex, Image, Text, useToast } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import Comment from '../components/Comment';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Actions from '../components/Actions';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserPost, getPOST } from '../store/slices/postSlice';
import { formatDistanceToNow } from 'date-fns';
import { AiFillDelete } from 'react-icons/ai';
import apiUrl from '../MY_ENV/API.JS';
import { API_URL } from '../MY_ENV/API.JS';

const PostPage = () => {
  const [liked, setLiked] = useState(false);
  const { pid } = useParams();
  const toast = useToast()
  const { post } = useSelector(state => state.posts)
  const { status, error } = useSelector(state => state.posts);
  const [postUser, setPostUser] = useState();
  const { user } = useSelector(state => state.user)
  const dispatch = useDispatch();
  const nav = useNavigate();
  const getThePost = async () => {
    dispatch(getPOST(pid))
  }
  const getPostUser = async () => {
    try {
      const res = await fetch(`${API_URL}/users/profile/${post?.postedBy}`, {
        method: 'GET'
      });
      const data = await res.json();
      setPostUser(data.user)
    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    getThePost()

  }, [pid]);
  useEffect(() => {
    getPostUser()
  }, [post])
  if (status == 'loading') {
    return <Loader />
  }
  const handleDelete = async () => {
    if (!user) {
      return
    }
    dispatch(deleteUserPost(post._id))
  }
  // if (data?.message != 'get post') {
  //   toast({
  //     description: data.message,
  //     status: 'error'
  //   })
  // }
  if (!post.replies) {
    return <Flex mt={7} height={'50vh'} minHeight={'10rem'} justifyContent={'center'} alignItems={'center'}>
      <Text fontWeight={'bold'} fontSize={'x-large'}>Post Not Found</Text>
    </Flex >
  }
  const sortedReplies = post.replies
    ? [...post.replies].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Newest first
    : [];
  return (

    <>
      <Flex mt={7}>
        <Flex w={'full'} alignItems={'center'}>
          <Avatar mr={2} src={`${apiUrl}/${postUser?.profilePic}`} size={'md'} name={postUser?.name} />
          <Flex >
            <Text fontSize={'sm'} fontWeight={'bold'}>
              {postUser?.username}
            </Text>
            <Image src='/verified.png' w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={'center'}>
          <Text color={'gray.light'} w={50} fontSize={'sm'}>
            {post?.createdAt && formatDistanceToNow(new Date(post?.createdAt))}
          </Text>
          {user?._id == post?.postedBy &&
            <Button onClick={(e) => {
              e.preventDefault();
              handleDelete();
              nav(`/${user.username}`)
            }} bg={'red.400'}>
              <AiFillDelete cursor={'pointer'} />
            </Button>
          }

        </Flex>
      </Flex>
      <Text my={3}>
        {post?.text}
      </Text>
      {post?.img && <Box maxHeight={'30rem'} borderRadius={6} borderColor={'gray.ligth'}
        overflow={'hidden'} border={'1px solid '}>
        <Image objectFit="cover" src={`${apiUrl}/${post?.img}`} bgSize={'cover'} w="full"
        />
      </Box>}
      <Flex gap={3} my={3}>

        <Actions post={post} liked={liked} setLiked={setLiked} />

      </Flex>

      <Divider my={4}></Divider>
      <Flex justifyContent={'space-between'}>
        <Flex alignItems={'center'} gap={2}>
          <Text fontSize={'2xl'}>
            h </Text>
          <Text color={'gray.light'}>Get the app to like replies and post</Text>
        </Flex>
        <Button>
          Get
        </Button>
      </Flex>
      <Divider my={4} />

      {post.replies && sortedReplies.map((rep, i) => {
        return (
          <Comment key={i}
            comment={rep.text} createdAt={rep?.createdAt} likes={rep?.likes?.length} username={rep.username}
            userAvatar={rep?.userId}
          />
        )
      })}

    </>
  )
}

export default PostPage;

// const handleDelete = async () => {
//   try {
//     const res = await fetch(`http://localhost:5000/api/posts/${post._id}`, {
//       method: 'DELETE',
//       credentials: 'include'
//     })
//     const data = await res.json();
//     console.log(data);
//     toast({
//       description: data.message,
//       status: 'success'
//     })

//   } catch (error) {
//     console.log(error.message);

//   }
// }

// const getThePost = async () => {
//   setLoading(true)
//   try {
//     const res = await fetch(`http://localhost:5000/api/posts/${pid}`, {
//       method: 'GET', credentials: 'include',
//     });
//     const data = await res.json();
//     setPost(data)
//   } catch (error) {
//     console.log(error.message)
//   } finally {
//     setLoading(false)
//   }
// }