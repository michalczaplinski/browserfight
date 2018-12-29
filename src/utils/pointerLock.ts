import { BFElement, BFDocument } from '../types';

export default function addPointerLock(element: BFElement) {

    const document = window.document as BFDocument;

    function lockChangeAlert() {
        if (document.pointerLockElement === element ||
            document.mozPointerLockElement === element) {
            console.log('The pointer lock status is now locked');
        } else {
            console.log('The pointer lock status is now unlocked');
        }
    }

    function lockError() {
        alert("Pointer lock failed");
    }

    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

    document.addEventListener('pointerlockerror', lockError, false);
    document.addEventListener('mozpointerlockerror', lockError, false);

    element.requestPointerLock = element.requestPointerLock ||
        element.mozRequestPointerLock;

    element.addEventListener('click', () => {
        element.requestPointerLock()
    })
}
