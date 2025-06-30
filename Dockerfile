FROM node:22.14.0-alpine
WORKDIR /opt
COPY . /opt

RUN npm install pnpm -g --registry=https://registry.npmmirror.com && \
    pnpm install --registry=https://registry.npmmirror.com && \
    pnpm run build

FROM hub.oepkgs.net/openeuler/openeuler:22.03-lts-sp4

ENV TZ Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

RUN sed -i 's|repo.openeuler.org|mirrors.nju.edu.cn/openeuler|g' /etc/yum.repos.d/openEuler.repo && \
    sed -i '/metalink/d' /etc/yum.repos.d/openEuler.repo && \
    sed -i '/metadata_expire/d' /etc/yum.repos.d/openEuler.repo && \
    yum update -y && \
    yum install -y nginx shadow-utils passwd gettext && \
    yum clean all && \
    mkdir -p /usr/share/nginx/html/witchaind

COPY --from=0 /opt/dist /usr/share/nginx/html/witchaind/
COPY --from=0 /opt/public /usr/share/nginx/html/witchaind/
COPY --from=0 /opt/deploy/nginx.conf.tmpl /opt/nginx.conf.tmpl
COPY --from=0 /opt/deploy/start.sh /opt/start.sh

EXPOSE 9888
WORKDIR /opt
ENTRYPOINT [ "bash", "./start.sh" ]
