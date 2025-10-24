# RSS Bot

这是一个使用GitHub Actions定时抓取RSS源并生成JSON文件的项目。

## 功能特点

- 定时抓取多个RSS源的内容
- 将RSS数据转换为JSON格式
- 生成两种JSON文件：
  - `rss-data.json`: 按RSS源分类的数据
  - `rss-merged.json`: 按时间排序的合并数据
- 支持手动触发和自动定时执行

## 项目结构

```
rss-bot/
├── .github/
│   └── workflows/
│       └── rss-fetcher.yml  # GitHub Actions工作流配置
├── fetch-rss.js             # RSS抓取脚本
├── rss-sources.json         # RSS源配置文件
├── package.json             # 项目依赖配置
└── README.md                # 项目说明文档
```

## 使用方法

### 1. 克隆仓库

```bash
git clone https://github.com/wangdaodao/rss-bot.git
cd rss-bot
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置RSS源

编辑 `rss-sources.json` 文件，添加或修改你想要抓取的RSS源：

```json
[
  {
    "name": "RSS源名称",
    "url": "RSS源的URL",
    "description": "RSS源的描述"
  }
]
```

### 4. 本地测试

```bash
npm start
```

### 5. 推送到GitHub

将代码推送到GitHub后，GitHub Actions会自动每小时运行一次RSS抓取任务。

## GitHub Actions配置

GitHub Actions工作流配置文件位于 `.github/workflows/rss-fetcher.yml`，默认设置为每天运行一次（UTC时间）。

你也可以通过以下方式修改运行频率：

1. 编辑 `.github/workflows/rss-fetcher.yml` 文件
2. 修改 `cron` 表达式，例如：
   - `0 */6 * * *`: 每6小时运行一次
   - `0 0 * * *`: 每天午夜运行一次
   - `0 0 * * 0`: 每周日午夜运行一次

## 输出文件

### rss-data.json

按RSS源分类的数据，格式如下：

```json
{
  "lastUpdated": "2023-01-01T00:00:00.000Z",
  "totalSources": 5,
  "sources": [
    {
      "source": "RSS源名称",
      "url": "RSS源的URL",
      "lastUpdated": "2023-01-01T00:00:00.000Z",
      "items": [
        {
          "title": "文章标题",
          "link": "文章链接",
          "pubDate": "发布日期",
          "content": "文章内容",
          "author": "作者",
          "categories": ["分类1", "分类2"],
          "source": "RSS源名称",
          "sourceUrl": "RSS源的URL"
        }
      ]
    }
  ]
}
```

### rss-merged.json

按时间排序的合并数据，格式如下：

```json
{
  "lastUpdated": "2023-01-01T00:00:00.000Z",
  "totalItems": 50,
  "items": [
    {
      "title": "文章标题",
      "link": "文章链接",
      "pubDate": "发布日期",
      "content": "文章内容",
      "author": "作者",
      "categories": ["分类1", "分类2"],
      "source": "RSS源名称",
      "sourceUrl": "RSS源的URL"
    }
  ]
}
```

## 如何使用

你可以直接使用 `rss-merged.json` 文件，它包含了所有RSS源的合并数据。

例如，你可以使用以下URL获取json数据：

https://raw.githubusercontent.com/wangdaodao/rss-bot/main/rss-merged.json

https://raw.githubusercontent.com/wangdaodao/rss-bot/main/rss-data.json

## 许可证

MIT License