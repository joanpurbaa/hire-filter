"use client";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

export default function Home() {
	const handleImage = (files: File[]) => {
		console.log("Files uploaded:", files);
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: handleImage,
		accept: {
			"application/zip": [".zip"],
		},
		multiple: false,
	});

	return (
		<div className="h-screen bg-gray-50 flex items-center justify-center py-20">
			<div className="h-full w-full max-w-6xl flex flex-col justify-between">
				<div className="text-center mb-12">
					<div className="flex items-center justify-center gap-2 mb-6">
						<Image
							src="/icon.png"
							alt="HF Logo"
							width={40}
							height={40}
							className="rounded"
						/>
						<span className="poppins text-gray-800 text-2xl font-bold">
							Hire Filter
						</span>
					</div>

					<h1 className="poppins text-4xl md:text-5xl font-bold text-violet-500 mb-4">
						Unggah, Cari, dan Rekrut!
					</h1>

					<p className="text-gray-700 text-lg max-w-2xl mx-auto">
						<span className="font-semibold">Unggah</span> semua CV, masukkan{" "}
						<span className="font-semibold">kata kunci</span>, dan dapatkan kandidat
						yang tepat.
						<br />
						Semua proses seleksi jadi lebih cepat, tanpa ribet.
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-[200px] items-center">
					<Image
						src="/sideImage.png"
						alt="Hire Filter Illustration"
						width={500}
						height={400}
						className="w-full h-auto"
					/>

					<div className="space-y-6">
						<div className="p-5 bg-white rounded-2xl shadow-2xl">
							<div
								{...getRootProps()}
								className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${
									isDragActive
										? "border-violet-400 bg-violet-50"
										: "border-gray-300 bg-white"
								}`}>
								<div className="space-y-6">
									<div className="poppins text-gray-600">
										<p className="text-2xl font-bold text-gray-800 mb-2">Drag and Drop</p>
										<p className="text-gray-600">
											or{" "}
											<span className="text-violet-500 font-bold">Browse to Upload</span>
										</p>
									</div>

									<div>
										<span className="inline-block bg-violet-500 hover:bg-violet-600 text-white px-8 py-4 rounded-full font-medium cursor-pointer transition-colors duration-200">
											Upload Your Zip
										</span>
										<input {...getInputProps()} className="hidden" />
									</div>

									<p className="text-sm text-gray-500 mt-4">Hanya menerima Zip!</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="text-center mt-16">
					<p className="text-gray-400 text-sm">© Joan Orlando Purba | 2025</p>
				</div>
			</div>
		</div>
	);
}
