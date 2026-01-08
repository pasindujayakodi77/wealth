const url = "https://bejzglotgsybkrzthzzz.supabase.co"

const key = "sb_publishable_PHs-5ZwADFqMk8rgwHvnXw_trxtogxy"

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(url, key)

export default async function uploadFile(file) {
    if (file == null) {
        throw new Error("Please select a file to upload");
    }

    try {
        const timeStamp = new Date().getTime();
        // sanitize filename by replacing spaces
        const safeName = (file.name || "").replace(/\s+/g, "_");
        const fileName = `${timeStamp}-${safeName}`;

        const { error: uploadError } = await supabase.storage.from("images").upload(fileName, file, {
            cacheControl: "3600",
            upsert: false
        });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            throw new Error("Failed to upload file");
        }

        // getPublicUrl may return different field names depending on client version
        const publicObj = supabase.storage.from("images").getPublicUrl(fileName);
        const publicUrl = publicObj?.data?.publicUrl || publicObj?.data?.publicURL || publicObj?.publicUrl || publicObj?.publicURL;

        if (!publicUrl) {
            // Construct fallback URL (matches Supabase storage public path)
            const fallback = `${url}/storage/v1/object/public/images/${encodeURIComponent(fileName)}`;
            return encodeURI(fallback);
        }

        // ensure encoded URL
        return encodeURI(publicUrl);
    } catch (err) {
        console.error(err);
        throw new Error("Failed to upload file");
    }
}