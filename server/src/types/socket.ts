export enum RoomEvents {
    Create = 'room:create',
    Created = 'room:created',
    CreateError = 'room:create_error',
    Join = 'room:join',
    Joined = 'room:joined',
    JoinError = 'room:joined_error',
    Update = 'room:update',

    Exit = 'room:exit',
    ExitError = 'room:exit_error',
    Exited = 'room:exited',
}

export enum GameEvents {
    Update = 'game:update',
    RequestUpdateOnJoin = 'game:request_update_on_join',
    SendUpdateToJoinee = 'game:send_update_to_joinee',
    End = 'game:end',
    Restart = 'game:restart',
    RestartAccepted = 'game:restart:accepted',
}
