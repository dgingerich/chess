
//2D arrays need to be deep copied so that the copied second dimension+ is copied to a new reference
//This function uses recursion to deep copy a >1D array by calling this function on all further dimensions
//Also calls deepCopyObject function to handle deep copying objects
const deepCopy = (array) => {
    let copy = [];

    array.forEach(element => {
        if (Array.isArray(element)) {
            copy.push(deepCopy(element));
        } else if (element !== null && typeof element === 'object') {
            copy.push(deepCopyObject(element));
        } else {
            copy.push(element);
        }
    });

    return copy;
}

const deepCopyObject = (obj) => {
    let objectCopy = {};

    for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            objectCopy[key] = deepCopy(value);
        } else if (typeof value === 'object') {
            objectCopy[key] = deepCopyObject(value);
        } else {
            objectCopy[key] = value;
        }
    }
    return objectCopy;
}

export default deepCopy;