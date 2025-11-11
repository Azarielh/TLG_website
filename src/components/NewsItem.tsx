import { Component, Show } from "solid-js";

export interface NewsItemData {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created: string;
  updated: string;
  author?: string;
  imageUrl?: string;
}

interface NewsItemProps {
  news: NewsItemData;
}

const NewsItem: Component<NewsItemProps> = (props) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <article class="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 shadow-lg hover:translate-y-[-4px] transition-all duration-300 hover:border-yellow-400/50">
      <Show when={props.news.imageUrl}>
        <div class="w-full h-48 mb-4 rounded-lg overflow-hidden">
          <img
            src={props.news.imageUrl}
            alt={props.news.title}
            class="w-full h-full object-cover"
          />
        </div>
      </Show>

      <Show when={props.news.tags && props.news.tags.length > 0}>
        <div class="flex flex-wrap gap-2 mb-3">
          {props.news.tags.map((tag) => (
            <span class="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
              {tag}
            </span>
          ))}
        </div>
      </Show>

      <h3 class="text-2xl font-bold mb-3 text-white">{props.news.title}</h3>

      <p class="text-gray-300 leading-relaxed mb-4 whitespace-pre-line">
        {props.news.content}
      </p>

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-4 border-t border-gray-700/50 text-sm text-gray-400">
        <Show when={props.news.author}>
          <span class="font-medium">Par {props.news.author}</span>
        </Show>
        <time datetime={props.news.created}>
          {formatDate(props.news.created)}
        </time>
      </div>
    </article>
  );
};

export default NewsItem;
