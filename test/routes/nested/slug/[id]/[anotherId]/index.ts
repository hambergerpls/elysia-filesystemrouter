import { Elysia } from "elysia";
import { Handler } from "./index.g";

export const onRequest = Handler(new Elysia(), async ({ path, params }) => `Hello from ${path} with params ${JSON.stringify(params)}`)