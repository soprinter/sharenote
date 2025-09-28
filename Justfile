# Simple task runner for Sharenote Landing (Astro)

set shell := ["bash", "-cu"]

# Use npm by default; override with env var or `just PM=pnpm dev`
PM := env_var_or_default('PM', 'npm')

_ensure-install:
	if [ ! -d node_modules ]; then echo "Installing dependencies with {{PM}}..."; {{PM}} install; fi

images:
	{{PM}} run images:build

# Start the development server
dev: _ensure-install
	ASTRO_TELEMETRY_DISABLED=1 {{PM}} run dev

# Build for production
build: _ensure-install
	ASTRO_TELEMETRY_DISABLED=1 {{PM}} run build

# Preview the production build locally
preview: _ensure-install
	ASTRO_TELEMETRY_DISABLED=1 {{PM}} run preview

# Optionally persistently disable telemetry for the user machine
telemetry-disable: _ensure-install
	{{PM}} run astro telemetry disable
