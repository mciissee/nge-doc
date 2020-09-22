import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// LIBS
import { NGE_THEMES, NgeMonacoModule, NgeMonacoColorizerService } from 'nge-monaco';
import {
    NgeMarkdownTabbedSetProvider,
    NgeMarkdownAdmonitionsProvider,
    NgeMarkdownLinkAnchorProvider,
    NgeMarkdownKatexProvider,
    NgeMarkdownEmojiProvider,
    NgeMarkdownIconsProvider,
    NgeMarkdownHighlighterProvider,
    NgeMarkdownHighlighterMonacoProvider
} from 'nge-markdown';

// MODULE
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
        NgeMarkdownHighlighterMonacoProvider(NgeMonacoColorizerService),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
