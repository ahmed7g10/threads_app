import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
    useToast,
} from "@chakra-ui/react";

import { useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import usePreviewImg from "../hooks/usePreviewImg";
import { update } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import apiUrl from "../MY_ENV/API.JS";
import { API_URL } from "../MY_ENV/API.JS";

export default function UpdateProfilePage() {
    const { user } = useSelector(state => state.user)
    const [inputs, setInputs] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        password: "",
    });
    const { handleImageChange, imageUrl } = usePreviewImg();

    const [updating, setUpdating] = useState(false);
    const nav = useNavigate()
    const showToast = useToast();
    const fileRef = useRef(null);
    const dispatch = useDispatch();




    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            // Append text fields
            formData.append('name', inputs.name);
            formData.append('username', inputs.username);
            if (imageUrl) {
                formData.append('profilePic', imageUrl);
            }
            formData.append('email', inputs.email);
            formData.append('bio', inputs.bio);
            formData.append('password', inputs.password);
            const res = await fetch(`${API_URL}/users/update/${user._id}`, {
                method: 'PUT',
                credentials: 'include',
                body: formData
            });
            const data = await res.json();
            if (data.message && data.message != "profile updated successfully") {
                showToast({
                    description: data.message,
                    status: 'warning'
                });
                return
            }
            showToast({
                description: data.message,
                status: 'success'
            });
            nav('/')
            dispatch(update(data.user));



        } catch (error) {
            showToast({
                description: error.message,
                status: 'error'
            })
        }
    };
    console.log(user);

    return (
        <form onSubmit={handleSubmit}>
            <Flex align={"center"} justify={"center"} my={6}>
                <Stack
                    spacing={4}
                    w={"full"}
                    maxW={"md"}
                    bg={useColorModeValue("white", "gray.dark")}
                    rounded={"xl"}
                    boxShadow={"lg"}
                    p={6}
                >
                    <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
                        User Profile Edit
                    </Heading>
                    <FormControl id='userName'>
                        <Stack direction={["column", "row"]} spacing={6}>
                            <Center>
                                <Avatar size='xl' name={user?.username} boxShadow={"md"} src={imageUrl ? URL.createObjectURL(imageUrl) :
                                    `${apiUrl}/${user?.profilePic}`
                                } />
                            </Center>
                            <Center w='full'>
                                <Button w='full'
                                    onClick={() => fileRef.current.click()}
                                >
                                    Change Avatar
                                </Button>
                                <Input type='file' hidden ref={fileRef}
                                    onChange={handleImageChange}
                                />
                            </Center>
                        </Stack>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Full name</FormLabel>
                        <Input
                            placeholder='John Doe'
                            value={inputs.name}
                            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                            _placeholder={{ color: "gray.500" }}
                            type='text'
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>User name</FormLabel>
                        <Input
                            placeholder='johndoe'
                            value={inputs.username}
                            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                            _placeholder={{ color: "gray.500" }}
                            type='text'
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Email address</FormLabel>
                        <Input
                            placeholder='your-email@example.com'
                            value={inputs.email}
                            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                            _placeholder={{ color: "gray.500" }}
                            type='email'
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Bio</FormLabel>
                        <Input
                            placeholder='Your bio.'
                            value={inputs.bio}
                            onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                            _placeholder={{ color: "gray.500" }}
                            type='text'
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder='password'
                            value={inputs.password}
                            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                            _placeholder={{ color: "gray.500" }}
                            type='password'
                        />
                    </FormControl>
                    <Stack spacing={6} direction={["column", "row"]}>
                        <Button
                            bg={"red.400"}
                            color={"white"}
                            w='full'
                            _hover={{
                                bg: "red.500",
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            bg={"green.400"}
                            color={"white"}
                            w='full'
                            _hover={{
                                bg: "green.500",
                            }}
                            type='submit'

                        >
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    );
}