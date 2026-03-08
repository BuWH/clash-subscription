# Project Instructions

See [AGENT.md](../AGENT.md) for project context and VPS access details.

## Rule Ordering Principle

Ad blocking rule lists (e.g. `Advertising_Domain.list`, Loyalsoldier `reject.txt`) are aggressive and frequently misclassify functional domains (P2P acceleration, CDN streams, playback APIs) as ads. This breaks video playback and live streaming.

**Always place service-specific whitelists BEFORE ad blocking rules.** Use blackmatrix7 platform rule sets (`RULE-SET`) rather than manually whitelisting individual domains. Rule sets auto-update and cover all known service domains.

Current rule order (both Surge and Stash):

1. Streaming/video service whitelists (TencentVideo, HuYa, Douyu, BiliBili, etc.)
2. Ad blocking (REJECT)
3. Everything else (Crypto, AI, Apple, Proxy, China, GEOIP, FINAL)

### Diagnosing "blocked by ad rules" Issues

When a Chinese service has playback/connectivity issues in rule-based mode but works in direct mode:

1. Use `surge-cli dump request --raw` to find connections with `policy: REJECT` and `rule: DOMAIN-SET Advertising_Domain.list`
2. Identify the affected service
3. Add the corresponding blackmatrix7 rule set BEFORE the REJECT rules
4. Available rule sets: https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/Surge

### Adding New Service Whitelists

**Surge:** Add `RULE-SET,<url>,DIRECT` before the REJECT line in `surge/Default.conf`.

**Stash:** Add a `rule-providers` entry using script.hub to convert the Surge list, then add `RULE-SET,<name>,DIRECT` before the REJECT rules in `config.yaml`. Use `stash-domain-set` target for domain-only lists, `stash-rule-set` for lists with IP-CIDR or other rule types.
