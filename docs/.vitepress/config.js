import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Rarebox Docs',
  description: 'Documentation for Rarebox — the privacy-first Pokémon TCG portfolio tracker',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:title', content: 'Rarebox Docs' }],
    ['meta', { property: 'og:description', content: 'Developer and user documentation for Rarebox' }],
    ['meta', { property: 'og:type', content: 'website' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Rarebox Docs',

    nav: [
      { text: 'Guide', link: '/guide/overview' },
      { text: 'Architecture', link: '/architecture/project-structure' },
      { text: 'Contributing', link: '/contributing/setup' },
      { text: 'Rarebox', link: 'https://rarebox.io' },
      { text: 'GitHub', link: 'https://github.com/novaoc/rarebox' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Overview', link: '/guide/overview' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Portfolios', link: '/guide/portfolios' },
            { text: 'Sealed & Graded', link: '/guide/sealed-and-graded' },
            { text: 'Deck Builder', link: '/guide/deck-builder' },
            { text: 'Price Charts & Snapshots', link: '/guide/price-charts' },
            { text: 'Backup & Transfer', link: '/guide/backup-and-transfer' },
            { text: 'PWA Installation', link: '/guide/pwa' },
          ],
        },
      ],
      '/architecture/': [
        {
          text: 'Architecture',
          items: [
            { text: 'Project Structure', link: '/architecture/project-structure' },
            { text: 'Data Flow & Persistence', link: '/architecture/data-flow' },
            { text: 'API Integrations', link: '/architecture/api-integrations' },
            { text: 'Serverless Functions', link: '/architecture/serverless' },
            { text: 'Price Snapshot System', link: '/architecture/snapshots' },
            { text: 'Component Guide', link: '/architecture/components' },
          ],
        },
      ],
      '/contributing/': [
        {
          text: 'Contributing',
          items: [
            { text: 'Development Setup', link: '/contributing/setup' },
            { text: 'Code Style', link: '/contributing/code-style' },
            { text: 'Pull Request Guidelines', link: '/contributing/pull-requests' },
            { text: 'API Rate Limits', link: '/contributing/rate-limits' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Data Schema', link: '/reference/data-schema' },
            { text: 'Environment Variables', link: '/reference/env-vars' },
            { text: 'Deployment', link: '/reference/deployment' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/novaoc/rarebox' },
    ],

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/novaoc/rarebox-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Built by <a href="https://www.threads.com/@novaoc_18584" target="_blank">Nova</a>',
    },
  },
})
