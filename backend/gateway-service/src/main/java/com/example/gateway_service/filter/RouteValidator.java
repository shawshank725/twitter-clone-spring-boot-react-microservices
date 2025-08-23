package com.example.gateway_service.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

import java.util.*;
import java.util.function.Predicate;


@Component
public class RouteValidator {

    public static final List<String> openApiEndpoints = List.of(
            "/authentication-service/register/**",
            "/authentication-service/register/getUser",
            "/authentication-service/register/getUserIdByUsername",
            "/authentication-service/register/getSuggestions",
            "/authentication-service/register/getUsersBasedOnSearch",
            "/posting-service/post/getPostResults",
            "/authentication-service/login",
            "/notification-service/ws/**",
            "/connection-service/connection/getUserConnectionsList",
            "/posting-service/post/getPostIDs",
            "/notification-service/notifications/**",
            "/ws/**"
            );

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    public Predicate<ServerHttpRequest> isSecured = request -> {
        String path = request.getURI().getPath();
        boolean isOpen = openApiEndpoints.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, path));
        boolean isSecured = !isOpen;
        System.out.println("[RouteValidator] Path: " + path + ", isSecured: " + isSecured);
        return isSecured;
    };
}
