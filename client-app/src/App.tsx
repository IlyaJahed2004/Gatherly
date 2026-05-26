// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage/';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All routes inside this will share the MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          {/* Add future routes here, e.g., <Route path="/about" element={<AboutPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
