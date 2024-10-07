import { Flex, Image, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { AiFillHome, AiOutlineLogout } from 'react-icons/ai'
import { Button, useToast } from '@chakra-ui/react'

import { RxAvatar, RxChatBubble, RxFigmaLogo } from 'react-icons/rx'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/userSlice';

import { Link } from 'react-router-dom';
import { BsFillChatFill, BsFillChatQuoteFill } from 'react-icons/bs'
import { SettingsIcon } from '@chakra-ui/icons'
import { API_URL } from '../MY_ENV/API.JS'
const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user } = useSelector(state => state.user)
  const toast = useToast();
  const nav = useNavigate();
  const dispatch = useDispatch()
  const handleLogout = async () => {
    try {
      localStorage.removeItem('user-threads');
      const res = await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await res.json()
      dispatch(logout())
      toast({
        description: 'user loged out successfully', status: 'success'
      })
      nav('/auth')
    } catch (error) {
      console.log(error.message);

    }
  }
  return (
    <Flex justifyContent={user ? 'space-between' : 'center'} mb={8} mt={6}>
      {user && (
        <>
          <Link to={`/`}>
            <AiFillHome size={24} />
          </Link>
        </>
      )}
      <Image
        onClick={toggleColorMode}
        cursor={'pointer'}
        alt='logo'
        w={6}
        src={colorMode === 'dark' ? '/light-logo.svg' : '/dark-logo.svg'}
      />

      {user && (
        <Flex alignItems={'center'} gap={6}>

          <Link to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Link to={'/chat'}>
            <BsFillChatQuoteFill />
          </Link>
          <Link to={`/settings`}>
            <SettingsIcon size={24} />
          </Link>
          <Button onClick={handleLogout}
          >
            <AiOutlineLogout />
          </Button>

        </Flex>
      )}

    </Flex>
  )
}

export default Header;