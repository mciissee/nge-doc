import { Location } from '@angular/common';
import { Injectable, Injector, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NgeDocInfo, NgeDocLink, NgeDocState } from './nge-doc';

@Injectable()
export class NgeDocService implements OnDestroy {
    private readonly state = new BehaviorSubject<NgeDocState>({
        meta: {
            root: '',
            name: '',
            copyright: '',
        },
        links: [],
        pages: [],
        prevLink: undefined,
        nextLink: undefined,
        currLink: undefined,
    });

    /** Root pages. */
    private readonly pages: NgeDocLink[] = [];
    /** All pages. */
    private readonly links: NgeDocLink[] = [];
    private readonly subscriptions: Subscription[] = [];

    /** documentation state */
    get stateChanges() {
        return this.state.asObservable();
    }

    constructor(
        private readonly router: Router,
        private readonly injector: Injector,
        private readonly location: Location,
        private readonly activatedRoute: ActivatedRoute,
    ) {}

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions.splice(0, this.subscriptions.length);
    }

    /**
     * Loads navigation from the router configuration.
     */
    async setup(): Promise<void> {
        this.ngOnDestroy();

        const config = this.activatedRoute.snapshot.data as NgeDocInfo;

        this.pages.splice(0, this.pages.length);
        this.links.splice(0, this.links.length);

        for (const o of config.pages) {
            const page = await o(this.injector);
            this.createLinks(config, page);
            this.pages.push(page);
        }

        this.subscriptions.push(
            this.router.events
                .pipe(filter((e) => e instanceof NavigationEnd))
                .subscribe(this.onChangeRoute.bind(this, config))
        );

        this.onChangeRoute(config);
    }

    /**
     * Checks whether the given `link` is active.
     * @param link The link to test.
     */
    isActive(link: NgeDocLink): boolean {
        const tree = this.location.path().split('/');
        for (let i = 0; i < tree.length; i++) {
            const path = tree.slice(0, tree.length - i).join('/');
            if (path && path.endsWith(link.href)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks whether the given `link` includes sub links.
     * @param link The link to test.
     */
    isExpandable(link: NgeDocLink): boolean {
        return !!link.children?.length;
    }

    private join(a: string, b: string): string {
        if (a.endsWith('/')) {
            a = a.slice(0, a.length - 1);
        }
        if (b.startsWith('/')) {
            b = b.slice(1);
        }
        return a + '/' + b;
    }

    private createLinks(config: NgeDocInfo, page: NgeDocLink) {
        const createLink = (link: NgeDocLink, parent: string) => {
            link.href = this.join(parent, link.href);
            if (typeof link.content === 'string' && !link.content.endsWith('.md')) {
                link.content += '.md';
            }

            this.links.push(link);
            if (link.children) {
                link.children.forEach((child) => {
                    createLink(child, link.href);
                });
            }
        };
        page.href = this.join(config.meta.root, page.href);
        if (typeof page.content === 'string' && !page.content.endsWith('.md')) {
            page.content += '.md';
        }
        page.children.forEach((link) => createLink(link, page.href));
    }

    private onChangeRoute(config: NgeDocInfo) {
        if (!this.pages) {
            return;
        }

        let {
            currLink,
            prevLink,
            nextLink,
        } = this.state.value;

        const path = this.location.path();

        // https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
        const modulo = (a: number, n: number) => {
            return ((a % n) + n) % n;
        };

        for (let i = 0; i < this.links.length; i++) {
            const link = this.links[i];
            if (link.href === path) {
                const prevIndex = modulo(i - 1, this.links.length);
                const nextIndex = modulo(i + 1, this.links.length);
                currLink = link;
                nextLink = this.links[nextIndex];
                prevLink = this.links[prevIndex];
                break;
            }
        }

        if (!currLink) {
            this.router.navigateByUrl(this.links[0].href);
            return;
        }

        this.state.next({
            pages: this.pages,
            links: this.links,
            prevLink,
            currLink,
            nextLink,
            meta: {
                root: config.meta.root,
                name: config.meta.name,
                repo: config.meta.repo,
                copyright: config.meta.copyright,
            }
        });
    }
}
