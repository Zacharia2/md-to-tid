import { Processor, unified } from 'unified';
import remarkParse from 'remark-parse';
import { VFile } from 'vfile';
import retidStringify, { IOptions } from './retid-stringify';

export const md2tidProcessor: Processor = unified().use(remarkParse).use(retidStringify);

export async function md2tid(markdownString: string): Promise<string> {
  const vFile = new VFile({ path: 'fileName', value: markdownString });
  const file = await md2tidProcessor.process(vFile);
  return file.value as string;
}

export function toString(value: any, options: IOptions) {
  if (typeof value === 'string') {
    value = { type: 'paragraph', children: [{ type: 'text', value }] };
  }

  if (value.type !== 'root') {
    value = { type: 'root', children: [value] };
  }

  return unified().use(retidStringify, options).stringify(value);
}
