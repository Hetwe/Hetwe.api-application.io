const patternEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const patternNumber = new RegExp(/^[1-9]{1}[0-9]*$/);
const patternPassword = new RegExp(/^((?=.*[0-9])+(?=.*[A-Z])+(?=.*[a-z])+(?=[A-Za-z0-9])).{6,12}$/);
const patternPhone = new RegExp(/^\+7[0-9]{10}$/);

const tokenID = '0fb5cd31-6eb4-4fbc-834c-089b2b823c7b';

const isCheckbox = type => ['checkbox'].includes(type);
const isRadio = type => ['radio'].includes(type);

const form = document.getElementById('main-form');
const fullName = document.getElementById('full-name');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
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
        let main = document.getElementsByClassName('page')[0];
        let section = document.createElement('section');
        section.className = 'employee-table';
        let div = document.createElement('div');
        div.className = 'employee-table__wrapper';
        let table = document.createElement('table');
        table.className = 'table';
    
        main.appendChild(section).appendChild(div).appendChild(table);
    
        let thead = document.createElement('thead');
        table.appendChild(thead);
    
        let th = document.createElement('th');
        let td = document.createElement('td');
        let tr = document.createElement('tr');
        
        thead.appendChild(tr);

        th.innerHTML = 'ФИО';
        tr.appendChild(th);
        th = document.createElement('th');
        th.innerHTML = 'Пол';
        tr.appendChild(th);
        th = document.createElement('th');
        th.innerHTML = 'Дата рождения';
        tr.appendChild(th);
        th = document.createElement('th');
        th.innerHTML = 'Телефон';
        tr.appendChild(th);
        th = document.createElement('th');
        th.innerHTML = 'Email';
        tr.appendChild(th);
        th = document.createElement('th');
        th.innerHTML = 'Ссылка на профиль';
        tr.appendChild(th);
        th = document.createElement('th');
        th.innerHTML = 'Пароль';
        tr.appendChild(th);
        th = document.createElement('th');
        th.innerHTML = 'Зарплата';
        tr.appendChild(th);
        th = document.createElement('th');
        th.innerHTML = 'Комментарий';
        tr.appendChild(th);

        let employee = {
            fullName: '',
            gender: '',
            birthday: '',
            phone: '',
            email: '',
            profileUrl: '',
            password: '',
            salary: '',
            comment: ''
        }

        let tbody = document.createElement('tbody');
        table.appendChild(tbody);

        for(let i = 0; i < data.length; i++){
            tr = document.createElement('tr');
            tbody.appendChild(tr);
            for(let j = 0; j < 9; j++){
                td = document.createElement('td');
                for (const key in data[i]) {
                    if(key === 'token' || key === 'id'){
                        continue;
                    }
                    employee[key] = data[i][key];
                }
                td.innerHTML = employee[Object.keys(employee)[j]];
                tr.appendChild(td);
            }
        }
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
        .then(data => {
            console.log(data);
            form.reset();
            window.location.reload();})
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
    }if(!checkPhone(phone)){
        setErrorState(phone, 'Некорректно введен номер телефона');
        isError = true;
    }if(!checkSalary(salary)){
        setErrorState(salary, 'Некорректно указана зарплата');
        isError = true;
    }if(!checkPassword(password)){
        setErrorState(password, 'Требования к паролю\n• от 6 до 12 символов\n• прописные латинские буквы\n• строчные латинские буквы');
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

phone.addEventListener('input', event => {
    if(checkPhone(phone)){
        setSuccessState(phone);
    }else{
        setErrorState(phone, 'Некорректно введен номер телефона')
    }
})

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
        setErrorState(password, 'Требования к паролю\n• от 6 до 12 символов\n• цифры\n• прописные латинские буквы\n• строчные латинские буквы');
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

function checkPhone(phone){
    let valuePhone = phone.value.trim();
    return patternPhone.test(valuePhone);
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
    error.classList.add('employee__form-error');
    if(input === password){
        error.classList.add('employee__form-error-password');
    }
    
}

function setSuccessState(input){
    const parentElement = input.parentElement;
    const error = parentElement.querySelector('span');
    error.innerText = '';
    error.className = '';
}