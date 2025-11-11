import mongoose from "mongoose";

mongoose.set('strictQuery', true);

const aboutSchema = new mongoose.Schema(
    {
        user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "user",
              required: true,
              unique: true,
              index: true,
        },
        self_title : {
            type : [String],
            required : true,
            trim : true
        },
        self_description : {
            type : [String],
            required : true,
            trim : true
        },
        people_title : {
            type : [String],
            required : true,
            trim : true
        },
        people_opinion : {
            type : [String],
            required : true,
            trim : true
        },
        people_job : {
            type : [String],
            required : true,
            trim : true
        },
        tools_title : {
            type : [String],
            required : true,
            trim : true
        },
        tools_url : {
            type : [String],
            required : true,
            trim : true
        }

    }, {
        timestamps : true
    });


const About = mongoose.model("about", aboutSchema);

export { About };