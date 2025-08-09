"use client";
import AnimatedText from "@/components/AnimatedText";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
	const router = useRouter();
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleImage = async (files: File[]) => {
		if (files.length === 0) return;

		setIsUploading(true);
		setError(null);

		try {
			const formData = new FormData();
			formData.append("zip", files[0]);

			const response = await axios.post("/api/zip", formData);

			if (response.data.success && response.data.files) {
				localStorage.setItem("cvFiles", JSON.stringify(response.data.files));
				router.push("/show-cv");
			} else {
				setError("Failed to process ZIP file");
			}
		} catch (err) {
			console.error("Upload error:", err);
			const error = err as { response?: { data?: { error?: string } } };
			setError(
				error.response?.data?.error ||
					"Terjadi kesalahan saat mengunggah file. Pastikan file adalah ZIP yang berisi PDF."
			);
		} finally {
			setIsUploading(false);
		}
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: handleImage,
		accept: {
			"application/zip": [".zip"],
		},
		multiple: false,
		disabled: isUploading,
	});

	return (
		<div
			style={{ backgroundImage: "url(background.png)" }}
			className="min-h-screen bg-gray-50 flex items-center justify-center bg-center bg-cover bg-no-repeat p-4 sm:p-6 lg:p-8">
			<div className="w-full max-w-7xl flex flex-col justify-between min-h-screen py-8 sm:py-12 lg:py-20">
				<div className="text-center mb-8 lg:mb-12">
					<div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
						<Image
							src="/icon.png"
							alt="HF Logo"
							width={40}
							height={40}
							className="rounded w-8 h-8 sm:w-10 sm:h-10"
						/>
						<span className="poppins text-gray-800 text-xl sm:text-2xl font-bold">
							<AnimatedText text="Hire Filter" />
						</span>
					</div>

					<h1 className="poppins text-2xl sm:text-4xl md:text-5xl font-bold text-violet-500 mb-3 sm:mb-4 flex flex-wrap justify-center gap-1 sm:gap-2 px-2">
						<AnimatedText text="Unggah, Cari, dan Rekrut!" />
					</h1>

					<div className="text-gray-700 text-base sm:text-lg max-w-2xl mx-auto">
						<p>
							<span className="font-semibold">Unggah</span> semua CV, masukkan{" "}
							<span className="font-semibold">kata kunci</span>, dan dapatkan kandidat
							yang tepat.
						</p>
						<p className="mt-1">
							Semua proses seleksi jadi lebih cepat, tanpa ribet.
						</p>
					</div>
				</div>

				<div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-[200px] items-center flex-1">
					<motion.div
						initial={{ y: 0 }}
						animate={{ y: [0, -20, 0] }}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						className="order-2 lg:order-1 w-full max-w-md lg:max-w-none">
						<Image
							src="/sideImage.png"
							alt="Hire Filter Illustration"
							width={500}
							height={400}
							className="w-full h-auto"
						/>
					</motion.div>

					<div className="order-1 lg:order-2 w-full max-w-md lg:max-w-none space-y-4 sm:space-y-6">
						<div className="p-3 sm:p-5 bg-white rounded-2xl shadow-2xl">
							<div
								{...getRootProps()}
								className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 lg:p-10 text-center transition-all duration-300 cursor-pointer ${
									isDragActive
										? "border-violet-400 bg-violet-50"
										: isUploading
										? "border-gray-400 bg-gray-100 cursor-not-allowed"
										: "border-gray-300 bg-white"
								}`}>
								<div className="space-y-4 sm:space-y-6">
									<div className="poppins text-gray-600">
										<p className="text-lg sm:text-2xl font-bold text-gray-800 mb-2">
											{isUploading ? "Mengunggah..." : "Drag and Drop"}
										</p>
										<p className="text-sm sm:text-base text-gray-600">
											{isUploading ? (
												"Memproses file ZIP Anda..."
											) : (
												<>
													or{" "}
													<span className="text-violet-500 font-bold">Browse to Upload</span>
												</>
											)}
										</p>
									</div>

									<div>
										<span
											className={`inline-block px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full text-sm sm:text-base font-medium transition-colors duration-200 ${
												isUploading
													? "bg-gray-400 text-white cursor-not-allowed"
													: "bg-violet-500 hover:bg-violet-600 text-white cursor-pointer"
											}`}>
											{isUploading ? "Mengunggah..." : "Upload Your Zip"}
										</span>
										<input
											{...getInputProps()}
											className="hidden"
											disabled={isUploading}
										/>
									</div>

									<p className="text-xs sm:text-sm text-gray-500">
										Hanya menerima file ZIP yang berisi PDF!
									</p>
								</div>
							</div>
						</div>

						{error && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
								<p className="text-xs sm:text-sm">{error}</p>
							</div>
						)}
					</div>
				</div>

				<div className="text-center mt-8 sm:mt-12 lg:mt-16">
					<p className="text-gray-400 text-xs sm:text-sm">
						© Joan Orlando Purba | 2025
					</p>
				</div>
			</div>
		</div>
	);
}
