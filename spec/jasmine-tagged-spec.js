require('../lib/jasmine-tagged');

describe("jasmine-tagged", function() {
  var anotherTaggedSpec, env, multiTaggedSpec, taggedSpec, untaggedSpec;
  [env, taggedSpec, multiTaggedSpec, anotherTaggedSpec, untaggedSpec] = [];
  beforeEach(function() {
    env = jasmine.getEnv();
    taggedSpec = {
      description: '#tag'
    };
    multiTaggedSpec = {
      description: '#tag #another-tag'
    };
    anotherTaggedSpec = {
      description: '#another-tag'
    };
    return untaggedSpec = {
      description: 'no tag'
    };
  });
  afterEach(function() {
    env.includeSpecsWithoutTags(true);
    return env.setIncludedTags([]);
  });
  describe("by default", function() {
    it("runs untagged specs", function() {
      return expect(env.specFilter(untaggedSpec)).toBeTruthy();
    });
    return it("doesn't run any tagged specs", function() {
      return expect(env.specFilter(taggedSpec)).toBeFalsy();
    });
  });
  describe("without untagged specs", function() {
    beforeEach(function() {
      return env.includeSpecsWithoutTags(false);
    });
    return it("doesn't run untagged specs", function() {
      return expect(env.specFilter(untaggedSpec)).toBeFalsy();
    });
  });
  describe("with a specific tag specs", function() {
    beforeEach(function() {
      return env.setIncludedTags(['tag']);
    });
    it("run specs with a matching tag", function() {
      expect(env.specFilter(taggedSpec)).toBeTruthy();
      return expect(env.specFilter(multiTaggedSpec)).toBeTruthy();
    });
    it("doesn't run specs with different tags", function() {
      return expect(env.specFilter(anotherTaggedSpec)).toBeFalsy();
    });
    return it("runs specs matching any one of the included tags", function() {
      env.setIncludedTags(['missing-tag', 'another-tag']);
      expect(env.specFilter(multiTaggedSpec)).toBeTruthy();
      return expect(env.specFilter(anotherTaggedSpec)).toBeTruthy();
    });
  });
  describe("with a nested spec", function() {
    var nestedAnotherTaggedSpec, nestedTaggedSpec;
    [nestedTaggedSpec, nestedAnotherTaggedSpec] = [];
    beforeEach(function() {
      var suite;
      env = jasmine.getEnv();
      suite = {
        description: 'another level'
      };
      nestedTaggedSpec = {
        description: '#tag',
        parentSuite: suite
      };
      return nestedAnotherTaggedSpec = {
        description: '#another-tag',
        parentSuite: suite
      };
    });
    describe("with a specific tag specs", function() {
      beforeEach(function() {
        return env.setIncludedTags(['tag']);
      });
      it("run specs with a matching tag", function() {
        return expect(env.specFilter(nestedTaggedSpec)).toBeTruthy();
      });
      return it("doesn't run specs with different tags", function() {
        return expect(env.specFilter(nestedAnotherTaggedSpec)).toBeFalsy();
      });
    });
    return it("inherits tags through every ancestor suite", function() {
      var childSuite, deeplyNestedSpec, rootSuite;
      rootSuite = {
        description: 'root #tag'
      };
      childSuite = {
        description: 'child suite',
        parentSuite: rootSuite
      };
      deeplyNestedSpec = {
        description: 'nested spec',
        parentSuite: childSuite
      };
      env.includeSpecsWithoutTags(false);
      env.setIncludedTags(['tag']);
      return expect(env.specFilter(deeplyNestedSpec)).toBeTruthy();
    });
  });
  describe("with a tagged suite", function() {
    var taggedSuiteSpec;
    [taggedSuiteSpec] = [];
    beforeEach(function() {
      var suite;
      env = jasmine.getEnv();
      suite = {
        description: 'another #tag'
      };
      return taggedSuiteSpec = {
        description: 'no tag',
        suite: suite
      };
    });
    return describe("with a specific tag specs", function() {
      beforeEach(function() {
        env.includeSpecsWithoutTags(false);
        return env.setIncludedTags(['tag']);
      });
      return it("run specs with a matching tag", function() {
        return expect(env.specFilter(taggedSuiteSpec)).toBeTruthy();
      });
    });
  });
  return describe("tag parsing", function() {
    beforeEach(function() {
      env.includeSpecsWithoutTags(false);
      return env.setIncludedTags(['tag']);
    });
    it("only treats whitespace-delimited words beginning with a hash as tags", function() {
      expect(env.specFilter({
        description: 'a #tag spec'
      })).toBeTruthy();
      return expect(env.specFilter({
        description: 'a feature#tag spec'
      })).toBeFalsy();
    });
    return it("matches complete tag names", function() {
      expect(env.specFilter({
        description: '#tagged'
      })).toBeFalsy();
      return expect(env.specFilter({
        description: '#tag'
      })).toBeTruthy();
    });
  });
});
