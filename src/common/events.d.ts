/**
 * This file contains types for the events you want to send between the UI (Panorama)
 * and the server (VScripts).
 *
 * IMPORTANT:
 *
 * The dota engine will change the type of event data slightly when it is sent, so on the
 * Panorama side your event handlers will have to handle NetworkedData<EventType>, changes are:
 *   - Booleans are turned to 0 | 1
 *   - Arrays are automatically translated to objects when sending them as event. You have
 *     to change them back into arrays yourself! See 'toArray()' in src/panorama/hud.ts
 */

// To declare an event for use, add it to this table with the type of its data

//Custom requests. The type means [INPUT, OUTPUT]
interface CSRequests {
    previousPhase: [Nothing, CScriptHTTPResponse];
    nextPhase: [Nothing, CScriptHTTPResponse];
}

/**
 * Regular client-server events, except with proper type conversions
 *
 * Declare as
 * interfaces SCMessages {
 *     messageName: body
 * }
 */
 interface SCMessages {
    stateUpdate: {
        eventName: string;
        payload: {
            state: {
                phase: number
            }
        }
    }
 }

interface CustomGameEventDeclarations {
    customRequest: CustomRequest<keyof CSRequests>;
    customResponse: CustomResponse;
    customClientMessage: CustomMessage<keyof SCMessages>;
    stateUpdate: {
        json: Json<unknown>
    }
}
interface CustomRequest<T extends keyof CSRequests> {
    name: keyof CSRequests;
    requestId: number;
    json: Json<CSRequests[T][0]>;
}

interface CustomResponse {
    requestId: number;
    json: Json<CustomResult> | Json< {
        ok: true;
        body: string;
    }>;
}

interface CustomMessage<T extends keyof SCMessages> {
    name: T;
    json: Json<SCMessages[T]>;
}

type CustomResult =
    | {
          ok: true;
          body: CSRequests[keyof CSRequests][1];
      }
    | {
          ok: false;
      };