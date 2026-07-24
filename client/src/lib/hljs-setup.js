import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

// Quill 1.3.7's Syntax module reads window.hljs at module-evaluation time,
// so this must run BEFORE react-quill is imported.
if (typeof window !== 'undefined') window.hljs = hljs;

export default hljs;
