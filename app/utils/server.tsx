"use server";

export async function getBase64ImageFromURL(file: any) {
	var fs = require("fs")

	// read binary data
	try {
		var bitmap = fs.readFileSync(file);
	} catch (e) {
		return { error: `File not Found: ${file}` };
	}
	// convert binary data to base64 encoded string
	return new Buffer(bitmap).toString("base64")
}