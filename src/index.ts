require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})

require('./db/mongoose')
import express, { Application } from 'express'
import helmet from 'helmet'
import AuthRoute from './routes/auth'
import RecipeRoute from './routes/recipes'
import MaterialRoute from './routes/materials'
import UnitRoute from './routes/units'
import MenuRoute from './routes/Receipt/menu'
import ReceiptRoute from './routes/Receipt/receipt'

const app: Application = express()
app.use(helmet());
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use(AuthRoute)  // routes relate to authentication
app.use(RecipeRoute) // routes relate to recipe 
app.use(MaterialRoute) // routes relate to material
app.use(UnitRoute) // routes relate to unit
app.use(MenuRoute) // routes relate to menu
app.use(ReceiptRoute);

export default app