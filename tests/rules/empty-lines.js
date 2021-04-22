/**
 * @fileoverview Disallows multiple blank lines.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require("../../src/rules/empty-lines");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

/**
 * Creates the expected error message object for the specified number of lines
 * @param {lines} lines The number of lines expected.
 * @returns {Object} the expected error message object
 * @private
 */
function getExpectedError(lines) {
  return {
    messageId: "consecutiveBlank",
    data: {
      max: lines,
      pluralizedLines: lines === 1 ? "line" : "lines"
    },
    type: "Program",
    column: 1
  };
}

/**
 * Creates the expected error message object for the specified number of lines
 * @param {lines} lines The number of lines expected.
 * @returns {Object} the expected error message object
 * @private
 */
function getExpectedErrorEOF(lines) {
  return {
    messageId: "blankEndOfFile",
    data: {
      max: lines
    },
    type: "Program",
    column: 1
  };
}

/**
 * Creates the expected error message object for the specified number of lines
 * @param {lines} lines The number of lines expected.
 * @returns {Object} the expected error message object
 * @private
 */
function getExpectedErrorBOF(lines) {
  return {
    messageId: "blankBeginningOfFile",
    data: {
      max: lines
    },
    type: "Program",
    column: 1
  };
}


ruleTester.run("empty-lines", rule, {
  valid: [
    {
      code: `import foo from 'foo';\n\n\n\nconst a = path;\n\n`,
      options: [{ default: { min: 0, max: 1 }, eoi: 2 }],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      output: 'import foo from \'foo\';\n\n\nconst a = path;\n\n',
    },
  ],

  invalid: [
    // {
    //   code: "// invalid 1\nvar a = 5;\n\n\nvar b = 3;",
    //   output: "// invalid 1\nvar a = 5;\n\nvar b = 3;",
    //   options: [{ max: 1 }],
    //   errors: [getExpectedError(1)]
    // },
  ]
});