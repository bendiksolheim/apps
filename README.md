# apps

## Usage

```sh
apps --help
```

## Configuration

Needs two different config files:

### `apps.json`

Resides in either your home folder or `~/.config/apps`. Contains a path to the actual config.

```json
{
  "config": "~/path/to/real/config.json",
  "home": "~/path/to/folder/with/apps/"
}
```

### The actual config

This is the config for all your apps.

```json
{
  "global": {
    "env": {
      "MY_ENV": "value"
    }
  },
  "apps": [
    {
      "name": "MyApp",
      "id": "my-app",
      "dependencies": ["my-other-app"],
      "docker": {
        "name": "org-my-app",
        "ports": [8080],
        "image": "java:latest",
        "cmd": "java -jar app.jar",
        "path": "myapp/target"
      }
    }
  ]
}
```
