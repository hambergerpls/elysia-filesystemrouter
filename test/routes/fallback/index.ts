
import Elysia, { t } from "elysia"
import { Handler } from "./index.g"

export const onRequestGet = Handler(new Elysia(), () => 'hi', {
    query: t.Object({
        redirect_uri: t.Optional(t.String())
    })
})