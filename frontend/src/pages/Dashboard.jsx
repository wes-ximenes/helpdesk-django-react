import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  function handleLogout() {
    // Remove os tokens
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    // Redireciona pro login
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
    </div>
  );
}

export default Dashboard;