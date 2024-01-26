import { unlinkSync } from "node:fs";
import { readdirSync } from "node:fs";
import path from "node:path";
import Elysia, { type Handler, LocalHook } from "elysia";


type Entrypoint = {
    onRequest?: { path: string, handler: Handler, hook?: LocalHook },
    onRequestGet?: { path: string, handler: Handler, hook?: LocalHook },
    onRequestPost?: { path: string, handler: Handler, hook?: LocalHook },
    onRequestPatch?: { path: string, handler: Handler, hook?: LocalHook },
    onRequestPut?: { path: string, handler: Handler, hook?: LocalHook },
    onRequestDelete?: { path: string, handler: Handler, hook?: LocalHook },
}

export const fileSystemRouter = async (options: {
    dir: string,
    assetPrefix?: string,
    origin?: string,
    fileExtensions?: string[],
    debug?: boolean,
    useExperimental?: boolean,
}) => {
    let app = new Elysia({
        name: 'elysia-filesystemrouter',
        seed: options
    })
    for (let [route, importPath] of Object.entries(getRoutes(options.dir))) {
        if (options.debug) console.log(`Processing route: ${route}`)
        route = parseBracketedDynamicRoute(route)
        await Bun.write(`${importPath.slice(0, importPath.length - 3)}.g.ts`, handlerTemplate(route))
        const entrypoint: Entrypoint = await import(importPath)
        if (entrypoint.onRequest) {
            if (options.debug) console.log(`all: ${route}`)
            app = app.all(route, entrypoint.onRequest.handler ?? (() => { }), entrypoint.onRequest.hook)
            continue
        }
        if (entrypoint.onRequestGet) {
            if (options.debug) console.log(`get: ${route}`)
            app = app.get(route, entrypoint.onRequestGet.handler ?? (() => { }), entrypoint.onRequestGet.hook)

        }
        if (entrypoint.onRequestPost) {
            if (options.debug) console.log(`post: ${route}`)
            app = app.post(route, entrypoint.onRequestPost.handler ?? (() => { }), entrypoint.onRequestPost.hook)
        }
        if (entrypoint.onRequestPatch) {
            if (options.debug) console.log(`patch: ${route}`)
            app = app.patch(route, entrypoint.onRequestPatch.handler ?? (() => { }), entrypoint.onRequestPatch.hook)
        }
        if (entrypoint.onRequestPut) {
            if (options.debug) console.log(`put: ${route}`)
            app = app.put(route, entrypoint.onRequestPut.handler ?? (() => { }), entrypoint.onRequestPut.hook)
        }
        if (entrypoint.onRequestDelete) {
            if (options.debug) console.log(`delete: ${route}`)
            app = app.delete(route, entrypoint.onRequestDelete.handler ?? (() => { }), entrypoint.onRequestDelete.hook)
        }
    }
    return app
};

export const parseBracketedDynamicRoute = (route: string) => {
    let result = ""
    for (let i = 0; i < route.length; i++) {
        const char = route[i];
        if (char == '[' && route[i + 1] != '[' && route[i + 1] != '.' && route[i + 1] != ']') result += ':'
        else if ((char == '[' && route[i + 1] == '[' || char == '[' && route[i + 1] == '.') && result[result.length - 1] != '*') result += '*'
        else if (result[result.length - 1] == '*' || char == '.' || char == ']') continue
        else result += char
    }
    return result;
}

const getRoutes = (dir: string) => {
    const routes: { [key: string]: string } = {}
    const regex = /(?<!.g).ts$/
    dir = dir.endsWith('/') ? dir : dir + '/'
    dir = path.join(process.cwd(), dir)
    readdirSync(dir, { recursive: true })
        .filter(f => regex.test(f.toString()))
        .map(f => {
            let route = `/${(f as string).replace('index.ts', '').replace('.ts', '')}`
            if (route.length > 1 && route.endsWith('/')) route = route.slice(0, -1)
            routes[route] = dir + f
        }
        )
    return routes
}

const deleteExistingGeneratedFiles = (dir: string) => {
    const regex = /[.g].ts$/
    dir = dir.endsWith('/') ? dir : dir + '/'
    readdirSync(dir, { recursive: true })
        .filter(f => regex.test(f.toString()))
        .map(f =>
            unlinkSync(dir + f)
        )
}

const handlerTemplate = (path: String) => `
import Elysia, { Handler, InputSchema, LocalHook, MergeSchema, UnwrapRoute } from "elysia";
import { BasePath, Decorators, Definitions, Macro, ParentSchema } from "@hambergerpls/elysia-filesystemrouter";

export function Handler<ElysiaApp extends Elysia, const Path extends string, const LocalSchema extends InputSchema<keyof Definitions<ElysiaApp>['type'] & string>, const Route extends MergeSchema<UnwrapRoute<LocalSchema, Definitions<ElysiaApp>['type']>, ParentSchema<ElysiaApp>>, const Handle extends Exclude<Route['response'], Handle> | Handler<Route, Decorators<ElysiaApp>, \`\${BasePath<ElysiaApp>}${path}\`>>(app: ElysiaApp, handler: Handle, hook?: LocalHook<LocalSchema, Route, Decorators<ElysiaApp>, Definitions<ElysiaApp>['error'], Macro<ElysiaApp>, \`\${BasePath<ElysiaApp>}${path}\`>) {
    return { path: '${path}' , handler, hook }
}
`

export type BasePath<ElysiaApp extends Elysia> = ElysiaApp extends Elysia<infer BasePath> ? BasePath : never
export type Decorators<ElysiaApp extends Elysia> = ElysiaApp extends Elysia<any, infer Decorators> ? Decorators : never
export type Definitions<ElysiaApp extends Elysia> = ElysiaApp extends Elysia<any, any, infer Definitions> ? Definitions : never
export type ParentSchema<ElysiaApp extends Elysia> = ElysiaApp extends Elysia<any, any, any, infer ParentSchema> ? ParentSchema : never
export type Macro<ElysiaApp extends Elysia> = ElysiaApp extends Elysia<any, any, any, any, infer Macro> ? Macro : never
export type Routes<ElysiaApp extends Elysia> = ElysiaApp extends Elysia<any, any, any, any, any, infer Routes> ? Routes : never
export type Scoped<ElysiaApp extends Elysia> = ElysiaApp extends Elysia<any, any, any, any, any, any, infer Scoped> ? Scoped : never
