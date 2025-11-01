# Security Best Practices Implementation
# /metlife-TEN-Hackathon/SECURITY.md

## Secret Management Implementation

### 1. Pre-commit Secret Detection Setup

**Installation:**
```bash
pip install pre-commit detect-secrets
```

**Configuration (.pre-commit-config.yaml):**
```yaml
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.5.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
        exclude: .*\.lock|.*\.log|.*\.pyc|node_modules/.*
```

**Activation:**
```bash
detect-secrets scan > .secrets.baseline
pre-commit install
```

### 2. Environment Variables Required

Create `.env` file (never commit):
```bash
# Google Cloud / Dialogflow
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
DIALOGFLOW_PROJECT_ID=your_project_id
DIALOGFLOW_AGENT_ID=your_agent_id

# Google Cloud Speech
GOOGLE_CLOUD_PROJECT=your_project_id

# Node.js Backend
NODE_ENV=development
PORT=3001
JWT_SECRET=your_jwt_secret

# React Frontend
REACT_APP_API_URL=http://localhost:3001

# Database (if needed)
DATABASE_URL=your_database_url
```

### 3. Pre-commit Workflow

Every commit automatically:
1. Scans for secrets using detect-secrets
2. Blocks commit if new secrets found
3. Updates `.secrets.baseline` for allowed patterns

**Manual scan:**
```bash
pre-commit run --all-files
```

### 4. Team Guidelines

- Never commit `.env` files or service account JSON keys
- Use environment variables for all credentials
- Run `pre-commit install` after cloning
- Review `.secrets.baseline` changes carefully
- Rotate any accidentally exposed keys immediately
- Store Google Cloud credentials outside repository
- Use `.gitignore` to exclude sensitive files

### 5. Google Cloud Security

- Use service accounts with minimum required permissions
- Enable Cloud Audit Logs
- Rotate service account keys regularly
- Use Secret Manager for production credentials
- Enable VPC Service Controls for sensitive data

## Verification
```bash
$ pre-commit run --all-files
Detect secrets...........................................................Passed
```

All secrets protected with pre-commit hooks active.
