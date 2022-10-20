export {};

declare global {
    interface CDOTA_PanoramaScript_GameEvents {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Subscribe<T extends string | object>(
            pEventName: (T extends string ? T : string) | keyof CustomGameEventDeclarations | keyof GameEventDeclarations,
            funcVal: (event: CustomNetworkedData<GameEvents.InferGameEventType<T, object>>) => void
        ): GameEventListenerID;
    }
}
