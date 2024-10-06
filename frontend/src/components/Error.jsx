import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

const Error = ({ er }) => {
    return (
        <Flex alignItems={'center'} justifyContent={'center'} w={'full'} height={'60vh'} minHeight={'18rem'}>
            {er ? (
                <Text fontSize={'2rem'} fontWeight={'bold'}>
                    {er}
                </Text>
            ) : (
                <Text fontSize={'2rem'} fontWeight={'bold'}>
                    server error
                </Text>
            )}
        </Flex>
    )
}

export default Error