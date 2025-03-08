import { Options as IToMarkdownOptions, toTid } from '../mdast-util-to-wikitext';
import { Plugin, CompilerFunction } from 'unified';
import { merge } from 'lodash';
export type IOptions = Omit<IToMarkdownOptions, 'extensions'>;
import type { Nodes } from 'mdast';

// @ts-expect-error: bad type written by unified author.
export const retidStringify: Plugin<[(IOptions | undefined)?] | void[], Nodes, string> = function (options) {
  const compiler: CompilerFunction<any, string> = (tree) => {
    // Assume options.
    const settings = this.data('settings') as IOptions;

    return toTid(
      tree,
      merge({ bullet: '*', bulletOrdered: '#', incrementListMarker: false }, settings, options, {
        // Note: this option is not in the readme.
        // The goal is for it to be set by plugins on `data` instead of being
        // passed by users.
        extensions: this.data('toMarkdownExtensions') || ([] as IToMarkdownOptions['extensions']),
      }) as IOptions,
    );
  };

  Object.assign(this, { Compiler: compiler });
};
export default retidStringify;
