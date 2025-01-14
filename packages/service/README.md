
[travis-image]: https://api.travis-ci.org/nest-cloud/nestcloud.svg?branch=master
[travis-url]: https://travis-ci.org/nest-cloud/nestcloud
[linux-image]: https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux
[linux-url]: https://travis-ci.org/nest-cloud/nestcloud

# NestCloud - Service

<p align="center">
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/v/@nestcloud/core.svg" alt="NPM Version"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/l/@nestcloud/core.svg" alt="Package License"/></a>
    <a href="https://www.npmjs.com/~nestcloud" target="_blank"><img src="https://img.shields.io/npm/dm/@nestcloud/core.svg" alt="NPM Downloads"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://travis-ci.org/nest-cloud/nestcloud.svg?branch=master" alt="Travis"/></a>
    <a href="https://travis-ci.org/nest-cloud/nestcloud" target="_blank"><img src="https://img.shields.io/travis/nest-cloud/nestcloud/master.svg?label=linux" alt="Linux"/></a>
    <a href="https://coveralls.io/github/nest-cloud/nestcloud?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nest-cloud/nestcloud/badge.svg?branch=master" alt="Coverage"/></a>
</p>

## Description

A NestCloud component for service registration and service discovery.

[中文文档](https://github.com/nest-cloud/nestcloud/blob/master/docs/consul-service.md)

## Installation

```bash
$ npm i --save @nestcloud/service @nestcloud/consul consul
```

## Quick Start

### Import Module

```typescript
import { Module } from '@nestjs/common';
import { ConsulModule } from '@nestcloud/consul';
import { ServiceModule } from '@nestcloud/service';
import { BootModule } from '@nestcloud/boot';
import { NEST_BOOT } from '@nestcloud/common';

@Module({
  imports: [
      ConsulModule.register({dependencies: [NEST_BOOT]}),
      BootModule.register(__dirname, 'bootstrap.yml'),
      ServiceModule.register({dependencies: [NEST_BOOT]}),
  ],
})
export class ApplicationModule {}
```

### Configurations

```yaml
consul:
  host: localhost
  port: 8500
  discoveryHost: localhost
  service:
    id: your-service-id
    name: your-service-name
    port: 3000
    tags: ['v1.0.1']
  healthCheck:
    timeout: 1s
    interval: 10s
    route: /health
  # when register / deregister the service to consul fail, it will retry five times.
  maxRetry: 5
  retryInterval: 5000
```

## Usage

```typescript
import { Injectable } from '@nestjs/common';
import { InjectService, Service } from '@nestcloud/service';

@Injectable()
export class TestService {
  constructor(@InjectService() private readonly service: Service) {}

  getServiceNodes() {
      const nodes = this.service.getServiceNodes('user-service', {passing: true});
      this.service.watch('user-service', nodes => {
          console.log(nodes);
      });
      console.log(nodes);
  }
}
```

## Checks

### Script + Interval

```yaml
consul:
  healthCheck:
    timeout: 1s
    interval: 10s
    script: /root/script/check.sh
```

### Http + Interval

```yaml
consul:
  healthCheck:
    timeout: 1s
    interval: 10s
    protocol: http
    route: /health
```

### Tcp + Interval

```yaml
consul:
  healthCheck:
    timeout: 1s
    interval: 10s
    tcp: localhost:3000
```

### Time To Live

```yaml
consul:
  healthCheck:
    ttl: 60s
```

### Docker + Interval

```yaml
consul:
  healthCheck:
    dockerContainerId: 2ddd99fd268c
```

## API

### class ServiceModule

#### static register\(options: RegisterOptions\): DynamicModule

Import nest consul service module.

| field | type | description |
| :--- | :--- | :--- |
| options.dependencies | string[] | if you are using @nestcloud/boot module, please set [NEST_BOOT] |
| options.service.id | string | the service id |
| options.service.name | string | the service name |
| options.service.port | number | the service port, if not set, it will use random port |
| options.service.tags | number | the service tags |
| options.service.includes | string[] | sync services from consul, if not set, it will sync all services |
| options.consul.discoveryHost | string | the discovery ip |
| options.consul.healthCheck.timeout | number | the health check timeout, default 1s |
| options.consul.healthCheck.interval | number | the health check interval，default 10s |
| options.consul.healthCheck.deregisterCriticalServiceAfter | string | timeout after which to automatically deregister service if check remains in critical state | 
| options.consul.healthCheck.protocol | string | https or http, default is http. | 
| options.consul.healthCheck.tcp | string | host:port to test, passes if connection is established, fails otherwise. | 
| options.consul.healthCheck.script | string | path to check script, requires interval. | 
| options.consul.healthCheck.dockerContainerId | string | Docker container ID to run script. | 
| options.consul.healthCheck.shell | string | shell in which to run script (currently only supported with Docker). | 
| options.consul.healthCheck.ttl | string | time to live before check must be updated, instead of http/tcp/script and interval (ex: 60s). | 
| options.consul.healthCheck.notes | string | human readable description of check. | 
| options.consul.healthCheck.status | string | initial service status. | 
| options.consul.healthCheck.route | string | the health check url, default is /health. | 
| options.consul.maxRetry | number | the max retry count when register service fail |
| options.consul.retryInterval | number | the retry interval when register service fail |

### class Service

#### getServices\(\): ServiceNode[]

Get all services with nodes.

#### getServiceNames\(\): string[]

Get all service names

#### watch(service: string, callback: (nodes: IServiceNode[]) => void): void

watch service nodes change

#### watchServiceList(callback: (services: string[]) => void): void

watch service name list change

## Stay in touch

- Author - [NestCloud](https://github.com/nest-cloud)

## License

  NestCloud is [MIT licensed](LICENSE).
