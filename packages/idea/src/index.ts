import type { PluginConfig, SchemaConfig } from '@ossph/idea-parser';
import { Terminal, Loader } from '@ossph/idea-transformer';

export * from '@ossph/idea-parser';
export { Terminal, Loader };
export type PluginProps = {
  config: PluginConfig,
  schema: SchemaConfig,
  cli: Terminal
};