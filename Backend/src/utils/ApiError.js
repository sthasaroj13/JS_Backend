// this code is coded  to handle the error in api is error came in api 
// which will be easy to debug when there will be error 
//  here  i  inherit   the Error class which is allready inbuilt   in js  then i create a constuctor
//which have statusCode and others  parameter  to  then i create super function super function is a kind a function
// which  is present in parent class 


class ApiError extends Error{
    constructor(
        statusCode,
        message= 'something went wrong',
        errors =[],
        stack =''
    ){
        super(message)
        this.statusCode= statusCode
        this.data = null
        this.message= message
        this.success =false
        this.errors=errors
    
// here check the stack 
        if(stack){
            this.stack=stack

        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
       
    }
}
export {ApiError}
// const apiError = new ApiError();
// console.log(apiError);