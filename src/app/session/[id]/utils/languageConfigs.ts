export const languageConfigs = {
    javascript: {
      name: 'JavaScript',
      extension: 'js',
      icon: '🟨',
      executable: true,
      defaultContent: `// JavaScript Code...`
    },
    python: {
      name: 'Python',
      extension: 'py',
      icon: '🐍',
      executable: true,
      defaultContent: `# Python Code...`
    },
    cpp: {
      name: 'C++',
      extension: 'cpp',
      icon: '🔵',
      executable: true,
      defaultContent: `#include <iostream>...`
    },
    html: {
      name: 'HTML',
      extension: 'html',
      icon: '🌐',
      executable: false,
      defaultContent: `<!DOCTYPE html>...`
    },
    css: {
      name: 'CSS',
      extension: 'css',
      icon: '🎨',
      executable: false,
      defaultContent: `/* CSS Styles... */`
    }
  } as const;