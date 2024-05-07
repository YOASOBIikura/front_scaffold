FROM node:18-alpine as builder

WORKDIR /code/

ADD package.json .
RUN npm install

COPY . .

# 构建参数，默认为空，可以自定义默认值
ARG JASPER_ENV
ENV JASPER_ENV=$JASPER_ENV
ENV NODE_OPTIONS=--max_old_space_size=5120
RUN npm run build-${JASPER_ENV}

FROM nginx:1.26-alpine-slim
WORKDIR /usr/share/nginx/html
COPY --from=builder /code/dist .
EXPOSE 80
