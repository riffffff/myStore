# syntax=docker/dockerfile:1

# ── Stage 1: Build Frontend Assets (Vite + React) ──
FROM node:22-alpine AS frontend
WORKDIR /app

# Cache package installation
COPY package*.json ./
RUN npm ci

# Build production assets
COPY . .
RUN npm run build

# ── Stage 2: PHP Application ──
FROM php:8.3-cli-alpine AS app

# Install necessary system libraries
RUN apk add --no-cache \
    bash \
    curl \
    git \
    sqlite \
    sqlite-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    linux-headers

# Install PHP extensions using official installer script
ADD --chmod=0755 https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN install-php-extensions \
    pdo_sqlite \
    sqlite3 \
    intl \
    gd \
    zip \
    bcmath \
    opcache \
    pcntl

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install Composer dependencies (cached)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy application files
COPY . .

# Copy compiled frontend assets from Stage 1
COPY --from=frontend /app/public/build ./public/build

# Finish Composer optimized autoload
RUN composer dump-autoload --optimize --no-dev

# Setup entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Environment settings
ENV PHP_CLI_SERVER_WORKERS=4
EXPOSE 8002

ENTRYPOINT ["docker-entrypoint.sh"]
