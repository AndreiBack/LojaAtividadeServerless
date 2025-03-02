package com.loja.pedidos;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loja.pedidos.Entity.ItemPedido;
import com.loja.pedidos.Entity.Pedido;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class PedidoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void criarPedido_DeveRetornarPedidoCriado() throws Exception {
        Pedido pedido = new Pedido();
        pedido.setCliente("Andrei");
        pedido.setEmail("andrei@email.com");
        pedido.setItens(List.of(new ItemPedido("Teclado", 1, 150.0)));

        mockMvc.perform(post("/pedidos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pedido)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cliente").value("Andrei"))
                .andExpect(jsonPath("$.total").value(150.0));
    }

}
