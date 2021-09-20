"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayAgainStatus = exports.GameServiceActionTypes = exports.Players = void 0;
var Players;
(function (Players) {
    Players["X"] = "X";
    Players["O"] = "O";
})(Players = exports.Players || (exports.Players = {}));
var GameServiceActionTypes;
(function (GameServiceActionTypes) {
    GameServiceActionTypes["SPECTATOR_JOIN"] = "SpectatorJoin";
    GameServiceActionTypes["PLAYER_MOVE"] = "PlayerMove";
})(GameServiceActionTypes = exports.GameServiceActionTypes || (exports.GameServiceActionTypes = {}));
var PlayAgainStatus;
(function (PlayAgainStatus) {
    PlayAgainStatus["PENDING_RESPONSE"] = "PendingResponse";
    PlayAgainStatus["PENDING_REQUEST"] = "PendingRequest";
    PlayAgainStatus["ACCEPTED"] = "Accepted";
    PlayAgainStatus["REJECTED"] = "Rejected";
})(PlayAgainStatus = exports.PlayAgainStatus || (exports.PlayAgainStatus = {}));
