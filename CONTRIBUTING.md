# Contributing to Digital Transformation Dashboard

Thank you for your interest in contributing to the Digital Transformation Dashboard! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Security Considerations](#security-considerations)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. By participating in this project, you agree to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, or discriminatory comments
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+)
- Local web server (Python, Node.js, or PHP)
- Git for version control
- Text editor or IDE (VS Code recommended)
- Basic understanding of:
  - HTML5, CSS3, JavaScript (ES6+)
  - Chart.js library
  - Google Apps Script (for backend contributions)

### Finding Issues to Work On

1. **Browse Issues**: Check [GitHub Issues](https://github.com/glen200392/Digital_Transformation_Dashboard/issues)
2. **Look for Labels**:
   - `good first issue` - Great for newcomers
   - `help wanted` - Actively seeking contributors
   - `bug` - Bug fixes needed
   - `enhancement` - New features
   - `documentation` - Documentation improvements

3. **Claim an Issue**: Comment on the issue to indicate you're working on it

---

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/Digital_Transformation_Dashboard.git
cd Digital_Transformation_Dashboard

# Add upstream remote
git remote add upstream https://github.com/glen200392/Digital_Transformation_Dashboard.git
```

### 2. Create a Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
# OR for bug fixes
git checkout -b fix/bug-description
```

### 3. Set Up Local Development Environment

#### Option A: Using Python
```bash
python3 -m http.server 8080
```

#### Option B: Using Node.js
```bash
npx http-server -p 8080
```

#### Option C: Using PHP
```bash
php -S localhost:8080
```

Then navigate to `http://localhost:8080/index.html`

### 4. Configure Development Settings

Edit `js/config.js` to enable debug mode:

```javascript
features: {
    debugMode: true,  // Enable detailed console logging
    // ... other features
}
```

### 5. Install Development Tools (Optional)

For linting and code quality:

```bash
# If package.json exists
npm install

# OR install globally
npm install -g eslint prettier
```

---

## Code Style Guidelines

### JavaScript (ES6+)

#### General Principles
- Use ES6+ classes for modularity
- Follow modular design patterns
- Use descriptive, meaningful variable names
- Add JSDoc comments for public APIs
- Keep functions small and focused (< 50 lines)

#### Naming Conventions

```javascript
// Classes: PascalCase
class DashboardAPI {
    // ...
}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Variables and functions: camelCase
const dashboardData = {};
function loadChartData() { }

// Private methods: prefix with underscore
class StateManager {
    _notifySubscribers() { }
}
```

#### Code Structure

```javascript
/**
 * Fetches data from the API with retry logic
 * @param {string} endpoint - API endpoint to call
 * @param {Object} options - Request options
 * @returns {Promise<Object>} API response data
 * @throws {Error} When all retry attempts fail
 */
async function fetchData(endpoint, options = {}) {
    // Implementation
}
```

#### ES6+ Features to Use
- ✅ `const` and `let` (avoid `var`)
- ✅ Arrow functions where appropriate
- ✅ Template literals for strings
- ✅ Destructuring assignment
- ✅ Async/await for promises
- ✅ Classes for encapsulation
- ✅ Modules (import/export when applicable)

#### Example: Good vs. Bad

**❌ Bad:**
```javascript
var x = function(data) {
    var result = data.map(function(item) {
        return item.value * 2;
    });
    return result;
}
```

**✅ Good:**
```javascript
const processData = (data) => {
    return data.map(item => item.value * 2);
};
```

### HTML

- Use semantic HTML5 elements (`<section>`, `<article>`, `<nav>`)
- Add `aria-*` attributes for accessibility
- Use meaningful `id` and `class` names
- Keep structure clean and indented

```html
<!-- Good example -->
<section id="kpi-section" aria-label="Key Performance Indicators">
    <div class="kpi-card" role="article">
        <h3 class="kpi-title">Health Score</h3>
        <p class="kpi-value" data-metric="health">76</p>
    </div>
</section>
```

### CSS

- Use CSS variables for theming
- Follow BEM naming convention where appropriate
- Mobile-first responsive design
- Keep specificity low

```css
/* Use CSS variables */
:root {
    --primary-color: #667eea;
    --card-padding: 1.5rem;
}

/* BEM naming */
.kpi-card {}
.kpi-card__title {}
.kpi-card__value {}
.kpi-card--highlighted {}
```

### File Organization

```javascript
// File structure for a module
// 1. Imports (if using modules)
import { helper } from './utils.js';

// 2. Constants
const DEFAULT_TIMEOUT = 30000;

// 3. Class definition
class ModuleName {
    constructor() {
        // ...
    }
    
    // Public methods first
    publicMethod() {}
    
    // Private methods last
    _privateMethod() {}
}

// 4. Export (if using modules)
export default ModuleName;
```

---

## Pull Request Process

### 1. Before Creating PR

**Ensure your code:**
- [ ] Follows the code style guidelines
- [ ] Includes JSDoc comments for new functions/classes
- [ ] Handles errors appropriately
- [ ] Doesn't break existing functionality
- [ ] Passes all tests (if applicable)
- [ ] Updates relevant documentation

### 2. Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(charts): add Gantt chart visualization

- Integrate Frappe Gantt library
- Add timeline view for projects
- Update ChartManager with new chart type

Closes #42
```

```bash
fix(api): handle network timeout gracefully

- Add retry logic with exponential backoff
- Show user-friendly error message
- Fall back to cached data when available

Fixes #38
```

### 3. Create Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Go to the original repository on GitHub
3. Click "New Pull Request"
4. Select your fork and branch
5. Fill out the PR template with:
   - **Title**: Brief, descriptive title
   - **Description**: What changes were made and why
   - **Related Issues**: Reference any related issues
   - **Screenshots**: If UI changes, include before/after
   - **Testing**: Describe how you tested the changes

### 4. PR Review Process

- Maintainers will review your PR
- Address any requested changes
- Keep the conversation professional and constructive
- Once approved, your PR will be merged

### 5. After Merge

```bash
# Update your main branch
git checkout main
git pull upstream main

# Delete your feature branch (optional)
git branch -d feature/your-feature-name
```

---

## Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, verify:

- [ ] **Layer 1** (Executive Summary) displays correctly
- [ ] **Layer 2** (Operational Dashboard) renders all charts
- [ ] **Layer 3** (Detailed Analysis) shows all tabs
- [ ] Data loads from API successfully
- [ ] Offline mode works with fallback data
- [ ] Auto-refresh mechanism functions
- [ ] Manual refresh button works
- [ ] Toast notifications appear
- [ ] No JavaScript errors in console
- [ ] Responsive design works on:
  - [ ] Desktop (1920x1080)
  - [ ] Tablet (768x1024)
  - [ ] Mobile (375x667)

### Browser Testing

Test in at least two modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance Testing

- Page load time < 3 seconds
- Chart rendering smooth (60 fps)
- No memory leaks (check DevTools)
- API calls complete within timeout

### Automated Testing (Future)

When test infrastructure is added:

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "API"

# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

---

## Security Considerations

### Security Best Practices

When contributing, **always**:

1. **Sanitize User Input**
   ```javascript
   // Use the security module
   import { escapeHtml, sanitizeInput } from './security.js';
   
   const safeHtml = escapeHtml(userInput);
   const cleanData = sanitizeInput(formData);
   ```

2. **Validate URLs**
   ```javascript
   import { validateUrl } from './security.js';
   
   if (!validateUrl(apiEndpoint)) {
       throw new Error('Invalid URL');
   }
   ```

3. **Avoid XSS Vulnerabilities**
   - Never use `innerHTML` with user-provided content
   - Use `textContent` or `escapeHtml()` instead
   - Validate and sanitize all inputs

4. **Handle Sensitive Data**
   - Never commit API keys or credentials
   - Use environment variables or config files (gitignored)
   - Mask sensitive data in logs

5. **Follow CSP Guidelines**
   - Don't add inline scripts
   - Don't use `eval()` or `Function()` constructor
   - Prefer external scripts with SRI hashes

### Security Review

- Review [ARCHITECTURE_REVIEW.md](ARCHITECTURE_REVIEW.md) for security architecture
- Check [docs/SECURITY.md](docs/SECURITY.md) for detailed security guidelines
- Report security vulnerabilities privately (see SECURITY.md)

### Audit Logging

For features that modify data:

```javascript
import { AuditLog } from './auditLog.js';

const auditLog = new AuditLog();
auditLog.log('DATA_UPDATED', {
    entity: 'dashboard',
    action: 'refresh',
    userId: 'system'
});
```

---

## Documentation

### When to Update Documentation

Update documentation when you:
- Add new features
- Change existing functionality
- Fix bugs that affect usage
- Modify configuration options
- Add new dependencies

### Documentation Files to Update

| Change Type | Files to Update |
|------------|-----------------|
| New feature | README.md, USER_GUIDE.md, relevant docs |
| API changes | DATA_SCHEMA.md, ARCHITECTURE_REVIEW.md |
| Configuration | README.md, DEPLOYMENT_GUIDE.md |
| Dependencies | package.json, README.md |
| Bug fixes | CHANGELOG.md |
| Security | SECURITY.md, ARCHITECTURE_REVIEW.md |

### Documentation Style

- Use clear, concise language
- Include code examples where helpful
- Add screenshots for UI features
- Use proper markdown formatting
- Keep documentation in sync with code

### JSDoc Comments

For public APIs:

```javascript
/**
 * Updates the dashboard with new data
 * 
 * @param {Object} data - Dashboard data object
 * @param {number} data.healthScore - Overall health score (0-100)
 * @param {Array<Object>} data.projects - List of projects
 * @param {Object} options - Update options
 * @param {boolean} options.forceRefresh - Force chart refresh
 * @returns {Promise<void>}
 * @throws {Error} When data is invalid
 * 
 * @example
 * await updateDashboard(data, { forceRefresh: true });
 */
async function updateDashboard(data, options = {}) {
    // Implementation
}
```

---

## Issue Reporting

### Before Creating an Issue

1. Search existing issues to avoid duplicates
2. Check the [documentation](DOCUMENTATION_INDEX.md)
3. Verify it's not already fixed in main branch

### Creating a Bug Report

Include:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: 
  1. Go to '...'
  2. Click on '...'
  3. See error
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**:
  - Browser and version
  - Operating System
  - Dashboard version
- **Console Errors**: Any JavaScript errors
- **Additional Context**: Any other relevant information

### Creating a Feature Request

Include:

- **Use Case**: Why is this feature needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other options you've considered
- **Additional Context**: Any other relevant information
- **Mockups/Examples**: If you have visual ideas

---

## Additional Resources

### Understanding the Architecture

Before contributing significant changes, review:

1. **[ARCHITECTURE_REVIEW.md](ARCHITECTURE_REVIEW.md)** - System design and patterns
2. **[EXPERT_RECOMMENDATIONS.md](EXPERT_RECOMMENDATIONS.md)** - Best practices and guidelines
3. **[DATA_SCHEMA.md](docs/DATA_SCHEMA.md)** - Data structures and API contracts

### Key Modules to Understand

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| `config.js` | Configuration management | Global settings |
| `api.js` | Backend communication | `getFullData()`, `getKPI()` |
| `state.js` | State management | `setData()`, `subscribe()` |
| `charts.js` | Visualization | `initRadarChart()`, `updateChart()` |
| `ui.js` | DOM manipulation | `updateLayer1KPI()`, `showNotification()` |
| `app.js` | Application orchestration | `init()`, event handlers |
| `security.js` | Security utilities | `escapeHtml()`, `validateUrl()` |

### Development Workflow

```
1. Pick an issue → 2. Create branch → 3. Code → 4. Test → 
5. Document → 6. Commit → 7. Push → 8. Create PR → 
9. Address feedback → 10. Merge
```

---

## Questions?

- 💬 **Discussions**: Use [GitHub Discussions](https://github.com/glen200392/Digital_Transformation_Dashboard/discussions)
- 📧 **Issues**: For bugs and features
- 📖 **Documentation**: Check [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

---

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Future CONTRIBUTORS.md file
- Release notes for significant contributions

---

Thank you for contributing to the Digital Transformation Dashboard! Your efforts help make this project better for everyone. 🙏

**Happy coding!** 🚀
