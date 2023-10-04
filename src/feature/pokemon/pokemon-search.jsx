import React from "react";

const PokemonSearch = props => {
    const inputRef = React.useRef(null)

    const handleSubmit = event => {
        event.preventDefault()
        props.data.setPokemonName(inputRef.current.value);
    }

    return (
        <form className="form-group" onSubmit={handleSubmit}>
            <label className="text-white">Buscar nombre o ID Pokemon</label>
            <input type="text" className="form-control" ref={inputRef} />
            <button type="submit" className="btn btn-primary mt-3" >Enviar</button>
        </form>
    )
}

export default PokemonSearch;