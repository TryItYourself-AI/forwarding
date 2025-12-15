interface Env {
  TARGET_DOMAIN: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  // 检查环境变量是否配置
  if (!env.TARGET_DOMAIN) {
    return new Response(
      'Error: TARGET_DOMAIN environment variable is not configured.',
      { status: 500, headers: { 'Content-Type': 'text/plain' } }
    );
  }

  const url = new URL(request.url);
  
  // 移除目标域名中可能存在的协议前缀和尾部斜杠
  const targetDomain = env.TARGET_DOMAIN
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
  
  // 构建目标 URL：https + 目标域名 + 原始路径 + 查询参数
  // 注意：hash 片段不会发送到服务器，浏览器会在重定向时自动保留
  const targetUrl = `https://${targetDomain}${url.pathname}${url.search}`;
  
  return Response.redirect(targetUrl, 301);
};
