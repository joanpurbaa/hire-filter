import { NextResponse } from "next/server";
import AdmZip from "adm-zip";

export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const zipFile = formData.get("zip") as File;

		if (!zipFile) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		if (!zipFile.name.endsWith(".zip")) {
			return NextResponse.json(
				{ error: "File must be a ZIP file" },
				{ status: 400 }
			);
		}

		const buffer = Buffer.from(await zipFile.arrayBuffer());

		const zip = new AdmZip(buffer);
		const zipEntries = zip.getEntries();

		const files = zipEntries
			.filter((entry) => !entry.isDirectory && entry.entryName.endsWith(".pdf"))
			.map((entry) => ({
				name: entry.entryName,
				type: "application/pdf",
				data: entry.getData().toString("base64"),
			}));

		if (files.length === 0) {
			return NextResponse.json(
				{ error: "No PDF files found in ZIP" },
				{ status: 400 }
			);
		}

		return NextResponse.json({
			success: true,
			files: files,
			count: files.length,
		});
	} catch (error) {
		console.error("Error processing ZIP file:", error);
		return NextResponse.json(
			{ error: "Failed to process ZIP file" },
			{ status: 500 }
		);
	}
}
