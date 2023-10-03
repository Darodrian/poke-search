import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://pokeapi.co/api/v2/'
    }),
    reducerPath: 'pokemonApi',
    endpoints: build => ({
        getPokemon: build.query({
            query: name => `pokemon/${name}`
        })
    })
})
export const { useGetPokemonQuery } = api

export const { endpoints, reducerPath, reducer, middleware } = api