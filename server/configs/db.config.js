import mongoose from "mongoose";
import { config} from 'dotenv'

config()
export const connection = mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
