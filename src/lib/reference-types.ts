export type ReferenceFormat={name:string;url:string;familyName:string;familySlug:string;marketSlug:string;summary:string;material:string;facts:{label:string;value:string}[];variants:string[]};
export type ExpandedFamily={name:string;marketSlug:string;summary:string;material:string;focus:string[];application:string;sourceURLs:string[]};
export type TechnicalGuide={slug:string;section:string;source:string;sections:{heading:string;text:string}[];facts:{label:string;value:string}[]};
