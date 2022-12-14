function toggleDisplay(display, elements) {
    for (let element in elements) {
        let displayed = !elements[element].hasClass("none"); //If the current element is focused or not
        if (display == displayed) 
            continue; //If the element already matches the desired focus, move onto next
        elements[element].toggleClass("none");
    }
}

function toggleClass(state, elementClass, element) {
    if (element.hasClass(elementClass) == state)
        return;
    element.toggleClass(elementClass);
}

function stringWithin(array, str) {
    result = array.some(element => {return element.toLowerCase() == str.toLowerCase();});
    return result;
}
