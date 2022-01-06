import mongoose, { ConnectOptions } from 'mongoose'

if(!process.env.MONGODB_URL){
    process.exit(1) // exit with a fail code, if not mongodb url is found
}
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    autoIndex: false
} as ConnectOptions)
