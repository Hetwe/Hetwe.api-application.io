const form = document.getElementById('main-form');
const fullName = document.getElementById('full-name');



fullName.addEventListener('input', event => {
    let valueFullName = fullName.value.trim();
    if(checkFullName(valueFullName)){
        setSuccessState(fullName);
    }//else{
    //     setErrorState(fullName, 'ФИО не может быть пустым');
    // }
});

form.addEventListener('submit', event => {
    let valueFullName = fullName.value.trim();
    if(!checkFullName(valueFullName)){
        event.preventDefault();
        setErrorState(fullName, 'ФИО не может быть пустым');
    }
});

function checkFullName(input){
    if(input === ''){
        return false;
    }else{
        return true;
    }
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