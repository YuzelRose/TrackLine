const TabloidModel = new mongoose.Schema({
    Name:{
        type:String,
        required: true,
    },
    Owner:{
        type:String,
        required: true,
    },
    Descripton:{
        type:String,
        required:true,
    },
    Content:{
        type:Array,
    },
    Date:{
        type:String,
        required:true,
        default:Date.now,
    },

},{collection:'Tabloid'});

const Tabloid = mongoose.model('Tabloid',TabloidModel);
export default Tabloid;