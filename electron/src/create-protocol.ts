const { mainModule } = process;
const { error } = console;
import { mimeTypeFor } from './mime-types';
const  { app, protocol } = require('electron');
const { nodeURL } = require('url');
const  { readFileSync: read } = require('fs');
const  { _resolveFilename: resolve } = require('module');

function createProtocol(scheme: string, base: string, normalize = true): Electron.App | null {
  // Should only be called after app:ready fires
  if (!app.isReady()) {
    return app.on('ready', () => createProtocol(scheme, base, normalize));
  }

  // Normalize standard URLs to match file protocol format
  const normalizeFn = !normalize
    ? (url: string) => new nodeURL(url).pathname
    : (url: string) => new nodeURL(
      url.replace(/^.*?:[/]*/, `file:///`) // `${scheme}://./`
    ).pathname.replace(/[/]$/, '');

  protocol.registerBufferProtocol(
    scheme,
    (request, respond) => {
      let pathname, filename, data, mimeType;
      try {
        // Get normalized pathname from url
        pathname = normalizeFn(request.url);

        // Resolve absolute filepath relative to mainModule
        filename = resolve(`.${pathname}`, mainModule);

        // Read contents into a buffer
        data = read(filename);

        // Resolve mimeType from extension
        mimeType = mimeTypeFor(filename);

        // Respond with mimeType & data
        respond({ mimeType, data });
      } catch (exception) {
        error(exception, { request, pathname, filename, data, mimeType });
      }
    },
    (exception) =>
      exception && error(`Failed to register ${scheme} protocol`, exception)
  );
  
  return null;
}

module.exports = createProtocol;