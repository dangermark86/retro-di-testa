import { test } from 'node:test';import assert from 'node:assert/strict';import {normalize} from '../src/lib/search.mjs';
test('ricerca senza distinzione di maiuscole e accenti',()=>{assert.equal(normalize('CURIOSITÀ è NAS'),'curiosita e nas');});
