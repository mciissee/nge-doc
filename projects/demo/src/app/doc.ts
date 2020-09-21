import { NgeDocInfo, NgeDocLink } from 'nge-doc';

export const DOC: NgeDocInfo = {
    meta: (_) => {
        return {
            name: 'nge-doc',
            root: '/docs/',
            copyright: '© 2020, nge-doc',
            repo: {
                name: 'nge-doc',
                url: 'https://github.com/mciissee/nge-doc',
            },
        };
    },
    pages: [
        (_) => {
            return {
                title: 'Guides',
                href: 'guides',
                content: 'assets/docs/guides/getting-started',
                children: [
                    { title: 'Getting Started', href: 'getting-started', content: 'assets/docs/guides/getting-started' },
                    { title: 'Features', href: 'features', content: 'assets/docs/guides/features' },
                    { title: 'Installation', href: 'installation', content: 'assets/docs/guides/installation' },
                    { title: 'Pages', href: 'pages', content: 'assets/docs/guides/pages' },
                ],
            };
        }
    ],
};
