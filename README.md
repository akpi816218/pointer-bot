# Pointer

A self-hostable Discord bot implementing a very simple per-guild point system.

## Building

Don't. Use the prebuilt Docker image.

## Deploying

Get a Discord bot token and client ID, and a Deno KV connection endpoint URL and access token (read-write).

**Failing to set a `DENO_KV_URL` environment variable will cause it to write data locally inside the container, which won't be persisted!**

```sh
$ docker pull akpi816218/pointer-bot:latest
$ docker run -d
		-e DISCORD_TOKEN=your_discord_token
		-e DISCORD_CLIENT_ID=your_discord_client_id
		-e DENO_KV_URL=your_kv_endpoint
		-e DENO_KV_ACCESS_TOKEN=your_kv_token
		akpi816218/pointer-bot:latest
```

## Contributions

All contributions are welcome!
