function toggleFocus(focus, elements) {
    for (let element in elements) {
        let focused = elements[element].hasClass("focus-colors"); //If the current element is focused or not
        if (focus == focused) 
            continue; //If the element already matches the desired focus, move onto next
        elements[element].toggleClass("focus-colors");
    }
}

function errorIndicated(mainElement, messageElement = null) {
    let mainElementError = mainElement.hasClass("error");
    if (messageElement != null){
        let messageElementError = !messageElement.hasClass("none");
        return mainElementError && messageElementError;
    }
    return mainElementError;
}

function successIndicated(element) {
    let success = element.hasClass("good");
    return success;
}

function validInput(inputName, inputValue, strict = false) {
    let info = [];

    if (inputName == "First_Name" || inputName == "Last_Name") {
        //The name is valid if it contains only alphabetical characters, spaces, dashes, and/or an apostrophe
        let invalidNameRegex = /[^A-Za-z '-]/;
        info = [!invalidNameRegex.test(inputValue), inputHasLength(cutBlanks(inputValue))];
    }
    else if (inputName == "Email_Address") {
        //I got this from StackOverflow
        let validMailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        info = [validMailRegex.test(inputValue), inputHasLength(inputValue)];
    }
    else if (inputName == "Phone_Number") {
        //The format should be 000-000-0000
        let validPhoneRegex = /^[0-9]{3,3}-[0-9]{3,3}-[0-9]{4,4}$/;
        info = [validPhoneRegex.test(inputValue), inputHasLengthOf(inputValue, 12)];
    }
    else if (inputName == "VIN") {
        //A VIN does not have the letters O, I, or Q, and it usually has a length of 17 characters
        let invalidVINRegex = /[^\w]/i;
        let invalidSpecialCharacters = /[OIQ]/i;
        info = [!invalidVINRegex.test(inputValue) && !invalidSpecialCharacters.test(inputValue) && noBlanks(inputValue),  inputHasLengthOf(inputValue, 17)];
    }
    else if (inputName == "Username") {
        info = [noBlanks(inputValue), inputHasLength(cutBlanks(inputValue)), !stringWithin(usedUsernames, inputValue)];
    }
    else if (inputName == "Password") {
        //If I ever come back here, I would split the passwod regex into four instead of trying to combine it into a confusing regex
        let passwordRegex = /(?=.*[a-z]{1,})(?=.*[A-Z]{1,})(?=.*[0-9]{1,})/g;
        info = [passwordRegex.test(inputValue) && cutBlanks(inputValue).length >= 5 && noBlanks(inputValue)];
    }
    else if (inputName == "Car_Make") {
        info = [stringWithin(CAR_MAKE, inputValue)]
    }
    else if (inputName == "Car_Model") {
        info = [carModels.includes(inputValue)];
    }
    else if (inputName == "Model_Year") {
        info = [parseInt(inputValue) >= MIN_YEAR && parseInt(inputValue) <= MAX_YEAR]
    }

    if (strict) 
        return [!info.includes(false), info];
    return info[0];
}

function inputHasLength(string) {
    return string.trim().length > 0;
}

function inputHasLengthOf(string, len) {
    return string.trim().length == len;
}

function cutBlanks(str) {
    return str.replace(/\s/g, "");
}

function noBlanks(str) {
    let whitespaceRegex = /[\s]/;
    return !whitespaceRegex.test(str)
}

function indicateError(inputElement, spanElement = null, message = null, imageElement = null, image = null) {
    //Input
    toggleClass(true, "error", inputElement);

    //Span Element & Message
    if (spanElement != null) {
        toggleClass(false, "hidden", spanElement);
        if (message != null) spanElement.text(message);
    }

    //Image Element
    if (imageElement != null && image != null) {
        if (imageElement.css("visibility") == "hidden") imageElement.css("visibility", "initial");
        imageElement.attr("src", image);
    }
}

function indicateSuccess(inputElement, spanElement = null, message = null, imageElement = null, image = null) {
    //Input
    toggleClass(false, "error", inputElement);
    toggleClass(true, "good", inputElement);

    //Span Element & Message
    if (spanElement != null) {
        toggleClass(true, "hidden", spanElement);
        if (message != null) spanElement.text(message);
    }

    //Image Element
    if (imageElement != null && image != null) {
        imageElement.attr("src", image);
    }
}

function removeIndicators(inputElement, spanElement = null, message = null, imageElement = null) {
    //Input
    toggleClass(false, "error", inputElement);

    //Span Element & Message
    if (spanElement != null) {
        toggleClass(true, "hidden", spanElement);
        if (message != null) spanElement.text(message);
    }

    //Image Element
    if (imageElement != null)
        imageElement.css("visibility", "hidden");
}

function updatePasswordRequirements(value) {
    //A password must have at least 5 characters, at least 1 number, at least 1 uppercase letter, and at least 1 lowercase letter
    if (value.length > 0) {
        //Regexes
        let numberRegex = /[0-9]/g;
        let uppercaseLetterRegex = /[A-Z]/g;
        let lowercaseLetterRegex = /[a-z]/g;
        //Boolean stats, I am aware this can be condensed w/ the bools array, but I am not doing so because readability!
        let hasNumber = numberRegex.test(value);
        let hasUppercaseLetter = uppercaseLetterRegex.test(value);
        let hasLowercaseLetter = lowercaseLetterRegex.test(value);
        let hasMinimumLength = cutBlanks(value).length >= 5;

        let bools = [hasNumber, hasUppercaseLetter, hasLowercaseLetter, hasMinimumLength];
        let classes = ["req-number", "req-uppercase", "req-lowercase", "req-length"];

        for (let i = 0; i < 4; i++) {
            let identifier = ".password-req > div." + classes[i];
            let image = $(identifier).children("img");
            let text = $(identifier).children("p");

            if (bools[i]) {
                image.attr("src", smallCheckPNG);
                //No emphasis needed
                if (text.hasClass("emphasis")) text.toggleClass("emphasis");
            }
            else {
                image.attr("src", smallExclamationPNG);
                //Emphasis needed
                if (!text.hasClass("emphasis")) text.toggleClass("emphasis");
            }
        }
    }
    else {
        //Reset to dashes
        $(".password-req > div").each(function() {
            $(this).children("img").attr("src", smallDashPNG);
            if ($(this).children("p").hasClass("emphasis")) $(this).children("p").toggleClass("emphasis");
        })
    }
}

function indicatePasswordError(pNum, errorMessage) {
    let identifier = ".P" + pNum + "[type='password']";
    let inputElement = $(identifier).parent().children("input");
    let errorElement = $(identifier).parent().parent().children("span.error");
    let imageElement = $(identifier).parent().children("img");
    indicateError(inputElement, errorElement, errorMessage, imageElement, wrongPNG);
}

function indicatePasswordSuccess(pNum) {
    let identifier = ".P" + pNum + "[type='password']";
    let inputElement = $(identifier).parent().children("input");
    let errorElement = $(identifier).parent().parent().children("span.error");
    let imageElement = $(identifier).parent().children("img");
    indicateSuccess(inputElement, errorElement, null, imageElement, checkmarkPNG);
}

function removePasswordIndicators(pNum) {
    let identifier = ".P" + pNum + "[type='password']";
    let inputElement = $(identifier).parent().children("input");
    let errorElement = $(identifier).parent().parent().children("span.error");
    let imageElement = $(identifier).parent().children("img");
    let insecure = $(identifier).parent().children(".hidden-password").hasClass("none");
    let secure = $(identifier).parent().children(".visible-password").hasClass("none");
 
    //Reset
    if (insecure) imageElement.attr("src", unlockPNG); //Letters already showing, so reset back to the unlocked image
    else if (secure) imageElement.attr("src", lockPNG); //Dots showing, so reset back to the locked image
    removeIndicators(inputElement, errorElement, null, null);
}

function passwordErrorIndicated(pNum) {
    return errorIndicated($(".P" + pNum + "[type='password']"));
}

function passwordSuccessIndicated(pNum) {
    return successIndicated($(".P" + pNum + "[type='password']"));
}

function updatePasswords(P1, P2) {
    let P1showing = P2.hasClass("none");
    let P2showing = P1.hasClass("none");

    if (P1showing) 
        P2.val(P1.val());
    else if (P2showing)
        P1.val(P2.val());
}