
import Elysia, { Handler, InputSchema, LocalHook, MergeSchema, UnwrapRoute } from "elysia";
import { BasePath, Decorators, Definitions, Macro, ParentSchema } from "elysia-filesystemrouter";

export function Handler<ElysiaApp extends Elysia, const Path extends string, const LocalSchema extends InputSchema<keyof Definitions<ElysiaApp>['type'] & string>, const Route extends MergeSchema<UnwrapRoute<LocalSchema, Definitions<ElysiaApp>['type']>, ParentSchema<ElysiaApp>>, const Handle extends Exclude<Route['response'], Handle> | Handler<Route, Decorators<ElysiaApp>, `${BasePath<ElysiaApp>}/put`>>(app: ElysiaApp, handler: Handle, hook?: LocalHook<LocalSchema, Route, Decorators<ElysiaApp>, Definitions<ElysiaApp>['error'], Macro<ElysiaApp>, `${BasePath<ElysiaApp>}/put`>) {
    return { path: '/put' , handler, hook }
}
