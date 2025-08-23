package com.example.gateway_service.filter;


import com.example.gateway_service.service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private RouteValidator routeValidator;

    @Autowired
    private JWTService jwtService;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getURI().getPath();
            System.out.println("[AuthenticationFilter] Processing request for path: " + path);

            if (path.startsWith("/ws") || path.contains("/ws/") || path.contains("/ws/info")) {
                System.out.println("[AuthenticationFilter] Skipping auth for WebSocket path: " + path);
                System.out.println("[AuthenticationFilter] Forwarding to: " + exchange.getRequest().getURI());
                return chain.filter(exchange);
            }
            try {
                if (routeValidator.isSecured.test(exchange.getRequest())) {
                    System.out.println("[AuthenticationFilter] Path is secured: " + path);

                    if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                        System.out.println("AUTH HEADER FROM FILTER - " + exchange.getRequest().getHeaders());
                        System.out.println("[AuthenticationFilter] Missing Authorization header for path: " + path);
                        throw new RuntimeException("Missing Authorization header");
                    }

                    String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                        System.out.println("[AuthenticationFilter] Invalid Authorization header format for path: " + path);
                        throw new RuntimeException("Invalid Authorization header format");
                    }

                    String token = authHeader.substring(7);
                    try {
                        jwtService.validateToken(token);
                        System.out.println("[AuthenticationFilter] Token validated successfully for path: " + path);
                    } catch (Exception e) {
                        System.out.println("[AuthenticationFilter] Token validation failed for path: " + path + ". Error: " + e.getMessage());
                        throw new RuntimeException("Unauthorized access: Invalid token", e);
                    }
                } else {
                    System.out.println("[AuthenticationFilter] Path is open (no auth required): " + path);
                }
            } catch (Exception e) {
                System.out.println("[AuthenticationFilter] Error processing request for path: " + path + ". Error: " + e.getMessage());
                throw e;
            }

            System.out.println("[AuthenticationFilter] Proceeding to next filter for path: " + path);
            return chain.filter(exchange);
        };
    }

    public static class Config {    }
}