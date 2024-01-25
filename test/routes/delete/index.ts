import { Elysia } from "elysia";
import { Handler } from "./index.g";

export const onRequestDelete = Handler(new Elysia(), async ({ path, request }) => `Hello from ${path} with method ${request.method}`)