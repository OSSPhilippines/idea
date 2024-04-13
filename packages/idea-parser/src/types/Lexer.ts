//types
import type { Definition, Reader, Parser, Token } from '../types';

import Exception from './Exception';

export default class Lexer implements Parser {
  //the code to parse
  protected _code = '';
  //the current index
  protected _index = 0;
  //a collection of definitions
  protected _dictionary: Record<string, Definition> = {};

  /**
   * Returns the shallow copy of the dictionary
   */
  get dictionary() {
    return { ...this._dictionary };
  }

  /**
   * Returns the current index
   */
  get index() {
    return this._index;
  }

  /**
   * Clones the lexer at it's exact state
   */
  public clone() {
    const lexer = new Lexer();
    lexer.load(this._code, this._index);
    for (const key in this._dictionary) {
      lexer.define(key, this._dictionary[key].reader);
    }
    return lexer;
  }

  /**
   * Makes a new definition
   */
  public define(key: string, reader: Reader) {
    this._dictionary[key] = { key, reader };
  }

  /**
   * Returns a token that matches any of the given names
   */
  public expect<T = Token>(keys: string|string[]) {
    if (!Array.isArray(keys)) {
      keys = [keys];
    }
    //get definition
    const definitions = keys.map(key => {
      const reader = this.get(key);
      if (!reader) {
        throw Exception.for('Unknown definition %s', key);
      }
      return reader;
    }).filter(Boolean);
    //throw if no definition
    if (!definitions.length) {
      throw Exception.for(
        'Unknown definitions %s', 
        keys.join(', ')
      );
    }
    //get match (sorted by names defined above)
    const match = this.match(this._code, this._index, keys)[0];
    //if no match
    if (!match) {
      //throw exception
      if (this._code[this._index + 10]) {
        throw Exception.for(
          'Unexpected %s ... expecting %s', 
          this._code
            .substring(this._index, this._index + 10)
            .replace(/[\n\r]/g, ' ')
            .trim(),
            keys.join(' or ')
        ).withPosition(this._index, this.nextSpace());
      } else {
        throw Exception.for(
          'Unexpected %s expecting %s', 
          this._code.substring(this._index, this._index + 10),
          keys.join(' or ')
        ).withPosition(this._index, this.nextSpace());
      }
    }
    //fast forward index
    this._index = match.end;
    return match as T;
  }

  /**
   * Returns the test for a given definition
   */
  public get(key: string) {
    return this._dictionary[key];
  }

  /**
   * Loads the code
   */
  public load(code: string, index = 0) {
    this._code = code;
    this._index = index;
    return this;
  }

  /**
   * Returns all the matching definitions for a given value
   */
  public match(code: string, start: number, keys?: string[]) {
    //if no names, get all names
    keys = keys || Object.keys(this._dictionary);
    //make the dictionary based on the order of names
    const dictionary = keys
      //add the definitions to dictionary
      .map(key => {
        const reader = this.get(key);
        if (!reader) {
          throw Exception.for('Unknown definition %s', key);
        }
        return reader;
      })
      //filter out undefined definitions
      .filter(Boolean);
    //storage for matches
    const matches: Token[] = [];
    //loop through dictionary
    for (const { reader } of dictionary) {
      const results = reader(code, start, this);
      //end is greater than start
      if (results && results.end > start) {
        //add to matches
        matches.push(results);
      }
    }
    return matches;
  }

  /**
   * Tests to see if the next set of characters match the given names
   */
  public next(names: string|string[]) {
    const start = this._index;
    try {
      this.expect(names);
      this._index = start;
      return true;
    } catch (error) {
      this._index = start;
      return false;
    }
  }

  /**
   * Possible returns a token that matches any of the given names 
   */
  public optional<T = Token>(names: string|string[]) {
    const start = this._index;
    try {
      return this.expect<T>(names);
    } catch (error) {
      this._index = start;
      return undefined;
    }
  }

  /**
   * Reads ahead and tries determines the next token
   */
  public read() {
    return this.optional(Object.keys(this.dictionary));
  }

  /**
   * Allows to read a substring of the code
   */
  public substring(start: number, end: number) {
    return this._code.substring(start, end);
  }

  /**
   * Finds the next space (for language server)
   */
  public nextSpace() {
    const index = this._code.indexOf(' ', this._index);
    return index === -1 ? this._code.length : index;
  }
}