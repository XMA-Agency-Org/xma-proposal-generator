type HeroMediaProps = {
  url: string;
  type: "video" | "image";
  alt?: string;
  className?: string;
};

function getVideoEmbedUrl(url: string): string | null {
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=0&muted=1&loop=1`;

  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=0&mute=1&loop=1&playlist=${youtubeMatch[1]}`;

  return null;
}

export function HeroMedia({ url, type, alt = "", className }: HeroMediaProps) {
  if (type === "image") {
    return (
      <img
        src={url}
        alt={alt}
        className={className ?? "w-full h-full object-cover"}
      />
    );
  }

  const embedUrl = getVideoEmbedUrl(url);

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        className={className ?? "w-full h-full"}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video
      src={url}
      className={className ?? "w-full h-full object-cover"}
      controls
      playsInline
      preload="metadata"
    />
  );
}
