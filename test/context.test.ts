import Elysia from "elysia"
import { fileSystemRouter } from ".."

import { describe, it, expect } from "bun:test"
import { req } from "./utils"

const dir = './test/routes'

export const deriveAppTest = () => new Elysia()
    .derive(() => {
        return {
            A: 'A'
        }
    })

const decoratorPluginTest = () => (app: Elysia) => app.decorate('hi', () => 'hi')
export const decoratorAppTest = () => new Elysia()
    .use(decoratorPluginTest())

describe('context', () => {

    describe('derive', () => {
        it('should return new property', async () => {
            const app = deriveAppTest()
                .use(await fileSystemRouter({
                    dir: dir,
                }))
            const res = await app.handle(req('/derive'))

            expect(await res.text()).toBe('A')
            expect(res.status).toBe(200)
        })
    })

    describe('decorator', () => {
        it('inherits plugin', async () => {
            const app = decoratorAppTest()
                .use(await fileSystemRouter({
                    dir: dir,
                }))
            const res = await app.handle(req('/decorator')).then((r) => r.text())
            expect(res).toBe('hi')
        })
    })
})