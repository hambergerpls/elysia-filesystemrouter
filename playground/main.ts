import { fileSystemRouter } from "@hambergerpls/elysia-filesystemrouter";
import Elysia from "elysia";

export const app =
    new Elysia()
        .decorate('hi', () => 'hi')

app.use(await fileSystemRouter({
    dir: './routes',
}))
    .listen(3000, () => console.log('Listening on port 3000'))