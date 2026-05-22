FROM php:8.1-apache
RUN docker-php-ext-install mysqli pdo pdo_mysql \
    && a2enmod headers rewrite \
    && apt-get update && apt-get install -y msmtp msmtp-mta --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
COPY msmtprc /etc/msmtprc
RUN chmod 644 /etc/msmtprc \
    && echo 'sendmail_path = /usr/bin/msmtp -t' > /usr/local/etc/php/conf.d/mail.ini
COPY api/ /var/www/html/
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html
RUN printf '<Directory /var/www/html>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
    Header always set Access-Control-Allow-Origin "*"\n\
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n\
    Header always set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization"\n\
    RewriteEngine On\n\
    RewriteCond %%{REQUEST_METHOD} OPTIONS\n\
    RewriteRule ^ - [R=200,L]\n\
</Directory>\n' > /etc/apache2/conf-available/cors.conf \
    && a2enconf cors
EXPOSE 80
