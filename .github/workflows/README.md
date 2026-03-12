# CI/CD Workflows

This repository contains automated CI/CD workflows for building and releasing Electron applications across multiple platforms.

## Workflows

### 1. Release Workflow (`release.yml`)
Triggers on push to main/master branches and checks commit messages for platform-specific releases.

**Commit Message Triggers:**
- `l` - Build for Linux (.AppImage)
- `w` - Build for Windows (.exe)
- `m1` - Build for macOS M1 (.dmg)
- `m2` - Build for macOS M2 (.dmg)

**Usage Examples:**
```bash
git commit -m "fix: update dependencies l"     # Linux only
git commit -m "feat: add new feature w"       # Windows only
git commit -m "feat: add dark mode m1 m2"     # Both M1 and M2
git commit -m "chore: update readme l w m1"   # Linux, Windows, M1
```

**Platforms and Artifacts:**
| Platform | Architecture | File Extension | Trigger |
| -------- | -------------- | -------------- | ------- |
| Ubuntu | Linux x64 | `.AppImage` | `l` |
| Windows | x64 | `.exe` | `w` |
| macOS | Apple Silicon (M1/M2) | `.dmg` | `m1`, `m2` |
| macOS | Intel x64 | `.dmg` | `m1` or `m2` |

### 2. Build All Platforms (`build-all.yml`)
Builds for all platforms simultaneously. Triggers on:
- Manual workflow dispatch
- Git tags (e.g., `v1.0.0`)

**Usage:**
```bash
# Create a tag to trigger automatic release
git tag v1.0.0
git push origin v1.0.0
```

### 3. Publish Workflow (`publish.yml`)
Manually publish artifacts to GitHub releases. Allows selective publishing.

**Parameters:**
- `platform`: Which platform artifacts to publish
- `release_tag`: Release tag (e.g., v1.0.0)
- `prerelease`: Mark as pre-release

## Platform Matrix

| Platform | Runner | Architecture | Output |
| -------- | ------- | ------------ | ------ |
| Linux | ubuntu-latest | x64 | `.AppImage` |
| Windows | windows-latest | x64 | `.exe` |
| macOS M1/M2 | macos-latest | arm64 | `.dmg` |
| macOS Intel | macos-latest | x64 | `.dmg` |

## Release Process

### Individual Platform Release
1. Make your changes
2. Commit with platform trigger:
   ```bash
   git commit -m "feat: add feature l"
   git push
   ```
3. Workflow builds and uploads artifacts
4. Use Publish workflow to create GitHub release

### Full Release (All Platforms)
1. Make your changes
2. Create and push a tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
3. Workflow builds all platforms and creates release automatically

### Manual Publishing
1. Ensure artifacts are built and available
2. Go to Actions → Publish Release
3. Fill in parameters:
   - Platform: `all` or specific platform
   - Release tag: `v1.0.0`
   - Prerelease: `false` (unless it's a beta)
4. Run workflow

## Artifacts

All artifacts are stored for 30 days and can be downloaded from the Actions tab. Published releases are available in the GitHub Releases section.

## Notes

- macOS builds include both Intel (x64) and Apple Silicon (arm64) versions
- Windows builds generate `.exe` installers
- Linux builds generate `.AppImage` portable applications
- All builds are created using Electron Forge with the configuration in `forge.config.ts`
- Releases are created as drafts by default (except tag-triggered releases)
