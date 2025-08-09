declare global {
	interface Window {
		pdfjsLib: {
			GlobalWorkerOptions: {
				workerSrc: string;
			};
			getDocument: (params: { data: Uint8Array }) => {
				promise: Promise<{
					numPages: number;
					getPage: (pageNum: number) => Promise<{
						getTextContent: () => Promise<{
							items: Array<{ str: string }>;
						}>;
					}>;
				}>;
			};
		};
	}
}

export {};
