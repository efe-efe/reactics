import "./lib/timers";
import { GameMode } from "./GameMode";

Object.assign(getfenv(), {
    Activate: GameMode.Activate,
    Precache: GameMode.Precache,
});

if (GameRules.addon) {
    GameRules.addon.Reload();
}
