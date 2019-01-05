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

export interface Position {
    x: number
    y: number
    z: number
}

export interface ClientGameState {
    position: {
        x: number
        y: number
        z: number
    }
    health: number
}

export interface GameStateFromServer {
    [key: string]: {
        position: {
            x: number
            y: number
            z: number
        }
        health: number
    }
}

export interface GameState {
    [key: string]: {
        position: {
            x: number
            y: number
            z: number
        }
        health: number
    }
}

export interface BFObject {
    id: string;
    get?: () => Object3D
    update?: () => void
}

export interface IConnections {
    [propName: string]: DataConnection
}


export type HandshakeFromServer = "Hello from server"
export type HandshakeFromClient = { kind: "Hello from client", id: string }
export function isHandshakeFromClient(event: ServerData): event is HandshakeFromClient {
    return (event as HandshakeFromClient).kind === 'Hello from client'
}

export type CreatePlayerEvent = { kind: 'createPlayer', id: string }
export function isCreatePlayerEvent(event: ClientData): event is CreatePlayerEvent {
    return (event as CreatePlayerEvent).kind === 'createPlayer'
}

export type DealDamageEvent = { kind: 'dealDamage', from: string, id: string, amount: number }
export function isDealDamageEvent(event: ClientData | ServerData): event is DealDamageEvent {
    return (event as DealDamageEvent).kind === 'dealDamage'
}

export type UpdatePosition = { kind: 'updatePosition', id: string, position: { x: number, y: number, z: number } }
export function isUpdatePosition(event: ClientData | ServerData): event is UpdatePosition {
    return (event as UpdatePosition).kind === 'updatePosition'
}

export type ClientData = HandshakeFromServer | CreatePlayerEvent | DealDamageEvent | UpdatePosition
export type ServerData = HandshakeFromClient | DealDamageEvent | UpdatePosition
