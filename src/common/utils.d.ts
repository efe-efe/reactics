
type Nothing = Record<string, never>;
    
// Json is an opaque type which you can only use in encode/decode
type Json<T> = {
    jsonBrand: unknown & T;
};

type CustomNetworkedData<T> = T extends string | number
    ? T
    : T extends boolean
    ? 0 | 1
    : T extends (infer U)[]
    ? { [key: number]: CustomNetworkedData<U> }
    : T extends Function // eslint-disable-line @typescript-eslint/ban-types
    ? undefined
    : T extends Json<infer P>
    ? Json<P>
    : T extends object
    ? { [K in keyof T]: CustomNetworkedData<T[K]> }
    : never;
