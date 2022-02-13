import "./lib/timers";
import { GameMode } from "./GameMode";

Object.assign(getfenv(), {
    Activate: GameMode.Activate,
    Precache: GameMode.Precache,
});

if (GameRules.addon) {
    // This code is only run after script_reload, not at startup
    GameRules.addon.Reload();
}
