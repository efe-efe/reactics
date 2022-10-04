export function log(message: string) {
    $.Msg(`[${Game.Time().toFixed(2)}] ${message}`);
}

export function encodeToJson<T>(value: T): Json<T> {
    return JSON.stringify(value) as unknown as Json<T>;
}

export function decodeFromJson<T>(value: Json<T>) {
    const jsonString = value as unknown as string;
    return JSON.parse(jsonString) as T;
}