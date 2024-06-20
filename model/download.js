const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const downloadSchema=new Schema({
    userId:
    {
        type: String,
        required: true,
        ref:'User'
    },
    URL:
    {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Download',downloadSchema);