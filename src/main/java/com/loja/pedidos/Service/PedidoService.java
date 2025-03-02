package com.loja.pedidos.Service;

import com.loja.pedidos.Entity.Pedido;
import com.loja.pedidos.Entity.StatusPedido;
import com.loja.pedidos.Repository.PedidoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PedidoService {
    private final PedidoRepository pedidoRepository;

    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    public Pedido criarPedido(Pedido pedido) {
        pedido.setStatus(StatusPedido.PENDENTE);
        pedido.setDataCriacao(LocalDateTime.now());
        pedido.setDataAtualizacao(LocalDateTime.now());
        double total = pedido.getItens().stream()
                .mapToDouble(item -> item.getPreco() * item.getQuantidade())
                .sum();
        pedido.setTotal(total);

        return pedidoRepository.save(pedido);
    }


    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    public Optional<Pedido> obterPedidoPorId(Long id) {
        return pedidoRepository.findById(id);
    }

    public Pedido atualizarStatus(Long id, StatusPedido status) {
        Pedido pedido = pedidoRepository.findById(id).orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        pedido.setStatus(status);
        pedido.setDataAtualizacao(LocalDateTime.now());
        return pedidoRepository.save(pedido);
    }

    public void deletarPedido(Long id) {
        pedidoRepository.deleteById(id);
    }
}
