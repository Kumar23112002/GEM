# ============================================================
# Multi-stage Dockerfile for Goeazymart Spring Boot Backend
# Optimized for Render Cloud Web Service deployment
# ============================================================

# Stage 1: Build Application with Maven & JDK 17
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Cache Maven dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy application source code and package executable JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Production JRE Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built JAR from builder stage
COPY --from=build /app/target/*.jar app.jar

# Dynamic port binding (Render injects $PORT at runtime, defaults to 8080)
ENV PORT=8080
EXPOSE 8080

# Run Spring Boot Application
ENTRYPOINT ["java", "-jar", "app.jar"]
