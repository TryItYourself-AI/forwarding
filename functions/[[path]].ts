interface Env {
  DEFAULT_TARGET?: string;
  [key: string]: string | undefined;
}

/**
 * 多域名转发配置
 * 
 * 环境变量格式：
 * - DEFAULT_TARGET = "default.com"         默认目标域名
 * - FROM_example_com = "target.com"        example.com -> target.com
 * - FROM_www_example_com = "target.com"    www.example.com -> target.com
 * 
 * 注意：域名中的点号(.)和连字符(-)需要替换为下划线(_)
 * 例如：www.my-site.com -> FROM_www_my_site_com
 */

function getTargetDomain(env: Env, sourceHost: string): string | null {
  // 将来源域名转换为环境变量键名格式
  // 点号和连字符都替换为下划线
  const envKey = `FROM_${sourceHost.replace(/[.\-]/g, '_')}`;
  
  // 优先匹配精确域名配置
  if (env[envKey]) {
    return env[envKey] as string;
  }
  
  // 回退到默认目标
  if (env.DEFAULT_TARGET) {
    return env.DEFAULT_TARGET;
  }
  
  return null;
}

function cleanDomain(domain: string): string {
  return domain
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const sourceHost = url.host;
  
  // 获取目标域名
  const targetDomain = getTargetDomain(env, sourceHost);
  
  if (!targetDomain) {
    return new Response(
      `Error: No forwarding rule configured for "${sourceHost}" and no DEFAULT_TARGET set.`,
      { status: 500, headers: { 'Content-Type': 'text/plain' } }
    );
  }
  
  // 清理目标域名格式
  const cleanedTarget = cleanDomain(targetDomain);
  
  // 构建目标 URL：https + 目标域名 + 原始路径 + 查询参数
  const targetUrl = `https://${cleanedTarget}${url.pathname}${url.search}`;
  
  return Response.redirect(targetUrl, 301);
};
