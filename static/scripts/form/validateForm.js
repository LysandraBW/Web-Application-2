const BAD_REQUIREMENT = "Password does not meet requirements.";
const MISMATCH = "Passwords must match.";
const ERROR_MESSAGES = {
    "First_Name": ["Invalid Name", "Must Enter a Name"],
    "Last_Name": ["Invalid Name", "Must Enter a Name"],
    "Email_Address": ["Invalid Email Address", "Must Enter an Email Address"],
    "Phone_Number": ["Invalid Phone #, Format 000-000-0000", "Must Enter a Phone Number"],
    "VIN": ["Invalid VIN", "Must Enter a VIN"],
    "Car_Make": ["Must Select Make"],
    "Car_Model": ["Must Select Model"],
    "Model_Year": ["Must Select Year"],
    "Username": ["Username Taken", "Must Enter a Username"],
    "Password": ["Must Fulfill Requirements", "Passwords Must Match", "Must Enter a Password"]
};
const TAG_NAMES = {
    "Input_Text": ["First_Name", "Last_Name", "Email_Address", "Phone_Number", "VIN", "Username", "Password"],
    "Select": ["Car_Make", "Car_Model", "Model_Year"]
}

$(document).ready(function() {
    //General Inputs
    $("input[type='text']:not(.login, .P1, .P2), input[type='email']").on("input", function() {
        let inputElement = $(this).parent().children("input");
        let imageElement = $(this).parent().children("img");
        let errorElement = $(this).parent().parent().children("span.error");
        
        let inputName = $(this).attr("name");
        let inputValue = $(this).val();
        
        //There's Input
        if (inputValue.length > 0) {
            imageElement.css("visibility", "initial");

            //Valid Input
            if (validInput(inputName, inputValue)) {
                indicateSuccess(inputElement, errorElement, ERROR_MESSAGES[inputName][0], imageElement, checkmarkPNG);
            }
            //Invalid Input
            else {
                indicateError(inputElement, errorElement, ERROR_MESSAGES[inputName][0], imageElement, wrongPNG);
            }
        }
        //No Input
        else {
            removeIndicators(inputElement, errorElement, ERROR_MESSAGES[inputName][0], imageElement);
        }
    });

    //Password Inputs
    $(".visible-password, .hidden-password").not(".login").on("input", function() {

        let visiblePassword = $(this).parent().children(".visible-password");
        let hiddenPassword = $(this).parent().children(".hidden-password");

        updatePasswords(visiblePassword, hiddenPassword);

        let P1value = $(".P1[type='password']").val();
        let P2value = $(".P2[type='password']").val();

        let P1entered = P1value.length > 0;
        let P2entered = P2value.length > 0;

        let P1valid = validInput("Password", P1value);
        let P2valid = validInput("Password", P2value);

        let matching = P1value == P2value;

        updatePasswordRequirements(P1value);

        if (P1entered && !P2entered) {
            if (passwordErrorIndicated(2) || passwordSuccessIndicated(2)) 
                removePasswordIndicators(2); //Resetting the second password's indicators if it has any
            
            if (P1valid)
                indicatePasswordSuccess(1)
            else
                indicatePasswordError(1, ERROR_MESSAGES["Password"][0])
        }
        else if (!P1entered && P2entered) {
            if (passwordErrorIndicated(1) || passwordSuccessIndicated(1)) 
                removePasswordIndicators(1); //Resetting the first password's indicators if it has any
            indicatePasswordError(2, ERROR_MESSAGES["Password"][1]);
        }
        else if (P1entered && P2entered) {
            //Both passwords match; the state of P1 implies the state of P2 and vice versa
            if (matching) {
                if (P1valid) {
                    indicatePasswordSuccess(1);
                    indicatePasswordSuccess(2);
                }
                else {
                    indicatePasswordError(1, ERROR_MESSAGES["Password"][0]);
                    indicatePasswordError(2, ERROR_MESSAGES["Password"][0]);
                }
            }
            //Passwords do not match
            else {
                //If both unequal passwords are valid
                if (P1valid && P2valid) {
                    indicatePasswordError(2, ERROR_MESSAGES["Password"][1]);
                }
                //If the first password of the two unequal passwords is valid
                else if (P1valid && !P2valid) {
                    indicatePasswordError(2, ERROR_MESSAGES["Password"][1]);
                }
                //If the second password is valid, but the first one is not
                else if (!P1valid && P2valid) {
                    indicatePasswordError(1, ERROR_MESSAGES["Password"][0]);
                    indicatePasswordError(2, ERROR_MESSAGES["Password"][1]);
                }
                //If both are invalid
                else if (!P1valid && !P2valid) {
                    indicatePasswordError(1, ERROR_MESSAGES["Password"][0]);
                    indicatePasswordError(2, ERROR_MESSAGES["Password"][1]);
                }
            }
        }
        else {
            //If nothing is entered, there's nothing to do, reset any indicators
            if (passwordErrorIndicated(1) || passwordSuccessIndicated(1)) removePasswordIndicators(1);
            if (passwordErrorIndicated(2) || passwordSuccessIndicated(2)) removePasswordIndicators(2);
        }
    })

    //When the submit button is pressed, we will consider the validity of the input fields. If everything is good, the data will be sent. If not, nothing will be sent.
    $(".input-box#Create_Account > button").click(function(event) {
        let generalInputs = {}, passwordInputs = {};
        let name, value;
        let badForm = false;

        $("input").each(function() {
            name = $(this).attr("name");
            value = $(this).val();

            if (name == "Password") {
                if (passwordInputs.hasOwnProperty(name)) {
                    passwordInputs[name][1] = value;
                }
                else {
                    passwordInputs[name] = [];
                    passwordInputs[name][0] = value;
                }
            }
            else if (name != undefined) {
                generalInputs[name] = value;
            }
        }) 

        $("select").each(function() {
            name = $(this).attr("name");
            value = $(this).val();
            if (name != undefined){
                generalInputs[name] = value;
            }
        })

        for (const name in generalInputs) {
            let validity = validInput(name, generalInputs[name], true);

            if (!validity[0]) {
                badForm = true;
                let identifier, inputElement, errorElement, imageElement;

                if (TAG_NAMES["Input_Text"].includes(name)) {
                    identifier = "input[name='"+name+"']"
                    inputElement = $(identifier);
                    imageElement = inputElement.parent().children("img");
                    errorElement = inputElement.parent().parent().children("span.error");

                    if (generalInputs[name].length > 0)
                        indicateError(inputElement, errorElement, ERROR_MESSAGES[name][0], imageElement, wrongPNG);
                    else
                        indicateError(inputElement, errorElement, ERROR_MESSAGES[name][ERROR_MESSAGES[name].length - 1], imageElement, wrongPNG);
                }
                else if (TAG_NAMES["Select"].includes(name)) {
                    identifier = "select[name='"+name+"']"
                    inputElement = $(identifier);
                    imageElement = null;
                    errorElement = inputElement.parent().children("span.error");

                    indicateError(inputElement, errorElement, ERROR_MESSAGES[name][ERROR_MESSAGES[name].length - 1], imageElement, wrongPNG);
                }
                else {
                    continue;
                }
            }
        }

        for (const prop in passwordInputs) {
            let passwordValue1 = passwordInputs[prop][0];
            let passwordValue2 = passwordInputs[prop][1];
            let validity1 = validInput(prop, passwordValue1, true);
            let validity2 = validInput(prop, passwordValue2, true);

            if (validity1[0] && validity2[0]) continue;

            badForm = true;

            if (passwordValue1.length == 0) indicatePasswordError(1, "Must Enter Password");
            else if (!validity1[0]) indicatePasswordError(1, BAD_REQUIREMENT);

            if (passwordValue2.length == 0) indicatePasswordError(2, "Must Enter Password");
            else if (passwordValue1 != passwordValue2) indicatePasswordError(2, MISMATCH);
        }

        if (badForm) {
            event.preventDefault();
        }
        else {
            $("input[name='Total_Car_Makes']").val(CAR_MAKE.toString());
            $("input[name='Total_Car_Models']").val(carModels.toString());
            $("input[name='Total_Model_Years']").val(MIN_YEAR + " " + MAX_YEAR);
        }
    })

    //When the submit button is pressed (login), we will check if input has been entered
    $(".input-box#Login > button").click(function(event) {
        let hiddenPassword = $(".input-password > .login.hidden-password");
        let visiblePassword = $(".input-password > .login.visible-password");
        updatePasswords(hiddenPassword, visiblePassword);

        let usernameInput = $("input[name='Username'].login");
        let usernameError = usernameInput.parent().parent().children("span");
        let usernameImage = usernameInput.parent().children("img");

        let username = $("input[name='Username'].login").val();
        let password = hiddenPassword.val();

        if (!inputHasLength(username)) {
            indicateError(usernameInput, usernameError, null, usernameImage, wrongPNG);
            event.preventDefault();
        }
        if (!inputHasLength(password)) {
            indicatePasswordError(1, null);
            event.preventDefault();
        }
    })

    $(".login.P1").on("input", function() {
        removePasswordIndicators(1);
    })

    $("input[name='Username'].login").on("input", function() {
        let usernameInput = $(this);
        let usernameError = usernameInput.parent().parent().children("span");
        let usernameImage = usernameInput.parent().children("img");
        removeIndicators(usernameInput, usernameError, null, usernameImage);
    })
})