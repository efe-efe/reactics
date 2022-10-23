interface HTTPRequest {
    requestId: number;
    url: string;
    PlayerID: CDOTAPlayerController;
    method: string;
    params: Json<[string, string][]> | undefined;
}

type HTTPResponseFromServer = {
    Body: string;
    StatusCode: number;
};

type HTTPResult =
    | {
          ok: true;
          body: HTTPResponseFromServer;
      }
    | {
          ok: false;
          text?: string;
      };

interface HTTPResponse {
    requestId: number;
    json: Json<HTTPResult>;
}

interface CustomGameEventDeclarations {
    httpRequest: HTTPRequest;
    httpResponse: HTTPResponse;
}
