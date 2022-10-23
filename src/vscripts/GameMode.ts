import { reloadable } from "./lib/tstl-utils";
import { decodeFromJson, encodeToJson, sendRequest } from "./utils";

declare global {
    interface CDOTAGameRules {
        Addon: GameMode;
    }
}

const SERVER_BASE_URL = "http://localhost:3000";

@reloadable
export class GameMode {
    players: PlayerID[] = [];

    public static Precache(this: void) {}

    public static Activate(this: void) {
        GameRules.Addon = new GameMode();
    }

    constructor() {
        this.Configure();
        ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);
        ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        CustomGameEventManager.RegisterListener("httpRequest", async (_, eventData) => {
            print(`[REQUEST][PLAYER = ${eventData.PlayerID}] ${eventData.method}/${eventData.url}`);

            const player = PlayerResource.GetPlayer(eventData.PlayerID);
            if (!player) {
                print(`Event httpRequest ignored because player with id ${eventData.PlayerID} was not found`);
                return;
            }

            const response = await sendRequest(
                eventData.PlayerID,
                eventData.method,
                eventData.url,
                eventData.params != undefined ? decodeFromJson(eventData.params) : []
            );
            if (!response) return;

            CustomGameEventManager.Send_ServerToPlayer(player, "httpResponse", {
                requestId: eventData.requestId,
                json: encodeToJson({
                    ok: true,
                    body: response
                })
            });
            return;
        });
    }

    private LongPolling(playerId: PlayerID) {
        print(`Player ${playerId} is subscribing ...`);
        sendRequest(playerId, "POST", `${SERVER_BASE_URL}/subscribe`)
            .then(response => {
                const parsedBody: ServerUpdate = decodeFromJson(response.Body as unknown as Json<ServerUpdate>);
                const clientResponse = encodeToJson({
                    payload: parsedBody.payload,
                    eventName: parsedBody.eventName
                });

                print("Dota server has received an update from server");

                if (parsedBody.informAll) {
                    CustomGameEventManager.Send_ServerToAllClients("stateUpdate", {
                        json: clientResponse
                    } as never);
                } else {
                    const player = PlayerResource.GetPlayer(playerId);
                    if (player) {
                        CustomGameEventManager.Send_ServerToPlayer(player, "stateUpdate", {
                            json: clientResponse
                        } as never);
                    } else {
                        print(`Trying to send a message, but Player ${playerId} wasn't found`);
                    }
                }
            })
            .catch(() => {
                print(`Player ${playerId} couldn't connect, trying again in 3 seconds...`);
            })
            .finally(() => {
                Timers.CreateTimer(3.0, () => {
                    this.LongPolling(playerId);
                });
            });
    }

    private Configure(): void {
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 1);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 1);
        GameRules.SetHeroSelectionTime(0);
        GameRules.SetCustomGameSetupAutoLaunchDelay(0);
        GameRules.SetPreGameTime(0.0);
        GameRules.SetStrategyTime(0);
        GameRules.SetShowcaseTime(0);
        GameRules.SetPostGameTime(0);
        GameRules.SetShowcaseTime(0);

        const gameMode = GameRules.GetGameModeEntity();
        gameMode.SetCustomGameForceHero("npc_dota_hero_wisp");
        gameMode.SetDaynightCycleDisabled(true);
        gameMode.SetAnnouncerDisabled(true);
    }

    public OnStateChange(): void {
        const state = GameRules.State_Get();

        if (state == GameState.CUSTOM_GAME_SETUP) {
            // Need to wait a frame otherwise player in tools doesn't connect
            Timers.CreateTimer(() => {
                for (let index = 0; index < 64; index++) {
                    if (PlayerResource.IsValidPlayerID(index)) {
                        this.RegisterPlayer(index);
                    }
                }
            });
        }
    }

    private RegisterPlayer(playerId: PlayerID) {
        const name = PlayerResource.GetPlayerName(playerId);
        print(`Registering player ${playerId}: ${name} ...`);
        this.players.push(playerId);
        this.LongPolling(playerId);
    }

    public Reload() {
        print("Script reloaded!");
    }

    private OnNpcSpawned(event: NpcSpawnedEvent) {
        const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC;
        unit.RemoveSelf();
    }
}
