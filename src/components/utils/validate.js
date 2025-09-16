export function validateFirstname(rule,value,callback){
    if(value ===''){
        callback(new Error('Please input firstname'))
    }else{
        callback();
    }
}

export function validateLastname(rule,value,callback){
    if(value ===''){
        callback(new Error('Please input lastname'))
    }else{
        callback();
    }
}


export function validatePassword(rule, value, callback) {
    let re=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    if(value ===''){
        callback(new Error('Please input password'));
    }else if(re.test(value)){
       callback();
    }else{
       callback(new Error('Password contains at least numbers and letters, length 6-20'));
    }
}
export function validateCheckPass(rule, value, callback) {
    if (value === '') {
      callback(new Error('Please input password again'));
    } else {
      callback();
    }
  }


export function checkMai(rule, value, callback) {
  let re = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (value === '') {
    callback(new Error('Please input email'));
  } else if (re.test(value)) {
    callback();
  } else {
    callback(new Error('Please enter the correct email'));
  }
}

export function checkEmail(src) {
    let re = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (re.test(src)) {
      return true;
    } else {
      return false;
    }
  }

  export function validateCourse_code(rule,value,callback){
    if(value ===''){
        callback(new Error('Please input Course code'))
    }else{
        callback();
    }
  }
  
  export function validateCourse_name(rule,value,callback){
    if(value ===''){
        callback(new Error('Please input imformation'))
    }else{
        callback();
    }
  }
  
  export function validateDescription(rule,value,callback){
    if(value ===''){
        callback(new Error('Please input description'))
    }else{
        callback();
    }
  }

  export function validateCourse_credit(rule,value,callback){
    let re = /^[0-9]$|^[0-9]{2}$/;
    if (value === '') {
      callback(new Error('Please input Course_credit'));
    } else if (re.test(value)) {
      callback();
    } else {
      callback(new Error('Please enter the correct credit, Can only enter numbers'));
    }
  }
  
  export function validateScore(rule,value,callback){
    let re = /^([1-9][0-9]?|100)$/;
    if (value === '') {
      callback(new Error('Please input Assignment Score'));
    } else if (re.test(value)) {
      callback();
    } else {
      callback(new Error('Please enter the correct score, only scores between 1-100 can be entered.'));
    }
  }
  