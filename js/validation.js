const patternEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const patternNumber = new RegExp(/^[1-9]{1}[0-9]*$/);
const patternPassword = new RegExp(/^(?=.*\d).{6,12}$/);

const form = document.getElementById('main-form');
const fullName = document.getElementById('full-name');
const email = document.getElementById('email');
const salary = document.getElementById('salary');
const password = document.getElementById('password');
const manual = document.getElementById('manual');

fullName.addEventListener('input', event => {
    if(checkFullName(fullName)){
        setSuccessState(fullName);
    }//else{
    //     setErrorState(fullName, 'ФИО не может быть пустым');
    // }
});

email.addEventListener('input', event => {
    if(checkEmail(email)){
        setSuccessState(email);
    }else{
        setErrorState(email, 'Некорректный Email')
    }
});

salary.addEventListener('input', event => {
    if(checkSalary(salary)){
        setSuccessState(salary);
    }else{
        setErrorState(salary, 'Некорректно указана зарплата')
    }
});

password.addEventListener('input', event => {
    if(checkPassword(password)){
        setSuccessState(password);
    }else{
        setErrorState(password, 'Пароль должен быть от 6 до 12 символов');
    }
});

manual.addEventListener('input', event => {
    if(checkManual(manual)){
        setSuccessState(manual);
    }
})

form.addEventListener('submit', event => {
    let valueFullName = fullName.value.trim();
    let valueEmail = email.value.trim();
    let valueSalary = salary.value.trim();
    let valuePassword = password.value.trim();
    if(valueFullName === '' || 
        valueEmail === ''   ||
        valueSalary === ''  ||
        valuePassword === ''||
        !(manual.checked)
    ){
        event.preventDefault();
        console.log(manual.checked);
    }

    if(!checkFullName(fullName)){
        setErrorState(fullName, 'ФИО не может быть пустым');
    }if(!checkEmail(email)){
        setErrorState(email, 'Некорректный Email');
    }if(!checkSalary(salary)){
        setErrorState(salary, 'Некорректно указана зарплата')
    }if(!checkPassword(password)){
        setErrorState(password, 'Пароль должен быть от 6 до 12 символов')
    }if(!checkManual(manual)){
        setErrorState(manual, 'Необходимо согласится с условиями')
    }
});

function checkFullName(fullName){
    let valueFullName = fullName.value.trim();
    if(valueFullName === ''){
        return false;
    }else{
        return true;
    }
}

function checkEmail(email){
    let valueEmail = email.value.trim();
    return patternEmail.test(valueEmail);
}

function checkSalary(salary){
    let valueSalary = salary.value.trim();
    return patternNumber.test(valueSalary)
}

function checkPassword(password){
    let valuePassword = password.value.trim();
    return patternPassword.test(valuePassword)
}

function checkManual(manual){
    return  manual.checked ? true: false;
}

function setErrorState(input, message){
    const formControl = input.parentElement;
    const error = formControl.querySelector('span');
    error.innerText = message;
    error.className = 'employee__form-error';
}

function setSuccessState(input){
    const parentElement = input.parentElement;
    const error = parentElement.querySelector('span');
    error.innerText = '';
    error.className = '';
}