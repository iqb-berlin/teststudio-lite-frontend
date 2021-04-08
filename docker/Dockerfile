FROM node:10.13.0 as dev

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY . /app

RUN npm install

RUN ng build --prod

EXPOSE 4200
CMD ng serve --disableHostCheck --host 0.0.0.0

# ===========================================

FROM nginx:1.19.1-alpine as prod

COPY --from=dev /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
