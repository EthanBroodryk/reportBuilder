import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReportBuilderController::upload
* @see app/Http/Controllers/ReportBuilderController.php:0
* @route '/report-builder/upload'
*/
export const upload = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/report-builder/upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReportBuilderController::upload
* @see app/Http/Controllers/ReportBuilderController.php:0
* @route '/report-builder/upload'
*/
upload.url = (options?: RouteQueryOptions) => {
    return upload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportBuilderController::upload
* @see app/Http/Controllers/ReportBuilderController.php:0
* @route '/report-builder/upload'
*/
upload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReportBuilderController::upload
* @see app/Http/Controllers/ReportBuilderController.php:0
* @route '/report-builder/upload'
*/
const uploadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: upload.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReportBuilderController::upload
* @see app/Http/Controllers/ReportBuilderController.php:0
* @route '/report-builder/upload'
*/
uploadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: upload.url(options),
    method: 'post',
})

upload.form = uploadForm

/**
* @see \App\Http\Controllers\ReportBuilderController::show
* @see app/Http/Controllers/ReportBuilderController.php:0
* @route '/report-builder/files/{filename}'
*/
export const show = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/report-builder/files/{filename}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportBuilderController::show
* @see app/Http/Controllers/ReportBuilderController.php:0
* @route '/report-builder/files/{filename}'
*/
show.url = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { filename: args }
    }

    if (Array.isArray(args)) {
        args = {
            filename: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        filename: args.filename,
    }

    return show.definition.url
            .replace('{filename}', parsedArgs.filename.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportBuilderController::show
* @see app/Http/Controllers/ReportBuilderController.php:0
* @route '/report-builder/files/{filename}'
*/
show.get = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportBuilderController::show
* @see app/Http/Controllers/ReportBuilderController.php:0
* @route '/report-builder/files/{filename}'
*/
show.head = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReportBuilderController::show
* @see app/Http/Controllers/ReportBuilderController.php:0
* @route '/report-builder/files/{filename}'
*/
const showForm = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportBuilderController::show
* @see app/Http/Controllers/ReportBuilderController.php:0
* @route '/report-builder/files/{filename}'
*/
showForm.get = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportBuilderController::show
* @see app/Http/Controllers/ReportBuilderController.php:0
* @route '/report-builder/files/{filename}'
*/
showForm.head = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const builder = {
    upload: Object.assign(upload, upload),
    show: Object.assign(show, show),
}

export default builder