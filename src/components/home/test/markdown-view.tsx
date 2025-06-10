import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewProps {
  children: string;
  size?: 'default' | 'large';
}

const MarkdownView: React.FC<MarkdownViewProps> = ({ children, size = 'default' }) => {

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
        p: ({ node, ...props }) => (
          <p className={`my-2 leading-relaxed text-sm md:text-base ${isLarge ? 'md:text-lg' : ''}`} {...props} />
        ), // eslint-disable-next-line @typescript-eslint/no-unused-vars
        h1: ({ node, ...props }) => <h1 className="my-3 font-bold text-xl md:text-2xl lg:text-3xl" {...props} />, // eslint-disable-next-line @typescript-eslint/no-unused-vars
        h2: ({ node, ...props }) => <h2 className="my-2 font-semibold text-lg md:text-xl lg:text-2xl" {...props} />, // eslint-disable-next-line @typescript-eslint/no-unused-vars
        h3: ({ node, ...props }) => <h3 className="my-1 font-medium text-md md:text-lg" {...props} />, // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ul: ({ node, ...props }) => <ul className="pl-5 my-2 list-disc text-sm md:text-base" {...props} />, // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ol: ({ node, ...props }) => <ol className="pl-5 my-2 list-decimal text-sm md:text-base" {...props} />, // eslint-disable-next-line @typescript-eslint/no-unused-vars
        li: ({ node, ...props }) => <li className="my-1" {...props} />,
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
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg" {...props} />
          </div>
        ), // eslint-disable-next-line @typescript-eslint/no-unused-vars
        thead: ({ node, ...props }) => <thead className="bg-gray-200 text-xs md:text-sm font-semibold" {...props} />, // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tbody: ({ node, ...props }) => <tbody {...props} />, // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tr: ({ node, ...props }) => <tr className="border-t border-gray-300" {...props} />, // eslint-disable-next-line @typescript-eslint/no-unused-vars
        th: ({ node, ...props }) => (
          <th className="px-4 py-2 text-left font-semibold text-sm md:text-base" {...props} />
        ), // eslint-disable-next-line @typescript-eslint/no-unused-vars
        td: ({ node, ...props }) => <td className="px-4 py-2 text-sm md:text-base" {...props} />,
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
