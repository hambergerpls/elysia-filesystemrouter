import Elysia, { t } from "elysia";
import { Handler } from "./index.g";

export const onRequestPost = Handler(new Elysia(), async ({ body }) => body, {
    body: t.Object({
        name: t.String()
    })
})