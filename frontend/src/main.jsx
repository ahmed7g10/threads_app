import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/theme-utils'
import { mode } from '@chakra-ui/theme-tools'
import { ColorModeScript } from '@chakra-ui/react'
import { Provider } from 'react-redux';

import { BrowserRouter } from 'react-router-dom'
import store from './store/store.js'
import { SocketContextProvider } from './context/socketContext.jsx'
const styles = {
  global: (props) => ({
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('gray.100', '#101010')(props),
    }
    // body: {
    //   color: mode('#6D28D9', '#D6BCFA')(props), // Custom purple colors for text
    //   bg: mode('#E9D8FD', '#4C1D95')(props), // Custom purple colors for background
    // }

  })
}
const config = {
  initialColorMode: "dark",
  useSystemColorMOde: true
}
const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e"
  }
}

const theme = extendTheme({ config, styles, colors });
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
       <SocketContextProvider>
       <App />
       </SocketContextProvider>
      </ChakraProvider>
    </BrowserRouter>
  </Provider>
  
)
