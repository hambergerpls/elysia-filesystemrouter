import { Elysia } from "elysia";
import { Handler } from "./index.g";

export const onRequestGet = Handler(new Elysia(), async ({ path, request }) => `Hello from ${path} with method ${request.method}`)

export const onRequestPost = Handler(new Elysia(), async ({ path, request }) => `Hello from ${path} with method ${request.method}`)

export const onRequestPut = Handler(new Elysia(), async ({ path, request }) => `Hello from ${path} with method ${request.method}`)

export const onRequestPatch = Handler(new Elysia(), async ({ path, request }) => `Hello from ${path} with method ${request.method}`)

export const onRequestDelete = Handler(new Elysia(), async ({ path, request }) => `Hello from ${path} with method ${request.method}`)