export {};

declare global {
    interface CCustomGameEventManager {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        RegisterListener<T extends string | object>(
            eventName: (T extends string ? T : string) | keyof CustomGameEventDeclarations,
            listener: (
                this: void,
                userId: EntityIndex,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                event: CustomNetworkedData<CCustomGameEventManager.InferEventType<T, object> & { PlayerID: PlayerID }>
            ) => void
        ): CustomGameEventListenerID;
    }
}
