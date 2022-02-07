const dates = new Date();
var date = dates.toLocaleDateString().replace(/\//g, '-');
var hour = dates.toLocaleTimeString().replace(/:/g, '-');
var time =  date +'--'+ hour

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
         cb(null, true)
    } else {
         cb(null, false)
    }
}

module.exports = {time, fileFilter}