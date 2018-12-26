import { DataConnection } from "peerjs";

export interface DataFromClient {
    x_pos: number
    y_pos: number
}

export interface DataFromServer {
    [key: string]: {
        x_pos: number
        y_pos: number
    }
}

export interface GameState {
    [key: string]: {
        x_pos: number
        y_pos: number
    }
}

export interface ClientGameState {
    x_pos: number
    y_pos: number
}

export interface IConnections {
    [propName: string]: DataConnection
}


export type Handshake = string