import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import { layoutRoutes, standaloneRoutes } from './routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with MainLayout (Navbar) */}
        <Route path="/" element={<MainLayout />}>
          {layoutRoutes.map((r) => (
            <Route 
              key={r.path || 'index'} 
              path={r.path} 
              index={r.index} 
              element={r.element} 
            />
          ))}
        </Route>

        {/* Standalone routes (no Navbar) */}
        {standaloneRoutes.map((r) => (
          <Route 
            key={r.path} 
            path={r.path} 
            element={r.element} 
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
