FROM node:latest

COPY . /var/www

WORKDIR /var/www

RUN npm install

CMD ["/bin/bash"]