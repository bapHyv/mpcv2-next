import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl({
  ...nextConfig,
  "next-intl/config": "./app/i18n.ts",
});
