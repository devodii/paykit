import { logger, ValidationError, Webhook } from '@paykit-sdk/core';
import { server$HandleWebhook } from '../server';

/**
 * Types for creating a basic Vite plugin, extracted from vite 7.0.4
 */
interface ViteDevServer {
  middlewares: {
    use(path: string, handler: (req: any, res: any, next?: () => void) => void): void;
  };
}

interface Plugin {
  name: string;
  configureServer?(server: ViteDevServer): void | (() => void) | Promise<void | (() => void)>;
  [key: string]: any;
}

export interface WithViteWebhookOptions {
  /**
   * API path prefix for the plugin routes
   * @default '/api/paykit'
   */
  prefix?: string;
  webhook: Webhook;
}

export const withViteWebhook = (options: WithViteWebhookOptions): Plugin => {
  const { prefix = '/api/paykit', webhook } = options;

  return {
    name: 'paykit-local-provider-vite',
    configureServer(server) {
      server.middlewares.use(prefix, async (req, res) => {
        try {
          logger.info(`[PayKit] ${req.method} ${req.url}`);

          const method = req.method?.toLowerCase();

          // Only handle POST requests for webhooks
          if (method !== 'post') {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Only POST webhook requests are supported' }));
            return;
          }

          await handleWebhook(req, res, webhook);
        } catch (error) {
          logger.error(`[PayKit] Error: ${error instanceof Error ? error.message : 'Unknown error'}`);

          if (error instanceof ValidationError) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: error.message }));
          } else {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal server error' }));
          }
        }
      });
    },
  };
};

async function handleWebhook(req: any, res: any, webhook: Webhook) {
  try {
    const result = await server$HandleWebhook(req.url, webhook);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (error) {
    logger.error(`[PayKit] Webhook error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Failed to process webhook' }));
  }
}
