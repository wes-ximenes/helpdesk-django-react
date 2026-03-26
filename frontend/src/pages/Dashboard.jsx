import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [chamados, setChamados] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [statusId, setStatusId] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [statusList, setStatusList] = useState([]);
  const [statusTemp, setStatusTemp] = useState({});
  const [user, setUser] = useState(null);

  const isAdmin = user && user.is_staff === true;

  const buscarChamados = async () => {
    try {
      const response = await api.get("/chamados/");
      setChamados(response.data.results);
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
    }
  };

  const buscarStatus = async () => {
    try {
      const response = await api.get("/status/");
      setStatusList(response.data.results);
    } catch (error) {
      console.error("Erro ao buscar status:", error);
    }
  };

  const buscarUsuario = async () => {
    try {
      const response = await api.get("/me/");
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };

  const criarChamado = async () => {
    try {
      await api.post("/chamados/", {
        titulo,
        descricao,
        status: statusId,
      });

      setTitulo("");
      setDescricao("");
      setStatusId("");

      buscarChamados();
    } catch (error) {
      console.error("Erro ao criar chamado:", error);
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    setLoadingId(id);

    try {
      await api.patch(`/chamados/${id}/atualizar_status/`, {
        status: novoStatus,
      });

      setMensagem("Status atualizado com sucesso!");
      setTimeout(() => setMensagem(""), 3000);

      buscarChamados();
    } catch (error) {
      setMensagem("Erro ao atualizar status");
      setTimeout(() => setMensagem(""), 3000);
    } finally {
      setLoadingId(null);
    }
  };

  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  }

  useEffect(() => {
    buscarChamados();
    buscarStatus();
    buscarUsuario();
  }, []);

  return (
    <div className="min-h-screen bg-blue-950 flex flex-col items-center p-6 text-white">

      <div className="w-full max-w-5xl space-y-6">

        {/* HEADER */}
        <div className="bg-blue-900 shadow-lg rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-4">
            Dashboard
          </h1>

          <p className="text-blue-200">
            Você está logado!
          </p>

          <p className="mb-4">
            Status:{" "}
            <span className="font-semibold text-green-400">
              {localStorage.getItem("access") ? "Autenticado" : "Não autenticado"}
            </span>
          </p>

          {user && (
            <p className="text-sm text-blue-300 mb-2">
              Usuário: {user.username} {isAdmin && "(Admin)"}
            </p>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 hover:scale-105 transition transform"
          >
            Sair
          </button>
        </div>

        {/* CRIAR CHAMADO */}
        <div className="bg-blue-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Criar novo chamado
          </h2>

          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full bg-blue-800 border border-blue-700 p-3 rounded mb-3 text-white placeholder-gray-400"
          />

          <textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full bg-blue-800 border border-blue-700 p-3 rounded mb-3 text-white placeholder-gray-400"
          />

          <select
            value={statusId}
            onChange={(e) => setStatusId(e.target.value)}
            className="w-full bg-blue-800 border border-blue-700 p-3 rounded mb-3 text-white"
          >
            <option value="">Selecione um status</option>

            {statusList.map((status) => (
              <option key={status.id} value={status.id}>
                {status.nome}
              </option>
            ))}
          </select>

          <button
            onClick={criarChamado}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 hover:scale-105 transition transform"
          >
            Criar Chamado
          </button>
        </div>

        {/* LISTA DE CHAMADOS */}
        <div className="bg-blue-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Chamados
          </h2>

          {mensagem && (
            <p
              className={`mb-4 p-3 rounded ${
                mensagem.includes("Erro")
                  ? "bg-red-900 text-red-300"
                  : "bg-green-900 text-green-300"
              }`}
            >
              {mensagem}
            </p>
          )}

          {chamados.length === 0 ? (
            <p>Nenhum chamado encontrado.</p>
          ) : (
            <div className="space-y-4">
              {chamados.map((chamado) => (
                <div
                  key={chamado.id}
                  className="bg-blue-800 border border-blue-700 p-4 rounded-lg shadow hover:shadow-lg transition"
                >
                  <p className="font-semibold text-lg">
                    {chamado.titulo}
                  </p>

                  <p className="mb-2">
                    Status:{" "}
                    <span
                      className={
                        chamado.status_nome === "ATIVO"
                          ? "text-green-400 font-semibold"
                          : chamado.status_nome === "FINALIZADO"
                          ? "text-yellow-400 font-semibold"
                          : "text-red-400 font-semibold"
                      }
                    >
                      {chamado.status_nome}
                    </span>
                  </p>

                  {/* ADMIN ONLY */}
                  {isAdmin ? (
                    <>
                      <select
                        value={
                          statusTemp[chamado.id] !== undefined
                            ? statusTemp[chamado.id]
                            : chamado.status
                        }
                        onChange={(e) =>
                          setStatusTemp({
                            ...statusTemp,
                            [chamado.id]: Number(e.target.value),
                          })
                        }
                        className="bg-blue-900 border border-blue-700 p-2 rounded mr-2 text-white"
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
                        className="bg-green-500 px-3 py-2 rounded hover:bg-green-600 hover:scale-105 transition transform"
                      >
                        {loadingId === chamado.id ? "Salvando..." : "Salvar"}
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-blue-300">
                      Apenas administradores podem alterar o status
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;