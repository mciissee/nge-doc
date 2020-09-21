import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    NgeMarkdownTabbedSetProvider,
    NgeMarkdownAdmonitionsProvider,
    NgeMarkdownLinkAnchorProvider,
    NgeMarkdownKatexProvider,
    NgeMarkdownEmojiProvider,
    NgeMarkdownIconsProvider,
    NGE_MARKDOWN_HIGHLIGHTER_CONFIG,
    NgeMarkdownHighlighterProvider,
    NgeMarkdownHighlighterConfig
} from 'nge-markdown';
import { NGE_THEMES, NgeMonacoModule, NgeMonacoColorizerService } from 'nge-monaco';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,

        NgeMonacoModule.forRoot({
            theming: {
                themes: NGE_THEMES.map(theme => 'assets/themes/' + theme),
                default: 'github'
            }
        }),
    ],
    providers: [
        NgeMarkdownTabbedSetProvider,
        NgeMarkdownAdmonitionsProvider,
        NgeMarkdownLinkAnchorProvider,
        NgeMarkdownKatexProvider,
        NgeMarkdownEmojiProvider,
        NgeMarkdownIconsProvider,
        NgeMarkdownHighlighterProvider,
        {
            provide: NGE_MARKDOWN_HIGHLIGHTER_CONFIG,
            useValue: {
                highligtht: async (injector, options) => {
                    const colorizer = injector.get(NgeMonacoColorizerService, null);
                    const code = options.element;
                    const pre = code.parentElement as HTMLElement;
                    await colorizer?.colorizeElement({
                        element: code,
                        language: options.language,
                        code: code.innerHTML,
                        lines: options.lines,
                        highlights: options.highlights
                    });
                    if (!pre.classList.contains('monaco-editor')) {
                        pre.classList.add('monaco-editor');
                        pre.classList.add('monaco-editor-background');
                    }
                    pre.style.margin = '0.5em 0';
                    pre.style.overflow = 'auto';
                    pre.style.border = '1px solid #F2F2F2';
                }
            } as NgeMarkdownHighlighterConfig
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
