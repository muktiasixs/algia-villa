import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="py-20 text-center text-xs uppercase tracking-[0.3em] text-gray-400 border-t border-gray-50 dark:border-gray-800">
            &copy; {new Date().getFullYear()} algia luxury villas • crafted with elegance
        </footer>
    );
};
