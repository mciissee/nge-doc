import { Injector, Type } from '@angular/core';

declare type StaticPage = NgeDocLink;
declare type DynamicPage = (injector: Injector) => NgeDocLink | Promise<NgeDocLink>;

declare type StaticMeta = NgeDocMeta;
declare type DynamicMeta = (injector: Injector) => NgeDocMeta | Promise<NgeDocMeta>;

declare type NgeDocRenderer = string | Promise<string> | Type<any> | Promise<Type<any>>;

/** Documentation site config. */
export interface NgeDocSettings {
    /** Metadata informations about a documentation site. */
    meta: StaticMeta | DynamicMeta;
    /** Pages of the documentation site. */
    pages: (StaticPage | DynamicPage)[];
    /**
     * Reference to a component that can render markdown content.
     *
     * The component should expose a `file` property to render a markdown from an url
     * and a `data` property to render markdown from a string.
     */
    markdownRenderer?: Type<any> | Promise<Type<any>>;
}

/** Metadata informations about a documentation site. */
export interface NgeDocMeta {
    /** Name of the documentation site. */
    name: string;
    /** Root url of the documentation site.  */
    root: string;
    /** Optional informations about a github repository linked to the site */
    repo?: {
        /** Url of the repository */
        url: string;
        /** Name of the repository. */
        name: string;
    };
    /** Copyright informations */
    copyright: string;
}

/**
 * Representation of a link in the documentation navigation.
 */
export interface NgeDocLink {
    /** Url to display in the browser navigation bar. */
    href: string;
    /** Title of the link */
    title: string;
    /**
     * Content to render once the link is displayed.
     *
     * - A one line string value means that the renderer is an url to a markdown file to render.
     *
     * Example:
     *
     * `renderer: assets/my-file.md`
     *
     * - A multiline string value means that the renderer is a markdown string to render.
     *
     * Example:
     *
     * `renderer: "# My Title \n my paragraph \n ...."
     *
     * - A reference to a Component type means that the renderer is a dynamic component to render.
     *
     *  Example:
     *
     *  `renderer: MyComponent` // direct reference to a component
     *
     *  `renderer: import(....).then(m => m.MyComponent)` // reference to a lazy loaded component.
     *
     */
    renderer: NgeDocRenderer;
    /** Sub links */
    children?: NgeDocLink[];
    /** A value indicating whether the link is expanded or not. */
    expanded?: boolean;
}

/** Representation of the documentation state. */
export interface NgeDocState {
    /**  Metadata informations about the documentation. */
    meta: NgeDocMeta;
    /** List of all links of the site. */
    links: NgeDocLink[];
    /** Root links of the site. */
    pages: NgeDocLink[];
    /** Current active link. */
    currLink?: NgeDocLink;
    /** Previous link of the current link. */
    prevLink?: NgeDocLink;
    /** Next link of the current link. */
    nextLink?: NgeDocLink;
}
