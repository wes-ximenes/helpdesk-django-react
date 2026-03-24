import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  // ================================
  // ESTADOS
  // ================================

  const [chamados, setChamados] = useState([]);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [statusId, setStatusId] = useState("");

  const [loadingId, setLoadingId] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const [statusList, setStatusList] = useState([]);

  const [statusTemp, setStatusTemp] = useState({});

  // ================================
  // BUSCAR CHAMADOS
  // ================================

  const buscarChamados = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/chamados/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChamados(response.data.results);
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
    }
  };

  // ================================
  // BUSCAR STATUS
  // ================================

  const buscarStatus = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/status/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatusList(response.data.results);
    } catch (error) {
      console.error("Erro ao buscar status:", error);
    }
  };

  // ================================
  // CRIAR CHAMADO
  // ================================

  const criarChamado = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/chamados/",
        {
          titulo: titulo,
          descricao: descricao,
          status: statusId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Chamado criado:", response.data);

      setTitulo("");
      setDescricao("");
      setStatusId("");

      buscarChamados();
    } catch (error) {
      console.error("Erro ao criar chamado:", error);
    }
  };

  // ================================
  // ATUALIZAR STATUS (PATCH)
  // ================================

  const atualizarStatus = async (id, novoStatus) => {
    setLoadingId(id);

    console.log("Enviando:", id, novoStatus, typeof novoStatus);

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/chamados/${id}/atualizar_status/`,
        { status: novoStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensagem("Status atualizado com sucesso!");

      setTimeout(() => setMensagem(""), 5000);

      buscarChamados();

    } catch (error) {
      console.error("Erro completo:", error);
      console.error("Resposta do backend:", error.response?.data);

      setMensagem("Erro ao atualizar status");

      setTimeout(() => setMensagem(""), 3000);

    } finally {
      setLoadingId(null);
    }
  };

  // ================================
  // LOGOUT
  // ================================

  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  }

  // ================================
  // USE EFFECT
  // ================================

  useEffect(() => {
    buscarChamados();
    buscarStatus();
  }, []);

  // ================================
  // JSX
  // ================================

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Você está logado!</p>
      <p>Status: {token ? "Autenticado" : "Não autenticado"}</p>

      <button onClick={handleLogout}>Sair</button>

      <hr />

      <h2>Criar novo chamado</h2>

      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <br /><br />

      <select
        value={statusId}
        onChange={(e) => setStatusId(e.target.value)}
      >
        <option value="">Selecione um status</option>

        {statusList.map((status) => (
          <option key={status.id} value={status.id}>
            {status.nome}
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={criarChamado}>
        Criar Chamado
      </button>

      <hr />

      <h2>Chamados</h2>

      {mensagem && (
        <p style={{ color: mensagem.includes("Erro") ? "red" : "green" }}>
          {mensagem}
        </p>
      )}

      {chamados.length === 0 ? (
        <p>Nenhum chamado encontrado.</p>
      ) : (
        <ul>
          {chamados.map((chamado) => (
            <li key={chamado.id}>
              <strong>{chamado.titulo}</strong> - {chamado.status_nome}

              <br />

              <select
                value={
                  statusTemp[chamado.id] !== undefined
                    ? statusTemp[chamado.id]
                    : chamado.status
                }
                onChange={(e) =>
                  setStatusTemp({
                    ...statusTemp,
                    [chamado.id]: Number(e.target.value)
                  })
                }
              >
                {statusList.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.nome}
                  </option>
                ))}
              </select>

              <button
                onClick={() =>
                  atualizarStatus(
                    chamado.id,
                    statusTemp[chamado.id] !== undefined
                      ? statusTemp[chamado.id]
                      : chamado.status
                  )
                }
                disabled={loadingId === chamado.id}
              >
                {loadingId === chamado.id ? "Salvando..." : "Salvar"}
              </button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;