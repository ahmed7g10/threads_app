import { AddIcon } from "@chakra-ui/icons";
import {
    Button,
    CloseButton,
    Flex,
    FormControl,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    useColorModeValue,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { createPostForUser } from "../store/slices/postSlice";

const MAX_CHAR = 500;

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = useSelector(state => state.user);
    const [postText, setPostText] = useState("");
    const { handleImageChange, imageUrl, setImageUrl } = usePreviewImg();
    const imageRef = useRef(null);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const showToast = useToast();
    const { status } = useSelector(state => state.posts)
    const { username } = useParams();
    const dispatch = useDispatch();
    const handleTextChange = (e) => {
        const inputText = e.target.value;

        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setPostText(truncatedText);
            setRemainingChar(0);
        } else {
            setPostText(inputText);
            setRemainingChar(MAX_CHAR - inputText.length);
        }
    };

    const handleCreatePost = async () => {
        if (!user) {
            showToast({
                description: "not lloged in",
                status: 'error'
            })
            return
        }
        showToast({
            description: "post created",
            status: 'success'
        })
        const d = { text: postText, postedBy: user._id, img: imageUrl||'non' };
        dispatch(createPostForUser(d))
        onClose()
        setImageUrl('')
        setPostText('')
    };
    if (status == 'loading') {
        return <Loader />
    }
    return (
        <>
            <Button
                position={"fixed"}
                bottom={10}
                right={5}
                bg={useColorModeValue("gray.300", "gray.dark")}
                onClick={onOpen}
                size={{ base: "sm", sm: "md" }}
            >
                <AddIcon />
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea
                                placeholder='Post content goes here..'
                                onChange={handleTextChange}
                                value={postText}
                            />
                            <Text fontSize='xs' fontWeight='bold' textAlign={"right"} m={"1"} color={"gray.800"}>
                                {remainingChar}/{MAX_CHAR}
                            </Text>

                            <Input type='file' hidden ref={imageRef} onChange={handleImageChange} />

                            <BsFillImageFill
                                style={{ marginLeft: "5px", cursor: "pointer" }}
                                size={16}
                                onClick={() => imageRef.current.click()}
                            />
                        </FormControl>

                        {imageUrl && (
                            <Flex mt={5} w={"full"} position={"relative"}>
                                <Image src={URL.createObjectURL(imageUrl)} alt='Selected img' />
                                <CloseButton
                                    onClick={() => {
                                        setImageUrl("");
                                    }}
                                    bg={"gray.800"}
                                    position={"absolute"}
                                    top={2}
                                    right={2}
                                />
                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={status == 'loading'}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreatePost;
// const handleCreatePost = async () => {
//     setLoading(true);
//     try {
//         const res = await fetch(`http://localhost:5000/api/posts/create`, {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json",

//             },
//             credentials: 'include',
//             body: JSON.stringify(({
//                 text: postText,
//                 postedBy: user._id,
//                 img: imageUrl
//             }))
//         })

//         const data = await res.json()
//         if (data.message != 'successfully created') {
//             showToast({
//                 description: data.message,
//                 status: 'error'
//             })
//             return
//         }
//         showToast({
//             description: data.message,
//             status: 'success'
//         })
//         onClose()
//         setImageUrl('')
//         setPostText('')
//     } catch (error) {
//         console.log(error.message);
//         showToast({
//             description: error.message,
//             status: 'error'
//         })

//     } finally {
//         setLoading(false);
//     }
// };