package executor

import (
	"fmt"
	"os"
	"strings"
)

type VertexPolicy struct {
	allowed map[string]bool
}

func NewVertexPolicy(models []string) *VertexPolicy {
	p := &VertexPolicy{allowed: make(map[string]bool, len(models))}
	for _, m := range models {
		m = strings.TrimSpace(m)
		if m != "" {
			p.allowed[m] = true
		}
	}
	return p
}

// VertexPolicyFromEnv reads VERTEX_ALLOWED_MODELS (comma-separated).
// Returns nil if the env var is empty — caller must provide models.
func VertexPolicyFromEnv() *VertexPolicy {
	env := os.Getenv("VERTEX_ALLOWED_MODELS")
	if env == "" {
		return nil
	}
	return NewVertexPolicy(strings.Split(env, ","))
}

func (p *VertexPolicy) Check(model string) error {
	if !p.allowed[model] {
		return fmt.Errorf("model not allowed: %s", model)
	}
	return nil
}

// ExtractModel parses a Vertex AI URL path like
// /v1/projects/P/locations/L/publishers/anthropic/models/MODEL:METHOD
// and returns the model name and method.
func ExtractModel(path string) (model, method string, err error) {
	const marker = "/models/"
	idx := strings.Index(path, marker)
	if idx < 0 {
		return "", "", fmt.Errorf("no /models/ segment in path")
	}
	tail := path[idx+len(marker):]
	colon := strings.IndexByte(tail, ':')
	if colon < 0 {
		return "", "", fmt.Errorf("no :method separator in model segment")
	}
	return tail[:colon], tail[colon+1:], nil
}
