import { csRequestHandler, parseAndHandleCustomRequest } from "./cs_requests";
import { reloadable } from "./lib/tstl-utils";
import { decodeFromJson, encodeToJson, registerEventListener, sendRequest } from "./utils";

declare global {
    interface CDOTAGamerules {
        addon?: GameMode;
    }
}

const SERVER_BASE_URL = "http://localhost:3000";

@reloadable
export class GameMode {
    players: PlayerID[] = [];

    public static Precache(this: void) {
    }

    public static Activate(this: void) {
        GameRules.addon = new GameMode();
    }

    constructor() {
        this.Configure();
        ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);
        ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
        
        //This links requests with the "csRequestHandler" handler
        //When a csRequestHandler returns something, we fire the "customResponse" event
        //So the client can manage it like an async call
        registerEventListener("customRequest", async (player, event) => {
            const response = await parseAndHandleCustomRequest(player.GetPlayerID(), event);
            if (!response) return;

            CustomGameEventManager.Send_ServerToPlayer(player, "customResponse", response);
            return undefined;
        });

        csRequestHandler("nextPhase", async id => {
            const response = await sendRequest("POST", `${SERVER_BASE_URL}/action`, [
                ["playerId", id.toString()],
                ["eventName", "nextPhase"]
            ])

            return response as unknown as Json<ServerUpdate>;
        })
        
        csRequestHandler("previousPhase", async id => {
            const response = await sendRequest("POST", `${SERVER_BASE_URL}/action`, [
                ["playerId", id.toString()],
                ["eventName", "previousPhase"]
            ])

            return response as unknown as Json<ServerUpdate>;
        })
    }

    private LongPolling(playerId: PlayerID) {
        print(`Player ${playerId} is subscribing ...`)
        sendRequest("POST", `${SERVER_BASE_URL}/subscribe`, [
            ["playerId", playerId.toString()],
        ])
            .then((response) => {
                const parsedBody: ServerUpdate = decodeFromJson(response.Body as unknown as Json<ServerUpdate>);
                const clientResponse = encodeToJson({ 
                    payload: parsedBody.payload,
                    eventName: parsedBody.eventName 
                });

                print("Dota server has received an update from server");

                if(parsedBody.informAll){
                    CustomGameEventManager.Send_ServerToAllClients("stateUpdate", {
                        json: clientResponse
                    } as never);
                } else {
                    const player = PlayerResource.GetPlayer(playerId);
                    if(player){
                        CustomGameEventManager.Send_ServerToPlayer(player, "stateUpdate", {
                            json: clientResponse,
                        } as never);
                    } else {
                        print(`Trying to send a message, but Player ${playerId} wasn't found`)
                    }
                }
            }).catch(() => {
                print(`Player ${playerId} couldn't connect, trying again in 3 seconds...`)
            }).finally(() => {
                Timers.CreateTimer(3.0, () => {
                    this.LongPolling(playerId);  
                })
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

    private RegisterPlayer(playerId: PlayerID){
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
