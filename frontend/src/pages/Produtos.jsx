import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { listarProdutos, excluirProduto } from "../services/api";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarProdutos(token);
        setProdutos(dados);
      } catch (e) {
        setErro(e.message);
      }
    }

    carregar();
  }, [token]);

  async function handleExcluir(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;

  try {
    await excluirProduto(token, id);
    setProdutos(produtos.filter((p) => p.id !== id));
  } catch (e) {
    setErro(e.message);
  }
}

  return (
    <div>
      <h1>Produtos</h1>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <Link to="/produtos/novo">Novo Produto</Link>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>SKU</th>
            <th>Preço</th>
            <th>Estoque</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>{produto.sku}</td>
              <td>{produto.precoUnitario}</td>
              <td>{produto.quantidadeEstoque}</td>
              <td>
                <Link to={`/produtos/editar/${produto.id}`}>Editar</Link>
                <button onClick={() => handleExcluir(produto.id)}>Excluir</button>
                <Link to={`/produtos/${produto.id}/movimentacao`}>Movimentar</Link>
                <Link to={`/produtos/${produto.id}/historico`}>Histórico</Link>
              </td>
            </tr>
         ))}
        </tbody>
      </table>
    </div>
  );
}