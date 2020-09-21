import { InjectionToken, Injector } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

declare type NgeDocContent = string | ComponentType<any>;

/** Documentation site config. */
export interface NgeDocInfo {
    /** Metadata informations about a documentation site. */
    meta: (injector: Injector) => NgeDocMeta | Promise<NgeDocMeta>;
    /** Pages of the documentation site. */
    pages: ((injector: Injector) => NgeDocLink | Promise<NgeDocLink>)[];
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
    /** Sub links */
    children?: NgeDocLink[];
    /** Content of the link (link to a markdown file or a Component to render). */
    content: NgeDocContent;
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
