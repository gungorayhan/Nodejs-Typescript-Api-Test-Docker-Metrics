import  express ,{Request,Response} from "express";
import deserializeUser from "../middleware/deserializeUser";
import routes from "../routes";
import responseTime from "response-time"
import { restResponseTmeHistogram } from "./metrics";
import config from "config"

function createServer(){
    const app= express();
    
    app.use(express.json())

    app.use(deserializeUser)

    app.use(responseTime((req:Request,res:Response,time:number)=>{
        if(req?.route?.path){
            restResponseTmeHistogram.observe({
                method:req.method,
                route:req.route.path,
                status_code:res.statusCode
            },time*1000)
        }
    }))

    routes(app)

    return app;
}

export default createServer