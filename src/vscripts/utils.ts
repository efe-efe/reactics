export function encodeToJson<T>(value: T): Json<T> {
    return json.encode(value) as unknown as Json<T>;
}

export function decodeFromJson<T>(value: Json<T>) {
    const jsonString = value as unknown as string;
    const result = json.decode(jsonString);

    if (result != undefined) {
        return result as unknown as T;
    } else {
        throw `Failed to decode json: ${jsonString}`;
    }
}

export async function sendRequest(playerId: PlayerID, method: string, url: string, params: [string, string][] = []) {
    const request = CreateHTTPRequestScriptVM(method, url);

    for (const param of [["source", "dota"], ["playerId", playerId.toString()], ...params]) {
        print(`Setting up the parameter: [${param[0]}, ${param[1]}]`);
        request.SetHTTPRequestGetOrPostParameter(param[0], param[1]);
    }

    print(`Parameters set, now sending the request: ${method}/${url}`);

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
