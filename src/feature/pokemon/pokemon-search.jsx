import React, { useState, useEffect, useRef, useMemo } from "react";
import { useGetAllPokemonQuery } from "../../services/api";
import { normalizePokemonName, formatPokemonName } from "../../services/utils";

const MAX_SUGGESTIONS = 10;

const PokemonSearch = props => {
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const [searchValue, setSearchValue] = useState(props.data.pokemonName ? formatPokemonName(props.data.pokemonName) : '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const allPokemonQuery = useGetAllPokemonQuery();
    const pokemonList = useMemo(() => allPokemonQuery.data?.results || [], [allPokemonQuery.data]);

    useEffect(() => {
        if (props.data.pokemonName) {
            setSearchValue(formatPokemonName(props.data.pokemonName));
        } else {
            setSearchValue('');
        }
    }, [props.data.pokemonName]);

    const getSuggestions = (query) => {
        const q = query.toLowerCase().trim();
        if (!q || /^\d+$/.test(q)) return [];

        const startsWith = [];
        const includes = [];
        for (const p of pokemonList) {
            if (startsWith.length >= MAX_SUGGESTIONS) break;
            if (p.name.startsWith(q)) {
                startsWith.push(p.name);
            } else if (p.name.includes(q)) {
                includes.push(p.name);
            }
        }

        const combined = [...startsWith];
        for (const name of includes) {
            if (combined.length >= MAX_SUGGESTIONS) break;
            combined.push(name);
        }
        return combined.slice(0, MAX_SUGGESTIONS);
    };

    const suggestions = getSuggestions(searchValue);

    const selectPokemon = (rawName) => {
        setSearchValue(formatPokemonName(rawName));
        props.data.setPokemonName(rawName);
        setShowSuggestions(false);
        setActiveIndex(-1);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
            selectPokemon(suggestions[activeIndex]);
            return;
        }
        const value = searchValue.trim();
        if (!value) return;
        const normalized = /^\d+$/.test(value) ? value : normalizePokemonName(value);
        setSearchValue(formatPokemonName(normalized));
        props.data.setPokemonName(normalized);
        setShowSuggestions(false);
        setActiveIndex(-1);
    };

    const handleClear = () => {
        setSearchValue('');
        setShowSuggestions(false);
        setActiveIndex(-1);
        if (inputRef.current) inputRef.current.focus();
    };

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
        setShowSuggestions(true);
        setActiveIndex(-1);
    };

    const handleInputFocus = () => {
        if (searchValue.trim()) {
            setShowSuggestions(true);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowSuggestions(false);
            setActiveIndex(-1);
        }, 150);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) {
            if (e.key === 'Escape') {
                setShowSuggestions(false);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
                break;
            case 'Escape':
                setShowSuggestions(false);
                setActiveIndex(-1);
                break;
            case 'Enter':
                if (activeIndex >= 0) {
                    e.preventDefault();
                    selectPokemon(suggestions[activeIndex]);
                }
                break;
            default:
                break;
        }
    };

    const handleSuggestionClick = (name) => {
        selectPokemon(name);
    };

    const handleSuggestionHover = (index) => {
        setActiveIndex(index);
    };

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

                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="search-input-wrapper">
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
                                    onFocus={handleInputFocus}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Enter Pokémon name or ID (e.g., Pikachu, 25, charizard)"
                                    autoFocus
                                    autoComplete="off"
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

                            {showSuggestions && suggestions.length > 0 && (
                                <div className="autocomplete-dropdown" ref={dropdownRef}>
                                    {suggestions.map((name, index) => (
                                        <div
                                            key={name}
                                            className={`autocomplete-item ${index === activeIndex ? 'active' : ''}`}
                                            onMouseDown={() => handleSuggestionClick(name)}
                                            onMouseEnter={() => handleSuggestionHover(index)}
                                        >
                                            <span className="autocomplete-name">{formatPokemonName(name)}</span>
                                            <small className="autocomplete-id">#{index + 1}</small>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>

                    <div className="mt-3 text-center">
                        <small className="text-white-50">
                            💡 Try: <span
                                className="text-info"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    const name = 'pikachu';
                                    setSearchValue(formatPokemonName(name));
                                    props.data.setPokemonName(name);
                                }}
                            >Pikachu</span>, <span
                                className="text-info"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    const name = 'charizard';
                                    setSearchValue(formatPokemonName(name));
                                    props.data.setPokemonName(name);
                                }}
                            >Charizard</span>, <span
                                className="text-info"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    const name = 'mewtwo';
                                    setSearchValue(formatPokemonName(name));
                                    props.data.setPokemonName(name);
                                }}
                            >Mewtwo</span>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PokemonSearch;
