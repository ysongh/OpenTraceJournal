import { HashRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Landing from './pages/Landing';

function App() {

  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route
          path="/test"
          element={<h1>Test</h1>} />
        <Route
          path="/"
          element={<Landing />} />
      </Routes>
    </HashRouter>
  )
}

export default App
