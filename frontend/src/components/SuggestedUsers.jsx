import { Box, Button, Flex, Skeleton, SkeletonCircle, Text, useToast } from '@chakra-ui/react'
import  { useEffect, useState } from 'react'
import SuggestedUser from './SuggestedUser';
import { API_URL } from '../MY_ENV/API.JS';

const SuggestedUsers = () => {
    const [loading, setLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const toast = useToast();
    const doFetch = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/users/suggestesUsers`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await res.json();
            setSuggestedUsers(data)
        } catch (error) {
            toast({
                description: error.message,
                status: 'error'
            })
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        doFetch()
    }, [])
   
    return (
        <>
            <Text fontWeight={'bold'}>Suggested Users</Text>
            <Flex gap={4} direction={'column'}>
                {!loading && suggestedUsers.map(user => <SuggestedUser key={user?._id} user={user} />)}


                {!loading && suggestedUsers.length === 0 && (
                    <Flex flexDirection="column" alignItems="center" justifyContent="center" mt={8}>
                        <Text fontSize="md" color="gray.500">No suggested users at the moment.</Text>
                        <Button mt={4} onClick={doFetch} colorScheme="blue" size="sm">
                            Try Again
                        </Button>
                    </Flex>
                )}

                {loading && [1, 2, 3, 4, 5].map((_, idx) => (
                    <Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
                        {/* avatar skeleton */}
                        <Box>
                            <SkeletonCircle size={"10"} />
                        </Box>
                        {/* username and fullname skeleton */}
                        <Flex w={"full"} flexDirection={"column"} gap={2}>
                            <Skeleton h={"8px"} w={"80px"} />
                            <Skeleton h={"8px"} w={"90px"} />
                        </Flex>
                        {/* follow button skeleton */}
                        <Flex>
                            <Skeleton h={"20px"} w={"60px"} />
                        </Flex>
                    </Flex>
                ))}
            </Flex>
        </>
    )
}

export default SuggestedUsers