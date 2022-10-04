import { decodeFromJson, encodeToJson } from "./utils";

type CSRequestHandler<T extends keyof CSRequests> = (player: PlayerID, input: CSRequests[T][0]) => CSRequests[T][1] | Promise<CSRequests[T][1]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let handlers: Map<string, CSRequestHandler<any>>;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (!handlers) {
    handlers = new Map();
} else {
    handlers.clear();
}

// Generates an error logger
function errorLogger(event: string, player: PlayerID) {
    return {
        error: (text: string) => {
            print(`[${event}][Player = ${player}]: ${text}`);
        }
    };
}

export function csRequestHandler<T extends keyof CSRequests>(name: T, handler: (id: PlayerID) => CSRequests[T][1] | Promise<CSRequests[T][1]>) {
    handlers.set(name, handler);
}

export async function parseAndHandleCustomRequest(player: PlayerID, event: CustomRequest<keyof CSRequests>): Promise<CustomResponse | undefined> {
    const log = errorLogger(event.name, player);
    const body = decodeFromJson(event.json);

    try {
        print(`[Dispatch][Player = ${player}] ${event.name}: ${json.encode(body)}`);

        const handler = handlers.get(event.name);
        if (!handler) {
            throw `Handler not found. Register it with csRequestHandler("${event.name}", (player, data) => { /* code */ });`;
        } else {
            
            const responseBody = await handler(player, json.encode(body));
            return {
                requestId: event.requestId,
                json: encodeToJson({
                    ok: true,
                    body: responseBody.Body
                })
            };
        }

    } catch (error) {
        log.error(`Handler produced an error. Error: ${"" + error}`);

        return {
            requestId: event.requestId,
            json: encodeToJson({
                ok: false
            })
        };
    }
}
