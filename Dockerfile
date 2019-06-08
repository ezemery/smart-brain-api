FROM node:10.10.0

WORKDIR /usr/src/smart-brain-api-master

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]