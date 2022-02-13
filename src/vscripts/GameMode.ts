import { reloadable } from "./lib/tstl-utils";

declare global {
    interface CDOTAGamerules {
        addon?: GameMode;
    }
}

@reloadable
export class GameMode {
    public static Precache(this: void) {
    }

    public static Activate(this: void) {
        GameRules.addon = new GameMode();
    }

    constructor() {
        this.configure();
        ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);
    }

    private configure(): void {
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 1);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 1);
        GameRules.SetHeroSelectionTime(0);
        GameRules.SetCustomGameSetupAutoLaunchDelay(0);
        GameRules.SetPreGameTime(0.0);
        GameRules.SetStrategyTime(0);
        GameRules.SetShowcaseTime(0);
        GameRules.SetPostGameTime(0);
    
        const gameMode = GameRules.GetGameModeEntity();
        gameMode.SetCustomGameForceHero("npc_dota_hero_wisp");
        gameMode.SetDaynightCycleDisabled(true);
        gameMode.SetAnnouncerDisabled(true);

        GameRules.SetShowcaseTime(0);
    }

    public OnStateChange(): void {
        const state = GameRules.State_Get();
        if (state === GameState.CUSTOM_GAME_SETUP) {
            // Automatically skip setup in tools
            if (IsInToolsMode()) {
                Timers.CreateTimer(3, () => {
                    GameRules.FinishCustomGameSetup();
                });
            }
        }

        // Start game once pregame hits
        if (state === GameState.PRE_GAME) {
            Timers.CreateTimer(0.2, () => this.StartGame());
        }
    }

    private StartGame(): void {
        print("Game starting!");
    }

    public Reload() {
        print("Script reloaded!");
    }

    private OnNpcSpawned(event: NpcSpawnedEvent) {
        const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC;
        unit.RemoveSelf();
    }
}
