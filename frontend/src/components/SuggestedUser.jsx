import React, { useState } from 'react'
import { Avatar, Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import apiUrl from '../MY_ENV/API.JS';
import { useSelector } from 'react-redux';
import { API_URL } from '../MY_ENV/API.JS';
const SuggestedUser = ({ user }) => {
    const currentUser = useSelector(state => state.user.user);
    const toast = useToast()
    const [updating, setUpdating] = useState(false);
    const dofollow = async () => {

        if (!currentUser) {
            toast({
                description: 'please login to follow', status: 'error'
            });
            return
        }
        setUpdating(true)
        try {
            const res = await fetch(`${API_URL}/users/follow/${user._id}`, {
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
            setUpdating(false)
        }
    }
    const [following, setFollowing] = useState(user.followers.includes(currentUser?._id || false));
    return (
        <>
            {user?._id != currentUser._id && <Flex mt={6} gap={2} justifyContent={"space-between"} alignItems={"center"}>
                <Flex gap={2} as={Link} to={`${user?.username}`}>
                    <Avatar src={`${apiUrl}/${user?.profilePic}`} />
                    <Box>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            {user?.username}
                        </Text>
                        <Text color={"gray.light"} fontSize={"sm"}>
                            {user?.name}
                        </Text>
                    </Box>
                </Flex>
                <Button
                    size={"sm"}
                    color={following ? "black" : "white"}
                    bg={following ? "white" : "blue.400"}
                    onClick={dofollow}
                    isLoading={updating}
                    _hover={{
                        color: following ? "black" : "white",
                        opacity: ".8",
                    }}
                >
                    {following ? "Unfollow" : "Follow"}
                </Button>
            </Flex>}</>
    )
}

export default SuggestedUser