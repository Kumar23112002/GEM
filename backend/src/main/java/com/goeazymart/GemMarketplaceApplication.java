package com.goeazymart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.nio.file.Files;
import java.util.List;

@SpringBootApplication
public class GemMarketplaceApplication {

    public static void main(String[] args) {
        loadEnvironmentVariables();
        SpringApplication.run(GemMarketplaceApplication.class, args);
        System.out.println("=============================================================");
        System.out.println("🚀 Goeazymart (GEM) Spring Boot Backend is running on port 8080");
        System.out.println("📡 REST Endpoints: http://localhost:8080/api/products");
        System.out.println("=============================================================");
    }

    private static void loadEnvironmentVariables() {
        File[] possibleFiles = new File[] {
            new File(".env"),
            new File("backend/.env"),
            new File("../.env")
        };

        for (File file : possibleFiles) {
            if (file.exists() && file.isFile()) {
                try {
                    List<String> lines = Files.readAllLines(file.toPath());
                    for (String line : lines) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#") || !line.contains("=")) {
                            continue;
                        }
                        int idx = line.indexOf('=');
                        String key = line.substring(0, idx).trim();
                        String value = line.substring(idx + 1).trim();
                        if ((value.startsWith("\"") && value.endsWith("\"")) ||
                            (value.startsWith("'") && value.endsWith("'"))) {
                            value = value.substring(1, value.length() - 1);
                        }
                        if (System.getProperty(key) == null && System.getenv(key) == null) {
                            System.setProperty(key, value);
                        }
                    }
                    System.out.println("[Environment] Successfully loaded secrets from: " + file.getAbsolutePath());
                    return;
                } catch (Exception e) {
                    System.err.println("[Environment] Failed to read " + file.getName() + ": " + e.getMessage());
                }
            }
        }
    }
}
