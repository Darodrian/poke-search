import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://pokeapi.co/api/v2/'
    }),
    reducerPath: 'pokemonApi',
    endpoints: build => ({
        getPokemon: build.query({
            query: name => `pokemon/${name}`
        }),
        getPokemonSpecies: build.query({
            query: id => `pokemon-species/${id}`
        }),
        getEvolutionChain: build.query({
            query: id => `evolution-chain/${id}`
        }),
        getTypeInfo: build.query({
            query: name => `type/${name}`
        }),
        getAllPokemon: build.query({
            query: () => 'pokemon?limit=100000&offset=0'
        })
    })
})
export const { useGetPokemonQuery, useGetPokemonSpeciesQuery, useGetEvolutionChainQuery, useGetTypeInfoQuery, useGetAllPokemonQuery } = api

export const { endpoints, reducerPath, reducer, middleware } = api