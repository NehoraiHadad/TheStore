const showFormError = (idElement, err) => {
    let errElement = document.getElementById(idElement);
    errElement.value = '';
    errElement.placeholder = err;
    errElement.classList.add('error-form');
}

let firstName = document.getElementById('first-name');
let lastName = document.getElementById('last-name');
let password = document.getElementById('password');
let phone = document.getElementById('phone');
let email = document.getElementById('email');
let formInput = document.getElementsByTagName('input');
for (let input of formInput) {
    input.addEventListener('click', (e)=> {
        e.target.classList.remove('error-form');
    })
}

function validateMyForm() {
    if (firstName.value.length < 3){
        showFormError('first-name','קצר מידי - לפחות 3 תוים');
        return false;
    }else if (lastName.value.length < 3){
        showFormError('last-name','קצר מידי - לפחות 3 תוים');
        return false;
    }else if (password.value.length < 8){
        showFormError('password','קצר מידי - לפחות 8 תוים');
        return false;
    }else if (phone.value.length != 10 || Number(phone)){
        showFormError('phone','נא להקליד מספר תקין');
        return false;
    }else if (!email.value.length){
        showFormError('email','נא להקליד כתובת מייל תקינה');
        return false;
    }
    return true;
}
