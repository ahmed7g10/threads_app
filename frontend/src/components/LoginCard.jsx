import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/userSlice";
import Loader from "./Loader";
import { API_URL } from "../MY_ENV/API.JS";
import apiUrl from "../MY_ENV/API.JS";

export default function LoginCard({ setValue }) {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const showToast = useToast();
    const [loading, setLoading] = useState(false)
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });



    const handleLogin = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify(inputs),
            });
            const data = await res.json();

            if (data.message) {
                showToast({
                    description: data.message, status: 'error'
                });
                return;
            }
            showToast({
                description: 'loged in successfully', status: 'success'
            });

            localStorage.setItem("user-threads", JSON.stringify(data));
            dispatch(login(data))
        } catch (error) {
            showToast({
                description: error.message, status: 'error'
            });
        } finally {
            setLoading(false)
        }
    };

    return (
        <Flex align={"center"} justify={"center"}>
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"} textAlign={"center"}>
                        Login
                    </Heading>
                </Stack>
                <Box rounded={"lg"} bg={useColorModeValue("white", "gray.dark")} boxShadow={"lg"} p={8}>
                    <Stack spacing={4}>

                        <FormControl isRequired>
                            <FormLabel>username</FormLabel>
                            <Input
                                type='text'
                                onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                                value={inputs.username}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                                    value={inputs.password}
                                />
                                <InputRightElement h={"full"}>
                                    <Button
                                        variant={"ghost"}
                                        onClick={() => setShowPassword((showPassword) => !showPassword)}
                                    >
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText='Submitting'
                                size='lg'
                                bg={useColorModeValue("gray.600", "gray.700")}
                                color={"white"}
                                _hover={{
                                    bg: useColorModeValue("gray.700", "gray.800"),
                                }}
                                onClick={handleLogin}
                                isLoading={loading}
                            >
                                Login
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={"center"}>
                                Don,t have an account?{" "}
                                <Link color={"blue.400"}
                                    onClick={() => setValue("signup")}
                                >
                                    Sign Up
                                </Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}