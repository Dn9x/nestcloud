
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - Config

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

## Description

A NestCloud component for getting and watching configurations from consul kv or kubernetes configmaps.

[中文文档](https://github.com/nest-cloud/nestcloud/blob/master/docs/config.md)

## Installation

```bash
$ npm i --save @nestcloud/consul consul @nestcloud/config
```

## Quick Start

### Import Module

#### Use Consul KV As Backend

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { ConfigModule } from '@nestcloud/config';
import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT, NEST_CONSUL } from '@nestcloud/common';

@Module({
  imports: [
      ConsulModule.register({dependencies: [NEST_BOOT]}),
      BootModule.register(__dirname, 'bootstrap.yml'),
      ConfigModule.register({dependencies: [NEST_BOOT, NEST_CONSUL]})
  ],
})
export class ApplicationModule {}
```

#### Use Kubernetes As Backend

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestcloud/config';
import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT, NEST_KUBERNETES } from '@nestcloud/common';

@Module({
  imports: [
      BootModule.register(__dirname, 'bootstrap.yml'),
      ConfigModule.register({dependencies: [NEST_BOOT, NEST_KUBERNETES]})
  ],
})
export class ApplicationModule {}
```

### Configurations

You should specific `config.key` for consul kv or 
specific `config.key`, `config.namespace`, `config.path` for kubernetes configMap.

```yaml
consul:
  host: localhost
  port: 8500
  service: 
    id: null
    name: example-service
config:
  key: nestcloud-conf
  namespace: default
  path: config.yaml
```

#### Configurations In Consul KV

```yaml
user:
  info:
    name: 'test'
```

#### Configurations In Kubernetes ConfigMap

```yaml
apiVersion: v1
data:
  config.yaml: |-
    user:
      info:
        name: 'test'

kind: ConfigMap
metadata:
  name: nestcloud-conf
  namespace: default

```

#### Inject Config Client

```typescript
import { Injectable } from '@nestjs/common';
import { InjectConfig, Config } from '@nestcloud/config';

@Injectable()
export class TestService {
  constructor(
      @InjectConfig() private readonly config: Config
  ) {}

  getUserInfo() {
      const userInfo = this.config.get('user.info', {name: 'judi'});
      console.log(userInfo);
  }
}
```

#### Inject value

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigValue } from '@nestcloud/config';

@Injectable()
export class TestService {
  @ConfigValue('user.info', {name: 'judi'})
  private readonly userInfo;

  getUserInfo() {
      return this.userInfo;
  }
}
```

## API

### class ConfigModule

#### static register\(options\): DynamicModule

Register consul config module.

| field | type | description |
| :--- | :--- | :--- |
| options.dependencies | string[] | NEST_BOOT, NEST_CONSUL, NEST_KUBERNETES |
| options.key | key of the consul kv or name of the kubernetes configMap |
| options.namespace | the kubernetes namespace |
| options.path | the path of the kubernetes configMap |

### class Config

#### get\(path?: string, defaults?: any\): any

Get configuration from consul kv.

| field | type | description |
| :--- | :--- | :--- |
| path | string | the path of the configuration |
| defaults | any | default value if the specific configuration is not exist |

#### getKey\(\): string

Get the current key.

#### watch\(path: string, callback: \(configs: any\) =&gt; void\): void

Watch the configurations.

| field | type | description |
| :--- | :--- | :--- |
| callback | \(configs\) =&gt; void | callback function |

#### async set\(path: string, value: any\): void

Update configuration.

| field | type | description |
| :--- | :--- | :--- |
| path | string | the path of the configuration |
| value | any | the configuration |


### Decorators

#### ConfigValue\(path?: string, defaultValue?: any\): PropertyDecorator

Inject configuration to attribute. It will change realtime when the value changed in consul kv.

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
