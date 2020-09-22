# Configuration

The full list of properties supported by NgeDoc configuration object can be found [here](https://github.com/mciissee/nge-doc/blob/69e02ae21e37fc75345b5cba537233930d2bd388/projects/nge-doc/src/lib/nge-doc.ts#L13).

## Static page

```typescript
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
              { title: 'Getting Started', href: 'getting-started', renderer: 'assets/docs/getting-started' },
              { title: 'Installation', href: 'installation', renderer: 'assets/docs/installation' },
              { title: 'Usage', href: 'usage', renderer: 'assets/docs/usage' },
              { title: 'Configuration', href: 'configuration', renderer: 'assets/docs/configuration' },
          ],
          markdownRenderer: import('nge-markdown').then(m => m.NgeMarkdownComponent)
        } as NgeDocInfo,
    },
    { path: '**', redirectTo: 'docs', pathMatch: 'full' }
];
```

## Dynamic page

```typescript
// WE ASSUME THAT MyDynamicComponent exists and it is declared in a module.
import { MyDynamicComponent } from './my-dynamic-component';

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
            (injector) => {
              const random = () => {
                  const pages: NgeDocLink[] = [];
                  for (let i = 0; i < 15; i++) {
                      const markdownOrComponent = (i % 2 == 0)
                        ? 'LINK TO A MARKDOWN FILE'
                        : MyDynamicComponent
                      ;
                      pages.push({
                          title: 'Dynamic ' + i,
                          href: 'dynamic_' + i,
                          content: markdownOrComponent,
                      });
                  }
                  return pages;
              };
              return Promise.resolve({
                  title: 'Dynamic',
                  href: 'dynamic',
                  content: 'assets/docs/getting-started',
                  children: random()
              });
            }
          ],
        } as NgeDocInfo,
    },
    { path: '**', redirectTo: 'docs', pathMatch: 'full' }
];
```
