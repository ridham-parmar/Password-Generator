// slider
const inputSlider = document.querySelector("[data-lengthSlider]");
// display pass length in digits
const lengthDisplay = document.querySelector("[data-lengthNumber]");
// display password
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
// copy pass button
const copyBtn = document.querySelector("[data-copy]");
// copy message
const copyMsg = document.querySelector("[data-copyMsg]");
// uppercase
const uppercaseCheck = document.querySelector("#uppercase");
// lowercase
const lowercaseCheck = document.querySelector("#lowercase");
// numbers 
const numbersCheck = document.querySelector("#numbers");
// symbols
const symbolsCheck = document.querySelector("#symbols");
// indicator 
const indicator = document.querySelector("[data-indicator]");
// generate password btn
const generateBtn = document.querySelector(".generateButton");
//for all checkboxes
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
// for generating random symbol
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// setting initial values
let password = "";
let passwordLength = 10 ;
let checkCount = 1 ;
handleSlider();
// set the color of indicator as grey
setIndicator("#ccc");
uppercaseCheck.checked = true;


// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    
    
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%" ;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow add karna hain
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}` ;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min ;
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91)) ;
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123)) ;
}

function generateRandomNumber() {
    return getRndInteger(0, 10) ;
}

function generateSymbol() {
    return symbols.charAt(getRndInteger(0, symbols.length)) ;
}

// setting strength
function calcStrength() {
    let isUpper = false ;
    let isLower = false ;
    let isNumber = false ;
    let isSymbol = false ;

    if(uppercaseCheck.checked) {
        isUpper = true ;
    }
    if(lowercaseCheck.checked) {
        isLower = true ;
    }
    if(numbersCheck.checked) {
        isNumber = true ;
    }
    if(symbolsCheck.checked) {
        isSymbol = true ;
    }
 
    // rules
    if(isUpper && isLower && isNumber && isSymbol && passwordLength >= 15) {
        setIndicator("#0f0") ;
    } else if(isUpper && isLower && (isNumber || isSymbol) && passwordLength >=10) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value) ;
        copyMsg.innerText = "Copied" ;
    }
    catch (e) {
        copyMsg.innerText = "Failed to copy" ;
    }
    
    // during css active class add karni hai
    copyMsg.classList.add("active") ;

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000) ;
}

function msgBeforePassGeneration() {
    copyMsg.innerText = "Failed" ;
    copyMsg.classList.add("active") ;

    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);    
}
 
function sufflePassword(array) {
    for(let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i)) ;
        let temp = array[i] ;
        array[i] = array[j] ;
        array[j] = temp;
    }
    let str = "" ;
    array.forEach((element) => {
        str += element ;
    })
    return str ;
}

function handleCheckBoxChange() {
    checkCount = 0 ;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked) {
            checkCount++;
        }
    });

    // special condition 
    if(passwordLength < checkCount) {
        passwordLength = checkCount ;
        handleSlider() ;
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change' , handleCheckBoxChange) ;
})

// event listener on slider
inputSlider.addEventListener('input', function(e) {
    passwordLength = e.target.value ;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(password.length > 0) {
        copyContent() ;
    }
    else {
        msgBeforePassGeneration();
    }

    // or
    // if(passwordDisplay.value) {
    //     copyContent();
    // }
})

generateBtn.addEventListener('click', () => {
    // no any checkbox is selected
    if(checkCount <= 0) {
        // alert('Please check any of the below field');
        return ;
    }

    if(passwordLength < checkCount) {
        passwordLength = checkCount ;
        handleSlider() ;
    }
    
    // setting password to zero everytime we click on generate pass
    password = "" ;

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase() ;
    // }

    // if (lowercaseCheck.checked) {
    //     password += generateLowerCase() ;
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber() ;
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol() ;
    // }

    let funcArr = [] ;

    if(uppercaseCheck.checked) {
        funcArr.push(generateUpperCase) ;
    }
    if(lowercaseCheck.checked) {
        funcArr.push(generateLowerCase) ;
    }
    if(numbersCheck.checked) {
        funcArr.push(generateRandomNumber) ;
    }
    if(symbolsCheck.checked) {
        funcArr.push(generateSymbol) ;
    }
    
    //adding compulsory characters 
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]() ;
    }

    // adding remaining characters 
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length) ;
        password += funcArr[randIndex]() ;
    }

    // shuffling password
    password = sufflePassword(Array.from(password));

    // showing password on UI
    passwordDisplay.value = password ;
   
    // showing stength on UI
    calcStrength();

})




