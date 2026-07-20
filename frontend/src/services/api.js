const API_URL = "http://localhost:5017";

export async function login(email, senha) {
  const resposta = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  if (!resposta.ok) {
    throw new Error("Email ou senha inválidos.");
  }

  const dados = await resposta.json();
  return dados.token;
}

export async function registrar(nome, email, senha) {
  const resposta = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.mensagem || "Erro ao cadastrar.");
  }

  return await resposta.json();
}