import React, { useState, useRef, useEffect } from "react";
import { useGetPokemonQuery, useGetPokemonSpeciesQuery, useGetEvolutionChainQuery, useGetTypeInfoQuery } from "../../services/api";
import { capFirstLetter, toLowerCase, getTypeColor, formatHeight, formatWeight, getStatAtLevel, extractIdFromUrl, parseEvolutionChain, combineDefensiveEffectiveness, combineOffensiveEffectiveness, formatGenderRate, getEnglishGenus, cleanFlavorText, getPokemonColor } from "../../services/utils";

const PokemonResult = props => {
    const pokemonQuery = useGetPokemonQuery(toLowerCase(props.name));
    const { data, error, isError, isFetching } = pokemonQuery;

    const [level, setLevel] = useState(50);
    const [isShiny, setIsShiny] = useState(false);
    const [isFemale, setIsFemale] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [flavorIndex, setFlavorIndex] = useState(0);
    const audioRef = useRef(null);

    const pokemonId = data?.id;
    const speciesQuery = useGetPokemonSpeciesQuery(pokemonId, { skip: !pokemonId });
    const species = speciesQuery.data;

    const chainUrl = species?.evolution_chain?.url;
    const chainId = chainUrl ? extractIdFromUrl(chainUrl) : null;
    const evolutionQuery = useGetEvolutionChainQuery(chainId, { skip: !chainId });
    const evolutionStages = evolutionQuery.data?.chain ? parseEvolutionChain(evolutionQuery.data.chain) : [];
    const typeNames = data?.types?.map(t => t.type.name) || [];
    const type1Query = useGetTypeInfoQuery(typeNames[0], { skip: !typeNames[0] });
    const type2Query = useGetTypeInfoQuery(typeNames[1], { skip: !typeNames[1] });

    const typeRelations = [type1Query.data?.damage_relations, type2Query.data?.damage_relations].filter(Boolean);
    const defensiveMultipliers = typeRelations.length > 0 ? combineDefensiveEffectiveness(typeRelations) : {};
    const offensive = typeRelations.length > 0 ? combineOffensiveEffectiveness(typeRelations) : { strongAgainst: [], weakAgainst: [], noDamageTo: [] };

    const genus = species ? getEnglishGenus(species.genera) : '';
    const englishFlavors = species ? species.flavor_text_entries.filter(e => e.language.name === 'en') : [];
    const genderInfo = species ? formatGenderRate(species.gender_rate) : null;

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
            setIsPlaying(false);
        }
        setIsShiny(false);
        setIsFemale(false);
        setFlavorIndex(0);
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [props.name]);

    if (isError) {
        return (
            <div className="mt-4 pokemon-result-container">
                <h3 className="text-white mb-3" style={{
                    fontFamily: 'monospace',
                    letterSpacing: '2px',
                    textShadow: '0 0 10px rgba(220, 20, 60, 0.5)',
                    fontSize: '1.5rem'
                }}>POKÉDEX ENTRY</h3>
                <div className="card bg-dark text-white border-secondary">
                    <div className="card-body">
                        <div className="alert alert-danger" role="alert" style={{
                            backgroundColor: '#3a1a1a',
                            borderColor: '#DC143C',
                            color: '#ff6b6b'
                        }}>
                            {error?.data || error?.error || "ERROR: POKÉMON NOT FOUND. TRY ANOTHER NAME OR ID."}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isFetching) {
        return (
            <div className="mt-4 pokemon-result-container">
                <h3 className="text-white mb-3" style={{
                    fontFamily: 'monospace',
                    letterSpacing: '2px',
                    textShadow: '0 0 10px rgba(220, 20, 60, 0.5)',
                    fontSize: '1.5rem'
                }}>POKÉDEX ENTRY</h3>
                <div className="card bg-dark text-white border-secondary">
                    <div className="card-body text-center py-5">
                        <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">Searching...</span>
                        </div>
                        <p className="mt-3 text-white-50" style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>
                            SEARCHING DATABASE...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!data || !data.sprites) {
        return (
            <div className="mt-4 pokemon-result-container">
                <h3 className="text-white mb-3" style={{
                    fontFamily: 'monospace',
                    letterSpacing: '2px',
                    textShadow: '0 0 10px rgba(220, 20, 60, 0.5)',
                    fontSize: '1.5rem'
                }}>POKÉDEX ENTRY</h3>
                <div className="card bg-dark text-white border-secondary">
                    <div className="card-body">
                        <div className="alert alert-warning" role="alert" style={{
                            backgroundColor: '#3a3a1a',
                            borderColor: '#ffc107',
                            color: '#ffd54f'
                        }}>
                            PLEASE ENTER A POKÉMON NAME OR ID.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const {
        id,
        name,
        sprites,
        types,
        stats,
        abilities,
        height,
        weight,
        base_experience,
        cries
    } = data;

    const handlePlayCry = () => {
        if (cries?.legacy) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            const audio = new Audio(cries.legacy);
            audio.volume = volume;
            audioRef.current = audio;
            audio.onplay = () => setIsPlaying(true);
            audio.onended = () => setIsPlaying(false);
            audio.onerror = () => setIsPlaying(false);
            audio.play().catch(err => {
                console.error('Error playing Pokemon cry:', err);
                setIsPlaying(false);
            });
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const handlePrevPokemon = () => {
        if (id > 1) {
            props.setPokemonName(String(id - 1));
        }
    };

    const handleNextPokemon = () => {
        props.setPokemonName(String(id + 1));
    };

    const navigateToPokemon = (targetId) => {
        props.setPokemonName(String(targetId));
    };

    const groupDefensive = () => {
        const groups = { 4: [], 2: [], 0.5: [], 0.25: [], 0: [] };
        Object.entries(defensiveMultipliers).forEach(([type, mult]) => {
            if (mult === 4) groups[4].push(type);
            else if (mult === 2) groups[2].push(type);
            else if (mult === 0.5) groups[0.5].push(type);
            else if (mult === 0.25) groups[0.25].push(type);
            else if (mult === 0) groups[0].push(type);
        });
        return groups;
    };
    const defensiveGroups = Object.keys(defensiveMultipliers).length > 0 ? groupDefensive() : null;

    return (
        <div className="mt-4 pokemon-result-container">
            <h3 className="text-white mb-4" style={{
                fontFamily: 'monospace',
                letterSpacing: '2px',
                textShadow: '0 0 10px rgba(220, 20, 60, 0.5)',
                fontSize: '1.5rem'
            }}>POKÉDEX ENTRY</h3>
            <div className="card bg-dark text-white border-secondary">
                <div className="card-body">
                    {/* Header with ID, Name, Navigation, Cry */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2">
                            <button
                                onClick={handlePrevPokemon}
                                disabled={id <= 1}
                                className="btn btn-sm btn-outline-danger"
                                title="Previous Pokémon"
                                style={{ padding: '0.25rem 0.5rem', fontFamily: 'monospace', fontSize: '0.8rem' }}
                            >
                                ◀
                            </button>
                            <div>
                                <h2 className="card-title mb-0">
                                    {capFirstLetter(name)}
                                </h2>
                                {genus && <small className="text-white-50" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{genus}</small>}
                            </div>
                            <button
                                onClick={handleNextPokemon}
                                className="btn btn-sm btn-outline-danger"
                                title="Next Pokémon"
                                style={{ padding: '0.25rem 0.5rem', fontFamily: 'monospace', fontSize: '0.8rem' }}
                            >
                                ▶
                            </button>
                            {cries?.legacy && (
                                <div className="d-flex align-items-center gap-2 ms-2">
                                    <button
                                        onClick={handlePlayCry}
                                        disabled={isPlaying}
                                        className="btn btn-sm btn-outline-danger"
                                        title="Play Pokemon cry"
                                        style={{
                                            fontFamily: 'monospace',
                                            borderColor: '#DC143C',
                                            color: isPlaying ? '#FF4444' : '#DC143C',
                                            minWidth: '36px',
                                            height: '36px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: 0
                                        }}
                                    >
                                        {isPlaying ? (
                                            <div className="spinner-border spinner-border-sm text-danger" role="status" style={{ width: '0.9rem', height: '0.9rem' }}>
                                                <span className="visually-hidden">Playing...</span>
                                            </div>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                                                <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.611 3.89l.707.707z"/>
                                                <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
                                            </svg>
                                        )}
                                    </button>
                                    <input
                                        type="range"
                                        className="form-range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        title={`Volume: ${Math.round(volume * 100)}%`}
                                        style={{ accentColor: '#DC143C', cursor: 'pointer', width: '70px' }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            {species?.is_legendary && <span className="badge" style={{ backgroundColor: '#FFD700', color: '#000' }}>LEGENDARY</span>}
                            {species?.is_mythical && <span className="badge" style={{ backgroundColor: '#9B59B6', color: '#fff' }}>MYTHICAL</span>}
                            <span className="badge bg-secondary fs-6">#{String(id).padStart(4, '0')}</span>
                        </div>
                    </div>

                    {/* Sprites Gallery */}
                    <div className="row mb-4">
                        <div className="col-12 mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="text-white-50 mb-0">Sprites</h5>
                                <div className="d-flex gap-3 align-items-center">
                                    <div className="form-check form-switch d-flex align-items-center gap-1 mb-0">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="shinyToggle"
                                            checked={isShiny}
                                            onChange={() => {
                                                const newShiny = !isShiny;
                                                if (newShiny && isFemale && !sprites.front_shiny_female && !sprites.back_shiny_female) {
                                                    setIsFemale(false);
                                                }
                                                setIsShiny(newShiny);
                                            }}
                                            style={{ cursor: 'pointer', accentColor: '#DC143C' }}
                                        />
                                        <label className="form-check-label text-white-50 small fw-bold" htmlFor="shinyToggle" style={{ cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '1px' }}>
                                            ⭐ SHINY
                                        </label>
                                    </div>
                                    <div className="form-check form-switch d-flex align-items-center gap-1 mb-0">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="femaleToggle"
                                            checked={isFemale}
                                            disabled={isShiny ? (!sprites.front_shiny_female && !sprites.back_shiny_female) : (!sprites.front_female && !sprites.back_female)}
                                            onChange={() => setIsFemale(!isFemale)}
                                            style={{ cursor: 'pointer', accentColor: '#DC143C' }}
                                        />
                                        <label className="form-check-label text-white-50 small fw-bold" htmlFor="femaleToggle" style={{ cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '1px' }}>
                                            ♀ FEMALE
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center gap-4 bg-secondary bg-opacity-25 p-3 rounded">
                                {(() => {
                                    const frontSprite = isShiny
                                        ? (isFemale ? sprites.front_shiny_female : sprites.front_shiny)
                                        : (isFemale ? sprites.front_female : sprites.front_default);
                                    const backSprite = isShiny
                                        ? (isFemale ? sprites.back_shiny_female : sprites.back_shiny)
                                        : (isFemale ? sprites.back_female : sprites.back_default);
                                    const prefix = isShiny ? 'Shiny ' : '';
                                    const genderLabel = isFemale ? '♀' : '♂';

                                    return (
                                        <>
                                            <div className="text-center">
                                                {frontSprite ? (
                                                    <img
                                                        src={frontSprite}
                                                        alt={`${name} ${prefix}front`}
                                                        className="bg-white rounded p-2"
                                                        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                                                    />
                                                ) : (
                                                    <div className="bg-secondary rounded p-2 d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
                                                        <small className="text-white-50">No sprite</small>
                                                    </div>
                                                )}
                                                <p className="small mt-1 mb-0">{`${prefix}Front ${genderLabel}`}</p>
                                            </div>
                                            <div className="text-center">
                                                {backSprite ? (
                                                    <img
                                                        src={backSprite}
                                                        alt={`${name} ${prefix}back`}
                                                        className="bg-white rounded p-2"
                                                        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                                                    />
                                                ) : (
                                                    <div className="bg-secondary rounded p-2 d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
                                                        <small className="text-white-50">No sprite</small>
                                                    </div>
                                                )}
                                                <p className="small mt-1 mb-0">{`${prefix}Back ${genderLabel}`}</p>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Flavor Text */}
                    {englishFlavors.length > 0 && (
                        <div className="mb-4 p-3 bg-secondary bg-opacity-25 rounded border border-secondary" style={{ position: 'relative' }}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div style={{ flex: 1 }}>
                                    <p className="mb-1 fst-italic" style={{ color: '#e0e0e0', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                        "{cleanFlavorText(englishFlavors[flavorIndex]?.flavor_text || '')}"
                                    </p>
                                    <small className="text-white-50" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                                        — {capFirstLetter(englishFlavors[flavorIndex]?.version?.name || '')}
                                    </small>
                                </div>
                                {englishFlavors.length > 1 && (
                                    <div className="d-flex gap-1 ms-3">
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => setFlavorIndex(prev => prev > 0 ? prev - 1 : englishFlavors.length - 1)}
                                            style={{ padding: '0.15rem 0.4rem', fontSize: '0.7rem' }}
                                        >
                                            ◀
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => setFlavorIndex(prev => prev < englishFlavors.length - 1 ? prev + 1 : 0)}
                                            style={{ padding: '0.15rem 0.4rem', fontSize: '0.7rem' }}
                                        >
                                            ▶
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Types */}
                    <div className="mb-4">
                        <h5 className="text-white-50 mb-2">Types</h5>
                        <div className="d-flex gap-2 flex-wrap">
                            {types.map((typeInfo, index) => (
                                <span
                                    key={index}
                                    className="badge px-3 py-2 fs-6"
                                    style={{
                                        backgroundColor: getTypeColor(typeInfo.type.name),
                                        color: 'white'
                                    }}
                                >
                                    {capFirstLetter(typeInfo.type.name)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Type Effectiveness */}
                    {defensiveGroups && (defensiveGroups[4].length > 0 || defensiveGroups[2].length > 0 || defensiveGroups[0.5].length > 0 || defensiveGroups[0.25].length > 0 || defensiveGroups[0].length > 0) && (
                        <div className="mb-4">
                            <h5 className="text-white-50 mb-2">Type Effectiveness</h5>
                            <div className="row g-2">
                                {defensiveGroups[0].length > 0 && (
                                    <div className="col-12">
                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                            <small className="text-white-50" style={{ minWidth: '80px', fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 'bold' }}>IMMUNE</small>
                                            {defensiveGroups[0].map(type => (
                                                <span key={type} className="badge" style={{ backgroundColor: '#2a2a2a', color: '#999', border: '1px solid #555', opacity: 0.7 }}>
                                                    {capFirstLetter(type)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {defensiveGroups[0.25].length > 0 && (
                                    <div className="col-12">
                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                            <small className="text-white-50" style={{ minWidth: '80px', fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 'bold' }}>¼×</small>
                                            {defensiveGroups[0.25].map(type => (
                                                <span key={type} className="badge" style={{ backgroundColor: getTypeColor(type) }}>
                                                    {capFirstLetter(type)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {defensiveGroups[0.5].length > 0 && (
                                    <div className="col-12">
                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                            <small className="text-white-50" style={{ minWidth: '80px', fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 'bold' }}>½×</small>
                                            {defensiveGroups[0.5].map(type => (
                                                <span key={type} className="badge" style={{ backgroundColor: getTypeColor(type) }}>
                                                    {capFirstLetter(type)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {defensiveGroups[2].length > 0 && (
                                    <div className="col-12">
                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                            <small className="text-white-50" style={{ minWidth: '80px', fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 'bold' }}>2×</small>
                                            {defensiveGroups[2].map(type => (
                                                <span key={type} className="badge" style={{ backgroundColor: getTypeColor(type) }}>
                                                    {capFirstLetter(type)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {defensiveGroups[4].length > 0 && (
                                    <div className="col-12">
                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                            <small className="text-white-50" style={{ minWidth: '80px', fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 'bold' }}>4×</small>
                                            {defensiveGroups[4].map(type => (
                                                <span key={type} className="badge px-3 py-2" style={{ backgroundColor: getTypeColor(type), border: '2px solid #FF4444', boxShadow: '0 0 8px rgba(255, 68, 68, 0.6)' }}>
                                                    {capFirstLetter(type)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {offensive.strongAgainst.length > 0 && (
                                <div className="mt-2 pt-2 border-top border-secondary">
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                        <small className="text-white-50" style={{ minWidth: '80px', fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 'bold' }}>STRONG VS</small>
                                        {offensive.strongAgainst.map(type => (
                                            <span key={type} className="badge" style={{ backgroundColor: getTypeColor(type) }}>
                                                {capFirstLetter(type)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {offensive.weakAgainst.length > 0 && (
                                <div className="mt-1">
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                        <small className="text-white-50" style={{ minWidth: '80px', fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 'bold' }}>WEAK VS</small>
                                        {offensive.weakAgainst.map(type => (
                                            <span key={type} className="badge" style={{ backgroundColor: '#666', color: '#ccc' }}>
                                                {capFirstLetter(type)} ½×
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Evolution Chain */}
                    {evolutionStages.length > 1 && (
                        <div className="mb-4">
                            <h5 className="text-white-50 mb-2">Evolution Chain</h5>
                            <div className="bg-secondary bg-opacity-25 rounded p-3">
                                <div className="d-flex align-items-center justify-content-center flex-wrap gap-2">
                                    {evolutionStages.map((stage, stageIdx) => (
                                        <React.Fragment key={stageIdx}>
                                            {stageIdx > 0 && (
                                                <div className="d-flex flex-column align-items-center px-2">
                                                    <span className="text-white-50" style={{ fontSize: '1.2rem' }}>→</span>
                                                </div>
                                            )}
                                            <div className="d-flex gap-2">
                                                {stage.map(species => {
                                                    const isCurrent = species.id === id;
                                                    return (
                                                        <span
                                                            key={species.id}
                                                            onClick={() => navigateToPokemon(species.id)}
                                                            className={`badge evolution-chain-badge ${isCurrent ? 'bg-danger' : 'bg-secondary'} px-3 py-2 fs-6`}
                                                            style={{
                                                                border: isCurrent ? '2px solid #FF4444' : '1px solid transparent',
                                                                boxShadow: isCurrent ? '0 0 12px rgba(220, 20, 60, 0.8)' : 'none',
                                                                opacity: isCurrent ? 1 : 0.8
                                                            }}
                                                            title={`View ${capFirstLetter(species.name)}`}
                                                        >
                                                            {capFirstLetter(species.name)}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Level Slider */}
                    <div className="mb-4 p-3 bg-secondary bg-opacity-25 rounded border border-secondary">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="text-white-50 mb-0" style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>
                                LEVEL: <span className="text-danger fw-bold">{level}</span>
                            </h5>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => setLevel(Math.max(1, level - 10))}
                                    style={{ fontFamily: 'monospace' }}
                                >
                                    -10
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => setLevel(Math.max(1, level - 1))}
                                    style={{ fontFamily: 'monospace' }}
                                >
                                    -1
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => setLevel(Math.min(100, level + 1))}
                                    style={{ fontFamily: 'monospace' }}
                                >
                                    +1
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => setLevel(Math.min(100, level + 10))}
                                    style={{ fontFamily: 'monospace' }}
                                >
                                    +10
                                </button>
                            </div>
                        </div>
                        <input
                            type="range"
                            className="form-range"
                            min="1"
                            max="100"
                            value={level}
                            onChange={(e) => setLevel(parseInt(e.target.value))}
                            style={{
                                accentColor: '#DC143C',
                                cursor: 'pointer'
                            }}
                        />
                        <div className="d-flex justify-content-between mt-1">
                            <small className="text-white-50" style={{ fontFamily: 'monospace' }}>Lv. 1</small>
                            <small className="text-white-50" style={{ fontFamily: 'monospace' }}>Lv. 100</small>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mb-4">
                        <h5 className="text-white-50 mb-3">
                            STATS AT LEVEL {level}
                            <small className="text-white-50 ms-2" style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
                                (Base stats shown in parentheses)
                            </small>
                        </h5>
                        <div className="row g-3">
                            {stats.map((statInfo, index) => {
                                const statName = statInfo.stat.name.replace('-', ' ');
                                const baseStat = statInfo.base_stat;
                                const statAtLevel = getStatAtLevel(baseStat, level, statInfo.stat.name);
                                const maxStatAtLevel = getStatAtLevel(255, 100, statInfo.stat.name);
                                const percentage = (statAtLevel / maxStatAtLevel) * 100;

                                return (
                                    <div key={index} className="col-md-6">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="text-capitalize fw-bold">
                                                {statName.replace('special attack', 'Sp. Atk').replace('special defense', 'Sp. Def')}:
                                            </span>
                                            <span>
                                                <strong className="text-danger">{statAtLevel}</strong>
                                                <small className="text-white-50 ms-2">({baseStat})</small>
                                            </span>
                                        </div>
                                        <div className="progress" style={{ height: '20px' }}>
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: percentage > 70 ? '#28a745' : percentage > 40 ? '#ffc107' : '#dc3545',
                                                    boxShadow: '0 0 8px rgba(40, 167, 69, 0.5)'
                                                }}
                                                aria-valuenow={statAtLevel}
                                                aria-valuemin="0"
                                                aria-valuemax={maxStatAtLevel}
                                            >
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Physical Attributes */}
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <h5 className="text-white-50 mb-2">Height</h5>
                            <p className="fs-5 mb-0">{formatHeight(height)}</p>
                        </div>
                        <div className="col-md-4">
                            <h5 className="text-white-50 mb-2">Weight</h5>
                            <p className="fs-5 mb-0">{formatWeight(weight)}</p>
                        </div>
                        <div className="col-md-4">
                            <h5 className="text-white-50 mb-2">Base Experience</h5>
                            <p className="fs-5 mb-0">{base_experience} XP</p>
                        </div>
                    </div>

                    {/* Species Profile */}
                    {species && (
                        <div className="mb-4">
                            <h5 className="text-white-50 mb-2">Species Profile</h5>
                            <div className="bg-secondary bg-opacity-25 rounded p-3">
                                <div className="row g-3">
                                    {species.habitat && (
                                        <div className="col-6 col-md-3">
                                            <small className="text-white-50 d-block" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>HABITAT</small>
                                            <span className="fw-bold">{capFirstLetter(species.habitat.name)}</span>
                                        </div>
                                    )}
                                    <div className="col-6 col-md-3">
                                        <small className="text-white-50 d-block" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>COLOR</small>
                                        <span className="fw-bold d-flex align-items-center gap-1">
                                            <span style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: getPokemonColor(species.color?.name), border: '1px solid rgba(255,255,255,0.3)', verticalAlign: 'middle' }}></span>
                                            {capFirstLetter(species.color?.name || '')}
                                        </span>
                                    </div>
                                    {species.shape && (
                                        <div className="col-6 col-md-3">
                                            <small className="text-white-50 d-block" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>SHAPE</small>
                                            <span className="fw-bold">{capFirstLetter(species.shape.name)}</span>
                                        </div>
                                    )}
                                    <div className="col-6 col-md-3">
                                        <small className="text-white-50 d-block" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>GROWTH RATE</small>
                                        <span className="fw-bold">{species.growth_rate ? capFirstLetter(species.growth_rate.name.replace('-', ' ')) : '—'}</span>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <small className="text-white-50 d-block" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>CAPTURE RATE</small>
                                        <span className="fw-bold">{species.capture_rate}</span>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <small className="text-white-50 d-block" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>BASE HAPPINESS</small>
                                        <span className="fw-bold">{species.base_happiness}</span>
                                    </div>
                                    {species.egg_groups?.length > 0 && (
                                        <div className="col-6 col-md-3">
                                            <small className="text-white-50 d-block" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>EGG GROUPS</small>
                                            <div className="d-flex gap-1 flex-wrap">
                                                {species.egg_groups.map(eg => (
                                                    <span key={eg.name} className="badge" style={{ backgroundColor: '#5DADE2', fontSize: '0.7rem' }}>
                                                        {capFirstLetter(eg.name)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {genderInfo && !genderInfo.genderless && (
                                        <div className="col-6 col-md-3">
                                            <small className="text-white-50 d-block" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>GENDER RATIO</small>
                                            <div className="mt-1">
                                                <div className="d-flex align-items-center gap-2">
                                                    <span style={{ color: '#5DADE2', fontSize: '0.85rem', fontWeight: 'bold' }}>♂ {genderInfo.male.toFixed(0)}%</span>
                                                    <div className="progress flex-grow-1" style={{ height: '12px', backgroundColor: '#2a2a2a' }}>
                                                        <div className="progress-bar" style={{ width: `${genderInfo.male}%`, backgroundColor: '#5DADE2' }}></div>
                                                        <div className="progress-bar" style={{ width: `${genderInfo.female}%`, backgroundColor: '#FF69B4' }}></div>
                                                    </div>
                                                    <span style={{ color: '#FF69B4', fontSize: '0.85rem', fontWeight: 'bold' }}>♀ {genderInfo.female.toFixed(0)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {genderInfo && genderInfo.genderless && (
                                        <div className="col-6 col-md-3">
                                            <small className="text-white-50 d-block" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>GENDER</small>
                                            <span className="fw-bolder" style={{ color: '#888' }}>GENDERLESS</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Abilities */}
                    <div className="mb-3">
                        <h5 className="text-white-50 mb-2">Abilities</h5>
                        <div className="d-flex flex-wrap gap-2">
                            {abilities.map((abilityInfo, index) => (
                                <span
                                    key={index}
                                    className={`badge ${abilityInfo.is_hidden ? 'bg-warning text-dark' : 'bg-info'} px-3 py-2 fs-6`}
                                >
                                    {capFirstLetter(abilityInfo.ability.name.replace('-', ' '))}
                                    {abilityInfo.is_hidden && ' (Hidden)'}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PokemonResult;
