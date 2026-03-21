# Agent Instructions

## Project Overview

This project contains proxy configuration files for Stash (Clash) and Surge clients.

- **Stash config**: `config.yaml` (root directory) -- used by Stash (Clash-compatible) on iOS/macOS
- **Surge config**: `surge/Default.conf` -- used by Surge on iOS/macOS

## Client Protocol Support

| Protocol | Stash (config.yaml) | Surge (Default.conf) |
|----------|---------------------|----------------------|
| vless    | Yes                 | No                   |
| snell    | No                  | Yes                  |

Do NOT add snell proxies to `config.yaml`. Do NOT add vless proxies to `surge/Default.conf`.

## VPS Access

Use `az` CLI or SSH to access VPS instances. SSH hosts are configured in `~/.ssh/config`.
Proxy names in config files should align with Azure VM names.

Available hosts:

| Host | Azure VM | Region | IP | Services |
|------|----------|--------|----|----------|
| `sg-agent` | sg-agent | Southeast Asia | 20.188.112.113 | snell, sing-box (vless) |
| `sg-backup` | sg-backup | Southeast Asia | 20.198.253.47 | snell, sing-box (vless) |
| `hk-b1ls` | hk-b1ls | East Asia | 52.184.83.193 | snell, sing-box (vless) |
| `uc-c` | UC-C | West US 3 | 20.14.85.196 | snell, xray (vless) |

All snell servers run on port 43721 (v5.0.1).

SSH usage:

```bash
ssh sg-agent
ssh sg-backup
ssh hk-b1ls
ssh uc-c
```

## Surge Modules

Modules cannot be added via the config file. They must be installed through the Surge app UI (install with URL) or placed as local `.sgmodule` files in the profile directory.

Installed modules:

| Module | URL |
|--------|-----|
| Skip Proxy Lists | `https://raw.githubusercontent.com/mieqq/mieqq/master/skip-proxy-lists.sgmodule` |
| IP Info Panel | `https://raw.githubusercontent.com/cc63/Surge/main/Module/Panel/IP-info/Moore/IP-info.sgmodule` |
| Net-X Panel | `https://raw.githubusercontent.com/xream/scripts/main/surge/modules/network-info/net-lsp-x.sgmodule` |
| BiliBili ADBlock | `https://github.com/BiliUniverse/ADBlock/releases/latest/download/BiliBili.ADBlock.sgmodule` |

## Setting Up New Services on VPS

Before installing any new service on a VPS:

1. **Check Azure NSG rules first** -- verify the required port is allowed in the VM's Network Security Group.
   ```bash
   az network nsg rule list --nsg-name <NSG_NAME> --resource-group <RG> --output table
   ```
2. **Add NSG rule if needed** -- open the port with TCP protocol before installing.
   ```bash
   az network nsg rule create --nsg-name <NSG_NAME> --resource-group <RG> \
     --name <RULE_NAME> --priority <N> --access Allow --protocol TCP \
     --direction Inbound --destination-port-ranges <PORT> --output table
   ```
3. **Install the service** on the VPS via SSH.
4. **Update the config files** -- add to Surge and/or Stash config as appropriate (respect protocol support above).

### NSG Mapping

| NSG Name | Resource Group | VMs |
|----------|---------------|-----|
| sg-nsg | SEA | sg-agent, sg-backup |
| HK-C-nsg | HK_group | hk-b1ls |
| uc-c680_z1-nsg | US-C_group | uc-c |

### Snell Installation (non-interactive)

The install script from https://github.com/passeway/Snell is interactive. Use the following non-interactive method instead:

```bash
ssh <HOST> 'sudo bash -s' << 'SCRIPT'
set -e
apt-get install -y -qq unzip > /dev/null 2>&1 || true
VERSION="v5.0.1"
PORT=43721
PSK=$(openssl rand -base64 32)
URL="https://dl.nssurge.com/snell/snell-server-${VERSION}-linux-amd64.zip"
cd /tmp && wget -q "$URL" -O snell-server.zip && unzip -o snell-server.zip
chmod +x snell-server && mv snell-server /usr/local/bin/
mkdir -p /etc/snell
cat > /etc/snell/snell-server.conf << EOF
[snell-server]
listen = ::0:${PORT}
psk = ${PSK}
ipv6 = true
EOF
cat > /etc/systemd/system/snell.service << EOF
[Unit]
Description=Snell Server
After=network.target
[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/snell-server -c /etc/snell/snell-server.conf
Restart=on-failure
RestartSec=5
[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload && systemctl enable snell && systemctl start snell
echo "=== CONFIG ===" && cat /etc/snell/snell-server.conf
SCRIPT
```

## Network Troubleshooting

### speedtest-cli

Use `speedtest-cli` for CLI-based speed testing when diagnosing network issues.

```bash
# Quick test (ping, download, upload)
speedtest-cli --simple

# Full output with server info
speedtest-cli

# Test against a specific server (use --list to find server IDs)
speedtest-cli --server <ID>
```

Install: `brew install speedtest-cli`

### Diagnostic Workflow

When Surge causes slowdowns, check in this order:

1. **DNS health** -- `surge-cli dump dns --raw` -- look for entries > 500ms or with retries
2. **REJECT mismatches** -- `surge-cli dump request --raw` -- search for `policyName: REJECT` on functional domains
3. **Speedtest comparison** -- `speedtest-cli --simple` with Surge on vs off
4. **DoH server reachability** -- `curl -s -o /dev/null -w "HTTP %{http_code}, time=%{time_total}s" "https://<DoH>/dns-query?dns=..."` -- any server > 5s is broken and should be removed from `encrypted-dns-server`

## Surge Documentation

官方提供了 llms.txt，用于给 AI Agent 提供全面的 Surge 文档和知识库数据：

- URL: https://nssurge.com/llms.txt

处理 Surge 配置相关的任务时，请先获取该文件作为参考。

## Surge Mac CLI

Surge Mac 提供了 CLI 工具，路径为 `/Applications/Surge.app/Contents/Applications/surge-cli`。

常用命令：

| Command | Description |
|---------|-------------|
| `reload` | 重新加载当前配置 |
| `switch-profile <name>` | 切换到指定配置 |
| `stop` | 关闭 Surge |
| `dump active` | 显示所有活跃连接 |
| `dump request` | 显示最近的连接 |
| `dump rule` | 显示所有生效的规则 |
| `dump policy` | 显示所有代理和策略组 |
| `dump dns` | 显示 DNS 缓存 |
| `dump profile [original/effective]` | 显示原始/生效后的配置 |
| `dump event` | 显示事件 |
| `watch request` | 持续跟踪新请求 |
| `test-policy <policy>` | 测试指定代理 |
| `test-all-policies` | 测试所有代理 |
| `test-group <group>` | 立即重新测试策略组 |
| `kill <connection>` | 终止活跃连接 |
| `flush dns` | 清空 DNS 缓存 |
| `diagnostics` | 运行网络诊断 |
| `set <key> <value>` | 修改环境设置 |
| `set-log-level <level>` | 修改日志级别（不写入配置文件） |
| `script evaluate <path> [mock-script-type] [timeout]` | 加载并执行脚本 |

参数选项：

- `--raw` -- 以 JSON 格式输出结果
- `--remote/-r` -- 连接远程 Surge 实例，例如 `--remote password@192.168.2.2:6170`

使用示例：

```bash
# 重新加载配置
/Applications/Surge.app/Contents/Applications/surge-cli reload

# 查看所有代理状态
/Applications/Surge.app/Contents/Applications/surge-cli dump policy

# 测试所有代理延迟
/Applications/Surge.app/Contents/Applications/surge-cli test-all-policies

# 以 JSON 格式输出活跃连接
/Applications/Surge.app/Contents/Applications/surge-cli --raw dump active
```
