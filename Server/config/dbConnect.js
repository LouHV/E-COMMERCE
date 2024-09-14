const { default: mongoose } = require("mongoose");
const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_DB}`)
        console.log('DB connection is succcess')
    } catch (error) {
        console.log('DB connection is failed')
        throw new Error(error)
    }
}

module.exports = dbConnect