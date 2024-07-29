function Validation(values) {
    let error = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if(values.name === "") {
        error.name = "Por favor, insira um nome!"
    } 

    if(values.email === "") {
        error.email = "Por favor, insira um email!"
    }
    else if(!email_pattern.test(values.email)) {
        error.email = "Email não corresponde aos requisitos: por favor, verifique se possui um '@'!"
    }

    if(values.password === "") {
        error.password = "Por favor, insira uma senha!"
    } 
    
    return error;
}

export default Validation;
