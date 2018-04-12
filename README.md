# Akkeris Memcached CLI Plugin

Adds ability to flush cache and get statistics from memcached instances on Akkeris.

## Installation

```bash
aka plugins:install memcached
```

## Usage

Flush a memcached attached to an app:

```bash
aka memcached:flush -a [appname-space]
```

Pull statistics related to a memcached:

```bash
aka memcached:stats -a [appname-space]
```
