import { safeParseHTML } from '@/lib/dom';
import { cn } from '@/lib/utils';
import { memo, useMemo } from 'react';

const MarkdownRenderer = ({ content, className }: { content: string; className?: string }) => {
	const parsedHtml = useMemo(() => safeParseHTML(content), [content]);

	if (!parsedHtml) {
		return null;
	}

	const classes = cn('font-medium text-gray-300 text-md', className);

	return <div className={classes} dangerouslySetInnerHTML={{ __html: parsedHtml }} />;
};

export default memo(MarkdownRenderer);
