import { useToast } from '@chakra-ui/react';
import React, { useState } from 'react'

const usePreviewImg = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const toast = useToast();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageUrl(file)
    }
    return { handleImageChange, imageUrl, setImageUrl }
}

export default usePreviewImg