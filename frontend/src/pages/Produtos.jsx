import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listarProdutos, excluirProduto } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [erro, setErro] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarProdutos(token, busca, pagina);
        setProdutos(dados.produtos);
        setTotal(dados.total);
      } catch (e) {
        setErro(e.message);
      }
    }

    carregar();
  }, [token, busca, pagina]);

  async function handleExcluir(id) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await excluirProduto(token, id);
      setProdutos(produtos.filter((p) => p.id !== id));
    } catch (e) {
      setErro(e.message);
    }
  }

  const totalPaginas = Math.ceil(total / 10);

  return (
    <div>
      <h1>Produtos</h1>
      <Link to="/produtos/novo">Novo Produto</Link>
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <input
        placeholder="Buscar por nome ou SKU"
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setPagina(1);
        }}
      />

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>SKU</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Ações</th>
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
                <button className="excluir" onClick={() => handleExcluir(produto.id)}>Excluir</button>
                <Link to={`/produtos/${produto.id}/movimentacao`}>Movimentar</Link>
                <Link to={`/produtos/${produto.id}/historico`}>Histórico</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>
          Anterior
        </button>
        <span> Página {pagina} de {totalPaginas || 1} </span>
        <button disabled={pagina >= totalPaginas} onClick={() => setPagina(pagina + 1)}>
          Próxima
        </button>
      </div>
    </div>
  );
}