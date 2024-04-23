//types
import type { PluginConfig, SchemaConfig } from '@ossph/idea-parser';
//others
import fs from 'fs';
import { final, Exception } from '@ossph/idea-parser';
import Loader from './Loader';

export type PluginProps<T extends {}> = T & {
  config: PluginConfig,
  schema: SchemaConfig,
  cwd: string
};

export default class Transformer<T extends {}> {
  //current working directory
  protected _cwd;
  //cached input file
  protected _input = '';
  //cached schema
  protected _schema: SchemaConfig|null = null;

  /**
   * Tries to load the schema file
   */
  get schema() {
    if (!this._schema) {
      //check if input file exists
      if (!fs.existsSync(this._input)) {
        throw Exception.for('Input file %s does not exist', this._input);
      }
      this._schema = final(fs.readFileSync(this._input, 'utf8'));
    }

    return this._schema;
  }

  /**
   * Preloads the input
   */
  constructor(input: string, cwd = Loader.cwd()) {
    this._input = input;
    this._cwd = cwd;
  }

  /**
   * Runs a transformer plugin
   */
  public run(
    callback: Function, 
    config: Record<string, any> = {}, 
    extras?: T
  ) {
    //remove the plugin and prop from the parsed schema
    const { plugin, prop, ...schema } = this.schema;
    const props = { 
      ...extras, 
      config, 
      schema, 
      cwd: this._cwd 
    } as PluginProps<T>;
    //call the callback
    callback(props);
  }

  /**
   * Transform all plugins
   */
  public transform(extras?: T) {
    //if no plugins defined throw error
    if (!this.schema.plugin) {
      throw Exception.for('No plugins defined in schema file');
    }
    //loop through plugins
    for (const plugin in this.schema.plugin) {
      //determine the module path
      const module = Loader.absolute(plugin, this._cwd);
      //get the plugin config
      const config = this.schema.plugin[plugin] as Record<string, any>;
      //load the callback
      let callback = Loader.require(module);
      //check for default
      if (callback.default) {
        callback = callback.default;
      }
      //check if it's a function
      if (typeof callback === 'function') {
        //call the callback
        this.run(callback, config, extras);
      }
      //dont do anything else if it's not a function
    }
  }
}