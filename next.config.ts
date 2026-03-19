import { cpSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
import type { NextConfig } from 'next';

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

const withCloudflarePages = (nextConfig: NextConfig): NextConfig => ({
  ...nextConfig,
  webpack(config, options) {
    const userWebpack = nextConfig.webpack;

    if (!options.dev && options.isServer) {
      const staticAssetsPath = join(process.cwd(), 'public');
      const cloudflareAssetsPath = join(process.cwd(), '.vercel', 'output', 'static');

      if (existsSync(staticAssetsPath)) {
        cpSync(staticAssetsPath, cloudflareAssetsPath, { recursive: true });
      }
    }

    return userWebpack ? userWebpack(config, options) : config;
  },
});

const nextConfig: NextConfig = {};

export default withCloudflarePages(nextConfig);
