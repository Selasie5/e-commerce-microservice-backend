import express from "express";
import { SERVICE_PORTS } from "../../common/constants.ts";
import userRoute from "./routes/userRoute.ts"

const app = express();
app.use(express.json())

app.use("/user",userRoute);




app.listen(SERVICE_PORTS.USER_SERVICE),()=>
{
    console.log(`User service has started running on port ${SERVICE_PORTS.USER_SERVICE}`)
    console.log('User service is listening on port', SERVICE_PORTS.USER_SERVICE)
}
