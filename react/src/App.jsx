import { HashRouter, Route, Routes } from 'react-router-dom';

import { ETHProvider } from './ETHContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import MintPaperNFTForm from './pages/MintPaperNFTForm';
import PapersList from './pages/PapersList';
import CreateKey from './pages/CreateKey';

function App() {

  return (
    <ETHProvider>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route
            path="/createkey"
            element={<CreateKey />} />
          <Route
            path="/mintpapernft"
            element={<MintPaperNFTForm />} />
          <Route
            path="/paperslist"
            element={<PapersList />} />
          <Route
            path="/"
            element={<Landing />} />
        </Routes>
      </HashRouter>
    </ETHProvider>
  )
}

export default App
