package com.harvesthub.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url:}")
    private String dbUrl;

    @Value("${spring.datasource.username:sa}")
    private String dbUsername;

    @Value("${spring.datasource.password:}")
    private String dbPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String cleanUrl = dbUrl;
        String cleanUser = dbUsername;
        String cleanPass = dbPassword;

        if (cleanUrl != null && !cleanUrl.isBlank()) {
            // Automatically adapt Render / Heroku cloud postgres:// or postgresql:// URIs to JDBC format
            if (cleanUrl.startsWith("postgres://") || (cleanUrl.startsWith("postgresql://") && !cleanUrl.startsWith("jdbc:"))) {
                try {
                    URI uri = new URI(cleanUrl);
                    if (uri.getUserInfo() != null) {
                        String[] userInfo = uri.getUserInfo().split(":");
                        cleanUser = userInfo[0];
                        if (userInfo.length > 1) {
                            cleanPass = userInfo[1];
                        }
                    }
                    int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                    String path = uri.getPath();
                    cleanUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + path;
                } catch (Exception e) {
                    if (!cleanUrl.startsWith("jdbc:")) {
                        cleanUrl = "jdbc:" + cleanUrl;
                    }
                }
            }
        }

        DataSourceBuilder<?> builder = DataSourceBuilder.create();
        if (cleanUrl != null && !cleanUrl.isBlank()) {
            builder.url(cleanUrl);
        }
        if (cleanUser != null && !cleanUser.isBlank()) {
            builder.username(cleanUser);
        }
        if (cleanPass != null) {
            builder.password(cleanPass);
        }
        return builder.build();
    }
}
