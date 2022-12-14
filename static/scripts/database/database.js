let usedUsernames = []

$(document).ready(function() {
    let input = $("input[name='DB_Usernames'");
    if (input.length != 0)  {
        usedUsernames = input.val().split(",");
    }
    //We were never here
    input.remove();

    input = $("input[name='Account_Not_Found']");
    if (input.length != 0 && input.val() != "{{accountNotFound}}") {
        if (input.val().length > 0) {
            console.log("Value: " + input.val());
            toggleClass(false, "hidden", $(".input-box#Login > span"))
        }
        else
            console.log("No Error");
    }
    //We were never here
    input.remove();
})