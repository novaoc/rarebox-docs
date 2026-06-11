/**
 * Rarebox Documentation
 * Built by Nova — GitHub: @novaoc
 * https://docs.rarebox.io
 */
import { defineConfig } from 'vitepress'

export default defineConfig({
  cleanUrls: true,
  title: 'Rarebox Docs',
  description: 'Documentation for Rarebox — the privacy-first multi-TCG portfolio tracker',
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { property: 'og:title', content: 'Rarebox Docs' }],
    ['meta', { property: 'og:description', content: 'Developer and user documentation for Rarebox' }],
    ['meta', { property: 'og:type', content: 'website' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Rarebox Docs',

    nav: [
      { text: 'Guide', link: '/guide/overview' },
      { text: 'Design', link: '/design/tactile' },
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
            { text: 'Shelves', link: '/guide/portfolios' },
            { text: 'Sealed & Graded', link: '/guide/sealed-and-graded' },
            { text: 'Deck Builder', link: '/guide/deck-builder' },
            { text: 'Price Charts & Snapshots', link: '/guide/price-charts' },
            { text: 'Backup & Transfer', link: '/guide/backup-and-transfer' },
            { text: 'Card Booth', link: '/guide/booth' },
            { text: 'PWA & Offline', link: '/guide/pwa' },
          ],
        },
      ],
      '/design/': [
        {
          text: 'Design',
          items: [
            { text: 'Tactile — Design System & Branding', link: '/design/tactile' },
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
            { text: 'Static Data Pipeline', link: '/architecture/serverless' },
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

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Built by <a href="https://www.threads.com/@novaoc_18584" target="_blank">Nova</a>',
    },
  },
})
