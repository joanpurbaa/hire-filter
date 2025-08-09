"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

declare global {
	interface Window {
		pdfjsLib: {
			getDocument: (options: { data: Uint8Array }) => {
				promise: Promise<{
					numPages: number;
					getPage: (pageNum: number) => Promise<{
						getTextContent: () => Promise<{
							items: Array<{ str: string }>;
						}>;
					}>;
				}>;
			};
			GlobalWorkerOptions: {
				workerSrc: string;
			};
		};
	}
}

interface CVFile {
	name: string;
	type: string;
	data: string;
	url?: string;
	textContent?: string;
}

export default function ShowCv() {
	const [files, setFiles] = useState<CVFile[]>([]);
	const [loading, setLoading] = useState(true);
	const [extractingText, setExtractingText] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchLoading, setSearchLoading] = useState(false);
	const router = useRouter();

	const extractTextFromPDF = async (pdfData: string): Promise<string> => {
		try {
			if (typeof window !== "undefined" && !window.pdfjsLib) {
				await new Promise<void>((resolve, reject) => {
					const script = document.createElement("script");
					script.src =
						"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
					script.onload = () => resolve();
					script.onerror = () => reject(new Error("Failed to load PDF.js"));
					document.head.appendChild(script);
				});
			}

			const byteArray = Uint8Array.from(atob(pdfData), (c) => c.charCodeAt(0));
			const loadingTask = window.pdfjsLib.getDocument({ data: byteArray });
			const pdf = await loadingTask.promise;

			let fullText = "";

			for (let i = 1; i <= pdf.numPages; i++) {
				const page = await pdf.getPage(i);
				const textContent = await page.getTextContent();
				const pageText = textContent.items.map((item) => item.str).join(" ");
				fullText += pageText + " ";
			}

			return fullText.trim();
		} catch (error) {
			console.error("Error extracting text from PDF:", error);
			return "";
		}
	};

	useEffect(() => {
		const loadFiles = async () => {
			try {
				const storedFiles = localStorage.getItem("cvFiles");

				if (!storedFiles) {
					router.push("/");
					return;
				}

				const parsedFiles: CVFile[] = JSON.parse(storedFiles);

				const filesWithUrls = parsedFiles.map((file) => {
					const byteArray = Uint8Array.from(atob(file.data), (c) => c.charCodeAt(0));
					const blob = new Blob([byteArray], { type: file.type });
					const url = URL.createObjectURL(blob);

					return { ...file, url };
				});

				setFiles(filesWithUrls);
				setLoading(false);

				setExtractingText(true);
				const filesWithText = await Promise.all(
					filesWithUrls.map(async (file) => {
						const textContent = await extractTextFromPDF(file.data);
						return { ...file, textContent };
					})
				);

				setFiles(filesWithText);
				setExtractingText(false);
			} catch (error) {
				console.error("Error loading CV files:", error);
				router.push("/");
			}
		};

		loadFiles();

		return () => {
			files.forEach((file) => {
				if (file.url) {
					URL.revokeObjectURL(file.url);
				}
			});
		};
	}, []);

	const filteredFiles = useMemo(() => {
		if (!searchQuery.trim()) {
			return files;
		}

		setSearchLoading(true);
		const query = searchQuery.toLowerCase().trim();

		const filtered = files.filter((file) => {
			if (file.name.toLowerCase().includes(query)) {
				return true;
			}

			if (file.textContent && file.textContent.toLowerCase().includes(query)) {
				return true;
			}

			return false;
		});

		setTimeout(() => setSearchLoading(false), 300);
		return filtered;
	}, [files, searchQuery]);

	const handleBackToHome = () => {
		localStorage.removeItem("cvFiles");
		files.forEach((file) => {
			if (file.url) {
				URL.revokeObjectURL(file.url);
			}
		});
		router.push("/");
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const clearSearch = () => {
		setSearchQuery("");
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
					<p className="text-gray-600 text-sm sm:text-base">Memuat CV...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-12 sm:h-16 gap-4">
						<div className="flex items-center gap-2 sm:gap-3 min-w-0">
							<Image
								src="/icon.png"
								alt="HF Logo"
								width={32}
								height={32}
								className="rounded w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
							/>
							<h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
								Hire Filter
							</h1>
						</div>

						<button
							onClick={handleBackToHome}
							className="bg-violet-500 hover:bg-violet-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-shrink-0">
							<span className="hidden sm:inline">← Kembali ke Beranda</span>
							<span className="sm:hidden">← Home</span>
						</button>
					</div>
				</div>
			</div>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
				<div className="mb-6 sm:mb-8">
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
						Daftar CV
					</h2>
					<p className="text-sm sm:text-base text-gray-600">
						Ditemukan {files.length} CV dalam file ZIP yang diunggah
					</p>
				</div>

				<div className="mb-6 sm:mb-8">
					<div className="relative w-full max-w-2xl">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg
								className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						<input
							type="text"
							placeholder="Cari berdasarkan nama file atau konten CV..."
							value={searchQuery}
							onChange={handleSearchChange}
							className="block w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
						/>
						{searchQuery && (
							<button
								onClick={clearSearch}
								className="absolute inset-y-0 right-0 pr-3 flex items-center">
								<svg
									className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						)}
					</div>

					<div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
						{extractingText && (
							<div className="flex items-center gap-2 text-blue-600">
								<div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-600"></div>
								<span>Mengekstrak teks dari PDF untuk pencarian...</span>
							</div>
						)}

						{searchQuery && (
							<div className="flex items-center gap-2">
								{searchLoading ? (
									<div className="flex items-center gap-2 text-violet-600">
										<div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-violet-600"></div>
										<span>Mencari...</span>
									</div>
								) : (
									<span className="text-gray-600">
										{filteredFiles.length === 0
											? "Tidak ada hasil yang ditemukan"
											: `Menampilkan ${filteredFiles.length} dari ${files.length} CV`}
									</span>
								)}
							</div>
						)}
					</div>
				</div>

				{filteredFiles.length === 0 ? (
					<div className="text-center py-8 sm:py-12">
						<div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">
							{searchQuery ? "🔍" : "📄"}
						</div>
						<p className="text-gray-500 text-base sm:text-lg mb-3 sm:mb-4 px-4">
							{searchQuery
								? `Tidak ada CV yang mengandung "${searchQuery}"`
								: "Tidak ada CV yang ditemukan"}
						</p>
						{searchQuery ? (
							<button
								onClick={clearSearch}
								className="bg-violet-500 hover:bg-violet-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors">
								Hapus Pencarian
							</button>
						) : (
							<button
								onClick={handleBackToHome}
								className="bg-violet-500 hover:bg-violet-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors">
								Unggah File Baru
							</button>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
						{filteredFiles.map((file, index) => (
							<div
								key={index}
								className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
								<div className="p-3 sm:p-4">
									<div className="flex items-center gap-2 mb-2 sm:mb-3">
										<div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
											<span className="text-red-600 text-xs sm:text-sm font-bold">
												PDF
											</span>
										</div>
										<div className="flex-1 min-w-0">
											<h3
												className="text-xs sm:text-sm font-medium text-gray-800 truncate"
												title={file.name}>
												{file.name}
											</h3>
										</div>
									</div>

									<div className="aspect-[3/4] bg-gray-100 rounded border overflow-hidden mb-2 sm:mb-0">
										<embed
											src={file.url}
											type="application/pdf"
											className="w-full h-full"
											title={`Preview ${file.name}`}
										/>
									</div>

									{searchQuery &&
										file.textContent &&
										file.textContent
											.toLowerCase()
											.includes(searchQuery.toLowerCase()) && (
											<div className="mt-2 flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
												<svg
													className="h-3 w-3 flex-shrink-0"
													fill="currentColor"
													viewBox="0 0 20 20">
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clipRule="evenodd"
													/>
												</svg>
												<span className="truncate">Mengandung keyword</span>
											</div>
										)}

									<div className="mt-3 sm:mt-4 flex gap-2">
										<a
											href={file.url}
											target="_blank"
											rel="noopener noreferrer"
											className="flex-1 bg-violet-500 hover:bg-violet-600 text-white text-center py-1.5 sm:py-2 px-2 sm:px-3 rounded text-xs sm:text-sm font-medium transition-colors">
											<span className="hidden sm:inline">Buka Full</span>
											<span className="sm:hidden">Buka</span>
										</a>
										<a
											href={file.url}
											download={file.name}
											className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-center py-1.5 sm:py-2 px-2 sm:px-3 rounded text-xs sm:text-sm font-medium transition-colors">
											Download
										</a>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
