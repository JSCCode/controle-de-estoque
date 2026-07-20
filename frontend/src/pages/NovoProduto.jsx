import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarProduto } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function NovoProduto() {
  const [nome, setNome] = useState("");
  const [sku, setSku] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [quantidadeEstoque, setQuantidadeEstoque] = useState("");
  const [erro, setErro] = useState("");

  const { token } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");

    try {
      await criarProduto(token, {
        nome,
        sku,
        descricao,
        precoUnitario: Number(precoUnitario),
        quantidadeEstoque: Number(quantidadeEstoque),
      });
      navigate("/produtos");
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <div>
      <h1>Novo Produto</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
        <input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <input placeholder="Preço" type="number" step="0.01" value={precoUnitario} onChange={(e) => setPrecoUnitario(e.target.value)} />
        <input placeholder="Quantidade" type="number" value={quantidadeEstoque} onChange={(e) => setQuantidadeEstoque(e.target.value)} />
        <button type="submit">Criar</button>
      </form>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
}