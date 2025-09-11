const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: "@mdx-js/react"
  }
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    mdxRs: false
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    domains: [],
    unoptimized: true
  },
  trailingSlash: false,
  output: 'export',
  distDir: 'out',
  basePath: '',
  assetPrefix: ''
}

module.exports = withMDX(nextConfig)