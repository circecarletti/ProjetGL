const regexStringFormulaForName = 
    `^[^- .,0-9_\\/\\\\;\\t\\r\\n\\f^@#~|%*$][^0-9_\\/\\\\;\\t\\r\\n\\f^@#~|%*$]*[^0-9_\\/\\\\;\\s\\-,^@#~|%*$]$`;

const regexStringFormulaForBalance = `^[1-9][0-9]*[\\.]{0,1}[0-9]{0,2}$`;

const regexStringFormulaForAge = `^[1-9][0-9]*$`;

const manageValidityMessage =
    function(element, message) {
        if (element) {
            element.setCustomValidity('');
            if (!element.validity.valid) {
                element.setCustomValidity(message);
                element.reportValidity();
            } else {
                element.setCustomValidity('');
                element.reportValidity();
            }
        }
    };

const positiveNumberDecimalCheck = function(number, nbOfDecimal) {
        return !Number.isNaN(number) &&     // Doit être un nombre
                number > 0 &&               // Positif
                (number * Math.pow(10, nbOfDecimal) % 1 === 0); // Le modulo (reste de la division) par 1 
                                                                // vaut 0 si le nombre a nbDecimal decimales
                                                                // puisqu'on le multiplie par 10^nbDecimals
    };

export {
    regexStringFormulaForName,
    regexStringFormulaForBalance,
    regexStringFormulaForAge,
    manageValidityMessage,
    positiveNumberDecimalCheck
};
