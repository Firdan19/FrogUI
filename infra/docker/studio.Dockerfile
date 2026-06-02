FROM node:20-alpine AS build

WORKDIR /workspace
COPY package.json ./
COPY apps/studio ./apps/studio
COPY packages/ui-core ./packages/ui-core
COPY packages/react-adapter ./packages/react-adapter
RUN npm install
RUN npm --workspace apps/studio run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /workspace/apps/studio/dist /app/dist
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
