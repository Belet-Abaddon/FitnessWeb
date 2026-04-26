FROM php:8.2-fpm

RUN sed -i 's/deb.debian.org/ftp.us.debian.org/g' /etc/apt/sources.list.d/debian.sources || true

RUN apt-get update || true

RUN apt-get install -y --no-install-recommends \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_mysql gd
RUN pecl install mongodb && docker-php-ext-enable mongodb

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]