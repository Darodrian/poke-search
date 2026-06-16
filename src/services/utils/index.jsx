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

// Extract numeric ID from a PokeAPI URL
export const extractIdFromUrl = (url) => {
    const parts = url.replace(/\/$/, '').split('/');
    return parseInt(parts[parts.length - 1], 10);
}

// Flatten evolution chain into stages (array of arrays)
// Each stage contains all species at that evolution level
export const parseEvolutionChain = (chain) => {
    const stages = [];
    const traverse = (node, level) => {
        if (!stages[level]) stages[level] = [];
        stages[level].push({
            name: node.species.name,
            id: extractIdFromUrl(node.species.url)
        });
        node.evolves_to.forEach(child => traverse(child, level + 1));
    };
    traverse(chain, 0);
    return stages;
}

// Find which stage a Pokémon is in within an evolution chain
export const findPokemonInChain = (stages, pokemonId) => {
    for (let i = 0; i < stages.length; i++) {
        const found = stages[i].find(s => s.id === pokemonId);
        if (found) return { stageIndex: i, species: found };
    }
    return null;
}

// Combine type damage relations for dual-type Pokémon
export const combineDefensiveEffectiveness = (typeRelations) => {
    const multipliers = {};
    const allTypes = new Set();
    typeRelations.forEach(relations => {
        [...(relations.double_damage_from || []), ...(relations.half_damage_from || []), ...(relations.no_damage_from || [])]
            .forEach(t => allTypes.add(t.name));
    });
    allTypes.forEach(t => multipliers[t] = 1);
    typeRelations.forEach(relations => {
        relations.no_damage_from?.forEach(t => { multipliers[t.name] = 0; });
        relations.double_damage_from?.forEach(t => {
            if (multipliers[t.name] !== 0) multipliers[t.name] *= 2;
        });
        relations.half_damage_from?.forEach(t => {
            if (multipliers[t.name] !== 0) multipliers[t.name] *= 0.5;
        });
    });
    return multipliers;
}

// Combine offensive type effectiveness (damage dealt to others)
export const combineOffensiveEffectiveness = (typeRelations) => {
    const strongAgainst = new Set();
    const weakAgainst = new Set();
    const noDamageTo = new Set();
    typeRelations.forEach(relations => {
        relations.double_damage_to?.forEach(t => strongAgainst.add(t.name));
        relations.half_damage_to?.forEach(t => weakAgainst.add(t.name));
        relations.no_damage_to?.forEach(t => noDamageTo.add(t.name));
    });
    return {
        strongAgainst: [...strongAgainst],
        weakAgainst: [...weakAgainst],
        noDamageTo: [...noDamageTo]
    };
}

// Format gender rate (-1 = genderless, 0-8 = female ratio eighths)
export const formatGenderRate = (rate) => {
    if (rate === -1) return { male: 0, female: 0, genderless: true };
    const female = (rate / 8) * 100;
    const male = 100 - female;
    return { male, female, genderless: false };
}

// Get English genus from genera array
export const getEnglishGenus = (genera) => {
    const entry = genera.find(g => g.language.name === 'en');
    return entry ? entry.genus : '';
}

// Get English flavor text from flavor_text_entries array
export const getEnglishFlavorText = (entries) => {
    const english = entries.filter(e => e.language.name === 'en');
    return english.length > 0 ? english[0] : null;
}

// Clean flavor text (replace newlines and form feeds)
export const cleanFlavorText = (text) => {
    return text.replace(/[\n\f]/g, ' ').replace(/  +/g, ' ').trim();
}

// Format Pokemon color name to display
export const getPokemonColor = (color) => {
    const colorMap = {
        black: '#111111',
        blue: '#3B5BA5',
        brown: '#8B6914',
        gray: '#6B6B6B',
        green: '#5A9E4E',
        pink: '#EE99AC',
        purple: '#7B5EA7',
        red: '#DC143C',
        white: '#E0E0E0',
        yellow: '#F8D030'
    };
    return colorMap[color] || '#999999';
}

// Normalize user input to a valid PokeAPI pokemon name
export const normalizePokemonName = (input) => {
    let name = input.trim().toLowerCase();

    // Handle Nidoran gender variants with ♂/♀ symbols
    if (/^nidoran/i.test(name)) {
        if (/[♂]/.test(name) || /\bm\b/.test(name) || /\bmale\b/.test(name)) {
            return 'nidoran-m';
        }
        if (/[♀]/.test(name) || /\bf\b/.test(name) || /\bfemale\b/.test(name)) {
            return 'nidoran-f';
        }
    }

    // Strip apostrophes (farfetch'd -> farfetchd)
    name = name.replace(/'/g, '');

    // Replace dots and colons with hyphens
    name = name.replace(/[.:]/g, '-');

    // Remove diacritics/accents (flabébé -> flabebe)
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Replace spaces with hyphens
    name = name.replace(/\s+/g, '-');

    // Remove any remaining non-alphanumeric characters except hyphens
    name = name.replace(/[^a-z0-9-]/g, '');

    // Collapse multiple hyphens
    name = name.replace(/-+/g, '-');

    // Remove leading/trailing hyphens
    name = name.replace(/^-/, '').replace(/-$/, '');

    return name;
}

// Format a raw API name for display (e.g., nidoran-m -> Nidoran ♂)
export const formatPokemonName = (name) => {
    const parts = name.split('-');
    const formatted = parts.map(capFirstLetter).join(' ');

    if (formatted.endsWith(' M')) return formatted.slice(0, -2) + ' ♂';
    if (formatted.endsWith(' F')) return formatted.slice(0, -2) + ' ♀';
    if (formatted.startsWith('Mr ')) return formatted.replace('Mr ', 'Mr. ');
    if (formatted.startsWith('Type ')) return formatted.replace('Type ', 'Type: ');
    if (formatted.startsWith('Ho Oh')) return formatted.replace('Ho Oh', 'Ho-Oh');

    return formatted;
}