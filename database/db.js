
import mongoose from "mongoose";


const connectDatabase = async () => {
   try {
    await mongoose.connect(process.env.DB)
    console.log("database connected");
   }
   catch(err) {
     console.log(err)
   }
}
 

export default connectDatabase