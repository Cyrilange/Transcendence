//import axios from 'axios';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import theme from "./assets/components/theme.js";


import './assets/styles/style.css';
import Menu from './assets/components/buttons/menu.js'
import Home from './pages/home'
import DataPolicy from './pages/data-privacy'
import Imprint from './pages/imprint'
import GameRoom from './pages/GameRoom.jsx'



function Header(){
	return(
		<nav className='Header'>
        <Link to="/">logo</Link>
        <Menu />
    </nav>
	)
}
function Footer(){
	return(
		<nav className='Footer'>
        <Link to="/privacy-policy"> Privacy Policy</Link> {" "}
        <Link to="/terms-of-service">Terms of service</Link>
    </nav>
	)
}

function App() {
  return (
    <CssVarsProvider theme={theme}>
      <BrowserRouter>
      <Sheet
        sx={{
          py: 3, // padding top & bottom
          px: 2, // padding left & right
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 2,
          backgroundColor: 'black',
        }}
      >
            <Header />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/privacy-policy" element={<DataPolicy />} />
              <Route path="/terms-of-service" element={<Imprint />} />
              <Route path="/profile" element={<GameRoom />} />
              <Route path="/game/:gameId" element={<GameRoom />} />
          </Routes>
            <Footer />
        </Sheet>
      </BrowserRouter>
    </CssVarsProvider>
  );
}

export default App;
