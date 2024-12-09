/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    // By default, Docusaurus generates a sidebar from the docs folder structure
    tutorialSidebar: [{ type: 'autogenerated', dirName: '.' }],
    openApiSidebar: [
        {
            type: 'category',
            label: 'Flagsmith API',
            link: {
                type: 'generated-index',
                title: 'Edge API Specification',
                slug: '/edge-api',
            },
            // @ts-ignore
            items: require('./docs/edge-api/sidebar.ts'),
        },
    ],
};

export default sidebars;
