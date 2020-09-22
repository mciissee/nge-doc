import { ComponentType } from '@angular/cdk/portal';
import {
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    OnDestroy,
    OnInit,
    ViewContainerRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgeDocSettings, NgeDocState } from '../../nge-doc';
import { NgeDocService } from '../../nge-doc.service';

@Component({
    selector: 'nge-doc-renderer',
    template: '',
})
export class NgeDocRendererComponent implements OnInit, OnDestroy {
    private subscription?: Subscription;
    private dynamicComponentRef?: ComponentRef<any>;
    private markdownComponentRef?: ComponentRef<any>;

    constructor(
        private readonly doc: NgeDocService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly componentFactoryResolver: ComponentFactoryResolver
    ) {}

    async ngOnInit() {
        this.subscription = this.doc.stateChanges.subscribe(
            this.onChangeRoute.bind(this)
        );
    }

    ngOnDestroy(): void {
        this.clearViewContainer();
        this.subscription?.unsubscribe();
    }

    private async onChangeRoute(state: NgeDocState) {
        if (state.currLink) {
            const renderer = await state.currLink.renderer;
            switch (typeof renderer) {
                case 'string':
                    await this.rendererMarkdown(renderer);
                    break;
                case 'function':
                    this.renderDynamicComponent(renderer);
                    break;
            }
        }
    }

    private async rendererMarkdown(markdown: string) {
        const settings = this.activatedRoute.snapshot.data as NgeDocSettings;
        const renderer = settings.markdownRenderer;
        if (!renderer) {
            throw new Error(
                '[nge-doc]: missing provider for NGE_DOC_MARKDOWN_RENDERER.'
            );
        }

        this.clearViewContainer();

        const factory = this.componentFactoryResolver.resolveComponentFactory(
            await renderer
        );

        this.markdownComponentRef = this.viewContainerRef.createComponent(factory);
        if (markdown.includes('\n')) { // markdown string contains at least two line
            this.markdownComponentRef.instance.data = markdown;
        } else { // we assume that a string in one line is an url to a markdown file.
            this.markdownComponentRef.instance.file = markdown;
        }

        this.markdownComponentRef.instance.ngOnChanges();
    }

    private async renderDynamicComponent(type: ComponentType<any>) {
        this.clearViewContainer();
        const factory = this.componentFactoryResolver.resolveComponentFactory(type);
        this.dynamicComponentRef = this.viewContainerRef.createComponent(factory);
    }

    private clearViewContainer() {
        this.markdownComponentRef?.destroy();
        this.markdownComponentRef = undefined;
        this.dynamicComponentRef?.destroy();
        this.dynamicComponentRef = undefined;
        this.viewContainerRef.clear();
    }
}
