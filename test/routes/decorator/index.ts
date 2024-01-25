// Get the type of main Elysia instance
import { decoratorAppTest } from "../../context.test";
import { Handler } from "./index.g";

export const onRequestGet = Handler(decoratorAppTest(), async ({ path, request, hi }) => hi())