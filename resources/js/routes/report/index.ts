import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import builderB3add7 from './builder'
/**
* @see \App\Http\Controllers\ReportBuilderController::builder
* @see app/Http/Controllers/ReportBuilderController.php:12
* @route '/report-builder'
*/
export const builder = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: builder.url(options),
    method: 'get',
})

builder.definition = {
    methods: ["get","head"],
    url: '/report-builder',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportBuilderController::builder
* @see app/Http/Controllers/ReportBuilderController.php:12
* @route '/report-builder'
*/
builder.url = (options?: RouteQueryOptions) => {
    return builder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportBuilderController::builder
* @see app/Http/Controllers/ReportBuilderController.php:12
* @route '/report-builder'
*/
builder.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: builder.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportBuilderController::builder
* @see app/Http/Controllers/ReportBuilderController.php:12
* @route '/report-builder'
*/
builder.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: builder.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReportBuilderController::builder
* @see app/Http/Controllers/ReportBuilderController.php:12
* @route '/report-builder'
*/
const builderForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: builder.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportBuilderController::builder
* @see app/Http/Controllers/ReportBuilderController.php:12
* @route '/report-builder'
*/
builderForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: builder.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportBuilderController::builder
* @see app/Http/Controllers/ReportBuilderController.php:12
* @route '/report-builder'
*/
builderForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: builder.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

builder.form = builderForm

const report = {
    builder: Object.assign(builder, builderB3add7),
}

export default report