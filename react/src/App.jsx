import { HashRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import MintPaperNFTForm from './pages/MintPaperNFTForm';

function App() {

  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route
          path="/mintpapernft"
          element={<MintPaperNFTForm />} />
        <Route
          path="/"
          element={<Landing />} />
      </Routes>
    </HashRouter>
  )
}

export default App
