import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RotaProtegida from "./components/RotaProtegida";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Produtos from "./pages/Produtos";
import NovoProduto from "./pages/NovoProduto";
import EditarProduto from "./pages/EditarProduto";
import Movimentacao from "./pages/Movimentacao";
import Historico from "./pages/Historico";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route
            path="/produtos"
            element={
              <RotaProtegida>
                <Produtos />
              </RotaProtegida>
            }
          />
          <Route
            path="/produtos/novo"
            element={
              <RotaProtegida>
                <NovoProduto />
              </RotaProtegida>
            }
          />
          <Route
            path="/produtos/editar/:id"
            element={
              <RotaProtegida>
                <EditarProduto />
              </RotaProtegida>
            }
          />
          <Route
            path="/produtos/:id/movimentacao"
            element={
              <RotaProtegida>
                <Movimentacao />
              </RotaProtegida>
            }
          />
          <Route
            path="/produtos/:id/historico"
            element={
              <RotaProtegida>
                <Historico />
              </RotaProtegida>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;