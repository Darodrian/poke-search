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

// Game version list for Pokemon games
export const gameVersions = [
    { id: 'all', name: 'All Versions', group: 'All' },
    { id: 'red-blue', name: 'Red/Blue', group: 'Generation I' },
    { id: 'yellow', name: 'Yellow', group: 'Generation I' },
    { id: 'gold-silver', name: 'Gold/Silver', group: 'Generation II' },
    { id: 'crystal', name: 'Crystal', group: 'Generation II' },
    { id: 'ruby-sapphire', name: 'Ruby/Sapphire', group: 'Generation III' },
    { id: 'emerald', name: 'Emerald', group: 'Generation III' },
    { id: 'firered-leafgreen', name: 'FireRed/LeafGreen', group: 'Generation III' },
    { id: 'diamond-pearl', name: 'Diamond/Pearl', group: 'Generation IV' },
    { id: 'platinum', name: 'Platinum', group: 'Generation IV' },
    { id: 'heartgold-soulsilver', name: 'HeartGold/SoulSilver', group: 'Generation IV' },
    { id: 'black-white', name: 'Black/White', group: 'Generation V' },
    { id: 'black-2-white-2', name: 'Black 2/White 2', group: 'Generation V' },
    { id: 'x-y', name: 'X/Y', group: 'Generation VI' },
    { id: 'omega-ruby-alpha-sapphire', name: 'Omega Ruby/Alpha Sapphire', group: 'Generation VI' },
    { id: 'sun-moon', name: 'Sun/Moon', group: 'Generation VII' },
    { id: 'ultra-sun-ultra-moon', name: 'Ultra Sun/Ultra Moon', group: 'Generation VII' },
    { id: 'lets-go-pikachu-lets-go-eevee', name: "Let's Go Pikachu/Eevee", group: 'Generation VII' },
    { id: 'sword-shield', name: 'Sword/Shield', group: 'Generation VIII' },
    { id: 'brilliant-diamond-and-shining-pearl', name: 'Brilliant Diamond/Shining Pearl', group: 'Generation VIII' },
    { id: 'legends-arceus', name: 'Legends: Arceus', group: 'Generation VIII' },
    { id: 'scarlet-violet', name: 'Scarlet/Violet', group: 'Generation IX' }
];

// Get version-specific sprite from Pokemon data
export const getVersionSprite = (sprites, version) => {
    if (!sprites || !sprites.versions || version === 'all') {
        return sprites?.front_default || null;
    }

    // Map our version IDs to PokeAPI version names
    const versionMap = {
        'red-blue': 'red-blue',
        'yellow': 'yellow',
        'gold-silver': 'gold-silver',
        'crystal': 'crystal',
        'ruby-sapphire': 'ruby-sapphire',
        'emerald': 'emerald',
        'firered-leafgreen': 'firered-leafgreen',
        'diamond-pearl': 'diamond-pearl',
        'platinum': 'platinum',
        'heartgold-soulsilver': 'heartgold-soulsilver',
        'black-white': 'black-white',
        'black-2-white-2': 'black-2-white-2',
        'x-y': 'x-y',
        'omega-ruby-alpha-sapphire': 'omegaruby-alphasapphire',
        'sun-moon': 'sun-moon',
        'ultra-sun-ultra-moon': 'ultra-sun-ultra-moon',
        'lets-go-pikachu-lets-go-eevee': 'lets-go-pikachu-lets-go-eevee',
        'sword-shield': 'sword-shield',
        'brilliant-diamond-and-shining-pearl': 'brilliant-diamond-and-shining-pearl',
        'legends-arceus': 'legends-arceus',
        'scarlet-violet': 'scarlet-violet'
    };

    const apiVersion = versionMap[version];
    if (!apiVersion || !sprites.versions[apiVersion]) {
        return sprites?.front_default || null;
    }

    // Try to get generation-specific sprite
    const genData = sprites.versions[apiVersion];
    if (genData?.front_default) {
        return genData.front_default;
    }

    // Fallback to default
    return sprites?.front_default || null;
}

// Check if Pokemon appears in a specific version
// Note: This is a placeholder function for future implementation
// In reality, we'd need to check the actual game_indices from the API
export const pokemonInVersion = (gameIndices, version) => {
    if (version === 'all' || !gameIndices) return true;
    
    // This is a simplified check - in reality, we'd need to check the actual game indices
    // The gameIndices array contains version objects that can be checked
    return true; // For now, assume all Pokemon appear in all versions
}