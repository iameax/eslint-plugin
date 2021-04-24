/**
 * @fileoverview Rule to disallow relative parent imports
 * @author goo.eax@gmail.com
 */

'use strict';

const path = require('path');
const moduleVisitor = require('eslint-module-utils/moduleVisitor').default;
const resolve = require('eslint-module-utils/resolve').default;


module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '',
      category: '',
      recommended: true,
      url: '',
    },
    fixable: 'code',
    schema: [{
      'type': 'object',
      'properties': {
        'baseUrl': {
          'type': 'string',
        },
      },
      'additionalProperties': false,
    }],
  },

  create: function noRelativePackages(context) {
    const filePath = context.getFilename();

    const rootDir = context.getCwd();
    const baseUrlConfig = context.options[0].baseUrl;
    const baseUrl = baseUrlConfig && path.join(rootDir, baseUrlConfig);

    // can't check a non-file
    if (filePath === '<text>') {
      return {};
    }

    function checkSourceValue(sourceNode) {
      const depPath = sourceNode.value;

      if (!depPath || !depPath.startsWith('../')) {
        return;
      }

      const absDepPath = resolve(depPath, context);

      // unable to resolve path
      if (!absDepPath) {
        return;
      }

      context.report({
        node: sourceNode,
        message: 'no relative parent imports',
        fix: function (fixer) {
          if (!baseUrl) {
            return;
          }

          const absolutePath = path.join(path.dirname(filePath), depPath);

          if (absolutePath.startsWith(baseUrl)) {
            const pathRelativeToBaseUrl = path.join(path.dirname(filePath), depPath).replace(baseUrl + '/', '');

            return fixer.replaceText(sourceNode, JSON.stringify(pathRelativeToBaseUrl));
          }
        },
      });
    }

    return moduleVisitor(checkSourceValue, context.options[0]);
  },
};
