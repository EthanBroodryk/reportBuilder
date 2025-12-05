import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DataController::index
* @see app/Http/Controllers/DataController.php:33
* @route '/data'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DataController::index
* @see app/Http/Controllers/DataController.php:33
* @route '/data'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DataController::index
* @see app/Http/Controllers/DataController.php:33
* @route '/data'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DataController::index
* @see app/Http/Controllers/DataController.php:33
* @route '/data'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DataController::index
* @see app/Http/Controllers/DataController.php:33
* @route '/data'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DataController::index
* @see app/Http/Controllers/DataController.php:33
* @route '/data'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DataController::index
* @see app/Http/Controllers/DataController.php:33
* @route '/data'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\DataController::store
* @see app/Http/Controllers/DataController.php:110
* @route '/data/import-data/upload'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/data/import-data/upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DataController::store
* @see app/Http/Controllers/DataController.php:110
* @route '/data/import-data/upload'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DataController::store
* @see app/Http/Controllers/DataController.php:110
* @route '/data/import-data/upload'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DataController::store
* @see app/Http/Controllers/DataController.php:110
* @route '/data/import-data/upload'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DataController::store
* @see app/Http/Controllers/DataController.php:110
* @route '/data/import-data/upload'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const data = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
}

export default data