import { DataConnection } from "peerjs";
import { Object3D, HemisphereLight } from 'three';

export interface BFDocument extends Document {
    pointerLockElement: HTMLElement
    onpointerlockchange: Function
    pointerlockchange: Event

    mozPointerLockElement: HTMLElement
    onmozpointerlockchange: Function
    mozpointerlockchange: Event
}

export interface BFElement extends HTMLElement {
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

export interface IConnections {
    [propName: string]: DataConnection
}


export interface BFObject {
    get?: () => Object3D
    update?: () => void
}

type HandshakeFromClient = "Hello from client"
type HandshakeFromServer = "Hello from server"

type BFEvent = {
    type: 'createPlayer' | 'destroyPlayer'
    data?: {}
}

export type DataFromServer = GameStateFromServer | HandshakeFromServer | BFEvent
export type DataFromClient = ClientGameState | HandshakeFromClient | BFEvent

export function isBFEvent(event: DataFromClient | DataFromServer): event is BFEvent {
    return (event as BFEvent).data !== undefined
}