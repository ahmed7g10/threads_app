import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, useColorModeValue, WrapItem } from '@chakra-ui/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BsCheck2All } from 'react-icons/bs'
import { changeConversation } from '../store/slices/messageSlice';
import apiUrl from '../MY_ENV/API.JS';
const Conversations = ({ conversation, isOnline }) => {
    const user = conversation?.participants[0];
    const currentUser = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const { selectedConversation } = useSelector(state => state.message);
    const changeConversation_front = () => {
        dispatch(changeConversation({
            _id: conversation._id,
            userId: user._id,
            username: user.username,
            userProfilePic: user.profilePic,
            mock: conversation.mock
        }))
    }
    return (
        <Flex gap={4}
            bg={selectedConversation._id == conversation._id ? useColorModeValue("gray.400", "gray.dark") : ""}
            onClick={changeConversation_front} p={1} _hover={{
                cursor: 'pointer',
                bg: useColorModeValue("gray.600", "gray.dark"),
                color: "white",
                borderRadius: "md"
            }}
            borderRadius={"lg"}
            alignItems={'center'}>
            <WrapItem>
                <Avatar size={{
                    base: "xs",
                    sm: "sm",
                    md: "md"
                }} src={`${apiUrl}/${user.profilePic}`} >
                    {isOnline && <AvatarBadge boxSize='1.25em' bg='green.500' />}
                </Avatar >
            </WrapItem>
            <Stack direction={'column'}>
                <Text fontWeight={700} display={'flex'} alignItems={'center'}
                >
                    {user.username} <Image src='/verified.png' w={4} ml={1} />

                </Text>
                <Text fontSize={'sm'} gap={1}
                    alignItems={'center'} display={'flex'}>
                    {<>
                        {conversation?.lastMessage?.sender == currentUser._id ? <Box>
                            <BsCheck2All
                                color={conversation?.lastMessage?.seen ? 'red' : ''}
                                scale={16} />
                        </Box> : ""}
                        {conversation?.lastMessage?.text?.length > 18 ? conversation?.lastMessage?.text.substring(0, 18) + '...'
                            : conversation?.lastMessage?.text}
                    </>}

                </Text>
            </Stack>
        </Flex>
    )
}

export default Conversations