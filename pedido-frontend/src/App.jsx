import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Form, Button, Table, Badge, Alert, Modal } from "react-bootstrap";

export default function App() {
  const [pedidos, setPedidos] = useState([]);
  const [cliente, setCliente] = useState("");
  const [email, setEmail] = useState("");
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [preco, setPreco] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [itens, setItens] = useState([]); // Lista de itens no pedido
  const [showModal, setShowModal] = useState(false); // Estado para controle do modal
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null); // Pedido selecionado para o modal

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/pedidos");
      setPedidos(response.data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      setErrorMessage("Erro ao carregar pedidos.");
    }
  };

  const adicionarProduto = () => {
    if (produto && quantidade > 0 && preco > 0) {
      setItens([...itens, { produto, quantidade, preco }]);
      setProduto(""); 
      setQuantidade(1); 
      setPreco(0);
    } else {
      setErrorMessage("Produto, quantidade e preço devem ser preenchidos corretamente.");
    }
  };

  const criarPedido = async () => {
    if (!cliente || !email || itens.length === 0) {
      setErrorMessage("Todos os campos devem ser preenchidos corretamente.");
      return;
    }

    const novoPedido = {
      cliente,
      email,
      itens,
    };

    try {
      await axios.post("http://localhost:8080/pedidos", novoPedido);
      carregarPedidos();
      setCliente("");
      setEmail("");
      setItens([]); 
      setErrorMessage(""); 
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      setErrorMessage("Erro ao criar pedido.");
    }
  };

  const atualizarStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:8080/pedidos/${id}`, { status });
      carregarPedidos();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      setErrorMessage("Erro ao atualizar status.");
    }
  };

  const deletarPedido = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/pedidos/${id}`);
      carregarPedidos();
    } catch (error) {
      console.error("Erro ao deletar pedido:", error);
      setErrorMessage("Erro ao deletar pedido.");
    }
  };

  const mostrarDetalhes = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/pedidos/${id}`);
      setPedidoSelecionado(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao buscar detalhes do pedido:", error);
      setErrorMessage("Erro ao carregar detalhes do pedido.");
    }
  };

  const fecharModal = () => {
    setShowModal(false);
    setPedidoSelecionado(null); // Limpa o pedido selecionado ao fechar o modal
  };

  const formatarData = (data) => {
    const dataObj = new Date(data);
    if (isNaN(dataObj)) return "Data inválida"; // Caso a data seja inválida
    return dataObj.toLocaleString(); // Formata a data para o formato local
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Gestão de Pedidos</h1>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <div className="p-4 border rounded bg-light">
        <h4>Novo Pedido</h4>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Cliente</Form.Label>
            <Form.Control
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Nome do Cliente"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email do Cliente"
            />
          </Form.Group>

          <h5>Adicionar Produtos</h5>
          <Form.Group className="mb-2">
            <Form.Label>Produto</Form.Label>
            <Form.Control
              type="text"
              value={produto}
              onChange={(e) => setProduto(e.target.value)}
              placeholder="Nome do Produto"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Quantidade</Form.Label>
            <Form.Control
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              min="1"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Preço</Form.Label>
            <Form.Control
              type="number"
              value={preco}
              onChange={(e) => setPreco(Number(e.target.value))}
              min="0"
              step="0.01"
            />
          </Form.Group>
          <Button variant="secondary" onClick={adicionarProduto} className="w-100 mb-3">
            Adicionar Produto
          </Button>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Preço (R$)</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item, index) => (
                <tr key={index}>
                  <td>{item.produto}</td>
                  <td>{item.quantidade}</td>
                  <td>{item.preco.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Button variant="primary" onClick={criarPedido} className="w-100">
            Criar Pedido
          </Button>
        </Form>
      </div>

      <h4 className="mt-4">Pedidos</h4>
      <Table striped bordered hover className="mt-2">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Email</th>
            <th>Status</th>
            <th>Total (R$)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id} onClick={() => mostrarDetalhes(pedido.id)}>
              <td>{pedido.id}</td>
              <td>{pedido.cliente}</td>
              <td>{pedido.email}</td>
              <td>
                <Badge
                  bg={
                    pedido.status === "CANCELADO"
                      ? "danger"
                      : pedido.status === "ENVIADO"
                      ? "success"
                      : "warning"
                  }
                >
                  {pedido.status}
                </Badge>
              </td>
              <td>{pedido.total.toFixed(2)}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => atualizarStatus(pedido.id, "PROCESSANDO")}
                >
                  🔄 Processar
                </Button>{" "}
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => atualizarStatus(pedido.id, "ENVIADO")}
                >
                  📦 Enviar
                </Button>{" "}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => atualizarStatus(pedido.id, "CANCELADO")}
                >
                  ❌ Cancelar
                </Button>{" "}
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => deletarPedido(pedido.id)}
                >
                  🗑️ Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de Detalhes do Pedido */}
      <Modal show={showModal} onHide={fecharModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pedidoSelecionado && (
            <div>
              <p><strong>Cliente:</strong> {pedidoSelecionado.cliente}</p>
              <p><strong>Email:</strong> {pedidoSelecionado.email}</p>
              <p><strong>Status:</strong> {pedidoSelecionado.status}</p>
              <p><strong>Data de Criação:</strong> {formatarData(pedidoSelecionado.dataCriacao)}</p>
              <p><strong>Data de Atualização:</strong> {formatarData(pedidoSelecionado.dataAtualizacao)}</p>
              <h5>Itens:</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidoSelecionado.itens.map((item, index) => (
                    <tr key={index}>
                      <td>{item.produto}</td>
                      <td>{item.quantidade}</td>
                      <td>{item.preco.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={fecharModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
