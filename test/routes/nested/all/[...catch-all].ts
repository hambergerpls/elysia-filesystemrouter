import { Elysia } from "elysia";
import { Handler } from "./[...catch-all].g";

export const onRequest = Handler(new Elysia(), async ({ path, params }) => `Hello from ${path} with params ${JSON.stringify(params)}`)