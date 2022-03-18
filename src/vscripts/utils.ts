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

export function registerEventListener<T extends keyof CustomGameEventDeclarations>(
    event: T,
    handler: (player: CDOTAPlayer, data: CustomNetworkedData<CCustomGameEventManager.InferEventType<T, object>>) => Promise<CustomResponse | undefined>
) {
    CustomGameEventManager.RegisterListener(event, (_, eventData) => {
        const player = PlayerResource.GetPlayer(eventData.PlayerID);
        if (!player) {
            print(`Event ${event} ignored because player with id ${eventData.PlayerID} was not found`);
            return;
        }

        handler(player, eventData);
    });
}

export async function sendRequest(method: "GET" | "POST", url: string, params: [string, string][] = []){
    const request = CreateHTTPRequestScriptVM(method, url);
    for(const param of [["source", "dota"], ...params]){
        request.SetHTTPRequestGetOrPostParameter(param[0], param[1]);
    }

    const result = await new Promise<CScriptHTTPResponse>((resolve, reject) => {
        request.Send((response) => {
            if(response.StatusCode == 0){
                reject();
            } else {
                resolve(response);
            }
        });
    })

    return result;
}