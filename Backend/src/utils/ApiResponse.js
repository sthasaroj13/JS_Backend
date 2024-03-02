class ApiResponse{
    constructor(statusCode,data,message='Success'){
        this.statusCode= statusCode
        this.data=data
        this.message= message
        this.success = statusCode <400

    }
}
export {ApiResponse}
// const apires = new ApiResponse(200)
// console.log(apires.statusCode);