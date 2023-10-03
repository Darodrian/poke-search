import React from "react";
import { capFirstLetter, toLowerCase } from '../helpers';
import { useGetPokemonQuery } from "../api";

const ResultadoPokemon = props => {
    const { data, error, isError, isFetching } = useGetPokemonQuery(toLowerCase(props.name))

    return (
        <div>
            <h3 className="text-white">Resultado: </h3>
            {isError ? (
                <span className="text-danger">{error.data}</span>
            ) : isFetching ? (
                <div className="text-warning">Buscando...</div>
            ): data.sprites ? (
                <div className="text-success">
                    <img src={data.sprites.front_default} alt="Pokemon" />
                    <span>{capFirstLetter(data.name)}</span>
                </div>
            ): <span className="text-danger">Debe ingresar nombre.</span>}
        </div>
    )
}

export default ResultadoPokemon;