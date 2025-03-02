package com.loja.pedidos.Controller;

import com.loja.pedidos.Entity.Pedido;
import com.loja.pedidos.Entity.StatusPedido;
import com.loja.pedidos.Service.PedidoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {
    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public Pedido criarPedido(@RequestBody Pedido pedido) {
        return pedidoService.criarPedido(pedido);
    }

    @GetMapping
    public List<Pedido> listarPedidos() {
        return pedidoService.listarPedidos();
    }

    @GetMapping("/{id}")
    public Pedido obterPedido(@PathVariable Long id) {
        return pedidoService.obterPedidoPorId(id).orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
    }

    @PatchMapping("/{id}")
    public Pedido atualizarStatus(@PathVariable Long id, @RequestBody AtualizarStatusRequest request) {
        return pedidoService.atualizarStatus(id, request.getStatus());
    }

    static class AtualizarStatusRequest {
        private StatusPedido status;

        public StatusPedido getStatus() {
            return status;
        }

        public void setStatus(StatusPedido status) {
            this.status = status;
        }
    }


    @DeleteMapping("/{id}")
    public void deletarPedido(@PathVariable Long id) {
        pedidoService.deletarPedido(id);
    }
}

