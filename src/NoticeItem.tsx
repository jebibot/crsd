import { Bj, Notice } from "./types";
import { getRelativeTime } from "./utils";

type NoticeProps = { bj: Bj; notice: Notice };

export default function NoticeItem({ bj, notice }: NoticeProps) {
  return (
    <div key={bj.name} className={`rounded-md p-2 ${bj.bgColor}`}>
      <div className="flex items-center">
        <img
          className="w-12 h-12 rounded-full m-2 object-cover"
          src={`https://profile.img.afreecatv.com/LOGO/${bj.bjId.slice(0, 2)}/${
            bj.bjId
          }/${bj.bjId}.jpg`}
          alt={bj.name}
        ></img>
        <span className={`text-2xl font-bold ${bj.textColor}`}>{bj.name}</span>
        {notice && (
          <a
            className="text-gray-500 ml-2"
            href={`https://bj.afreecatv.com/${bj.bjId}/post/${notice.no}`}
            target="_blank"
            rel="noopener noreferrer"
            title={notice.date.toLocaleString()}
          >
            {getRelativeTime(notice.date)}
          </a>
        )}
      </div>
      {notice && (
        <div className="p-1">
          <span className="font-bold">{notice.title}</span>{" "}
          {notice.summary.trim()}
        </div>
      )}
    </div>
  );
}
