const showFormError = (idElement, err) => {
    let errElement = document.getElementById(idElement);
    errElement.value = '';
    errElement.placeholder = err;
    errElement.classList.add('error-form');
}

let formBtn = document.getElementById('btn-form');

let password = document.getElementById('password');
let email = document.getElementById('email');

let formInput = document.getElementsByTagName('input');
for (let input of formInput) {
    input.addEventListener('click', (e)=> {
        e.target.classList.remove('error-form');
    })
}

function validateMyForm() {
     if (password.value.length < 8){
        showFormError('password','קצר מידי - לפחות 8 תוים');
        return false;
    }else if (!email.value.length){
        showFormError('email','נא להקליד כתובת מייל תקינה');
        return false;
    }
    return true;
}