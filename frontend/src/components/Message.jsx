import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { useSelector } from 'react-redux'
import apiUrl from '../MY_ENV/API.JS';
import { BsCheck2All } from "react-icons/bs";

const Message = ({ ownMessage, msg }) => {
    const { user } = useSelector(state => state.user);
    const { selectedConversation } = useSelector(state => state.message)
    return (
        <>
            {ownMessage ? (<Flex alignSelf={'flex-end'} gap={2}>
                <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
                    <Text color={"white"}>{msg.text}</Text>
                    <Box
                        alignSelf={"flex-end"}
                        ml={1}
                        color={msg.seen ? "blue.400" : ""}
                        fontWeight={"bold"}
                    >
                        <BsCheck2All size={16} />
                    </Box>
                </Flex>
                <Avatar w={7} h={7} src={`${apiUrl}/${user?.profilePic}`} />
            </Flex>) : (
                <Flex gap={2}>
                    <Avatar w={7} h={7} src={`${apiUrl}/${selectedConversation?.userProfilePic}`} />

                    <Text maxW={'350px'} bg={'gray.400'} borderRadius={'md'} color={'black'} p={1}>
                        {msg?.text}
                    </Text>

                </Flex>
            )}
        </>
    )
}

export default Message;