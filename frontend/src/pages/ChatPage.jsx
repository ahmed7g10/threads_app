import { Search2Icon } from '@chakra-ui/icons'
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Conversations from '../components/Conversations'
import { GiConversation } from 'react-icons/gi'
import MessageContainer from '../components/MessageContainer'
import { useDispatch, useSelector } from 'react-redux';
import { changeConversation, getConversations, mockConversation } from './../store/slices/messageSlice';
import { useSocket } from '../context/socketContext'
const ChatPage = () => {
    const { user } = useSelector(state => state.user)
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { conversations, selectedConversation, status } = useSelector(state => state.message);
    const [search, setSearch] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const {onlineUsers}=useSocket()
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoading(true); // Start loading
                dispatch(getConversations());
            } catch (error) {
                toast({
                    title: "Error fetching conversations.",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                });
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchConversations();

    }, [dispatch, toast]);
    const handelSearchConversation = async (e) => {
        e.preventDefault();
        setSearchLoading(true)
        try {
            if (!search) return;
            const res = await fetch(`http://localhost:5000/api/users/profile/${search}`);
            const data = await res.json();
            // console.log(data);

            if (data?.message != "profile") {
                toast({
                    description: data?.message,
                    status: 'error'
                })
                return
            }
            if (user._id == data.user._id) {
                toast({
                    description: "you can not message your self",
                    status: 'error'
                })
                return
            }

            // let existConversation = conversations?.find((c) => {

            //     c.participants[0]._id == data.user._id;
            // })
            let existConversation = conversations.find((c) =>
                c.participants?.[0]?._id === data.user._id
            ) || null;
            //if user has conversation 
            if ((data.user._id) == (existConversation?.participants[0]?._id)) {
                // console.log('iam here');

                dispatch(changeConversation({
                    _id: existConversation?._id,
                    userId: data.user._id,
                    userProfilePic: data.user.profilePic,
                    username: data.user.username
                }));
                return
            }
            const mockConversation_r = {
                _id: Date.now(),
                mock: true,
                participants: [{
                    _id: data.user._id,
                    username: data.user.username,
                    profilePic: data.user.profilePic


                }],
                lastMessage: {
                    text: ""
                    , sender: ""
                }
            }
            dispatch(mockConversation(mockConversation_r))
        } catch (error) {
            toast({
                description: error.message,
                status: 'error'
            })
        } finally {
            setSearchLoading(false)
        }
    }
    return (
        <Box position={'absolute'} w={{
            base: "80%",
            lg: "750px",
            md: '80%'

        }} p={4} left={'50%'} transform={'translateX(-50%)'}  >

            <Flex
                flexDirection={{
                    base: 'column',
                    md: 'row'
                }}
                maxW={{
                    sm: '400px',
                    md: 'full'
                }}
                mx={'auto'}
                gap={4}>
                <Flex flexDirection={'column'}
                    maxW={{
                        sm: "250px",
                        md: 'full'
                    }}
                    mx={'auto'}
                    gap={2} flex={'30%'}>
                    <Text t fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
                        Your Conversations
                    </Text>
                    <form onSubmit={handelSearchConversation}>
                        <Flex alignItems={'center'} gap={2}>
                            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='search for user' />
                            <Button isLoading={searchLoading} onClick={handelSearchConversation}>
                                <Search2Icon />
                            </Button>
                        </Flex>

                    </form>
                    {status == 'loading' ||loading ? (
                        [1, 2, 3, 4, 5].map((_, index) => (
                            <Flex key={index} gap={4} p={1} borderRadius={'md'} alignItems={'center'}>
                                <Box>
                                    <SkeletonCircle size={20} />
                                </Box>
                                <Flex
                                    w={'full'} flexDirection={'column'} gap={3}
                                >
                                    <Skeleton h={'10px'} w={'80px'} />
                                    <Skeleton h={'8px'} w={'90%'} />
                                </Flex>
                            </Flex>
                        ))
                    ) : (
                        conversations?.map((c) => (
                            <Conversations isOnline={onlineUsers.includes(c.participants[0]._id)} key={c?._id} conversation={c} />
                        ))
                    )}
                </Flex>
                {!selectedConversation?._id ? (
                    <Flex flex={'70%'} borderRadius={'md'} flexDirection={'column'} alignItems={'center'}
                        h={'400px'} justifyContent={'center'} p={2}>
                        <GiConversation size={100} />
                        <Text >
                            select a conversation to start messageing
                        </Text>
                    </Flex>
                ) : (<MessageContainer />
                )}

            </Flex>
        </Box>
    )
}

export default ChatPage