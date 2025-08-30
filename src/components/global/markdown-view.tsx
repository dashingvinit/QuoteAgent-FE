import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewProps {
  children: string;
  size?: 'default' | 'large';
}

const MarkdownView: React.FC<MarkdownViewProps> = ({ children, size = 'default' }) => {
  const isLarge = size === 'large';

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        p: ({ node, ...props }) => <p className="mb-4 leading-7" {...props} />,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        h1: ({ node, ...props }) => (
          <h1 className="text-3xl font-bold mt-6 mb-4 pb-2 border-b border-border" {...props}>
            {children && children.length > 0 ? children : <span className="sr-only">Section heading</span>}
          </h1>
        ), // eslint-disable-next-line @typescript-eslint/no-unused-vars
        h2: ({ node, ...props }) => (
          <h2 className="text-2xl font-semibold mt-5 mb-3 pb-2 border-b border-border" {...props}>
            {children && children.length > 0 ? children : <span className="sr-only">Section heading</span>}
          </h2>
        ), // eslint-disable-next-line @typescript-eslint/no-unused-vars
        h3: ({ node, ...props }) => (
          <h3 className="text-xl font-semibold mt-4 mb-2" {...props}>
            {children && children.length > 0 ? children : <span className="sr-only">Section heading</span>}
          </h3>
        ), // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ul: ({ node, ...props }) => <ul className="my-4 ml-6 list-disc space-y-2" {...props} />, // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ol: ({ node, ...props }) => <ol className="my-4 ml-6 list-decimal space-y-2" {...props} />, // eslint-disable-next-line @typescript-eslint/no-unused-vars
        li: ({ node, ...props }) => <li className="pl-2" {...props} />,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        a: ({ node, ...props }) => (
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:opacity-75"
            {...props}
          />
        ), // eslint-disable-next-line @typescript-eslint/no-unused-vars
        table: ({ node, ...props }) => (
          <div className="my-6 w-full overflow-hidden rounded-lg border border-border">
            <div className="overflow-x-auto">
              <table className="w-full" {...props} />
            </div>
          </div>
        ), // eslint-disable-next-line @typescript-eslint/no-unused-vars
        thead: ({ node, ...props }) => <thead className="bg-muted" {...props} />, // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tbody: ({ node, ...props }) => <tbody {...props} />, // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tr: ({ node, ...props }) => <tr className="border-b border-border m-0 p-0 even:bg-muted/50" {...props} />, // eslint-disable-next-line @typescript-eslint/no-unused-vars
        th: ({ node, ...props }) => <th className="px-4 py-2 text-left font-bold" {...props} />, // eslint-disable-next-line @typescript-eslint/no-unused-vars
        td: ({ node, ...props }) => <td className="px-4 py-2 text-left" {...props} />,
        img: ({ src, alt, ...props }) => (
          <div className="flex justify-center my-4">
            <img
              src={src ?? ''}
              alt={alt ?? ''}
              className="max-w-full max-h-[300px] object-contain rounded-lg shadow-md"
              {...props}
            />
          </div>
        ),
      }}>
      {children}
    </ReactMarkdown>
  );
};

export default MarkdownView;
