import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue, useToast } from '@chakra-ui/react'
import  { useEffect, useRef, useState } from 'react'
import Message from './Message'
import MessageInput from './MessageInput'
import { useDispatch, useSelector } from 'react-redux'
import apiUrl from '../MY_ENV/API.JS'
import { updateConversationLastMessage } from '../store/slices/messageSlice'
import { useSocket } from '../context/socketContext'
import { API_URL } from '../MY_ENV/API.JS'

const MessageContainer = () => {
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const { selectedConversation } = useSelector(state => state.message);
    const [messages, setMessages] = useState([]);
    const { user } = useSelector(state => state.user);
    const { socket } = useSocket()
    const dispatch = useDispatch()
    const getUsersMessaes = async ( ) => {
        setLoading(true)
        try {

            const res = await fetch(`${API_URL}/messages/${selectedConversation.userId}`, {
                credentials: 'include'
            })
            const data = await res.json();
            // if (selectedConversation?.mock) {
            //     return;
            // };
            setMessages(data)
        } catch (error) {
            toast({
                description: error.message,
                status: "error"
            })
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getUsersMessaes();

        if (selectedConversation.mock) {
            getUsersMessaes(selectedConversation.userId);
        }
    }, [toast, selectedConversation?.userId])
    useEffect(() => {
        const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== user._id;
        if (lastMessageIsFromOtherUser) {
            socket.emit("markMessagesAsSeen", {
                conversationId: selectedConversation._id,
                userId: selectedConversation.userId,
            });
        }
        socket.on("messagesSeen", ({ conversationId }) => {
            if (selectedConversation._id === conversationId) {
                setMessages((prev) => {
                    const updatedMessages = prev.map((message) => {
                        if (!message.seen) {
                            return {
                                ...message,
                                seen: true,
                            };
                        }
                        return message;
                    });
                    return updatedMessages;
                });
            }
        });
    }, [socket, user._id, messages, selectedConversation])
    useEffect(() => {
        socket.on("newMessage", (message) => {

            if (selectedConversation._id == message.conversationId) {
                setMessages((pre) => [...pre, message])
            }
            dispatch(updateConversationLastMessage({ s_id: selectedConversation._id, message, try: 'sasasasa' }))
        })
        return () => socket.off("newMessage")
    }, [socket])
    const messageRef = useRef(null);
    useEffect(() => {
        messageRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])
    return (
        <Flex p={3} borderRadius={'md'} bg={useColorModeValue("gray.200", 'gray.dark')}
            flexDirection={'column'} flex={'70%'}>
            <Flex w={'full'} alignItems={'center'} h={12} gap={2}>
                <Avatar src={`${apiUrl}/${selectedConversation?.userProfilePic}`} size={'sm'} />
                <Text display={'flex'} ml={1} alignItems={'center'}>{selectedConversation?.username}
                    <Image src='/verified.png' w={4} ml={1} /></Text>
            </Flex>
            <Divider />
            <Flex px={2} flexDirection={'column'} height={'400px'} gap={4} my={4} overflowY={'auto'}>
                {loading && (
                    [...Array(5)].map((_, index) => (
                        <Flex p={1} borderRadius={'md'} alignItems={'center'}
                            gap={2} key={index}
                            alignSelf={index % 2 == 0 ? 'flex-start' : 'flex-end'}
                        >
                            {index % 2 == 0 && <SkeletonCircle size={7} />}
                            <Flex gap={2} flexDirection={'column'}>
                                <Skeleton h={'8px'} w={'250px'} />
                                <Skeleton h={'8px'} w={'250px'} />
                                <Skeleton h={'8px'} w={'250px'} />
                            </Flex>
                            {index % 2 != 0 && <SkeletonCircle size={7} />}
                        </Flex>
                    ))
                )}
                {!loading && <>
                    {messages.length > 0 && messages?.map((m) => (
                        <Flex key={m._id} ref={messages.length - 1 == messages.indexOf(m) ? messageRef : null}
                            direction={'column'}>
                            <Message msg={m} ownMessage={m.sender == user._id ? true : false} />
                        </Flex>
                    ))}
                </>}
            </Flex>

            <MessageInput messages={messages} setMessages={setMessages} />
        </Flex >

    )
}

export default MessageContainer;