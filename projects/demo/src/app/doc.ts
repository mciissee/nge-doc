import { NgeDocInfo } from 'nge-doc';

export const DOC: NgeDocInfo = {
    meta: {
        name: 'nge-doc',
        root: '/docs/',
        copyright: '© 2020, nge-doc',
        repo: {
            name: 'nge-doc',
            url: 'https://github.com/mciissee/nge-doc',
        },
    },
    pages: [
        { title: 'Getting Started', href: 'getting-started', content: 'assets/docs/getting-started' },
        { title: 'Features', href: 'features', content: 'assets/docs/features' },
        { title: 'Installation', href: 'installation', content: 'assets/docs/installation' },
        { title: 'Pages', href: 'pages', content: 'assets/docs/pages' },
    ],
};
