import { BFElement, BFDocument } from '../types';

export default (() => {

  let hasLock = false;

  const document = window.document as BFDocument;
  const element = document.documentElement as unknown as BFElement;

  if (hasLock) () => { };

  return () => {

    function lockChangeAlert() {
      if (
        document.pointerLockElement === element
        || document.mozPointerLockElement === element
      ) {
        hasLock = true;
        console.log('The pointer lock status is now locked');
      } else {
        hasLock = false;
        console.log('The pointer lock status is now unlocked');
      }
    }

    function lockError() {
      alert("Pointer lock failed");
      hasLock = false;
    }

    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

    document.addEventListener('pointerlockerror', lockError, false);
    document.addEventListener('mozpointerlockerror', lockError, false);

    element.requestPointerLock = element.requestPointerLock ||
      element.mozRequestPointerLock;

    element.requestPointerLock();

    if (!hasLock) {
      hasLock = true;
      window.addEventListener('click', () => {
        if (!hasLock) {
          element.requestPointerLock();
        }
      })
    }
  }
})()
