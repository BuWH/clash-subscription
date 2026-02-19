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
