import * as fs from 'fs'
import * as path from 'path';
import {parse, serialize} from 'parse5'

function stripBlanks (el) {
    el.childNodes = el.childNodes.filter(e => e.nodeName !== '#text')
}

export default function Index(options ={}) {
  const { source, compact, target } = options;

  return {
    name: 'index',
    generateBundle: (options, bundle, isWrite) => {

      let data = fs.readFileSync(source, {encoding: 'utf8'})
      let dom = parse(data)

      // It _should_ be: [DOCTYPE, html[head]]
      let html = dom.childNodes.find(el => el.nodeName === 'html')
      let head = html.childNodes.find(el => el.nodeName === 'head')

      // Strip #text nodes
      if(compact) {
        stripBlanks(html)
        stripBlanks(head)
      }

      for(let name in bundle) {
	let chunk = bundle[name];
        if (!(chunk.isAsset || chunk.isEntry)) continue;
        if (chunk.fileName.endsWith('.js')) {
          head.childNodes.push({
            tagName: 'script',
            attrs: [
              {name: 'type', value: 'module'},
              {name: 'src', value: name}
            ]
          })
        } else if (name.endsWith('.css')) {
          head.childNodes.push({
            tagName: 'link',
            attrs: [
              {name: 'rel', value: 'stylesheet'},
              {name: 'href', value: name}
            ]
          })
        }
      }

      let output = serialize(dom);

      let targetDir = (options.dir) ? options.dir : path.dirname(options.file);
      let targetFile = path.join(targetDir, (target || path.basename(source)));

      // ensure the target dir exists
      fs.mkdirSync(path.dirname(targetFile), {recursive: true});

      fs.writeFileSync(targetFile, output)
    }
  }
}
