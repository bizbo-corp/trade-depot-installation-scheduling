# Git Workflow

## Overview

This document outlines the Git workflow, branching strategy, and commit conventions for the Trade Depot Installation Scheduling project. Following these guidelines ensures a clean, organised git history and facilitates collaboration.

## Repository Information

- **Repository:** https://github.com/bizbo-corp/trade-depot-installation-scheduling
- **Organization:** bizbo-corp
- **Primary Branch:** main
- **Visibility:** Private

## Table of Contents

1. [Repository Information](#repository-information)
2. [Branching Strategy](#branching-strategy)
3. [Commit Conventions](#commit-conventions)
4. [Pull Request Process](#pull-request-process)
5. [Branch Naming](#branch-naming)
6. [Git Best Practices](#git-best-practices)
7. [Common Git Tasks](#common-git-tasks)
8. [Troubleshooting](#troubleshooting)

## Branching Strategy

### Main Branches

#### `main` (Production)

- **Purpose:** Production-ready code
- **Protection:** Protected branch, requires PR reviews
- **Deployment:** Automatically deploys to production
- **Merging:** Only through approved pull requests
- **Never:** Commit directly to main

#### `develop` (Development - Optional)

- **Purpose:** Integration branch for features
- **Status:** Currently not in use (small project)
- **Usage:** Large projects with many active branches
- **Note:** Consider adding if team grows or project expands

### Feature Branches

#### Naming Convention

```
feature/description-of-feature
feature/contact-form
feature/user-authentication
```

#### Workflow

1. **Create from main:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/new-feature
   ```

2. **Develop feature:**
   - Make commits following commit conventions
   - Keep branch up to date with main
   - Push regularly

3. **Merge to main:**
   - Create pull request
   - Get code review
   - Merge after approval

### Branch Types

| Type | Prefix | Example | Purpose |
|------|--------|---------|---------|
| Feature | `feature/` | `feature/add-blog` | New functionality |
| Bug Fix | `fix/` | `fix/login-error` | Bug fixes |
| Hotfix | `hotfix/` | `hotfix/security-patch` | Urgent production fixes |
| Refactor | `refactor/` | `refactor/api-client` | Code restructuring |
| Documentation | `docs/` | `docs/update-readme` | Documentation only |
| Style | `style/` | `style/fix-formatting` | Formatting, no logic change |
| Test | `test/` | `test/add-unit-tests` | Adding tests |
| Chore | `chore/` | `chore/update-deps` | Maintenance tasks |

## Commit Conventions

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <subject>

[optional body]

[optional footer(s)]
```

### Commit Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, missing semicolons, etc.)
- **refactor:** Code refactoring without feature changes or bug fixes
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **build:** Build system or dependency changes
- **ci:** CI/CD changes
- **chore:** Other changes that don't modify src or test files
- **revert:** Revert a previous commit

### Commit Message Examples

#### Simple Commits

```bash
git commit -m "feat: add contact form component"

git commit -m "fix: resolve mobile navigation menu bug"

git commit -m "docs: update installation instructions"

git commit -m "refactor: simplify API client structure"

git commit -m "style: fix Tailwind class ordering"

git commit -m "chore: update dependencies to latest versions"
```

#### Detailed Commits

```bash
git commit -m "feat: add contact form validation

- Implement client-side validation
- Add error handling for form submission
- Include accessibility improvements
- Test on multiple browsers

Closes #123"
```

#### Breaking Changes

```bash
git commit -m "feat(api): redesign user authentication

BREAKING CHANGE: authentication endpoints now require 
API key in headers instead of query parameters.

Migration guide: Update API client headers configuration."
```

### Commit Best Practices

1. **Keep Commits Atomic:** One logical change per commit
2. **Write Clear Messages:** Descriptive subject line
3. **Explain Why:** Use body to explain reasoning
4. **Reference Issues:** Include issue numbers
5. **Test Before Committing:** Ensure code works

### Good Commits

```bash
# Atomic, clear, tested
✅ feat: add user registration form
✅ fix: correct mobile menu scroll issue
✅ docs: document environment variables
✅ refactor: extract form validation logic to utility

# Multiple changes, unclear purpose
❌ WIP commit
❌ fixes and stuff
❌ update code
```

### Commit Frequency

- **Often:** Commit small, logical changes frequently
- **Before Break:** Commit before lunch or end of day
- **After Feature:** Commit when feature is complete
- **Don't:** Accumulate many changes in one commit

## Pull Request Process

### Creating a Pull Request

1. **Ensure Clean History:**
   ```bash
   # Update from main
   git checkout main
   git pull origin main
   
   # Rebase feature branch
   git checkout feature/my-feature
   git rebase main
   ```

2. **Push Branch:**
   ```bash
   git push origin feature/my-feature
   ```

3. **Create PR on GitHub:**
   - Click "New Pull Request"
   - Select `feature/my-feature` → `main`
   - Fill in template

### PR Title Format

Follow the same convention as commits:

```
feat: Add contact form component
fix: Resolve mobile navigation menu bug
docs: Update API documentation
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Item 1
- Item 2
- Item 3

## Testing
- [ ] Manual testing completed
- [ ] All tests passing
- [ ] Cross-browser testing done

## Screenshots (if applicable)
[Add screenshots here]

## Related Issues
Closes #123

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Linting passes
- [ ] TypeScript checks pass
```

### PR Review Process

1. **Author:**
   - Create PR with clear description
   - Request review from team
   - Respond to feedback
   - Make requested changes

2. **Reviewer:**
   - Review within 24 hours if possible
   - Check code quality and style
   - Test functionality if possible
   - Provide constructive feedback
   - Approve when satisfied

3. **Merge:**
   - Squash and merge (preferred for feature branches)
   - Delete branch after merge
   - Update project management tools

### Review Checklist

- [ ] Code follows project standards
- [ ] No console.logs or commented code
- [ ] Proper error handling
- [ ] Accessibility requirements met
- [ ] Responsive design works
- [ ] Performance considerations addressed
- [ ] Security best practices followed
- [ ] Documentation updated
- [ ] Tests pass
- [ ] No breaking changes (or documented)

## Branch Naming

### Rules

- Use lowercase letters
- Separate words with hyphens
- Be descriptive but concise
- Use appropriate prefix

### Examples

```
✅ feature/add-search-functionality
✅ fix/resolve-login-bug
✅ docs/update-architecture-guide
✅ refactor/api-response-handling

❌ Feature-AddSearch
❌ fix-login
❌ my-branch
❌ temp
```

## Git Best Practices

### General

1. **Pull Regularly:** Keep local main updated
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Branch from Latest:** Always branch from updated main
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/new-feature
   ```

3. **Commit Often:** Small, logical commits
4. **Push Regularly:** Don't let branch diverge too much
5. **Use Rebase:** Keep history clean (don't rebase shared branches)

### Merging vs Rebasing

#### Use Merge When:
- Merging feature branches to main
- Collaborating on feature branches
- Preserving branch history

#### Use Rebase When:
- Updating feature branch with latest main
- Cleaning up personal commits
- Creating linear history

```bash
# Update feature branch from main
git checkout feature/my-feature
git rebase main
```

**Warning:** Never rebase shared/public branches!

### Interactive Rebase

Clean up commit history before PR:

```bash
git rebase -i HEAD~3  # Last 3 commits
```

Options:
- `pick` - Use commit as-is
- `reword` - Change commit message
- `edit` - Modify commit
- `squash` - Combine with previous commit
- `drop` - Remove commit

### Stashing

Temporarily save changes:

```bash
# Stash changes
git stash

# Stash with message
git stash save "WIP: working on feature"

# List stashes
git stash list

# Apply stash
git stash apply

# Pop stash (apply and remove)
git stash pop

# Drop stash
git stash drop
```

## Common Git Tasks

### Starting New Feature

```bash
# Update main
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b feature/new-feature

# Start coding...
```

### Daily Workflow

```bash
# Morning: Update and create branch
git checkout main
git pull origin main
git checkout feature/my-feature

# During day: Commit changes
git add .
git commit -m "feat: add new component"

# End of day: Push progress
git push origin feature/my-feature
```

### Amending Last Commit

```bash
# Add more changes to last commit
git add .
git commit --amend --no-edit

# Or change commit message
git commit --amend -m "new message"

# Force push (only on feature branches!)
git push origin feature/my-feature --force
```

### Updating Feature Branch from Main

```bash
# Switch to main and pull updates
git checkout main
git pull origin main

# Switch back to feature branch
git checkout feature/my-feature

# Rebase on latest main
git rebase main

# Resolve conflicts if any
# Then continue rebase
git rebase --continue

# Force push if needed (only feature branches!)
git push origin feature/my-feature --force
```

### Viewing History

```bash
# View commit history
git log

# One line per commit
git log --oneline

# Graph view
git log --oneline --graph --all

# View changes in file
git log -- path/to/file

# View specific commit
git show <commit-hash>
```

### Finding Bugs

```bash
# Binary search for bug introduction
git bisect start
git bisect bad              # Current commit is bad
git bisect good <commit>    # This commit was good
# Test, then:
git bisect good  # or bad
# Repeat until found
git bisect reset
```

## Troubleshooting

### Merge Conflicts

```bash
# Start merge/rebase
git merge main  # or git rebase main

# If conflicts:
# 1. Open conflicted files
# 2. Look for conflict markers:
#    <<<<<<< HEAD
#    current changes
#    =======
#    incoming changes
#    >>>>>>> branch-name
# 3. Resolve by keeping desired code
# 4. Remove conflict markers
# 5. Stage resolved files
git add .

# Continue merge
git merge --continue
# or for rebase
git rebase --continue
```

### Undoing Changes

```bash
# Discard local changes (careful!)
git checkout -- file.txt

# Discard all local changes
git checkout .

# Reset to specific commit (destructive!)
git reset --hard <commit-hash>

# Reset to last commit
git reset --hard HEAD

# Unstage files
git reset HEAD file.txt
```

### Retrieving Deleted Work

```bash
# View recent commits
git reflog

# Checkout commit before accident
git checkout <commit-hash>

# Create new branch from recovered code
git checkout -b recovery-branch
```

### Fixing Last Commit

```bash
# Add forgotten files
git add forgotten-file.txt
git commit --amend --no-edit

# Change message
git commit --amend -m "better message"
```

### Force Push Warning

⚠️ **Never force push to main!**

Only use `--force` or `--force-with-lease` on feature branches:

```bash
# After interactive rebase
git push origin feature/my-feature --force-with-lease
```

`--force-with-lease` is safer than `--force` as it checks for remote changes.

## Git Configuration

### Set Up Editor

```bash
# Use VSCode
git config --global core.editor "code --wait"

# Use Vim
git config --global core.editor "vim"
```

### Set Up User Information

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Useful Aliases

```bash
# Short aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit

# Useful aliases
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
```

### .gitignore

Already configured to ignore:

- `node_modules/`
- `.next/`
- `.env*.local`
- Build files
- IDE files
- OS files

Never commit:
- Environment files with secrets
- `node_modules`
- Build outputs
- IDE-specific settings

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
- [git-scm.com](https://git-scm.com/)

## Questions

For git-related questions:

1. Check this guide
2. Search git documentation
3. Ask team members
4. Search Stack Overflow

## Summary

- Use feature branches for all work
- Follow conventional commit format
- Keep commits atomic and clear
- Always get PR review before merging
- Update with latest main regularly
- Never force push to protected branches
- Keep history clean and meaningful

