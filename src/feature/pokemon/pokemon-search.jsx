import React, { useState, useEffect } from "react";
import { gameVersions } from "../../services/utils";

const PokemonSearch = props => {
    const inputRef = React.useRef(null);
    const [searchValue, setSearchValue] = useState(props.data.pokemonName || '');

    useEffect(() => {
        setSearchValue(props.data.pokemonName || '');
    }, [props.data.pokemonName]);

    const handleSubmit = event => {
        event.preventDefault();
        const value = searchValue.trim();
        if (value) {
            props.data.setPokemonName(value);
        }
    }

    const handleClear = () => {
        setSearchValue('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
    }

    return (
        <div className="pokemon-search-container">
            <div className="card bg-dark text-white border-secondary shadow-lg">
                <div className="card-body p-4">
                    <div className="text-center mb-4">
                        <h1 className="display-4 mb-2" style={{ 
                            color: '#FF6B6B',
                            fontWeight: 'bold',
                            textShadow: '0 0 20px rgba(220, 20, 60, 0.8), 0 0 40px rgba(220, 20, 60, 0.4), 2px 2px 4px rgba(0, 0, 0, 0.8)',
                            letterSpacing: '3px',
                            fontFamily: 'monospace'
                        }}>
                            🔍 POKÉDEX
                        </h1>
                        <p className="text-white-50 mb-0" style={{ 
                            fontFamily: 'monospace',
                            letterSpacing: '1px',
                            fontSize: '0.9rem',
                            color: 'rgba(255, 255, 255, 0.8)'
                        }}>SEARCH FOR ANY POKÉMON BY NAME OR ID NUMBER</p>
                    </div>

                    {/* Game Version Selector */}
                    <div className="mb-3">
                        <label className="text-white-50 mb-2" style={{ 
                            fontFamily: 'monospace',
                            letterSpacing: '1px',
                            fontSize: '0.85rem'
                        }}>
                            GAME VERSION:
                        </label>
                        <select
                            className="form-select form-select-lg"
                            value={props.data.selectedVersion || 'all'}
                            onChange={(e) => props.data.setSelectedVersion(e.target.value)}
                            style={{
                                backgroundColor: '#2a2a2a',
                                color: '#fff',
                                borderColor: '#DC143C',
                                fontFamily: 'monospace',
                                fontSize: '0.9rem'
                            }}
                        >
                            {gameVersions.map((version) => (
                                <option key={version.id} value={version.id} style={{ backgroundColor: '#1a1a1a' }}>
                                    {version.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="input-group input-group-lg">
                            <span className="input-group-text bg-primary text-white border-primary">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="20" 
                                    height="20" 
                                    fill="currentColor" 
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                </svg>
                            </span>
                            <input 
                                type="text" 
                                className="form-control form-control-lg border-primary" 
                                ref={inputRef}
                                value={searchValue}
                                onChange={handleInputChange}
                                placeholder="Enter Pokémon name or ID (e.g., Pikachu, 25, charizard)"
                                autoFocus
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    fontSize: '1.1rem'
                                }}
                            />
                            {searchValue && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary border-primary"
                                    onClick={handleClear}
                                    title="Clear search"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width="16" 
                                        height="16" 
                                        fill="currentColor" 
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                    </svg>
                                </button>
                            )}
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg px-4"
                                style={{
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    <div className="mt-3 text-center">
                        <small className="text-white-50">
                            💡 Try: <span 
                                className="text-info" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    const name = 'pikachu';
                                    setSearchValue(name);
                                    props.data.setPokemonName(name);
                                }}
                            >Pikachu</span>, <span 
                                className="text-info" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    const name = 'charizard';
                                    setSearchValue(name);
                                    props.data.setPokemonName(name);
                                }}
                            >Charizard</span>, <span 
                                className="text-info" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    const name = 'mewtwo';
                                    setSearchValue(name);
                                    props.data.setPokemonName(name);
                                }}
                            >Mewtwo</span>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PokemonSearch;