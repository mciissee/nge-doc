import {
    Component,
    ComponentRef,
    OnDestroy,
    OnInit,
    ViewContainerRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RendererService } from './renderer.service';
import { NgeDocSettings, NgeDocState } from '../../nge-doc';
import { NgeDocService } from '../../nge-doc.service';

@Component({
    selector: 'nge-doc-renderer',
    template: '',
    providers: [RendererService]
})
export class NgeDocRendererComponent implements OnInit, OnDestroy {
    private subscription?: Subscription;
    private component?: ComponentRef<any>;

    constructor(
        private readonly doc: NgeDocService,
        private readonly route: ActivatedRoute,
        private readonly renderer: RendererService,
        private readonly container: ViewContainerRef,
    ) {}

    async ngOnInit() {
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
        const settings = this.route.snapshot.data as NgeDocSettings;
        const renderer = settings.markdownRenderer;
        if (!renderer) {
            throw new Error(
                '[nge-doc]: missing provider for NGE_DOC_MARKDOWN_RENDERER.'
            );
        }

        let inputs: any = {
            file: markdown // we assume that a string in one line is an url to a markdown file.
        };

        if (markdown.includes('\n')) { // markdown string contains at least two line
            inputs = {
                data: markdown
            };
        }

        this.component = await this.renderer.render({
            inputs,
            type: await renderer(),
            container: this.container
        });
    }

    private clearViewContainer() {
        this.component?.destroy();
        this.component = undefined;
        this.container.clear();
    }
}
