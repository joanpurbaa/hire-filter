import { motion } from "motion/react";

export default function AnimatedText({ text }: { text: string }) {
	const words = text.split(" ");

	return words.map((word: string, index: number) => (
		<motion.span
			key={index}
			initial={{ filter: "blur(8px)", opacity: 0 }}
			animate={{ filter: "blur(0px)", opacity: 1 }}
			transition={{ duration: 0.6, delay: index * 0.2 }}
			className="inline-block">
			{word}
		</motion.span>
	));
}
