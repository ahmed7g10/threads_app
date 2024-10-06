import { useEffect } from 'react'
import './index.css'
import { Box, Container, Toast } from '@chakra-ui/react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import UserPage from './pages/UserPage'
import PostPage from './pages/PostPage'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import { useDispatch, useSelector } from 'react-redux'
import UpdateProfilePage from './pages/UpdateProfilePage'
import LoginButton from './components/LoginButton'
import Error from './components/Error';
import ChatPage from './pages/ChatPage'
import SettingsPage from './pages/SettingsPage'
import * as jwtDecode from 'jwt-decode'
import { logout } from './store/slices/userSlice'
function App() {

  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();

  function getCookie() {
    try {
      const value = document.cookie.split('=')[1];
      const decode = jwtDecode.jwtDecode(value || " ")
      if (decode == " ") {
        dispatch(logout());
        Toast({
          description: 'your token expire',
          status: "error"
        })
      }

      const is_expire = new Date(decode.exp * 1000) < Date.now();
      
      if (is_expire) {
        dispatch(logout());
        Toast({
          description: 'your token expire',
          status: "error"
        })
      }
    } catch (error) {
      return true
    }
  }
  useEffect(() => {

    if (getCookie()) {
      dispatch(logout());
      Toast({
        description: 'your token expire',
        status: "error"
      })
    }



  }, [])
 
  if (!navigator.onLine) {
    return <Error er={"PLZ CONECCT TO THE INTERNET"} />
  }
  const { pathname } = useLocation();
  return (
    <Box position={'relative'} w={'full'}>
      <Container maxW={pathname == '/' ? { base: '620px', md: '900px' } : '620px'}>
        <Header ></Header>
        <Routes>
          <Route path='/:username' element={<UserPage />} />

          <Route path='/' element={<HomePage />} />
          <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to={'/'} />} />
          <Route path='/update' element={user ? <UpdateProfilePage /> : <Navigate to={'/auth'} />} />
          <Route path='/:username/post/:pid' element={<PostPage />} />
          <Route path='/chat' element={user ? <ChatPage /> : <Navigate to={'/auth'} />} />
          <Route path='/settings' element={user ? <SettingsPage /> : <Navigate to={'/auth'} />} />

        </Routes>
        {!user && <LoginButton />}

      </Container>
    </Box>
  )
}

export default App;
