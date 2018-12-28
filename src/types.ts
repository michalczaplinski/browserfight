import { DataConnection } from "peerjs";
import { Object3D, HemisphereLight } from 'three';

export interface DataFromClient {
    x: number
    y: number
    z: number
}

export interface DataFromServer {
    [key: string]: {
        x: number
        y: number
        z: number
    }
}

export interface GameState {
    [key: string]: {
        x: number
        y: number
        z: number
    }
}

export interface IConnections {
    [propName: string]: DataConnection
}


export interface BFObject {
    get?: () => Object3D
    update?: () => void
}

export type Handshake = string
