import DOMPurify from 'dompurify';
import showdown from 'showdown';
import showdownHighlight from 'showdown-highlight';

const classMap = {
	h1: 'text-2xl sm:text-3xl mt-2 mb-3 font-bold text-white',
	h2: 'text-xl sm:text-2xl mt-2 mb-3 font-semibold text-white',
	h3: 'text-lg sm:text-xl mt-2 mb-3 font-semibold text-white',
	h4: 'text-md sm:text-lg mt-2 mb-3 font-semibold text-white',
	ul: 'list-disc mt-2 mb-3 list-inside text-white',
	ol: 'list-decimal mt-2 mb-3 list-inside text-white',
	li: 'text-white mt-2 mb-3',
	blockquote: 'border-l-4 mt-2 mb-3 border-gray-600 bg-gray-800 text-gray-300 p-4 italic',
	a: 'text-blue-500 mt-2 mb-3 hover:underline',
	// code: 'px-2 sm:px-4 py-1 sm:py-2 rounded font-mono',
	// pre: 'text-gray-300 p-2 sm:p-4 rounded my-2 overflow-auto max-w-full whitespace-pre-wrap',
	table: 'w-full mt-2 mb-3 text-gray-300 border-collapse dark-b',
	th: 'dark-b mt-2 mb-3 text-white font-semibold py-2 px-1 sm:px-4 border border-gray-600 text-left',
	td: 'dark-b mt-2 mb-3 text-white py-2 px-1 sm:px-4 border border-gray-600 text-left',
	img: 'mx-auto mt-2 mb-3 my-4',
	hr: 'border-gray-600 my-8',
};
const bindings = Object.keys(classMap).map((key) => ({
	type: 'output',
	regex: new RegExp(`<${key}(.*)>`, 'g'),
	replace: `<${key} class="${classMap[key as keyof typeof classMap]}" $1>`,
}));

// Custom showdown extension to add language labels

const converter = new showdown.Converter({
	noHeaderId: false,
	customizedHeaderId: true,
	ghCompatibleHeaderId: true,
	prefixHeaderId: false,
	rawPrefixHeaderId: false,
	headerLevelStart: 1,
	parseImgDimensions: true,
	simplifiedAutoLink: true,
	excludeTrailingPunctuationFromURLs: false,
	literalMidWordUnderscores: false,
	literalMidWordAsterisks: false,
	strikethrough: true,
	tables: true,
	tablesHeaderId: false,
	ghCodeBlocks: true,
	tasklists: true,
	smoothLivePreview: true,
	smartIndentationFix: true,
	disableForced4SpacesIndentedSublists: false,
	simpleLineBreaks: true,
	requireSpaceBeforeHeadingText: true,
	ghMentions: false,
	ghMentionsLink: 'https://github.com/{u}',
	encodeEmails: true,
	openLinksInNewWindow: false,
	backslashEscapesHTMLTags: false,
	emoji: false,
	underline: true,
	completeHTMLDocument: false,
	metadata: false,
	splitAdjacentBlockquotes: false,
	extensions: [showdownHighlight({ pre: true, auto_detection: true }), ...bindings],
});

const convertToHTML = (text: string) => converter.makeHtml(text);

export const convertToMarkdown = (text: string) => converter.makeMarkdown(text);

const withDomSanitize = (rawHtml: string) => DOMPurify.sanitize(rawHtml);

export const safeParseHTML = (text: string) => withDomSanitize(convertToHTML(text));
