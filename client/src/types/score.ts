// client/src/types/score.ts

// --- Define the structure for your score assets ---

// Structure for an entry in Approach and Obstacles (used within a Score)
export interface ApproachObstacle {
    id: string; // Unique ID for this list item
    type: 'approach' | 'obstacle'; // Is it an approach or an obstacle?
    text: string; // The description text
}

// Structure for a score Location asset
export interface scoreLocation {
    id: string; // Unique ID for the location
    header?: string; // The title/name of the location
    image?: string; // URL for an image representing the location
    description?: string; // Description of the location
    personas?: string[]; // Array of IDs of Persona assets linked to this location
    map?: string; // URL or data for a map of the location
    // Add other location-specific fields here as needed
}

// Structure for a score Score (Case/Quest) asset
export interface scoreScore {
    id: string; // Unique ID for the score
    description?: string; // Main description of the score/case
    image?: string; // Image related to the score
    approachObstacles?: ApproachObstacle[]; // List of approaches/obstacles for this score
    scenesComplications?: string; // Text for key scenes and complications
    personas?: string[]; // Array of IDs of Persona assets linked to this score
    location?: string; // ID of a primary Location asset linked to this score
    // Add other score-specific fields here as needed
}

// Structure for a score Persona (NPC) asset
export interface scorePersona {
    id: string; // Unique ID
    name?: string; // Persona's name
    description?: string; // Description or notes about the persona (assuming this is needed)
    // TODO: You mentioned the Persona description was cut off. Please provide the rest of the fields you want for a Persona.
    // Example:
    // attitude?: number; // A number representing attitude (-1, 0, 1?)
    // faction?: string; // Linked faction ID?
    // notableTraits?: string;
}

// TODO: Define the structure for your fourth asset type here.
// Please provide the name and fields for the fourth asset type.
// Example:
// export interface scoreFaction {
//    id: string; // Unique ID
//    name?: string;
//    description?: string;
//    headquarters?: string; // Linked Location ID?
//    members?: string[]; // Array of Persona IDs?
// }


// --- Define the overall structure for the data that will be nested INSIDE the score Sheet ---

// This interface describes the shape of the 'score' object
// that will live inside the 'data' property of your single 'score' Sheet.
export interface scoreSheetContent {
    locations?: Record<string, scoreLocation>; // An object where keys are Location IDs and values are Location objects
    scores?: Record<string, scoreScore>;     // An object where keys are Score IDs and values are Score objects
    personas?: Record<string, scorePersona>;   // An object where keys are Persona IDs and values are Persona objects
    // TODO: Add a field for your fourth asset type list here, matching the interface you define.
    // Example: factions?: Record<string, scoreFaction>;

    // Add other score-level data properties that belong *to the sheet itself* if any
    // Example: overviewNotes?: string;
}