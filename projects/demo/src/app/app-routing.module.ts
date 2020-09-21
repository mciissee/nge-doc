import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgeDocInfo } from 'nge-doc';

const documentation: NgeDocInfo = {
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
        { title: 'Getting Started', href: 'getting-started', content: 'assets/docs/getting-started' },
        { title: 'Installation', href: 'installation', content: 'assets/docs/installation' },
        { title: 'Usage', href: 'usage', content: 'assets/docs/usage' },
        { title: 'Configuration', href: 'configuration', content: 'assets/docs/configuration' },
    ],
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
