import React, { useState, useRef, useEffect } from "react";
import { useGetPokemonQuery } from "../../services/api";
import { capFirstLetter, toLowerCase, getTypeColor, formatHeight, formatWeight, getStatAtLevel } from "../../services/utils";

const PokemonResult = props => {
    const { data, error, isError, isFetching } = useGetPokemonQuery(toLowerCase(props.name));
    const [level, setLevel] = useState(50);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef(null);

    useEffect(() => {
        // Stop any playing audio when Pokemon changes
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
            setIsPlaying(false);
        }
        
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
                    {/* Header with ID and Name */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-3">
                            <h2 className="card-title mb-0">
                                {capFirstLetter(name)}
                            </h2>
                            {cries?.legacy && (
                                <div className="d-flex align-items-center gap-2">
                                    <button
                                        onClick={handlePlayCry}
                                        disabled={isPlaying}
                                        className="btn btn-sm btn-outline-danger"
                                        title="Play Pokemon cry"
                                        style={{
                                            fontFamily: 'monospace',
                                            borderColor: '#DC143C',
                                            color: isPlaying ? '#FF4444' : '#DC143C',
                                            minWidth: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: 0
                                        }}
                                    >
                                        {isPlaying ? (
                                            <div className="spinner-border spinner-border-sm text-danger" role="status" style={{ width: '1rem', height: '1rem' }}>
                                                <span className="visually-hidden">Playing...</span>
                                            </div>
                                        ) : (
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                width="20" 
                                                height="20" 
                                                fill="currentColor" 
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                                                <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.611 3.89l.707.707z"/>
                                                <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
                                            </svg>
                                        )}
                                    </button>
                                    <div className="d-flex align-items-center gap-2" style={{ minWidth: '120px' }}>
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width="16" 
                                            height="16" 
                                            fill="currentColor" 
                                            viewBox="0 0 16 16"
                                            style={{ color: '#DC143C' }}
                                        >
                                            <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                                            <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.611 3.89l.707.707z"/>
                                            <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
                                        </svg>
                                        <input
                                            type="range"
                                            className="form-range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={volume}
                                            onChange={handleVolumeChange}
                                            title={`Volume: ${Math.round(volume * 100)}%`}
                                            style={{
                                                accentColor: '#DC143C',
                                                cursor: 'pointer',
                                                flex: 1
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <span className="badge bg-secondary fs-6">#{String(id).padStart(4, '0')}</span>
                    </div>

                    {/* Sprites Gallery */}
                    <div className="row mb-4">
                        <div className="col-12 mb-3">
                            <h5 className="text-white-50 mb-2">Sprites</h5>
                            <div className="sprite-container d-flex flex-wrap gap-3 justify-content-center bg-secondary bg-opacity-25 p-3 rounded">
                                {(() => {
                                    const hasFemaleVariants = sprites.front_female || sprites.back_female;
                                    const hasShinyFemaleVariants = sprites.front_shiny_female || sprites.back_shiny_female;
                                    
                                    return (
                                        <>
                                            {sprites.front_default && (
                                                <div className="text-center">
                                                    <img 
                                                        src={sprites.front_default} 
                                                        alt={`${name} front`}
                                                        className="bg-white rounded p-2"
                                                        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                                                    />
                                                    <p className="small mt-1 mb-0">{`Front${hasFemaleVariants ? ' (♂)' : ''}`}</p>
                                                </div>
                                            )}
                                            {sprites.back_default && (
                                                <div className="text-center">
                                                    <img 
                                                        src={sprites.back_default} 
                                                        alt={`${name} back`}
                                                        className="bg-white rounded p-2"
                                                        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                                                    />
                                                    <p className="small mt-1 mb-0">{`Back${hasFemaleVariants ? ' (♂)' : ''}`}</p>
                                                </div>
                                            )}
                                            {sprites.front_female && (
                                                <div className="text-center">
                                                    <img 
                                                        src={sprites.front_female} 
                                                        alt={`${name} female front`}
                                                        className="bg-white rounded p-2"
                                                        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                                                    />
                                                    <p className="small mt-1 mb-0">Front (♀)</p>
                                                </div>
                                            )}
                                            {sprites.back_female && (
                                                <div className="text-center">
                                                    <img 
                                                        src={sprites.back_female} 
                                                        alt={`${name} female back`}
                                                        className="bg-white rounded p-2"
                                                        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                                                    />
                                                    <p className="small mt-1 mb-0">Back (♀)</p>
                                                </div>
                                            )}
                                            {sprites.front_shiny && (
                                                <div className="text-center">
                                                    <img 
                                                        src={sprites.front_shiny} 
                                                        alt={`${name} shiny front`}
                                                        className="bg-white rounded p-2"
                                                        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                                                    />
                                                    <p className="small mt-1 mb-0">{`Shiny Front${hasShinyFemaleVariants ? ' (♂)' : ''}`}</p>
                                                </div>
                                            )}
                                            {sprites.back_shiny && (
                                                <div className="text-center">
                                                    <img 
                                                        src={sprites.back_shiny} 
                                                        alt={`${name} shiny back`}
                                                        className="bg-white rounded p-2"
                                                        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                                                    />
                                                    <p className="small mt-1 mb-0">{`Shiny Back${hasShinyFemaleVariants ? ' (♂)' : ''}`}</p>
                                                </div>
                                            )}
                                            {sprites.front_shiny_female && (
                                                <div className="text-center">
                                                    <img 
                                                        src={sprites.front_shiny_female} 
                                                        alt={`${name} shiny female front`}
                                                        className="bg-white rounded p-2"
                                                        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                                                    />
                                                    <p className="small mt-1 mb-0">Shiny Front (♀)</p>
                                                </div>
                                            )}
                                            {sprites.back_shiny_female && (
                                                <div className="text-center">
                                                    <img 
                                                        src={sprites.back_shiny_female} 
                                                        alt={`${name} shiny female back`}
                                                        className="bg-white rounded p-2"
                                                        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                                                    />
                                                    <p className="small mt-1 mb-0">Shiny Back (♀)</p>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>

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
                                const maxStatAtLevel = getStatAtLevel(255, 100, statInfo.stat.name); // Max possible stat at level 100
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