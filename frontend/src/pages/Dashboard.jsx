import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  // Guarda o Token de autenticação
  const token = localStorage.getItem("access");

  // Estado para armazenar os chamados
  const [chamados, setChamados] = useState([]);

  // Buscar chamados ao carregar a página
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/chamados/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => { 
      console.log("Dados da API:", response.data);

      setChamados(response.data.results);

    })
    .catch((error) => {
      console.error("Erro ao buscar chamados:", error);
    });
  }, []);

  // Função de logout
  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Você está logado!</p>

      <p>Status: {token ? "Autenticado" : "Não autenticado"}</p>

      <button onClick={handleLogout}>
        Sair
      </button>

      <h2>Chamados</h2>

      {chamados.length === 0 ? (
        <p>Nenhum chamado encontrado.</p>
      ) : (
        <ul>
          {chamados.map((chamado) => (
            <li key={chamado.id}>
              <strong>{chamado.titulo}</strong> - {chamado.status_nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;