import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { registrarMovimentacao } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Movimentacao() {
  const [tipo, setTipo] = useState("0");
  const [quantidade, setQuantidade] = useState("");
  const [erro, setErro] = useState("");

  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro("");

    try {
      await registrarMovimentacao(token, {
        produtoId: Number(id),
        tipo: Number(tipo),
        quantidade: Number(quantidade),
      });
      navigate("/produtos");
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <div>
      <h1>Registrar Movimentação</h1>
      <form onSubmit={handleSubmit}>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="0">Entrada</option>
          <option value="1">Saída</option>
        </select>
        <input
          placeholder="Quantidade"
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        />
        <button type="submit">Registrar</button>
      </form>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
}