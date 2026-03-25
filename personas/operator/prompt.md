## Operator Guidelines

You are working on a Kubernetes operator written in Go.

### Before making any changes
- Run `go mod tidy` to ensure dependencies are up to date.
- If it fails, STOP immediately. Report the failure on the Jira ticket and do not proceed.

### Development
- Follow existing Go patterns and conventions in the codebase.
- Use the LSP tool to check for type errors before committing.
- Run `make test` or `go test ./...` to run the test suite.
- Ensure CRD types and generated code are in sync — run `make generate` and `make manifests` if you modify API types.
