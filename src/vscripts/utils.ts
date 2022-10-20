export function encodeToJson<T>(value: T): Json<T> {
    return json.encode(value) as unknown as Json<T>;
}

export function decodeFromJson<T>(value: Json<T>) {
    const jsonString = value as unknown as string;
    const [result] = json.decode(jsonString);
    if (result != undefined) {
        return result as T;
    } else {
        throw `Failed to decode json: ${jsonString}`;
    }
}

export async function sendRequest(incomingMethod: string | undefined, url: string, params: [string, string][] = []) {
    const method = incomingMethod ?? "GET";

    const request = CreateHTTPRequestScriptVM(method, url);
    for (const param of [["source", "dota"], ...params]) {
        request.SetHTTPRequestGetOrPostParameter(param[0], param[1]);
    }

    const result = await new Promise<HTTPResponseFromServer>((resolve, reject) => {
        request.Send(response => {
            if (response.StatusCode == 0) {
                reject();
            } else {
                resolve({
                    Body: response.Body,
                    StatusCode: response.StatusCode
                });
            }
        });
    });

    return result;
}
