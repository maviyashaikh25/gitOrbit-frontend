import React from "react";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const FileViewer = ({ content, fileName, downloadUrl, onClose }) => {
    
    const getExtension = (name) => name?.split('.').pop().toLowerCase();
    const ext = getExtension(fileName);

    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext);
    const isDoc = ['pdf', 'docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls'].includes(ext);
    const isCode = !isImage && !isDoc;

    const renderContent = () => {
        if (isImage) {
            return (
                <div className="flex justify-center items-center h-full">
                    <img src={downloadUrl} alt={fileName} className="max-w-full max-h-[70vh] object-contain" />
                </div>
            );
        }

        if (isDoc) {
             // Use Google Docs Viewer for office files and PDF
            const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(downloadUrl)}&embedded=true`;
            return (
                <iframe 
                    src={viewerUrl} 
                    className="w-full h-full border-0" 
                    title="Document Viewer"
                />
            );
        }

        return (
             <SyntaxHighlighter 
                language={ext === 'js' ? 'javascript' : ext} 
                style={vscDarkPlus}
                customStyle={{ background: '#0d1117', margin: 0, padding: '1rem' }}
                showLineNumbers={true}
            >
                {content || ""}
            </SyntaxHighlighter>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg w-full max-w-5xl h-[85vh] flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] bg-[#161b22] rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-[#c9d1d9]">{fileName}</h3>
                        {downloadUrl && (
                             <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#58a6ff] hover:underline">
                                Open Raw
                             </a>
                        )}
                    </div>
                    <button onClick={onClose} className="text-[#8b949e] hover:text-[#c9d1d9]">
                        <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                    </button>
                </div>
                <div className="flex-1 overflow-auto bg-[#0d1117] text-sm text-[#c9d1d9]">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default FileViewer;
