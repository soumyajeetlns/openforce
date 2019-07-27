import {ProjectId} from "./FirebaseConfigurator";
import * as cloudinary from "cloudinary-core";
import {Transformation} from "cloudinary-core";

let uploadPreset = "";
let cloudinaryVar;
let cloudName;
if (process.env.NODE_ENV === 'production' && 'openforce-production' === ProjectId) {
    cloudinaryVar = cloudinary.Cloudinary.new( {cloud_name: "openforce"}); // change cloudName
    uploadPreset = "of-preset";
    cloudName = "openforce";
} else {
    cloudinaryVar = cloudinary.Cloudinary.new( {cloud_name: "firmastudio-co-uk"});
    uploadPreset = "uglncfoq";
    cloudName = "firmastudio-co-uk";
}
cloudinaryVar.init();


export function getImageUrlWithDimension(publicId, width, height, radius) {
    return cloudinaryVar.url(publicId, new Transformation({ type: 'upload',
            width: width, height: height, crop: 'scale', radius: radius, format: 'jpg' })
        )
}

export function uploadImage(image, publicId, callback, progressCallback) {
    const url = "https://api.cloudinary.com/v1_1/" + cloudName + "/upload";
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        // Update progress (can be used to show progress indicator)
        xhr.upload.addEventListener("progress", function(e) {
            if (progressCallback) {
                const progress = Math.round((e.loaded * 100.0) / e.total);
                progressCallback(progress);
            }
        });

        xhr.onreadystatechange = function(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // File uploaded successfully

                var response = JSON.parse(xhr.responseText);
                callback(response);
            }
        };

        fd.append('upload_preset', uploadPreset);
        fd.append('folder', "employer/profile");
        fd.append('public_id', publicId);
        fd.append('file', image);
        xhr.send(fd);
}