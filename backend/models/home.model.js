import mongoose from "mongoose";

const homeSchema = new mongoose.Schema(
    {
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref : "user",
            required : true,
            unique: true,
            index: true,
        },
        hobbies : {
            type : [String],
            default : []
        },
        intro : {
            type : String,
            default : ""
        },
        profile_picture_url : {
            type : String,
            default : ""
        },
        download_cv : {
            type : String,
            default : ""
        },
        facebook_url : {
            type : String,
            default : ""
        },
        instagram_url : {
            type : String,
            default : ""
        },
        linkedin_url : {
            type : String,
            default : ""
        },
        github_url : {
            type : String,
            default : ""
        }
    }, {
        timestamps : true
    },
)


export const Home = mongoose.model("home", homeSchema);