package com.CommentDraw.Backend.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CommentDraw Backend API")
                        .version("1.0")
                        .description("This is the API documentation for CommentDraw backend")
                        .contact(new Contact().name("Deep Mandloi").email("deep@example.com"))
                );
    }

}
