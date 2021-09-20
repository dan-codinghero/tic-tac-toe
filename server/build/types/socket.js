"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEvents = exports.RoomEvents = void 0;
var RoomEvents;
(function (RoomEvents) {
    RoomEvents["Create"] = "room:create";
    RoomEvents["Created"] = "room:created";
    RoomEvents["CreateError"] = "room:create_error";
    RoomEvents["Join"] = "room:join";
    RoomEvents["Joined"] = "room:joined";
    RoomEvents["JoinError"] = "room:joined_error";
    RoomEvents["Update"] = "room:update";
    RoomEvents["Exit"] = "room:exit";
    RoomEvents["ExitError"] = "room:exit_error";
    RoomEvents["Exited"] = "room:exited";
})(RoomEvents = exports.RoomEvents || (exports.RoomEvents = {}));
var GameEvents;
(function (GameEvents) {
    GameEvents["Update"] = "game:update";
    GameEvents["RequestUpdateOnJoin"] = "game:request_update_on_join";
    GameEvents["SendUpdateToJoinee"] = "game:send_update_to_joinee";
    GameEvents["End"] = "game:end";
    GameEvents["Restart"] = "game:restart";
    GameEvents["RestartAccepted"] = "game:restart:accepted";
})(GameEvents = exports.GameEvents || (exports.GameEvents = {}));
