import { InjectionToken, Injector, Type } from '@angular/core';

declare type StaticPage = NgeDocLink;
declare type DynamicPage = (injector: Injector) => NgeDocLink | Promise<NgeDocLink> | NgeDocLink[] | Promise<NgeDocLink[]>;

declare type StaticMeta = NgeDocMeta;
declare type DynamicMeta = (injector: Injector) => NgeDocMeta | Promise<NgeDocMeta>;

declare type NgeDocRenderer = string | Promise<string> | (() => (Type<any> | Promise<Type<any>>));

declare type NgeDocRenderers = {
    /** Markdown renderer. */
    markdown: {
        /**
         * Reference to a component that can render markdown content.
         *
         * The component should expose a `file` property to render a markdown from an url
         * and a `data` property to render markdown from a string.
         */
        component: () => (Type<any> | Promise<Type<any>>);
        /** Inputs objects to pass to the component instance. */
        inputs?: Record<string, any> | ((injector: Injector) => (Record<string, any> | Promise<Record<string, any>>));
    }
};

/** Documentation site config. */
export interface NgeDocSettings {
    /** Metadata informations about a documentation site. */
    meta: StaticMeta | DynamicMeta;
    /** Pages of the documentation site. */
    pages: (StaticPage | DynamicPage)[];
    renderers?: NgeDocRenderers;
}

/** Metadata informations about a documentation site. */
export interface NgeDocMeta {
    /** Name of the documentation site. */
    name: string;
    /** Root url of the documentation site. (absolute url starting with `/`)  */
    root: string;
    /** Url to the logo to the documentation logo. */
    logo?: string;
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
     *  `renderer: () => MyComponent` // direct reference to a component
     *
     *  `renderer: () => import(....).then(m => m.MyComponent)` // reference to a lazy loaded component.
     *
     * - A reference to a Module type means that the renderer is a dynamic component to render.
     *
     *  `renderer: () => MyModule` // direct reference to a module
     *
     *  `renderer: () => import(....).then(m => m.MyModule)` // reference to a lazy loaded module.
     *
     * The difference between referencing a module and referencing a component is the following:
     *  - If you reference a module the dependencies (CommonModule, SharedModule...) of the component
     *    that you want to render will be resolved.
     *  - If you reference a component the dependencies will not be loaded.
     *
     * If you choose to reference a module, the module must contains a public field `component` that indicates
     * the component that you want to render.
     */
    renderer: NgeDocRenderer;
    /** Sub links */
    children?: NgeDocLink[];
    /** A value indicating whether the link is expanded or not. */
    expanded?: boolean;
    /** Inputs to pass to the dynamic renderered component if `renderer` is a dynamic component. */
    inputs?: Record<string, any>;
    /** Optional icon */
    icon?: string;
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

/** Custom renderers components */
export const NGE_DOC_RENDERERS = new InjectionToken<NgeDocRenderers>(
    'NGE_DOC_RENDERERS'
);
