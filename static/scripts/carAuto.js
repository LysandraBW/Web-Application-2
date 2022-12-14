//AJAX, AUTO-COMPLETION, VIN DECODING

const CAR_MAKE = [
    'Toyota',
    'Honda',
    'Chevrolet',
    'Ford',
    'Mercedes-Benz',
    'Jeep',
    'BMW',
    'Porsche',
    'Subaru',
    'Nissan',
    'Cadillac',
    'Volkswagen',
    'Audi',
    'Ferrari',
    'Volvo',
    'Jaguar',
    'GMC',
    'Buick',
    'Acura',
    'Dodge',
    'Hyundai',
    'Lincoln',
    'Lexus',
    'Mazda',
    'Land Rover',
    'Tesla',
    'Ram Trucks',
    'Kia',
    'Chrysler',
    'Infiniti',
    'Mitsubishi',
    'Maserati',
    'Fiat',
    'Mini',
    'Alfa Romeo',
    'Suzuki',
]

let carModels = [];

const MIN_YEAR = 1981;
const MAX_YEAR = 2022;

$(document).ready(function() {
    loadCarMakes();
    loadModelYears();

    //When a valid VIN is entered, we will decode it
    $("input[name='VIN']").on("input", function(){
        let name = 'VIN';
        let value = $(this).val();
        let valid = validInput(name, value, false);
        if (valid && $(this).val().length == 17) {
            decodeVIN($(this).val());
        }
    })

    //If a make is chosen or a different one is selected, we are to update the listed models
    $("select#Car_Make").change(function(){
        updateModels(selectedValue("Car_Make"));
    })
});

function loadCarMakes() {
    CAR_MAKE.sort();
    for (let m = 0; m < CAR_MAKE.length; m++) {
        let make = CAR_MAKE[m];
        let standardizedMake = make.toUpperCase();
        $("select#Car_Make").append(`<option value="${standardizedMake}">${make}</option>`);
    }
}

function loadModelYears() {
    for (let year = MAX_YEAR; year >= MIN_YEAR; year--) {
        $("select#Model_Year").append(`<option value="${year}">${year}</option>`);
    }
}

function selectedValue(selectName) {
    let select = document.getElementById(selectName);
    return select.options[select.selectedIndex].text;
}

function updateModels(carMake, selectModel = "") {
    let makeModels;
    let models = new XMLHttpRequest();
    models.open("GET", `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${carMake}?format=json`);
    models.onload = function()
    {
        makeModels = JSON.parse(models.responseText).Results;
        clearCarModels();
        for (let model = 0; model < makeModels.length; model++) {
            let m = makeModels[model].Model_Name;
            $("select#Car_Model").append(`<option value="${m}">${m}</option>`)
            carModels.push(m);
        }

        if (selectModel != "") {
            let models = document.getElementById("Car_Model");
            models.value = selectModel;
        }
    }
    models.send();
    
}

function clearCarModels() {
    //Removing previous car models
    $("select#Car_Model > option").each(function(index, element) {
        if ($(element).attr("disabled") != "disabled") {
            $(element).remove();
            return false;
        }
    });
    carModels = [];
}

function decodeVIN(VIN, modelYear = "b") {
    let aggData = new XMLHttpRequest();
    aggData.open("GET", `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${VIN}?format=json&modelyear=${modelYear}`)
    aggData.onload = function() {
        const INFO = JSON.parse(aggData.responseText).Results[0];
        let make = INFO.Make;
        let model = INFO.Model;
        let year = INFO.ModelYear;
        autofill(make, model, year);
    }
    aggData.send();
}

function autofill(make, model, year) {
    //Select make
    if (optionInSelect(make, "Car_Make")) {
        let makes = document.getElementById("Car_Make");
        makes.value = make;
        let makesQuery = $("select[name='Car_Make']");
        removeIndicators(makesQuery, makesQuery.parent().children("span.error"), null, null);
    }
    //Update models and select model
    if (model != "Not Applicable" && model.length > 0) {
        updateModels(make, model);
        let modelsQuery = $("select[name='Car_Model']");
        removeIndicators(modelsQuery, modelsQuery.parent().children("span.error"), null, null);
    }
    //Select year
    yearNum = parseInt(year);
    if (yearNum >= MIN_YEAR && yearNum <= MAX_YEAR)    {
        let years = document.getElementById("Model_Year");
        years.value = year;
        let yearsQuery = $("select[name='Model_Year']");
        removeIndicators(yearsQuery, yearsQuery.parent().children("span.error"), null, null);
    }
}

function optionInSelect(option, selectID) {
    let found = false;
    let modOption = option.toUpperCase().trim();
    $("select#" + selectID + " > option").each(function(index, element) {
        if ($(element).val().toUpperCase().trim() === modOption) {
            found = true;
            return false;
        }
    });
    return found;

}

