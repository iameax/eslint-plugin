/**
 * @fileoverview Disallows multiple blank lines.
 * implementation adapted from the no-trailing-spaces rule.
 * @author Greg Cochard
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const optSchema = {
  anyOf: [
    {
      type: 'number',
      minimum: 0
    },
    {
      type: 'object',
      properties: {
        max: {
          type: 'number',
          minimum: 0
        },
        min: {
          type: 'number',
          minimum: 0
        }
      },
    }
  ]
};

const defaults = {
  eof: 1,
  bof: 0,
  default: { max: 1 },
  eoi: 2,
}

const makeOptions = (options) => {
  const _options = {
    ...defaults,
    ...options,
  };

  for (let name of Object.keys(_options)) {
    if (typeof _options[name] === 'number') {
      _options[name] = {
        min: _options[name],
        max: _options[name],
      }
    }
  }

  return _options;
}

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'manage blank lines',
      category: 'Stylistic Issues',
      recommended: true,
      url: ''
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          eof: optSchema,
          bof: optSchema,
          default: optSchema,
          eoi: optSchema,
        },
        additionalProperties: false
      }
    ],
    messages: {
      // def: 'Wrong number of blank lines. Should not be less than {{min}} .',
      def: 'Wrong number of blank lines. Rule: {{rule}}.',
    }
  },

  create(context) {
    const options = makeOptions(context.options && context.options[0]);
    const sourceCode = context.getSourceCode();

    // Swallow the final newline, as some editors add it automatically and we don't want it to cause an issue
    const allLines = sourceCode.lines[sourceCode.lines.length - 1] === '' ? sourceCode.lines.slice(0, -1) : sourceCode.lines;
    const templateLiteralLines = new Set();

    let endOfImportsLineNum = 0;

    return {
      TemplateLiteral(node) {
        node.quasis.forEach(literalPart => {

          // Empty lines have a semantic meaning if they're inside template literals. Don't count these as empty lines.
          for (let ignoredLine = literalPart.loc.start.line; ignoredLine < literalPart.loc.end.line; ignoredLine++) {
            templateLiteralLines.add(ignoredLine);
          }
        });
      },
      ImportDeclaration(node) {
        const { parent } = node;
        const nodePosition = parent.body.indexOf(node);
        const nextNode = parent.body[nodePosition + 1];

        // skip "export import"s
        if (node.type === 'TSImportEqualsDeclaration' && node.isExport) {
          return;
        }

        if (nextNode && nextNode.type !== 'ImportDeclaration' && (nextNode.type !== 'TSImportEqualsDeclaration' || nextNode.isExport)) {
          endOfImportsLineNum = nodePosition + 1;
        }
      },
      'Program:exit'(node) {
        const nonEmptyLineNums =  allLines.reduce((nonEmptyLineNumbers, line, index) => {
            if (line.trim() || templateLiteralLines.has(index + 1)) {
              nonEmptyLineNumbers.push(index + 1);
            }
            return nonEmptyLineNumbers;
          }, []);

        // Add a value at the end to allow trailing empty lines to be checked.
        const lineNums = nonEmptyLineNums.concat(allLines.length + 1);

          // Given two line numbers of non-empty lines, report the lines between if the difference is not correct.
        lineNums.reduce((lastLineNumber, lineNumber, _, arr) => {
            // console.log('arr', arr);
            // console.log('eoiEndLineNumber', eoiEndLineNumber);

            let rule;

            if (lastLineNumber === 0) {
              rule = 'bof';
            } else if (lineNumber === allLines.length + 1) {
              rule = 'eof';
            } else if (lastLineNumber === endOfImportsLineNum) {
              rule = 'eoi';
            } else {
              rule = 'default';
            }

            const option = options[rule];
            const { min, max } = option;
            const actual = lineNumber - lastLineNumber - 1;

            // console.log({ lineNumber, lastLineNumber, rule, min, max, actual });

            if (actual > max) {
              context.report({
                node,
                loc: {
                  start: { line: lastLineNumber + max + 1, column: 0 },
                  end: { line: lineNumber, column: 0 }
                },
                messageId: 'def',
                data: {
                  rule: `${rule}_max`,
                },
                fix(fixer) {
                  const rangeStart = sourceCode.getIndexFromLoc({ line: lastLineNumber + 1, column: 0 });

                  const lineNumberAfterRemovedLines = lineNumber - max;
                  const rangeEnd = lineNumberAfterRemovedLines <= allLines.length
                    ? sourceCode.getIndexFromLoc({ line: lineNumberAfterRemovedLines, column: 0 })
                    : sourceCode.text.length;

                  return fixer.removeRange([rangeStart, rangeEnd]);
                }
              });
            }

            if (actual < min) {
              context.report({
                node,
                loc: {
                  start: { line: lastLineNumber + min + 1, column: 0 },
                  end: { line: lineNumber, column: 0 }
                },
                messageId: 'def',
                data: {
                  rule: `${rule}_min`,
                },
                fix(fixer) {
                  /*return fixer.insertTextBefore(
                    node,
                    '\n'.repeat(min)
                  );*/
                }
              });
            }

            return lineNumber;
          }, 0);
      }
    };
  }
};