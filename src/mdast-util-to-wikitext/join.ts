import type { Context, Join, Parent, Nodes } from './types';

import { formatCodeAsIndented } from './util/format-code-as-indented';

export const join: Join[] = [joinDefaults];

function joinDefaults(left: Nodes, right: Nodes, parent: Parent, context: Context): boolean | null | void | number {
  // Indented code after list or another indented code.
  if (
    right.type === 'code' &&
    formatCodeAsIndented(right, context) &&
    (left.type === 'list' || (left.type === right.type && formatCodeAsIndented(left, context)))
  ) {
    return false;
  }

  // Two lists with the same marker.
  if (
    left.type === 'list' &&
    left.type === right.type &&
    Boolean(left.ordered) === Boolean(right.ordered) &&
    !(left.ordered ? context.options.bulletOrderedOther : context.options.bulletOther)
  ) {
    return false;
  }

  // Join children of a list or an item.
  // In which case, `parent` has a `spread` field.
  if ('spread' in parent && typeof parent.spread === 'boolean') {
    if (
      left.type === 'paragraph' &&
      // Two paragraphs.
      (left.type === right.type || right.type === 'definition')
    ) {
      return;
    }

    return parent.spread ? 1 : 0;
  }
}
