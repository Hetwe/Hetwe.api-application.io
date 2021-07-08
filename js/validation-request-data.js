const patternEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const patternNumber = new RegExp(/^[1-9]{1}[0-9]*$/);
const patternPassword = new RegExp(/^(?=.*\d).{6,12}$/);
const tokenID = '0fb5cd31-6eb4-4fbc-834c-089b2b823c7b';

const isCheckbox = type => ['checkbox'].includes(type);
const isRadio = type => ['radio'].includes(type);

const form = document.getElementById('main-form');
const fullName = document.getElementById('full-name');
const email = document.getElementById('email');
const salary = document.getElementById('salary');
const password = document.getElementById('password');
const manual = document.getElementById('manual');

const XHR = new XMLHttpRequest();

function CreateEmployee(body){
    return new Promise((resolve, reject) => {
        XHR.open('POST', 'https://server.edu.inkode.ru/employee/create');
        XHR.setRequestHeader('Content-Type', 'application/json');
        XHR.responseType = 'json';
        XHR.onload = () => {
            if(XHR.status >= 400){
                reject(new Error('Не удалось выполнить запрос'));
            }else{
                resolve(XHR.response);
            }
        }

        XHR.onerror = () => {
            reject(new Error('Не удалось выполнить запрос'));
        }

        XHR.send(JSON.stringify(body));
    })
}

function ListEmployee(){
    return new Promise((resolve, reject) => {
        XHR.open('GET', 'https://server.edu.inkode.ru/employee/list?tokenId=' + tokenID);

        XHR.onload = () => {
            if(XHR.status >= 400){
                reject(new Error('Не удалось выполнить запрос'));
            }else{
                resolve(JSON.parse(XHR.response));
            }
        }
        XHR.onerror = () => {
            reject(new Error('Не удалось выполнить запрос'));
        }

        XHR.send();
    })
}

window.addEventListener('load', event => {
    ListEmployee().then(data => {
        console.log(data);
    }).catch(error => {
        console.log(error.toString());
    })
})

form.addEventListener('submit', event => {
    event.preventDefault();
    if(checkAllInput()){
        return;
    }
    
    console.log(form);

    const {elements} = form;
    const body = {};

    for (let index = 0; index < elements.length; index++) {
        const {name} = elements[index];

        if(name){
            const {value, type, checked} = elements[index];
            if(isRadio(type)){
                continue;
            }
            body[name] = isCheckbox(type) ? checked : value;
        }
    }

    
    const radio = document.getElementsByName('gender');
    for(let index = 0; index < radio.length; index++){
        if(radio[index].checked){
            body['gender'] = radio[index].value;
            break;
        }
    }
    body['tokenId'] = tokenID;
    console.log(body);
    CreateEmployee(body)
        .then(data => console.log(data))
        .catch(error => alert(error.toString()));
});

function checkAllInput(){
    let isError = false;
    if(!checkFullName(fullName)){
        setErrorState(fullName, 'ФИО не может быть пустым');
        isError = true;
    }if(!checkEmail(email)){
        setErrorState(email, 'Некорректный Email');
        isError = true;
    }if(!checkSalary(salary)){
        setErrorState(salary, 'Некорректно указана зарплата');
        isError = true;
    }if(!checkPassword(password)){
        setErrorState(password, 'Пароль должен быть от 6 до 12 символов');
        isError = true;
    }if(!checkManual(manual)){
        setErrorState(manual, 'Необходимо согласится с условиями');
        isError = true;
    }
    return isError;
}


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