import { HashRouter, Route, Routes } from 'react-router-dom';

import Landing from './pages/Landing';

function App() {

  return (
    <HashRouter>
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
