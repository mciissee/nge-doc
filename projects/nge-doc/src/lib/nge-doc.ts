import { ComponentType } from '@angular/cdk/portal';
import { Injector } from '@angular/core';

declare type NgeDocContent = string | ComponentType<any>;

declare type StaticPage = NgeDocLink;
declare type DynamicPage = (injector: Injector) => NgeDocLink | Promise<NgeDocLink>;

declare type StaticMeta = NgeDocMeta;
declare type DynamicMeta = (injector: Injector) => NgeDocMeta | Promise<NgeDocMeta>;

/** Documentation site config. */
export interface NgeDocInfo {
    /** Metadata informations about a documentation site. */
    meta: StaticMeta | DynamicMeta;
    /** Pages of the documentation site. */
    pages: (StaticPage | DynamicPage)[];
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
    /** A value indicating whether the link is expanded or not. */
    expanded?: boolean;
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
