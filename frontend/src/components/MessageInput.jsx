import { Button, Input, InputGroup, InputRightElement, useToast } from '@chakra-ui/react'
import  { useState } from 'react'
import { IoSendSharp } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux';
import { changeConversation, updateConversations } from '../store/slices/messageSlice';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../MY_ENV/API.JS';
const MessageInput = ({ messages, setMessages }) => {
    const [loading, setLoading] = useState(false);
    const { selectedConversation } = useSelector(state => state.message);
    const toast = useToast();
    const dispacth = useDispatch();
    const [message, setMessage] = useState("");
    const navigate=useNavigate();
    const handleSendMessage = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            if (!message) return;
            const res = await fetch(`${API_URL}/messages`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipientId: selectedConversation.userId,
                    message
                })
            })
            const data = await res.json();

            if (!selectedConversation?.mock) {
                
                setMessages([...messages, data]);
            } else {
                if (messages.length == 0) {
                    setMessages(data);
                } else {
                    navigate('/chat')
                    dispacth(changeConversation({
                        _id: "",
                        userId: "",
                        userProfilePic: "",
                        username: "",
                        mock: false
                    }))
                    // setMessages([...messages, data]);
                }
            }
            dispacth(updateConversations({
                s_id: selectedConversation._id,
                Lmessage: {
                    message: data.text,
                    sender: data.sender
                }
            }));
            setMessage("")
        } catch (error) {
            toast({
                description: error.message,
                status: 'error'
            })
        } finally {
            setLoading(false)
        }
    }
    return (
        <form onSubmit={handleSendMessage} >
            <InputGroup>
                <Input value={message} onChange={(e) => {
                    setMessage(e.target.value)
                }} placeholder='type message' w={'full'} />
                <InputRightElement>
                    <Button onClick={handleSendMessage} isLoading={loading} p={0}>
                        <IoSendSharp size={20} />
                    </Button>
                </InputRightElement>
            </InputGroup>
        </form>
    )
}

export default MessageInput;