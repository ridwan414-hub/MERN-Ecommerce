const createHttpError = require("http-errors")
const cloudinary = require("../Config/cloudinary")

const publicIdWithoutExtensionFromUrl = async (imageUrl) => {
    const pathSegments = imageUrl.split('/')
    const lastSegment = pathSegments[pathSegments.length - 1]
    const valueWithoutExtension = lastSegment.replace(".jpg", "").replace(".png", "").replace(".jpeg", "")
    return valueWithoutExtension
}

const deleteImageFromCloudinary = async (imageUrl,modelName) => {
    try {
        console.log(modelName)
        const publicId = await publicIdWithoutExtensionFromUrl(imageUrl)
        const { result } = await cloudinary.uploader.destroy(`ecommerceMern/${modelName}/${publicId}`)
        if (result !== 'ok') throw createHttpError(500, `Failed to delete ${modelName} image`)
    } catch (error) {
        throw error
    }
}

module.exports = {
    publicIdWithoutExtensionFromUrl,
    deleteImageFromCloudinary
}