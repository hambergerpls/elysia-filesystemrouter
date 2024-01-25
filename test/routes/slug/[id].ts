import { Elysia } from "elysia";
import { Handler } from "./[id].g";

export const onRequest = Handler(new Elysia(), async ({ path, params }) => `Hello from ${path} with params ${JSON.stringify(params)}`)