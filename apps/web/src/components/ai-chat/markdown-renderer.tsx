import { safeParseHTML } from '@/lib/dom';
import { cn } from '@/lib/utils';

const MarkdownRenderer = ({ content, className }: { content: string; className?: string }) => {
	const parsedHtml = safeParseHTML(content);

	if (!parsedHtml) {
		return null;
	}

	const classes = cn('font-medium text-gray-300 text-md', className);

	return <div className={classes} dangerouslySetInnerHTML={{ __html: parsedHtml }} />;
};

export default MarkdownRenderer;
