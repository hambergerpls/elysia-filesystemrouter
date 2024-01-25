import { Elysia, t } from 'elysia'
import { Handler } from './index.g'

export const onRequestPost = Handler(new Elysia(), ({ query: { id } }) => id.toString(), {
    body: t.Object({
        username: t.String(),
        password: t.String()
    }),
    query: t.Object({
        id: t.String()
    }),
    response: {
        200: t.String()
    }
})