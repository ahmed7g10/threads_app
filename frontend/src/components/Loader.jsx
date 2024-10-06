import { Flex, Spinner } from '@chakra-ui/react'
import React from 'react'

const Loader = () => {
    return (
        <Flex height={'80vh'} minHeight={'7rem'} alignItems={'center'} justifyContent={'center'}>
            <Spinner
                thickness='5px'
                speed='0.65s'
                emptyColor='gray.900'
                color='blue.500'
                size='xl'
            />
        </Flex>
    )
}

export default Loader