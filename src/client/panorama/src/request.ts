import { decodeFromJson, encodeToJson } from "./utils";

const ongoingRequests: Record<number, ((body: HTTPResponseFromServer) => void) | undefined> = {};
let requestIdSequence = 0;

GameEvents.Subscribe("httpResponse", event => {
    const response = decodeFromJson(event.json);

    if (response.ok) {
        const handler = ongoingRequests[event.requestId];

        if (handler) {
            handler(response.body);
        }
    }
});

export function request(
    input: string,
    init?: {
        method: string;
        params?: [string, string][];
    }
) {
    const requestId = requestIdSequence++;

    const promise = new Promise((resolve, reject) => {
        const timeout = $.Schedule(10, () => {
            if (!ongoingRequests[requestId]) {
                return;
            }

            delete ongoingRequests[requestId];

            $.Msg(`Request timeout in ${requestId}/${input}`);

            reject();
        });

        ongoingRequests[requestId] = (result: HTTPResponseFromServer) => {
            delete ongoingRequests[requestId];

            $.CancelScheduled(timeout);

            if (result.StatusCode != 0) {
                resolve(result.Body);
            } else {
                reject(`Error on server while executing ${requestId}/${input}`);
            }
        };

        GameEvents.SendCustomGameEventToServer("httpRequest", {
            requestId: requestIdSequence,
            url: input,
            PlayerID: Game.GetLocalPlayerID(),
            method: init?.method ?? "GET",
            params: init?.params ? encodeToJson(init.params) : undefined
        });
    });

    promise.catch(error => {}); //log(`Error ${error}`));

    return promise;
}
