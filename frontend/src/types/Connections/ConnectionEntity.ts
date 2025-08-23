export type ConnectionEntity = {
    connectionId: number;
    followerId: number;
    followeeId: number;
}

export type NewConnectionEntity = {
    followerId: number;
    followeeId: number;
}