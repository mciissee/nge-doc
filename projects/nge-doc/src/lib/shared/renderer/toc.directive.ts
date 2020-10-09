import { Location } from '@angular/common';
import { ComponentRef, Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

@Directive({ selector: '[ngeDocToc]' })
export class NgeDocTocDirective implements OnDestroy, OnChanges {
    private intersection?: IntersectionObserver;

    @Input('ngeDocToc')
    component?: ComponentRef<any>;

    constructor(
        private readonly el: ElementRef<HTMLElement>,
        private readonly location: Location,
    ) { }

    ngOnDestroy() {
        this.intersection?.disconnect();
    }

    ngOnChanges() {
        const container = this.el.nativeElement;
        container.innerHTML = '';
        if (this.component) {
            this.buildToc(this.component);
        }
    }

    private buildToc(component: ComponentRef<any>) {
        const cmp = component.injector.get(ElementRef).nativeElement as HTMLElement;
        const build = () => {
            const container = this.el.nativeElement;
            const nodes = Array.from(
                cmp.children
            ).filter(node => node.tagName === 'H2');
            if (!nodes.length) {
                return;
            }
            const anchors: HTMLElement[] = [];
            const rect = container.getBoundingClientRect();
            const bottom = -window.innerHeight + rect.y + 200;
            this.intersection?.disconnect();
            this.intersection = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        anchors.forEach(anchor => {
                            anchor.classList.remove('active');
                            const a = anchor.getAttribute('data-spy');
                            const b = entry.target.getAttribute('data-spy');
                            if (a === b) {
                                anchor.classList.add('active');
                            }
                        });
                    }
                });
            }, {
                // A BOX OF 200px STARTING AT THE POSITION OF THE TOC ELEMENT
                rootMargin: `0px 0px ${bottom}px 0px`
            });
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

                node.setAttribute('data-spy', id);
                li.setAttribute('data-spy', id);
                anchors.push(li);
                this.intersection.observe(node);
            });
            container.appendChild(ul);
        };

        build();

        const observer = new MutationObserver(() => {
            observer?.disconnect();
            build();
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
