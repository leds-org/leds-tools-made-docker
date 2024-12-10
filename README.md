# MADE Report Docker Tool

Docker container for generating MADE reports from specified directories.

## Quick Start

```bash
docker pull ghcr.io/leds-conectafapes/leds-tools-made-docker:main
```

## Configuration

1. Create a `directories.json` file:
```json
[
  {
    "path": "./example/",
    "webhook": "xxxxx"
  }
]
```

2. Create a `docker-compose.yml`:
```yaml
version: '3.8'
services:
  made-report:
    image: ghcr.io/leds-conectafapes/leds-tools-made-docker:main
    environment:
      JSON_FILE_PATH: /app/config/directories.json
    volumes:
      - ./config:/app/config
      - /path/to/your/files:/host
```

## Usage

1. Start the container:
```bash
docker-compose up
```

2. The tool will:
   - Read paths from your JSON file
   - Map them to container paths
   - Generate reports for each directory

## Volume Mapping

- `/app/config`: Configuration directory containing your JSON file
- `/host`: Base directory for your source files

## Environment Variables

- `JSON_FILE_PATH`: Path to your directories configuration file inside container

## Example Structure

```
.
├── config/
│   └── directories.json
└── docker-compose.yml
```

## Notes

- Paths in `directories.json` should be relative to the `/host` mount point
- Ensure proper read/write permissions on mounted volumes