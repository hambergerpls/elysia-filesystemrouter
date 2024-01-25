
import { describe, it, expect } from 'bun:test'
import { parseBracketedDynamicRoute } from '..'

describe('utils', () => {
    it('parse bracketed dynamic route', () => {
        /**
         * /nested/slug/:id/:anotherId
         * /slug/:id
         * /nested/slug-capture-all/:id/:anotherId/*
         * /all/*
         * /nested/all/*
         * /optional-all/*
         * 
         *  */

        expect(parseBracketedDynamicRoute('/nested/slug/[id]/[anotherId]')).toBe('/nested/slug/:id/:anotherId')
        expect(parseBracketedDynamicRoute('/slug/[id]')).toBe('/slug/:id')
        expect(parseBracketedDynamicRoute('/nested/slug-capture-all/[id]/[anotherId]/[...capture-all]')).toBe('/nested/slug-capture-all/:id/:anotherId/*')
        expect(parseBracketedDynamicRoute('/all/[...capture-all]')).toBe('/all/*')
        expect(parseBracketedDynamicRoute('/nested/all/[...capture-all]')).toBe('/nested/all/*')
        expect(parseBracketedDynamicRoute('/optional-all/[[...capture-all]]')).toBe('/optional-all/*')
    })
})