require '../lib/jasmine-tagged'

describe "jasmine-tagged", ->
  [env, taggedSpec, multiTaggedSpec, anotherTaggedSpec, untaggedSpec] = []

  beforeEach ->
    env = jasmine.getEnv()
    taggedSpec =
      description: '#tag'
    multiTaggedSpec =
      description: '#tag #another-tag'
    anotherTaggedSpec =
      description: '#another-tag'
    untaggedSpec =
      description: 'no tag'

  afterEach ->
    env.includeSpecsWithoutTags(true)
    env.setIncludedTags([])

  describe "by default", ->
    it "runs untagged specs", ->
      expect(env.specFilter(untaggedSpec)).toBeTruthy()

    it "doesn't run any tagged specs", ->
      expect(env.specFilter(taggedSpec)).toBeFalsy()

  describe "without untagged specs", ->
    beforeEach ->
      env.includeSpecsWithoutTags(false)

    it "doesn't run untagged specs", ->
      expect(env.specFilter(untaggedSpec)).toBeFalsy()

  describe "with a specific tag specs", ->
    beforeEach ->
      env.setIncludedTags(['tag'])

    it "run specs with a matching tag", ->
      expect(env.specFilter(taggedSpec)).toBeTruthy()
      expect(env.specFilter(multiTaggedSpec)).toBeTruthy()

    it "doesn't run specs with different tags", ->
      expect(env.specFilter(anotherTaggedSpec)).toBeFalsy()

    it "runs specs matching any one of the included tags", ->
      env.setIncludedTags(['missing-tag', 'another-tag'])
      expect(env.specFilter(multiTaggedSpec)).toBeTruthy()
      expect(env.specFilter(anotherTaggedSpec)).toBeTruthy()

  describe "with a nested spec", ->
    [nestedTaggedSpec, nestedAnotherTaggedSpec] = []

    beforeEach ->
      env = jasmine.getEnv()
      suite =
        description: 'another level'
      nestedTaggedSpec =
        description: '#tag'
        parentSuite: suite
      nestedAnotherTaggedSpec =
        description: '#another-tag'
        parentSuite: suite

    describe "with a specific tag specs", ->
      beforeEach ->
        env.setIncludedTags(['tag'])

      it "run specs with a matching tag", ->
        expect(env.specFilter(nestedTaggedSpec)).toBeTruthy()

      it "doesn't run specs with different tags", ->
        expect(env.specFilter(nestedAnotherTaggedSpec)).toBeFalsy()

    it "inherits tags through every ancestor suite", ->
      rootSuite =
        description: 'root #tag'
      childSuite =
        description: 'child suite'
        parentSuite: rootSuite
      deeplyNestedSpec =
        description: 'nested spec'
        parentSuite: childSuite

      env.includeSpecsWithoutTags(false)
      env.setIncludedTags(['tag'])
      expect(env.specFilter(deeplyNestedSpec)).toBeTruthy()

  describe "with a tagged suite", ->
    [taggedSuiteSpec] = []

    beforeEach ->
      env = jasmine.getEnv()
      suite =
        description: 'another #tag'
      taggedSuiteSpec =
        description: 'no tag'
        suite: suite

    describe "with a specific tag specs", ->
      beforeEach ->
        env.includeSpecsWithoutTags(false)
        env.setIncludedTags(['tag'])

      it "run specs with a matching tag", ->
        expect(env.specFilter(taggedSuiteSpec)).toBeTruthy()

  describe "tag parsing", ->
    beforeEach ->
      env.includeSpecsWithoutTags(false)
      env.setIncludedTags(['tag'])

    it "only treats whitespace-delimited words beginning with a hash as tags", ->
      expect(env.specFilter(description: 'a #tag spec')).toBeTruthy()
      expect(env.specFilter(description: 'a feature#tag spec')).toBeFalsy()

    it "matches complete tag names", ->
      expect(env.specFilter(description: '#tagged')).toBeFalsy()
      expect(env.specFilter(description: '#tag')).toBeTruthy()
