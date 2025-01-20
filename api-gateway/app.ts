import express from "express"
import helmet from "helmet"
import { API_GATEWAY_PORT } from "../common/constants"
import cors from "cors"

const app  = express();


//Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

app.listen(API_GATEWAY_PORT,()=>{
    console.log(`✅ API Gateway is running on port ${API_GATEWAY_PORT}`);
})
