import { useDispatch, useSelector } from 'react-redux';
import UserPost from '../components/UserPost';
import UserHeader from './../components/UserHeader';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { Flex, Text, useToast } from '@chakra-ui/react';
import Post from '../components/Post';
import { getUserPosts } from './../store/slices/postSlice';
import CreatePost from '../components/CreatePost';
import { API_URL } from '../MY_ENV/API.JS';

const UserPage = () => {
    const [user, setUser] = useState(null);
    const nav = useNavigate();
    const { user: me } = useSelector(state => state.user)
    const [loading, setLoading] = useState(true);
    const { username } = useParams();

    const toast = useToast()
    const dispatch = useDispatch();
    // const [userPosts, setUserPosts] = useState([])
    const { userPosts, status } = useSelector(state => state.posts);

    const getUser = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${API_URL}/users/profile/${username}`, {
                method: 'GET'
            })
            const data = await res.json()
            setLoading(false);
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

        }
    }
    // const getUserPosts = async () => {
    //     try {
    //         const res = await fetch(`http://localhost:5000/api/posts/user/${username}`, {
    //             method: 'GET'
    //         });
    //         const data = await res.json();
    //         console.log(data);
    //         setUserPosts(data)
    //     } catch (error) {
    //         console.log(error.message);

    //     }
    // }
    useEffect(() => {
        getUser();
        dispatch(getUserPosts(username))
    }, [username]);
    if (status == 'loading') {
        return <Loader />
    }
    if (!user && !loading || user?.isFrozen) {
        return <Flex justifyContent={'center'} minHeight={'10rem'} height={'50vh'} alignItems={'center'}>
            <Text fontSize={'2rem'} fontWeight={'bold'}>
                User Not Found
            </Text>
        </Flex>
    }
    return (
        <>
            {user && <UserHeader user={user} />}
            {userPosts?.map((p, i) => (
                <Post key={i} post={p} userId={user?._id} />
            ))}
            {userPosts.length == 0 && <Flex alignItems={'center'} justifyContent={'center'} mt={14}  >
                <Text textTransform={'capitalize'} textAlign={'center'} fontWeight={'bold'} fontSize={'xl'}>
                    user does not have post
                </Text>
            </Flex >}
            {user && user?._id == me?._id && < CreatePost />}
        </>
    )
}
export default UserPage;