//These are general functions for form elements
$(document).ready(function() {
    
    $("input[type='text'], input[type='email'], input[type='password'], select").focus(function(){
        //When a text-input is clicked, we're going to show it
        toggleFocus(true, [$(this), $(this).parent().children("span")]);

    })

    $("input[type='text'], input[type='email'], input[type='password'], select").focusout(function(){
        //When a text-input is no longer clicked, we're going unshow it
        toggleFocus(false, [$(this), $(this).parent().children("span")]);

    })

    $(".input-password > img").click(function() {
        //When the password display types are toggled, we must actually toggle the display type, the lock/unlock indicator, and update the values
        let visiblePassElement = $(this).parent().children(".visible-password"); //The visible password element
        let hiddenPassElement = $(this).parent().children(".hidden-password"); //The hidden password element
        let visiblePassShowing = hiddenPassElement.hasClass("none"); 
        let hiddenPassShowing = visiblePassElement.hasClass("none");

        hiddenPassElement.toggleClass("none"); //Switching displays
        visiblePassElement.toggleClass("none"); //Ditto

        //Updating the values
        if (visiblePassShowing)
            hiddenPassElement.val(visiblePassElement.val());
        else if (hiddenPassShowing)
            visiblePassElement.val(hiddenPassElement.val());

        let currentPassword = (visiblePassShowing) ? visiblePassElement : (hiddenPassShowing) ? hiddenPassElement : null;
        let spanElement = $(this).parent().parent().children("span");
        let imageElement = $(this).parent().children("img");
        let noIndicators = !errorIndicated(currentPassword, spanElement) && !successIndicated(currentPassword);

        //If there's no indicators (good/bad), the lock/unlock images will be showing. We are toggling between unlock/lock.
        if (noIndicators) {
            if (hiddenPassShowing) 
                imageElement.attr("src", unlockPNG);
            else if (visiblePassShowing) 
                imageElement.attr("src", lockPNG);
        }

    })

    $(".P1").focus(function() {
        //When the first password box is focused, the password requirement box will appear (accordion animation)
        let container = $(this).parent().parent();
        let box = document.getElementsByClassName("password-req")[0];

        if (box === undefined)
            return;
        
        toggleClass(true, "auto-height", container);
        if (!box.style.maxHeight) box.style.maxHeight = box.scrollHeight + "px";
    })

    $(".P1").focusout(function() {
        //When the first password box is no longer focused, the password requirement box will disappear (accordion style)
        let container = $(this).parent().parent();
        let box = document.getElementsByClassName("password-req")[0];

        if (box === undefined)
            return;

        if (box.style.maxHeight) 
            box.style.maxHeight = null;

        if (container.hasClass("auto-height")) 
            container.css("margin-bottom", "0px");
        
        //We'll revert back, just give me some time
        setTimeout(() => {
            container.toggleClass("auto-height");
            container.css("margin-bottom", "20px");
        }, 200);
    })

    $("select").on("input", function() {
        //So the error messages on the select boxes don't always stay there
        let selectName = $(this).attr("name");
        let selectValue = $(this).val();
        let valid = validInput(selectName, selectValue);
        if (valid) removeIndicators($(this), $(this).parent().children("span.error"), null, null);
        else indicateError($(this), $(this).parent().children("span.error"), null, null);
    })

    $("input[name='VIN']").on("input", function() {
        if ($(this).val().length >= 16) 
            $(this).val($(this).val().substring(0, 17));
    })
});

