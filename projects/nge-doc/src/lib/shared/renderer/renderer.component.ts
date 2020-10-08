import {
    AfterViewInit,
    Component,
    ComponentRef,
    ElementRef,
    Injector,
    OnDestroy,
    OnInit,
    Type,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RendererService } from './renderer.service';
import { NgeDocSettings, NgeDocState, NGE_DOC_RENDERERS } from '../../nge-doc';
import { NgeDocService } from '../../nge-doc.service';

@Component({
    selector: 'nge-doc-renderer',
    templateUrl: 'renderer.component.html',
    styleUrls: ['renderer.component.scss'],
    providers: [RendererService]
})
export class NgeDocRendererComponent implements AfterViewInit, OnDestroy {
    @ViewChild('toc', { read: ViewContainerRef })
    container!: ViewContainerRef;
    component?: ComponentRef<any>;

    private subscription?: Subscription;
    private markdownRenderer?: Type<any>;

    constructor(
        private readonly doc: NgeDocService,
        private readonly route: ActivatedRoute,
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
        this.subscription?.unsubscribe();
    }

    private async onChangeRoute(state: NgeDocState) {
        this.clearViewContainer();
        if (state.currLink) {
            const renderer = await state.currLink.renderer;
            switch (typeof renderer) {
                case 'string':
                    await this.rendererMarkdown(renderer);
                    break;
                case 'function':
                    this.component = await this.renderer.render({
                        type: await renderer(),
                        inputs: state.currLink.inputs,
                        container: this.container,
                    });
                    break;
            }
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
        this.component = await this.renderer.render({
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
