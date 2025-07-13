# Publishing to npm

## Pre-publish Checklist

- [ ] All tests pass: `npm test`
- [ ] No linting errors: `npm run lint`
- [ ] Type checking passes: `npm run typecheck`
- [ ] Coverage is above 80%: `npm run test:coverage`
- [ ] Build completes successfully: `npm run build`
- [ ] Version number is updated in package.json
- [ ] README is up to date
- [ ] CHANGELOG is updated (if applicable)

## Publishing Steps

1. **Login to npm** (if not already logged in):
   ```bash
   npm login
   ```

2. **Verify package contents**:
   ```bash
   npm pack --dry-run
   ```
   Check that only necessary files are included.

3. **Test the package locally**:
   ```bash
   npm pack
   npm install -g mcp-wtit-0.1.0.tgz
   mcp-wtit
   # Test that it works
   npm uninstall -g mcp-wtit
   ```

4. **Publish to npm**:
   ```bash
   npm publish
   ```

   The `prepublishOnly` script will automatically run:
   - Lint check
   - Type check
   - Tests
   - Build

5. **Create a Git tag**:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

6. **Verify the published package**:
   - Check https://www.npmjs.com/package/mcp-wtit
   - Install and test: `npm install -g mcp-wtit`

## Version Management

Follow semantic versioning:
- MAJOR version for incompatible API changes
- MINOR version for backwards-compatible functionality
- PATCH version for backwards-compatible bug fixes

Update version:
```bash
npm version patch  # 0.1.0 -> 0.1.1
npm version minor  # 0.1.0 -> 0.2.0
npm version major  # 0.1.0 -> 1.0.0
```

## Troubleshooting

### Package name already exists
- Choose a different name in package.json
- Consider scoping: `@yorifuji/mcp-wtit`

### Authentication issues
- Ensure you're logged in: `npm whoami`
- Check your npm auth token

### Build failures
- Run `npm run build` manually
- Check for TypeScript errors
- Ensure all dependencies are installed