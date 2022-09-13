############################
# Final container
############################
FROM registry.cto.ai/official_images/node:2-12.13.1-stretch-slim

WORKDIR /ops

COPY --chown=ops:9999 package.json .
COPY --chown=ops:9999 package-lock.json .
RUN npm install

COPY --chown=ops:9999 . .
