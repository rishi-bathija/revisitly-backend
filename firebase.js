import admin from "firebase-admin"
import serviceAccount from "./revisitly-firebase-adminsdk-fbsvc-c26155ed52.json" assert { type: "json" };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

export default admin