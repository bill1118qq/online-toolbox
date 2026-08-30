#!/bin/bash
# eitools.cn 生产部署脚本
# 背景：Vercel 项目的 GitHub 自动部署已断开（无 Git 连接）。
# 本脚本 = push 到 GitHub + CLI 部署到 Vercel 生产，一条命令完成。
# 用法：bash scripts/deploy.sh
set -e
cd "$(dirname "$0")/.."

echo "→ 推送到 GitHub ..."
git push

echo "→ 部署到 Vercel 生产环境 ..."
vercel --yes --prod

echo "✓ 部署完成: https://eitools.cn"
