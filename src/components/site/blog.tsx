import { DiscoveryQuestions } from "../discovery-questions";
import { discoveryCopy } from "@/lib/product-discovery";
import { localizeValue } from "@/components/site/localization";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "./locale";
import { ArticleView } from "./pages";
import { articleDates } from "./articles";
import { blogPosts, getBlogPost, relatedBlogPosts } from "./blog-posts";

import { ProjectLearning } from "./project-learning";

export function BlogIndex() {
  const { locale, en } = useLocale();
  return (
    <article className="article-page blog-page">
      <a className="back-link" href={`/${locale}`}>
        ← {localizeValue(en ? "Home" : "首页", locale)}
      </a>
      <span className="eyebrow">IOTA WATCH / {localizeValue(en ? "BLOG" : "博客", locale)}</span>
      <h1>{discoveryCopy.blogTitle[locale]}</h1>
      <p className="article-lead">
        {localizeValue(
          en
            ? "Practical workflows for checking several devices, understanding reward records and investigating reported training activity."
            : "多设备查看、收益记录解读与训练状态排查：从实际使用问题出发，逐步检查。",
          locale,
        )}
      </p>
      <DiscoveryQuestions />
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
              {localizeValue(en ? "Read article" : "阅读全文", locale)} →
            </a>
          </article>
        ))}
      </div>
      <ProjectLearning />
      <aside className="article-tip">
        <h2>
          {localizeValue(en ? "Looking for a specific feature?" : "需要查询具体功能？", locale)}
        </h2>
        <p>
          {localizeValue(
            en
              ? "The help library explains individual fields, data sources and storage rules."
              : "使用说明提供各个字段、数据来源与保存规则的详细定义。",
            locale,
          )}
        </p>
        <a href={`/${locale}/learn`}>
          {localizeValue(en ? "Browse guides" : "查看使用说明", locale)} →
        </a>
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
