# Usage

Ngedoc usage is based on Angular router module. As for the router module, you define the routes (pages) of your documentation site using a configuration object then Ngedoc will handle the navigation between the pages.

## Create one project called my-doc

```bash
ng new my-doc
```

## Add Ngedoc dependencies to the project

```bash
# Install Angular Material
ng add @angular/material

# Install nge-doc

npm i nge-doc

# Install nge-markdown used by nge-doc to render markdown content
npm i nge-markdown marked
```

So, the default generated files looks like this (you must include HttpClientModule in app.module.ts).

===app.module.ts

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

=== app-routing.module.ts

```typescript
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DOC } from './doc';

const routes: Routes = [];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
```

=== app.component.html

```html
<router-outlet></router-outlet>
```

===

## Register the documentation pages

A documentation site in Ngedoc is a collection of links. Each link can refer either to a static page (Markdown file) or a dynamic page (Angular component).

To define the links of the site, you must register new route in the `routes` array of one of the router modules of your application like `app-routing.module.ts`. This route should lazy load `NgeDocModule` from `nge-doc` and use the `data` property of the route to define the links.

```typescript
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgeDocInfo } from 'nge-doc';

const routes: Routes = [
    {
        path: 'docs',
        loadChildren: () => import('nge-doc').then(m => m.NgeDocModule),
        data: {
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
        } as NgeDocInfo,
    },
    { path: '**', redirectTo: 'docs', pathMatch: 'full' }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, , {
            anchorScrolling: 'enabled',
            scrollPositionRestoration: 'enabled',
            preloadingStrategy: PreloadAllModules
        }),
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
```

In this example, the content property of the links refers to markdown files placed in assets folder.
