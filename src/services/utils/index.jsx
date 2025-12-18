export const capFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export const toLowerCase = (string) => {
    return string.toLowerCase()
}

// Type color mapping for Pokémon types
export const getTypeColor = (type) => {
    const typeColors = {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC'
    };
    return typeColors[type] || '#68A090';
}

// Convert height from decimeters to feet/inches or meters
export const formatHeight = (height) => {
    const meters = height / 10;
    const feet = Math.floor(meters * 3.28084);
    const inches = Math.round((meters * 3.28084 - feet) * 12);
    return `${meters.toFixed(1)}m (${feet}'${inches}")`;
}

// Convert weight from hectograms to kg and lbs
export const formatWeight = (weight) => {
    const kg = weight / 10;
    const lbs = (kg * 2.20462).toFixed(1);
    return `${kg.toFixed(1)}kg (${lbs}lbs)`;
}

// Calculate HP stat at a given level
// Formula: HP = floor((Base * 2 + 31) * Level / 100) + Level + 10
export const calculateHPAtLevel = (baseStat, level) => {
    return Math.floor((baseStat * 2 + 31) * level / 100) + level + 10;
}

// Calculate other stats at a given level
// Formula: Stat = floor((Base * 2 + 31) * Level / 100) + 5
export const calculateStatAtLevel = (baseStat, level) => {
    return Math.floor((baseStat * 2 + 31) * level / 100) + 5;
}

// Calculate stat at level (handles HP differently)
export const getStatAtLevel = (baseStat, level, statName) => {
    if (statName === 'hp') {
        return calculateHPAtLevel(baseStat, level);
    }
    return calculateStatAtLevel(baseStat, level);
}