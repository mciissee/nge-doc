import {
    AfterViewInit,
    Component,
    ComponentRef,
    ElementRef,
    Injector,
    OnDestroy,
    Type,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NgeDocState, NGE_DOC_RENDERERS } from '../nge-doc';
import { NgeDocService } from '../nge-doc.service';
import { RendererService } from './renderer.service';

@Component({
    selector: 'nge-doc-renderer',
    templateUrl: 'renderer.component.html',
    styleUrls: ['renderer.component.scss'],
    providers: [RendererService]
})
export class NgeDocRendererComponent implements AfterViewInit, OnDestroy {
    @ViewChild('container', { read: ViewContainerRef })
    container!: ViewContainerRef;

    component?: ComponentRef<any>;
    loading = false;

    private subscription?: Subscription;
    private markdownRenderer?: Type<any>;
    private observer?: MutationObserver;

    constructor(
        private readonly doc: NgeDocService,
        private readonly injector: Injector,
        private readonly renderer: RendererService,
    ) {}

    async ngAfterViewInit() {
        this.subscription = this.doc.stateChanges.subscribe(
            this.onChangeRoute.bind(this)
        );
    }

    ngOnDestroy() {
        this.clearViewContainer();
        this.observer?.disconnect();
        this.subscription?.unsubscribe();
    }

    private async onChangeRoute(state: NgeDocState) {
        this.clearViewContainer();
        this.loading = true;
        this.component = undefined;
        let component: ComponentRef<any> | undefined;
        if (state.currLink) {
            const renderer = await state.currLink.renderer;
            switch (typeof renderer) {
                case 'string':
                    component = await this.rendererMarkdown(renderer);
                    break;
                case 'function':
                    component = await this.renderer.render({
                        type: await renderer(),
                        inputs: state.currLink.inputs,
                        container: this.container,
                    });
                    break;
            }
        }

        if (component) {
            const cmp = component.injector.get(ElementRef).nativeElement as HTMLElement;
            this.observer?.disconnect();
            this.observer = new MutationObserver(() => {
                this.observer?.disconnect();
                this.component = component;
                this.loading = false;
            });
            this.observer.observe(cmp, {
                childList: true,
                subtree: true,
            });
        }
    }

    private async rendererMarkdown(markdown: string) {
        const renderers = this.injector.get(NGE_DOC_RENDERERS);
        if (!renderers?.markdown) {
            throw new Error(
                '[nge-doc]: missing markdown renderer.'
            );
        }

        const renderer = renderers.markdown;
        let inputs: Record<string, any> = {
            file: markdown // we assume that a string in one line is an url to a markdown file.
        };

        if (markdown.includes('\n')) { // markdown string contains at least two line
            inputs = {
                data: markdown
            };
        }

        let customInputs: Record<string, any> = {};
        if (typeof renderer.inputs === 'function') {
            customInputs = await renderer.inputs(this.injector);
        } else if (typeof renderer.inputs === 'object') {
            customInputs = renderer.inputs;
        }

        if (!this.markdownRenderer) {
            this.markdownRenderer = await renderer.component();
        }

        return await this.renderer.render({
            inputs: {
                ...customInputs,
                ...inputs,
            },
            type: this.markdownRenderer,
            container: this.container
        });
    }

    private clearViewContainer() {
        this.component?.destroy();
        this.component = undefined;
        this.container.clear();
    }
}
