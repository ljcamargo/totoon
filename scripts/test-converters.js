const { convert, estimateTokens, calculateReduction } = require('../utils/converter');

// Mock console.log to keep output clean
const log = (msg) => console.log(`[TEST] ${msg}`);
const error = (msg) => console.error(`[FAIL] ${msg}`);

const runTests = () => {
    log("Starting tests...");
    let passed = 0;
    let failed = 0;

    const assert = (condition, message) => {
        if (condition) {
            // log(`PASS: ${message}`);
            passed++;
        } else {
            error(`FAIL: ${message}`);
            failed++;
        }
    };

    // Test 1: JSON to YAML
    try {
        const json = '{"foo": "bar"}';
        const yaml = convert(json, 'JSON', 'YAML');
        assert(yaml.includes('foo: bar'), 'JSON to YAML conversion');
    } catch (e) {
        assert(false, `JSON to YAML error: ${e.message}`);
    }

    // Test 2: YAML to JSON
    try {
        const yaml = 'foo: bar';
        const json = convert(yaml, 'YAML', 'JSON');
        assert(json.includes('"foo": "bar"'), 'YAML to JSON conversion');
    } catch (e) {
        assert(false, `YAML to JSON error: ${e.message}`);
    }

    // Test 3: Token Estimation
    const text = "hello world";
    const tokens = estimateTokens(text);
    assert(tokens > 0, 'Token estimation returns positive number');

    // Test 4: Reduction Calculation
    const reduction = calculateReduction(100, 50);
    assert(reduction === '50.00', 'Reduction calculation is correct');

    log(`Tests completed. Passed: ${passed}, Failed: ${failed}`);
    if (failed > 0) process.exit(1);
};

runTests();
