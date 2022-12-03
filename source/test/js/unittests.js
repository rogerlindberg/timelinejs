class TestCase {

    constructor() {
        this.testList = [];
        this.name = ""
    }

    runTests() {
        this.#createHeader(this.name);
        for (const test of this.testList) {
            this.setUp();
            this._funcname = test.name;
            try {
                test(this);
            }
            catch(e) {
                this.#reportTestFailure(e);
            }
            this.tearDown();
        }
    }

    setUp() {
        // To be overriden by test case
    }

    tearDown() {
        // To be overriden by test case
    }

    assertEquals(expected, result) {
        this._expected = `${expected}`;
        this._result = `${result}`;
        if (this._expected == this._result) {
            this.#reportTestPassed();
        } else {
            this.#reportTestFailure();
        }
    }

    assertTrue(result) {
        this._expected = `${true}`;
        this._result = `${result}`;
        if (result) {
            this.#reportTestPassed();
        } else {
            this.#reportTestFailure();
        }
    }

    assertFalse(result) {
        this._expected = `${false}`;
        this._result = `${result}`;
        if (!result) {
            this.#reportTestPassed();
        } else {
            this.#reportTestFailure();
        }
    }

    #reportTestFailure(e=undefined) {
        if (e) {
            this.#createTag("fail", `Test failed: ${this._funcname}: ${e}`);
        } else {
            this.#createTag("fail", `Test failed: ${this._funcname}: ${this._expected} != ${this._result}`);
        }
    }

    #reportTestPassed() {
        this.#createTag("pass", `Test passed: ${this._funcname}`);
    }

    #createTag(id, message) {
        var tag = document.createElement("p");
        tag.setAttribute("id", id);
        var text = document.createTextNode(message);
        tag.appendChild(text);
        var element = document.getElementById("testresults");
        element.appendChild(tag);
    }

    #createHeader(message) {
        var tag = document.createElement("h2");
        var text = document.createTextNode(message);
        tag.appendChild(text);
        var element = document.getElementById("testresults");
        element.appendChild(tag);
    }

}