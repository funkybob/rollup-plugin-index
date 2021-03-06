import * as fs from 'fs';
import * as path from 'path';
import { parse, serialize } from 'parse5';

/**
 * Strip all #text nodes from the element.
 */
function stripBlanks(el) {
  /* eslint-disable-next-line no-param-reassign */
  el.childNodes = el.childNodes.filter((e) => (e.nodeName !== '#text' && e.nodeName !== '#comment'));
}

/**
 * Recursively trim #text nodes.
 */
function trimBlanks(el) {
  if (!el.childNodes) return;
  el.childNodes.forEach((e) => {
    if (e.nodeName === '#text') {
      e.value = e.value.trim() || ' ';
    } else {
      trimBlanks(e);
    }
  });
}

export default function Index({ source, compact, target }) {
  return {
    name: 'index',
    buildStart() {
      this.addWatchFile(source);
    },
    generateBundle(options, bundle) {
      const data = fs.readFileSync(source, { encoding: 'utf8' });
      const dom = parse(data);

      // It _should_ be: [DOCTYPE, html[head]]
      const html = dom.childNodes.find((el) => el.nodeName === 'html');
      const head = html.childNodes.find((el) => el.nodeName === 'head');
      const body = html.childNodes.find((el) => el.nodeName === 'body');

      // Strip #text nodes
      if (compact) {
        stripBlanks(html);
        stripBlanks(head);
        trimBlanks(body);
      }

      Object.entries(bundle).forEach(([name, chunk]) => {
        if (!(chunk.type === 'asset' || chunk.isEntry)) return;
        if (chunk.fileName.endsWith('.js')) {
          head.childNodes.push({
            tagName: 'script',
            attrs: [
              { name: 'type', value: 'module' },
              { name: 'src', value: name },
            ],
          });
        } else if (name.endsWith('.css')) {
          head.childNodes.push({
            tagName: 'link',
            attrs: [
              { name: 'rel', value: 'stylesheet' },
              { name: 'href', value: name },
            ],
          });
        }
      });

      const output = serialize(dom);

      const targetFile = target || path.basename(source);

      this.emitFile({
        type: 'asset',
        source: output,
        fileName: targetFile,
      });
    },
  };
}
