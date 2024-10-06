import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
// import Actions from './Actions'
const UserPost = ({ postImg, postTitle, likes, replies }) => {
    const [liked, setLiked] = useState(false)
    return (
        <Link to={'/userid/post/pid'}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={'column'} alignItems={'center'}>
                    <Avatar size={'md'} name='mohmmedmm'
                        src='' />
                    <Box w={'1px'} h={'full'} my={2} bg={'gray.light'} ></Box>
                    <Box position={'relative'} w={'full'}>
                        <Avatar name='yousof'
                            size={'xs'}
                            src='' padding={'2px'}
                            position={'absolute'}
                            top={'0px'} left={'15px'} />
                        <Avatar name='gaza'
                            size={'xs'}
                            src='' padding={'2px'}
                            position={'absolute'}
                            bottom={'0px'} right={'-5px'} />
                        <Avatar name='aqsaa'
                            size={'xs'}
                            src='' padding={'2px'}
                            position={'absolute'}
                            bottom={'0px'} left={'4px'} />
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={'column'} gap={2}>
                    <Flex w={'full'} justifyContent={'space-between'}>
                        <Flex gap={1} w={'full'} alignItems={'center'}>
                            <Text fontSize={'sm'}
                                fontWeight={'bold'}> ahmed abdo
                            </Text>
                            <Image src='/verified.png' w={4}
                                h={4} name='ahmed' />
                        </Flex>
                        <Flex gap={4} alignItems={'center'}>
                            <Text fontSize={'sm'} color={'gray.light'}>
                                1d
                            </Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>
                    <Text fontSize={'sm'}>{postTitle}</Text>
                    {
                        postImg && (
                            <Box borderRadius={6} borderColor={'gray.ligth'}
                                overflow={'hidden'} border={'1px solid '}>
                                <Image src={postImg} w={'full'} />
                            </Box>
                        )
                    }
                    <Flex gap={3} my={1}>
                        {/* <Actions liked={liked} setLiked={setLiked} /> */}
                    </Flex>
                    <Flex gap={2} alignItems={'center'}>
                        <Text color={'gray.light'} fontSize={'sm'}>
                            {replies} replies
                        </Text>
                        <Box w={0.5} h={0.5} borderRadius={'full'}
                            bg={'gray.light'}>

                        </Box>
                        <Text color={'gray.light'} fontSize={'sm'}>
                            {likes} likes
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    )
}

export default UserPost