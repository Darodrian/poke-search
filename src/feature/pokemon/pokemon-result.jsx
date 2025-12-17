import React, { useState } from "react";
import { useGetPokemonQuery } from "../../services/api";
import { capFirstLetter, toLowerCase, getTypeColor, formatHeight, formatWeight, getStatAtLevel, getVersionSprite, gameVersions } from "../../services/utils";

const PokemonResult = props => {
    const { data, error, isError, isFetching } = useGetPokemonQuery(toLowerCase(props.name))
    const [level, setLevel] = useState(50); // Default level 50
    const selectedVersion = props.version || 'all';
    const versionName = gameVersions.find(v => v.id === selectedVersion)?.name || 'All Versions';

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
        game_indices
    } = data;

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
                        <div>
                            <h2 className="card-title mb-0">
                                {capFirstLetter(name)}
                            </h2>
                            {selectedVersion !== 'all' && (
                                <small className="text-white-50" style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>
                                    VERSION: {versionName.toUpperCase()}
                                </small>
                            )}
                        </div>
                        <span className="badge bg-secondary fs-6">#{String(id).padStart(4, '0')}</span>
                    </div>

                    {/* Sprites Gallery */}
                    <div className="row mb-4">
                        <div className="col-12 mb-3">
                            <h5 className="text-white-50 mb-2">
                                {selectedVersion !== 'all' ? `${versionName} Sprites` : 'Sprites'}
                            </h5>
                            <div className="d-flex flex-wrap gap-3 justify-content-center bg-secondary bg-opacity-25 p-3 rounded">
                                {(() => {
                                    const versionSprite = getVersionSprite(sprites, selectedVersion);
                                    return versionSprite ? (
                                        <div className="text-center">
                                            <img 
                                                src={versionSprite} 
                                                alt={`${name} ${versionName} front`}
                                                className="bg-white rounded p-2"
                                                style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                                            />
                                            <p className="small mt-1 mb-0">
                                                {selectedVersion !== 'all' ? `${versionName} Front` : 'Front'}
                                            </p>
                                        </div>
                                    ) : null;
                                })()}
                                {sprites.front_default && selectedVersion === 'all' && (
                                    <>
                                        <div className="text-center">
                                            <img 
                                                src={sprites.front_default} 
                                                alt={`${name} front`}
                                                className="bg-white rounded p-2"
                                                style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                                            />
                                            <p className="small mt-1 mb-0">Front</p>
                                        </div>
                                        {sprites.back_default && (
                                            <div className="text-center">
                                                <img 
                                                    src={sprites.back_default} 
                                                    alt={`${name} back`}
                                                    className="bg-white rounded p-2"
                                                    style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                                                />
                                                <p className="small mt-1 mb-0">Back</p>
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
                                                <p className="small mt-1 mb-0">Shiny Front</p>
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
                                                <p className="small mt-1 mb-0">Shiny Back</p>
                                            </div>
                                        )}
                                    </>
                                )}
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

                    {/* Game Versions Info */}
                    {game_indices && game_indices.length > 0 && (
                        <div className="mb-3">
                            <h5 className="text-white-50 mb-2">Available In Games</h5>
                            <div className="d-flex flex-wrap gap-2">
                                {game_indices.slice(0, 10).map((gameIndex, index) => (
                                    <span
                                        key={index}
                                        className="badge bg-success px-2 py-1"
                                        style={{ fontSize: '0.75rem' }}
                                    >
                                        {capFirstLetter(gameIndex.version.name.replace('-', ' '))}
                                    </span>
                                ))}
                                {game_indices.length > 10 && (
                                    <span className="badge bg-secondary px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                        +{game_indices.length - 10} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PokemonResult;