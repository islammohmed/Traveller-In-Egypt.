export const globalError = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    if(process.env.MODE = 'development'){
        res.status(err.statusCode).json({error: err.message, stack: err.stack})
    }else{
        console.log("bteee5");
        res.status(err.statusCode).json({error: err.message})  
    }
}