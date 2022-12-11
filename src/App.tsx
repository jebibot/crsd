import { useEffect, useState } from "react";
import NoticeItem from "./NoticeItem";
import VideoItem from "./VideoItem";
import { Bj, Channel, Notice, Video } from "./types";
import crescendoLogo from "./logo/crescendo.svg";
import moyoBanner from "./banner/moyo.webp";
import elseaBanner from "./banner/elsea.webp";
import pyowooBanner from "./banner/pyowoo.webp";
import hananaBanner from "./banner/hanana.webp";
import hiyoBanner from "./banner/hiyo.webp";

const MEMBERS: (Channel | Bj)[] = [
  {
    name: "크레센도",
    textColor: "text-rose-500",
    youtubeHandle: "cr1108",
    youtubeId: "UCGgIZLso_nKBThRcQVJSE5Q",
  },
  {
    name: "모요",
    bgColor: "bg-lime-100",
    textColor: "text-lime-500",
    youtubeHandle: "M0Y020",
    youtubeId: "UCXFiD5eQqN3VWsKV4Jsqh6w",
    bjId: "duvl123",
    noticeBoard: "90707682",
    banner: moyoBanner,
  },
  {
    name: "엘시",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-500",
    youtubeHandle: "MusiaElsea",
    youtubeId: "UCEMupHQqQ6UQfkyuunaAM-Q",
    bjId: "elisehs",
    noticeBoard: "90251393",
    banner: elseaBanner,
  },
  {
    name: "표우",
    bgColor: "bg-zinc-100",
    textColor: "text-zinc-500",
    youtubeHandle: "user-pm4sl3vq6o",
    youtubeId: "UC9fLfv-36m6L-h20Ef89UxQ",
    bjId: "pyowoo",
    noticeBoard: "90297468",
    banner: pyowooBanner,
  },
  {
    name: "하나나",
    bgColor: "bg-pink-100",
    textColor: "text-pink-500",
    youtubeHandle: "hanana777",
    youtubeId: "UCi3BnqSK4DPzRj8szUeLIQA",
    bjId: "17282486",
    noticeBoard: "90073318",
    banner: hananaBanner,
  },
  {
    name: "하이요",
    bgColor: "bg-sky-100",
    textColor: "text-sky-500",
    youtubeHandle: "hi_yo",
    youtubeId: "UChWrFUrthv30VN9GJrGjv3w",
    bjId: "song1218",
    noticeBoard: "89836105",
    banner: hiyoBanner,
  },
];

function App() {
  const [streams, setStreams] = useState<{ [bjId: string]: Video }>({});
  const [notices, setNotices] = useState<{ [bjId: string]: Notice }>({});
  const [videos, setVideos] = useState<{ [url: string]: Video }>({});

  useEffect(() => {
    const abortController = new AbortController();
    const fetchOptions = {
      keepalive: true,
      signal: abortController.signal,
    };

    for (const m of MEMBERS) {
      fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${m.youtubeId.replace(
          "UC",
          "UU"
        )}&maxResults=3&fields=items%2Fsnippet(publishedAt%2Ctitle%2Cthumbnails%2Fmedium%2Furl%2CresourceId%2FvideoId)&key=${
          process.env.REACT_APP_YOUTUBE_API_KEY
        }`,
        fetchOptions
      )
        .then((r) => r.json())
        .then((r) => {
          if (r.items?.length) {
            setVideos((v) => {
              const result: { [key: string]: Video } = {};
              for (const i of r.items) {
                result[i.snippet.resourceId.videoId] = {
                  type: "youtube",
                  title: i.snippet.title,
                  thumbnail: i.snippet.thumbnails.medium.url,
                  date: new Date(i.snippet.publishedAt),
                  url: `https://www.youtube.com/watch?v=${i.snippet.resourceId.videoId}`,
                  uploader: m,
                };
              }
              return {
                ...v,
                ...result,
              };
            });
          }
        });

      if (!("bjId" in m)) {
        continue;
      }
      fetch(
        `https://bjapi.afreecatv.com/api/${m.bjId}/board/${m.noticeBoard}?page=1&per_page=1&field=title%2Ccontents&keyword=&type=post&months=`,
        fetchOptions
      )
        .then((r) => r.json())
        .then((r) => {
          if (r.data?.length) {
            const notice = r.data[0];
            setNotices((n) => ({
              ...n,
              [m.bjId]: {
                no: notice.title_no,
                title: notice.title_name,
                date: new Date(`${notice.reg_date.replace(" ", "T")}+09:00`),
                summary: notice.content.summary,
              },
            }));
          }
        });

      fetch(`https://bjapi.afreecatv.com/api/${m.bjId}/station`, fetchOptions)
        .then((r) => r.json())
        .then((r) => {
          if (r.broad) {
            setStreams((b) => ({
              ...b,
              [m.bjId]: {
                type: "live",
                title: r.broad.broad_title,
                thumbnail: `https://liveimg.afreecatv.com/h/${
                  r.broad.broad_no
                }.webp?${new Date().valueOf()}`,
                date: new Date(),
                url: `https://play.afreecatv.com/${m.bjId}/${r.broad.broad_no}`,
                mobileUrl: `afreeca://player/live?user_id=${m.bjId}&broad_no=${r.broad.broad_no}`,
                uploader: m,
              },
            }));
          }
        });

      fetch(
        `https://bjapi.afreecatv.com/api/${m.bjId}/vods/review?page=1&per_page=3&orderby=reg_date&field=title%2Ccontents&created=false&catchCreated=true&keyword=&months=`,
        fetchOptions
      )
        .then((r) => r.json())
        .then((r) => {
          if (r.data?.length) {
            setVideos((v) => {
              const result: { [key: string]: Video } = {};
              for (const i of r.data) {
                result[i.title_no] = {
                  type: "afreeca",
                  title: i.title_name,
                  thumbnail: i.ucc.thumb,
                  date: new Date(`${i.reg_date.replace(" ", "T")}+09:00`),
                  url: `https://vod.afreecatv.com/player/${i.title_no}`,

                  mobileUrl: `afreeca://player/video?station_no=${i.station_no}&bbs_no=${i.bbs_no}&title_no=${i.title_no}&type=REVIEW`,
                  uploader: m,
                };
              }
              return {
                ...v,
                ...result,
              };
            });
          }
        });
    }
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <a
          className="flex items-center justify-center"
          href="https://cafe.naver.com/cr1108"
          target="_blank"
          rel="noopener noreferrer"
          title="크레센도 공식 팬카페"
        >
          <img
            className="w-40 h-40"
            src={crescendoLogo}
            alt="크레센도 로고"
          ></img>
        </a>
        {MEMBERS.map(
          (m) =>
            "bjId" in m && (
              <NoticeItem
                key={m.bjId}
                bj={m}
                notice={notices[m.bjId]}
              ></NoticeItem>
            )
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {MEMBERS.map(
          (m) =>
            "bjId" in m && (
              <VideoItem
                key={m.bjId}
                uploader={m}
                video={streams[m.bjId]}
              ></VideoItem>
            )
        )}
        {Object.values(videos)
          .sort((v1, v2) => v2.date.valueOf() - v1.date.valueOf())
          .map((v) => (
            <VideoItem key={v.url} uploader={v.uploader} video={v}></VideoItem>
          ))}
      </div>
    </div>
  );
}

export default App;
