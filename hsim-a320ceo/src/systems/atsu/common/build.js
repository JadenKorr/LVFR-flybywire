'use strict';

const esbuild = require('esbuild');
const path = require('path');

const rootDir = path.join(__dirname, '..', '..', '..', '..');
const outFile = 'out/lvfr-horizonsim-airbus-a320-ceo/html_ui/JS/A320HS/atsu/common.js';

const isProductionBuild = process.env.A32NX_PRODUCTION_BUILD === '1';

esbuild.build({
    absWorkingDir: __dirname,

    define: { DEBUG: 'false' },

    entryPoints: [ path.join(rootDir,  '../fbw-common/src/systems/datalink/common/src/index.ts')],
    bundle: true,
    treeShaking: false,
    minify: isProductionBuild,

    outfile: path.join(rootDir, outFile),

    format: 'iife',
    globalName: 'AtsuCommon',

    sourcemap: isProductionBuild ? undefined : 'linked',

    // Target approximate CoherentGT WebKit version
    target: 'safari11',
});