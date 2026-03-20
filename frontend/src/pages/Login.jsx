import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  // Estados para armazenar usuário e senha
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Função que faz o login
  const handleLogin = async () => {
    try {
      // Faz a requisição POST para o endpoint JWT do Django
      const response = await api.post("token/", {
        username: username,
        password: password,
      });

      // Exibe resposta no console
      console.log("Resposta da API:", response.data);

      // Salva o token de acesso no navegador
      localStorage.setItem("access", response.data.access);

      // (Opcional, pra salvar o refresh e gerar um novo access quando o atual expirar)
      localStorage.setItem("refresh", response.data.refresh);

      alert("Login realizado com sucesso!");
      console.log("Login realizado com sucesso");
      navigate("/dashboard");

    } catch (error) {
      console.error("Erro ao fazer login:", error);

      alert("Usuário ou senha inválidos!");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}

export default Login;