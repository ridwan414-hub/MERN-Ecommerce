const createHttpError = require("http-errors")
const { mongoose } = require("mongoose")

const findingById = async (Model,id, options = {}) => {
    try {
        const item = await Model.findById(id, options)
        if (!item) throw createHttpError(404, `${Model.modelName} does not exist with id: `)

        return item
    } catch (error) {
        if (error instanceof mongoose.Error) {
            throw createHttpError(404, "invalid item id")
        }
        throw error
    }
}
module.exports = { findingById }