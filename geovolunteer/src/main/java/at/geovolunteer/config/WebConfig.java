package at.geovolunteer.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Ersetze dies durch deinen API-Pfad
                .allowedOrigins("http://localhost:3000") // Erlaube den Ursprung deines Frontends
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Erlaube die HTTP-Methoden
                .allowCredentials(true); // Optional: Wenn du Cookies oder Authentifizierung verwendest
    }
}