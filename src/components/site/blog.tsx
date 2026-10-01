import { ArrowUpRight } from "lucide-react";
import { useLocale } from "./locale";
import { ArticleView } from "./pages";
import { articleDates } from "./articles";
import { blogPosts, getBlogPost, relatedBlogPosts } from "./blog-posts";

export function BlogIndex() {
  const { locale, en } = useLocale();
  return (
    <article className="article-page blog-page">
      <a className="back-link" href={`/${locale}`}>
        ← {en ? "Home" : "首页"}
      </a>
      <span className="eyebrow">IOTA WATCH / {en ? "BLOG" : "博客"}</span>
      <h1>{en ? "IOTA Train at Home monitoring blog" : "IOTA Train at Home 监控博客"}</h1>
      <p className="article-lead">
        {en
          ? "Practical workflows for checking several devices, understanding reward records and investigating reported training activity."
          : "多设备查看、收益记录解读与训练状态排查：从实际使用问题出发，逐步检查。"}
      </p>
      <div className="blog-grid">
        {blogPosts.map((post) => (
          <article key={post.slug}>
            <div className="blog-card-meta">
              <span>{post.topic[locale]}</span>
              <time dateTime={articleDates(post).published}>{articleDates(post).published}</time>
            </div>
            <h2>
              <a href={`/${locale}/blog/${post.slug}`}>
                {post.title[locale]} <ArrowUpRight size={18} />
              </a>
            </h2>
            <p>{post.description[locale]}</p>
            <a className="blog-read" href={`/${locale}/blog/${post.slug}`}>
              {en ? "Read article" : "阅读全文"} →
            </a>
          </article>
        ))}
      </div>
      <aside className="article-tip">
        <h2>{en ? "Looking for a specific feature?" : "需要查询具体功能？"}</h2>
        <p>
          {en
            ? "The help library explains individual fields, data sources and storage rules."
            : "使用说明提供各个字段、数据来源与保存规则的详细定义。"}
        </p>
        <a href={`/${locale}/learn`}>{en ? "Browse guides" : "查看使用说明"} →</a>
      </aside>
    </article>
  );
}

export function BlogArticle({ slug }: { slug: string }) {
  const article = getBlogPost(slug);
  return article ? (
    <ArticleView article={article} section="blog" related={relatedBlogPosts(slug)} />
  ) : null;
}
