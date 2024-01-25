import Elysia, { t } from "elysia";
import { fileSystemRouter, parseBracketedDynamicRoute } from "..";

import { describe, it, expect } from "bun:test"
import { post, req } from "./utils";

const dir = './test/routes'
const methodGet = { method: 'GET' }
const methodPost = { method: 'POST' }
const methodPut = { method: 'PUT' }
const methodPatch = { method: 'PATCH' }
const methodDelete = { method: 'DELETE' }
const rootPath = '/'
const getPath = '/get'
const postPath = '/post'
const putPath = '/put'
const patchPath = '/patch'
const deletePath = '/delete'

describe('route', () => {
    it('handle path', async () => {
        const app = new Elysia()
            .use(await fileSystemRouter({
                dir: dir,
            }))


        let res = await app.handle(req(rootPath, methodGet)).then((x) => x.text())
        expect(res).toBe(`Hello from ${rootPath} with method ${methodGet.method}`)
        res = await app.handle(req(rootPath, methodPost)).then((x) => x.text())
        expect(res).toBe(`Hello from ${rootPath} with method ${methodPost.method}`)
        res = await app.handle(req(rootPath, methodPut)).then((x) => x.text())
        expect(res).toBe(`Hello from ${rootPath} with method ${methodPut.method}`)
        res = await app.handle(req(rootPath, methodPatch)).then((x) => x.text())
        expect(res).toBe(`Hello from ${rootPath} with method ${methodPatch.method}`)
        res = await app.handle(req(rootPath, methodDelete)).then((x) => x.text())
        expect(res).toBe(`Hello from ${rootPath} with method ${methodDelete.method}`)

        res = await app.handle(req(getPath, methodGet)).then((x) => x.text())
        expect(res).toBe(`Hello from ${getPath} with method ${methodGet.method}`)
        res = await app.handle(req(postPath, methodPost)).then((x) => x.text())
        expect(res).toBe(`Hello from ${postPath} with method ${methodPost.method}`)
        res = await app.handle(req(putPath, methodPut)).then((x) => x.text())
        expect(res).toBe(`Hello from ${putPath} with method ${methodPut.method}`)
        res = await app.handle(req(patchPath, methodPatch)).then((x) => x.text())
        expect(res).toBe(`Hello from ${patchPath} with method ${methodPatch.method}`)
        res = await app.handle(req(deletePath, methodDelete)).then((x) => x.text())
        expect(res).toBe(`Hello from ${deletePath} with method ${methodDelete.method}`)
    })

    it('handle body', async () => {
        const app = new Elysia().
            use(await fileSystemRouter({
                dir: dir,
            }))

        const body = {
            name: 'hambergerpls'
        } as const

        const res = (await app
            .handle(post('/body', body))
            .then((x) => x.json())) as typeof body

        const invalid = await app.handle(post('/body', {})).then((x) => x.status)

        expect(res.name).toBe(body.name)
        expect(invalid).toBe(400)
    })

    it('handle catch-all all method', async () => {
        const wildcard = 'wildcard'
        const app = new Elysia()
            .use(await fileSystemRouter({
                dir: dir,
            }))

        let res = await app.handle(req(`/all/${wildcard}`)).then((x) => x.text())
        expect(res).toBe(`Hello from /all/${wildcard} with params {\"*\":\"${wildcard}\"}`)
        res = await app.handle(req(`/all/a/b`)).then((x) => x.text())
        expect(res).toBe(`Hello from /all/a/b with params {\"*\":\"a\/b\"}`)
        res = await app.handle(req(`/all/`)).then((x) => x.text())
        expect(res).toBe(`Hello from /all/ with params {\"*\":\"\"}`)
        res = await app.handle(req(`/optional-all/`)).then((x) => x.text())
        expect(res).toBe(`Hello from /optional-all/ with params {\"*\":\"\"}`)
        const invalid = await app.handle(req(`/all`)).then((x) => x.status)
        expect(invalid).toBe(404)
    })

    it('handle dynamic segment all method', async () => {
        const app = new Elysia()
            .use(await fileSystemRouter({
                dir: dir,
            }))

        let res = await app.handle(req(`/slug/1`)).then((x) => x.text())
        expect(res).toBe(`Hello from /slug/1 with params {\"id\":\"1\"}`)
        const invalid = await app.handle(req(`/slug`)).then((x) => x.status)
        expect(invalid).toBe(404)
    })

    it('use custom error', async () => {
        const res = await new Elysia()
            .use(await fileSystemRouter({
                dir: dir,
            }))
            .onError(({ code }) => {
                if (code === 'NOT_FOUND')
                    return new Response("I'm a teapot", {
                        status: 418
                    })
            })
            .handle(req('/not-found'))

        expect(await res.text()).toBe("I'm a teapot")
        expect(res.status).toBe(418)
    })

    it('inject headers to error', async () => {
        const app = new Elysia()
            .use(await fileSystemRouter({
                dir: dir,
            }))
            .onRequest(({ set }) => {
                set.headers['Access-Control-Allow-Origin'] = '*'
            })

        const res = await app.handle(req('/error'))

        expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*')
        expect(res.status).toBe(404)
    })

    it('transform any to error', async () => {
        const app = new Elysia()
            .use(await fileSystemRouter({
                dir: dir,
            }))
            .onError(async ({ set }) => {
                set.status = 418

                return 'aw man'
            })

        const res = await app.handle(req('/error'))

        expect(await res.text()).toBe('aw man')
        expect(res.status).toBe(418)
    })

    it('validate', async () => {
    	const app = new Elysia()
        .use(await fileSystemRouter({
            dir: dir,
        }))

    	const res = await app
    		.handle(
    			post('/validate?id=me', {
    				username: 'username',
    				password: 'password'
    			})
    		)
    		.then((x) => x.text())
    	expect(res).toBe('me')
    })

    // it('handle non query fallback', async () => {
    // 	const app = new Elysia({ aot: false })
    // 		.get('/', () => 'hi', {
    // 			query: t.Object({
    // 				redirect_uri: t.Optional(t.String())
    // 			})
    // 		})

    // 	const res1 = await app.handle(req('/'))
    // 	const res2 = await app.handle(req('/?'))
    // 	const res3 = await app.handle(req('/?redirect_uri=a'))

    // 	expect(res1.status).toBe(200)
    // 	expect(res2.status).toBe(200)
    // 	expect(res3.status).toBe(200)
    // })
})