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

  const [respostas, setRespostas] = useState({});
  const [novaResposta, setNovaResposta] = useState({});

  const isAdmin = user && user.is_staff === true;

  const totalChamados = chamados.length;

  const chamadosResolvidos = chamados.filter(
    (c) => c.status_nome === "FINALIZADO"
  ).length;

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

  const buscarRespostas = async (chamadoId) => {
    try {
      const response = await api.get(`/respostas/?chamado=${chamadoId}`);
      setRespostas((prev) => ({
        ...prev,
        [chamadoId]: response.data.results,
      }));
    } catch (error) {
      console.error("Erro ao buscar respostas:", error);
    }
  };

  const enviarResposta = async (chamadoId) => {
    const mensagem = novaResposta[chamadoId];

    if (!mensagem || mensagem.trim() === "") {
      alert("Digite uma mensagem");
      return;
    }

    try {
      await api.post("/respostas/", {
        chamado: chamadoId,
        mensagem: mensagem,
      });

      setNovaResposta({
        ...novaResposta,
        [chamadoId]: "",
      });

      buscarRespostas(chamadoId);
    } catch (error) {
      console.error("Erro detalhado:", error.response?.data); // 🔥 IMPORTANTE
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

  const deletarChamado = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este chamado?");
    if (!confirmar) return;

    setLoadingId(id);

    try {
      await api.delete(`/chamados/${id}/`);

      setMensagem("Chamado deletado com sucesso!");
      setTimeout(() => setMensagem(""), 3000);

      buscarChamados();
    } catch (error) {
      console.error("Erro ao deletar chamado:", error);
      setMensagem("Erro ao deletar chamado");
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

        <div className="bg-blue-900 p-6 rounded">
          <h1 className="text-2xl mb-4">Dashboard</h1>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-800 p-4 text-center">
              <p>Chamados registrados</p>
              <p className="text-xl">{totalChamados}</p>
            </div>

            <div className="bg-blue-800 p-4 text-center">
              <p>Chamados resolvidos</p>
              <p className="text-xl text-green-400">{chamadosResolvidos}</p>
            </div>
          </div>

          {user && <p className="mt-2">Usuário: {user.username}</p>}

          <button onClick={handleLogout} className="mt-3 bg-red-500 px-3 py-1">
            Sair
          </button>
        </div>

        <div className="bg-blue-900 p-6 rounded">
          <h2 className="mb-3">Criar chamado</h2>

          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" className="w-full mb-2 p-2 bg-blue-800" />
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição" className="w-full mb-2 p-2 bg-blue-800" />

          <select value={statusId} onChange={(e) => setStatusId(e.target.value)} className="w-full mb-2 p-2 bg-blue-800">
            <option value="">Selecione</option>
            {statusList.map((s) => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>

          <button onClick={criarChamado} className="bg-blue-500 px-3 py-1">
            Criar
          </button>
        </div>

        <div className="bg-blue-900 p-6 rounded">
          <h2 className="mb-3">Chamados</h2>

          {chamados.map((chamado) => (
            <div key={chamado.id} className="bg-blue-800 p-4 mb-3 rounded">

              <p className="font-bold">{chamado.titulo}</p>
              <p className="text-sm">Criado por: {chamado.usuario_nome}</p>
              <p>Status: {chamado.status_nome}</p>

              {isAdmin && (
                <div className="mt-2">

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
                    className="bg-blue-900 p-2 mr-2"
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
                    className="bg-green-500 px-2 py-1 mr-2"
                  >
                    Salvar
                  </button>

                  <button
                    onClick={() => deletarChamado(chamado.id)}
                    className="bg-red-500 px-2 py-1"
                  >
                    Excluir
                  </button>
                </div>
              )}

              {chamado.status_nome === "ATIVO" && (
                <div className="mt-3">

                  <button
                    onClick={() => buscarRespostas(chamado.id)}
                    className="text-sm underline"
                  >
                    Carregar respostas
                  </button>

                  {respostas[chamado.id]?.map((r) => (
                    <p key={r.id}>
                      <strong>{r.usuario_nome}:</strong> {r.mensagem}
                    </p>
                  ))}

                  <input
                    value={novaResposta[chamado.id] || ""}
                    onChange={(e) =>
                      setNovaResposta({
                        ...novaResposta,
                        [chamado.id]: e.target.value,
                      })
                    }
                    placeholder="Responder..."
                    className="w-full mt-2 p-2 bg-blue-900"
                  />

                  <button
                    onClick={() => enviarResposta(chamado.id)}
                    className="bg-blue-500 px-2 py-1 mt-2"
                  >
                    Enviar
                  </button>

                </div>
              )}

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;