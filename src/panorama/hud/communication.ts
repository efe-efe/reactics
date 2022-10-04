import { decodeFromJson, encodeToJson, log } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ongoingRequests: Record<number, ((body: any) => void) | undefined> = {};
let requestIdSequence = 0;

GameEvents.Subscribe("customResponse", event => {
    const response = decodeFromJson(event.json);

    if (response.ok) {
        const handler = ongoingRequests[event.requestId];

        if (handler) {
            handler(response);
        }
    }
});

export function subscribeToMessage<T extends keyof SCMessages>(message: T, handler: (body: SCMessages[T]) => void) {
    GameEvents.Subscribe("customClientMessage", event => {
        if (event.name == message) {
            handler(decodeFromJson(event.json) as SCMessages[T]);
        }
    });
}

export function csRequest<T extends keyof CSRequests>(request: T, body: CSRequests[T][0]): Promise<CSRequests[T][1]> {
    const requestId = requestIdSequence++;

    const promise = new Promise<CSRequests[T][1]>((resolve, reject) => {
        const timeout = $.Schedule(10, () => {
            if (!ongoingRequests[requestId]) {
                return;
            }

            delete ongoingRequests[requestId];

            log(`Request timeout in ${requestId}/${request}`);

            reject();
        });

        ongoingRequests[requestId] = (result: CustomResult) => {
            delete ongoingRequests[requestId];

            $.CancelScheduled(timeout);

            if (result.ok) {
                resolve(result.body);
            } else {
                reject(`Error on server while executing ${requestId}/${request}`);
            }
        };

        GameEvents.SendCustomGameEventToServer("customRequest", {
            requestId: requestId,
            name: request,
            json: encodeToJson(body)
        });
    });

    promise.catch(error => log(`Error ${error}`));

    return promise;
}