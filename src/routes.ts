import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('lib/pages/home/index.tsx'),
  route('privacy', 'lib/pages/privacy/index.tsx'),
  route('*', 'lib/pages/404/index.tsx'),
] satisfies RouteConfig;
