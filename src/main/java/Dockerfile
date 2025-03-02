# Usando a imagem base do OpenJDK 17 para executar a aplicação Spring Boot
FROM openjdk:17-jdk-slim

# Diretório de trabalho no container
WORKDIR /app

# Copia o JAR compilado para dentro do container
COPY target/pedidos-0.0.1-SNAPSHOT.jar pedidos.jar

# Expõe a porta que a aplicação vai rodar
EXPOSE 8080

# Comando para rodar a aplicação Spring Boot
ENTRYPOINT ["java", "-jar", "pedidos.jar"]
