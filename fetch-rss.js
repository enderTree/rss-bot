const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');

// 创建RSS解析器实例
const parser = new Parser();

// 读取RSS源配置
function loadRssSources() {
  try {
    const configPath = path.join(__dirname, 'rss-sources.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('读取RSS源配置失败:', error);
    process.exit(1);
  }
}

// 获取单个RSS源的内容
async function fetchRssFeed(source) {
  try {
    console.log(`正在获取RSS源: ${source.name}`);
    const feed = await parser.parseURL(source.url);

    // 转换为统一格式
    const items = feed.items.map(item => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || new Date().toISOString(),
      content: item.content || item.contentSnippet || '',
      author: item.author || '',
      categories: item.categories || [],
      source: source.name,
      sourceUrl: source.url
    }));

    return {
      source: source.name,
      url: source.url,
      lastUpdated: new Date().toISOString(),
      items: items
    };
  } catch (error) {
    console.error(`获取RSS源 ${source.name} 失败:`, error.message);
    return {
      source: source.name,
      url: source.url,
      error: error.message,
      lastUpdated: new Date().toISOString(),
      items: []
    };
  }
}

// 获取所有RSS源的内容
async function fetchAllRssFeeds() {
  const sources = loadRssSources();
  const results = [];

  for (const source of sources) {
    const result = await fetchRssFeed(source);
    results.push(result);
  }

  return results;
}

// 保存结果到JSON文件
function saveToJsonFile(data) {
  try {
    const outputPath = path.join(__dirname, 'rss-data.json');
    const jsonData = {
      lastUpdated: new Date().toISOString(),
      totalSources: data.length,
      sources: data
    };

    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
    console.log(`RSS数据已保存到: ${outputPath}`);

    // 同时创建一个按时间排序的合并版本
    const allItems = data
      .filter(source => !source.error && source.items && source.items.length > 0)
      .flatMap(source => source.items)
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    const mergedPath = path.join(__dirname, 'rss-merged.json');
    const mergedData = {
      lastUpdated: new Date().toISOString(),
      totalItems: allItems.length,
      items: allItems
    };

    fs.writeFileSync(mergedPath, JSON.stringify(mergedData, null, 2));
    console.log(`合并后的RSS数据已保存到: ${mergedPath}`);

  } catch (error) {
    console.error('保存JSON文件失败:', error);
    process.exit(1);
  }
}

// 主函数
async function main() {
  try {
    console.log('开始抓取RSS数据...');
    const rssData = await fetchAllRssFeeds();
    saveToJsonFile(rssData);
    console.log('RSS数据抓取完成!');
  } catch (error) {
    console.error('RSS抓取过程中发生错误:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本，则执行主函数
if (require.main === module) {
  main();
}

module.exports = {
  fetchRssFeed,
  fetchAllRssFeeds,
  saveToJsonFile
};