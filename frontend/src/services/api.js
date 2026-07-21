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

export async function listarProdutos(token) {
  const resposta = await fetch(`${API_URL}/produtos`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!resposta.ok) {
    throw new Error("Erro ao carregar produtos.");
  }

  return await resposta.json();
}

export async function criarProduto(token, produto) {
  const resposta = await fetch(`${API_URL}/produtos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(produto),
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.mensagem || "Erro ao criar produto.");
  }

  return await resposta.json();
}

export async function buscarProduto(token, id) {
  const resposta = await fetch(`${API_URL}/produtos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!resposta.ok) throw new Error("Produto não encontrado.");
  return await resposta.json();
}

export async function atualizarProduto(token, id, produto) {
  const resposta = await fetch(`${API_URL}/produtos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(produto),
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.mensagem || "Erro ao atualizar.");
  }

  return await resposta.json();
}

export async function excluirProduto(token, id) {
  const resposta = await fetch(`${API_URL}/produtos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!resposta.ok) throw new Error("Erro ao excluir.");
}

export async function registrarMovimentacao(token, movimentacao) {
  const resposta = await fetch(`${API_URL}/movimentacoes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(movimentacao),
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.mensagem || "Erro ao registrar movimentação.");
  }

  return await resposta.json();
}

export async function historicoPorProduto(token, produtoId) {
  const resposta = await fetch(`${API_URL}/movimentacoes/produto/${produtoId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!resposta.ok) throw new Error("Erro ao carregar histórico.");
  return await resposta.json();
}