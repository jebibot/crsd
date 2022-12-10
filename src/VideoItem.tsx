import { Bj, Channel, Video } from "./types";
import { getRelativeTime, isAndroid, isIos } from "./utils";
import afeecaLogo from "./logo/afreeca.svg";
import afeecaGrayLogo from "./logo/afreeca-gray.svg";
import youtubeLogo from "./logo/youtube.svg";

type VideoProps = { uploader: Bj | Channel; video?: Video };

export default function VideoItem({ uploader, video }: VideoProps) {
  let url: string;
  let mobileUrl: string | undefined;
  let thumbnail;
  let title = "";
  let date;
  let icon;
  let isLive = false;
  if (video != null) {
    url = video.url;
    mobileUrl = video.mobileUrl;
    thumbnail = video.thumbnail;
    title = video.title;
    date = video.date;
    icon = video.type === "youtube" ? youtubeLogo : afeecaLogo;
    isLive = video.type === "live";
  } else if ("bjId" in uploader) {
    url = `https://bj.afreecatv.com/${uploader.bjId}`;
    thumbnail = uploader.banner;
    icon = afeecaGrayLogo;
  } else {
    return null;
  }

  return (
    <a
      className="flex flex-row sm:flex-col items-start"
      href={url}
      onClick={
        mobileUrl && (isAndroid || isIos)
          ? (e) => {
              e.preventDefault();
              window.location.href = mobileUrl as string;
              setTimeout(() => {
                if (isIos || document.hasFocus()) {
                  window.location.href = url;
                }
              }, 100);
            }
          : undefined
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        className="w-3/5 sm:w-full object-cover aspect-video rounded-lg"
        src={thumbnail}
        alt={title}
      ></img>
      <div className="w-2/5 sm:w-full flex flex-col-reverse justify-between p-1.5 gap-1 break-all">
        <div>
          <img
            className="w-5 h-5 mr-1 inline-block"
            src={icon}
            alt={icon === youtubeLogo ? "유튜브" : "아프리카TV"}
          ></img>
          <span className={`font-bold break-keep ${uploader.textColor}`}>
            {uploader.name}
          </span>{" "}
          <span
            className={`text-sm whitespace-nowrap text-gray-500`}
            title={!isLive ? date?.toLocaleString() : undefined}
          >
            {isLive ? "LIVE" : getRelativeTime(date)}
          </span>
        </div>
        {title}
      </div>
    </a>
  );
}
