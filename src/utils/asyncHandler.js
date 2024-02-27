
const asyncHandler = (reqHandler) =>(req,res,next)=>{
   Promise.resolve(reqHandler(req,res,next))
    .catch((err)=>next(err))

}
export default asyncHandler









// const asyncHandler = (requestHanlder) => async(res,req,next)=>{

//     try {
// await requestHanlder(res,req,next)
        
//     } catch (error) {
//         res.status(error.code ||500).json({
//             sucess:false,
//             message:error.message
//         })
        
//     }

// }