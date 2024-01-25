import { Handler } from "./index.g";
import { deriveAppTest } from "../../context.test";

export const onRequestGet = Handler(deriveAppTest(), async ({ path, request, A }) => A)