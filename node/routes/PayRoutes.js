
import express from 'express';
import paypal from '@paypal/checkout-server-sdk'
//import { AlterPass, AlterDrop, getdata } from '../controllers/AlterUserController.js'
const clientId = "AX6LSCECBEJnjWpgp-s9tLOlajcF4Tz_yvQ01E1zx1IbsI8OnGQxl00wcjPWvOMnhUhlBWv4DMbjMQCS"
const clientSecret = "EAgRW4cH4_llsJSCRI7psKB7cGNsEBB2Nznnxo-QdedfyNmZX1WcKW_GI-B5nTAc41GVB6s1KcOZ_b9c"

const environment = new paypal.core.SandboxEnvironment(clientId,clientSecret)
const client = new paypal.core.PayPalHttpClient(environment)

export function POST() {
    return NextResponse.json({
        message : "Pocesando pago"
    })
}


const router = express.Router();

//router.post('/Pass', AlterPass);

export default router;