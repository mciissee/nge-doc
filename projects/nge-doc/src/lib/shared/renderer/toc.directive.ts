import { Location } from '@angular/common';
import { ComponentRef, Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({ selector: '[ngeDocToc]' })
export class NgeDocTocDirective implements OnChanges {

    @Input('ngeDocToc')
    component?: ComponentRef<any>;

    constructor(
        private readonly el: ElementRef<HTMLElement>,
        private readonly location: Location,
    ) { }

    ngOnChanges() {
        const container = this.el.nativeElement;
        container.innerHTML = '';
        if (this.component) {
            this.buildToc(this.component);
        }
    }

    private buildToc(component: ComponentRef<any>) {
        const toc = this.el.nativeElement;
        const cmp = component.injector.get(ElementRef).nativeElement as HTMLElement;
        const observer = new MutationObserver(() => {
            observer?.disconnect();
            const nodes = Array.from(
                cmp.children
            ).filter(node => node.tagName === 'H2');
            if (!nodes.length) {
                return;
            }
            const ul = document.createElement('ul');
            nodes.forEach(node => {
                const id = this.dashify(node.textContent);
                const target = document.createElement('span');
                target.id = id;
                node.insertAdjacentElement('afterend', target);

                const li = document.createElement('li');
                const anchor = document.createElement('a');
                anchor.innerHTML = node.innerHTML;
                anchor.href = '#';
                anchor.href = this.location.path() + '#' + id;
                li.appendChild(anchor);
                ul.appendChild(li);
            });
            toc.appendChild(ul);
        });
        observer.observe(cmp, {
            childList: true,
            subtree: true,
        });

    }

    private dashify(input: string) {
        return input.trim()
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/\W/g, m => /[À-ž]/.test(m) ? m : '-')
            .replace(/^-+|-+$/g, '')
            .replace(/-{2,}/g, m => '-') // Condense multiple consecutive dashes to one.
            .toLowerCase();
    }
}
