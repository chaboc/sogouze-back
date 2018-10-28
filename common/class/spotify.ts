export class Tracks {
    id?: number
    userId?: number
    spotifyId?: string
    name?: string
};

export class Artists {
    id?: number
    userId?: number
    spotifyId?: string
    name?: string
};

export class Genres {
    id?: number
    userId?: number
    name?: string
    occurence?: number
};

export class Matching {
    id?: number
    userId?: number
    matchingId?: string
    pourcentage?: number
};

export class Matchs {
    id?: number
    userId?: number
    matchingId?: string
    like?: number
};
