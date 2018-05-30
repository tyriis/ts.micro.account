# (virtual bank) account microservice

### setup

this microservice uses [hemerajs](https://hemerajs.github.io/hemera/)

to start the service a running [NATS](https://nats.io) instance is required


NATS configuration is passed to the service via environment variables:

<dl>
  <dt>NATS_URL</dt>
  <dd>the nats server url f.e. <em>nats://127.0.0.1:4222</em></dd>

  <dt>NATS_USER</dt>
  <dd>the NATS server user if credentials are required else just do not set it</dd>

  <dt>NATS_PW</dt>
  <dd>the NATS server password if creadentials are reuired else just do not set it</dd>
</dl>
