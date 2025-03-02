package com.loja.pedidos;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Permite CORS de qualquer origem. Caso queira restringir a origem, substitua o "*" pelo URL do seu front-end.
        registry.addMapping("/**")
                .allowedOrigins("*") // Permitir o acesso apenas do front-end que está no localhost:5173
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")  // Métodos permitidos
                .allowedHeaders("*"); // Permitir todos os cabeçalhos
    }
}
