#!/usr/bin/env node
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";

import schema from "./schema.mjs";

const port = process.env.PORT || 8080;
const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  ...schema,
  cors: {
    origin: "*",
    credentials: true,
  },
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(cors(), bodyParser.json(), expressMiddleware(server));

await new Promise((resolve) => httpServer.listen({ port }, resolve));
console.log(`🚀 Server ready at http://localhost:${port}`);
