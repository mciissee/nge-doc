import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgeDocSettings } from 'nge-doc';

const documentation: NgeDocSettings = {
    meta: {
        name: 'Ngedoc',
        root: '/docs/',
        copyright: '© 2020, nge-doc',
        repo: {
            name: 'nge-doc',
            url: 'https://github.com/mciissee/nge-doc',
        },
    },
    pages: [
        { title: 'Getting Started', href: 'getting-started', renderer: 'assets/docs/getting-started.md' },
        { title: 'Installation', href: 'installation', renderer: 'assets/docs/installation.md' },
        { title: 'Usage', href: 'usage', renderer: 'assets/docs/usage.md' },
        { title: 'Configuration', href: 'configuration', renderer: 'assets/docs/configuration.md' },
    ],
    markdownRenderer: import('nge-markdown').then(m => m.NgeMarkdownComponent)
};

const routes: Routes = [
    {
        path: 'docs',
        loadChildren: () => import('nge-doc').then(m => m.NgeDocModule),
        data: documentation,
    },
    { path: '**', redirectTo: 'docs', pathMatch: 'full' }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, {
            anchorScrolling: 'enabled',
            scrollPositionRestoration: 'enabled',
            preloadingStrategy: PreloadAllModules
        }),
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
