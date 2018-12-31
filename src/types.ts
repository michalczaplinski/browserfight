import { DataConnection } from "peerjs";
import { Object3D } from 'three';

export interface BFDocument extends Document {
    pointerLockElement?: Element
    onpointerlockchange?: Function
    pointerlockchange?: Event

    mozPointerLockElement?: Element
    onmozpointerlockchange?: Function
    mozpointerlockchange?: Event
}

export interface BFElement extends Element {
    requestPointerLock: Function
    mozRequestPointerLock: Function
}

export interface ClientGameState {
    x: number
    y: number
    z: number
}

export interface GameStateFromServer {
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

export interface BFObject {
    get?: () => Object3D
    update?: () => void
}

export interface IConnections {
    [propName: string]: DataConnection
}

export type HandshakeFromClient = { kind: "Hello from client", id: string }
export function isHandshakeFromClient(event: ServerData): event is HandshakeFromClient {
    return (event as HandshakeFromClient).kind === 'Hello from client'
}

export type HandshakeFromServer = "Hello from server"

export type CreatePlayerEvent = { kind: 'createPlayer', id: string }
export function isCreatePlayerEvent(event: ClientData): event is CreatePlayerEvent {
    return (event as CreatePlayerEvent).kind === 'createPlayer'
}

export type ClientData = GameStateFromServer | HandshakeFromServer | CreatePlayerEvent
export type ServerData = ClientGameState | HandshakeFromClient
