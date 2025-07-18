# Release Command

This command automates the release process for mcp-wtit.

## Usage
Use this command with a version type: patch, minor, or major
Example: `/release patch`

## Steps

1. **Run pre-release checks**
```bash
# Run linting
npm run lint

# Run type checking  
npm run typecheck

# Run tests
npm test

# Check coverage
npm run test:coverage

# Build the project
npm run build

# If any checks fail, stop and ask user if they want to continue
```

2. **Update version**
```bash
# Update version based on the argument (patch/minor/major)
# This will create a commit with message "Release x.y.z"
npm version {{VERSION_TYPE}} -m "Release %s"
```

3. **Push changes**
```bash
# Show commits that will be pushed
echo "=== Commits to be pushed ==="
git log origin/main..HEAD --oneline

# Show diff of changes
echo -e "\n=== Changes to be pushed ==="
git diff origin/main..HEAD

# ⚠️ CONFIRM: Ask user "Ready to push these changes to GitHub? (yes/no)" and proceed only if they confirm

# Push the version commit
git push

# Push the version tag
git push origin v$(node -p "require('./package.json').version")
```

4. **Create GitHub Release**
```bash
# Get the new version
VERSION=$(node -p "require('./package.json').version")

# Create release notes based on recent commits
NOTES=$(git log --pretty=format:"- %s" v${VERSION}^..v${VERSION})

# Show release preview
echo "Will create GitHub release v${VERSION} with notes:"
echo "### Changes"
echo "${NOTES}"

# ⚠️ CONFIRM: Ask user "Ready to create GitHub release? (yes/no)" and proceed only if they confirm

# Create GitHub release
gh release create v${VERSION} \
  --title "v${VERSION}" \
  --notes "### Changes
${NOTES}"
```

5. **Publish to npm**
```bash
# Show package details
npm pack --dry-run

# ⚠️ CONFIRM: Ask user "Ready to publish to npm? (yes/no)" and proceed only if they confirm

# Publish the package
npm publish
```

6. **Verify release**
```bash
# Check npm package
echo "Package published: https://www.npmjs.com/package/mcp-wtit"

# Check GitHub release  
echo "GitHub release: https://github.com/yorifuji/mcp-wtit/releases/tag/v$(node -p "require('./package.json').version")"
```

## Notes
- Ensure you are logged in to npm: `npm whoami`
- Ensure you have GitHub CLI configured: `gh auth status`
- The prepublishOnly script will run automatic checks before publishing