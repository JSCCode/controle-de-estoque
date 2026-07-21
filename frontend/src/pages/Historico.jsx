import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { historicoPorProduto } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Historico() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [erro, setErro] = useState("");

  const { token } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await historicoPorProduto(token, id);
        setMovimentacoes(dados);
      } catch (e) {
        setErro(e.message);
      }
    }

    carregar();
  }, [id, token]);

  return (
    <div>
      <h1>Histórico de Movimentações</h1>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {movimentacoes.map((mov) => (
            <tr key={mov.id}>
              <td>{mov.tipo === 0 ? "Entrada" : "Saída"}</td>
              <td>{mov.quantidade}</td>
              <td>{new Date(mov.data).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}