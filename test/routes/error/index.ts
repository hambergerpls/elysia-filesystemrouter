import Elysia, { NotFoundError } from "elysia";
import { Handler } from "./index.g";

export const onRequestGet = Handler(new Elysia(), async ({ path, request }) => { throw new NotFoundError() })