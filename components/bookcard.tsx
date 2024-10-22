import { CiStar } from "react-icons/ci";
import { FaPen } from "react-icons/fa";
import { FaBookBookmark, FaUserClock } from "react-icons/fa6";
import clsx from 'clsx';
import {vi} from "date-fns/locale"
import { formatDistanceToNow } from 'date-fns';

interface BookCardProps {
  image: string;
  title: string;
  description: string;
  author: string;
  createdTime: string;
  updatedTime: string;
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({
  image,
  title,
  description,
  createdTime,
  updatedTime,
  author,
  className,
}) => {
  return (
    <div className={clsx("", className)}>
      <div className="max-w-96 min-w-72 h-96 bg-white border border-gray-200 rounded-lg hover:shadow-lg group cursor-pointer">
        <div>
          <div className="relative">
            <img className="rounded-t-lg w-full h-48 object-cover" src={image} alt={title} />
            <div className="absolute bottom-0 left-0 p-2 z-10">
              <FaBookBookmark size={40} className="text-white" />
            </div>
            <div className="absolute inset-0 bg-blue-700 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-t-lg"></div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-center">
            <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h5>
          </div>
          <p className="mb-3 text-sm font-normal opacity-70 dark:text-gray-400 line-clamp-2 max-w-80 pr-5 min-w-72 text-justify">
            {description}
          </p>
          <div className="flex flex-col text-sm opacity-65 gap-1 justify-center">
            <div className="flex items-center gap-2">
              <CiStar />
              <span>{formatDistanceToNow(new Date(createdTime), { addSuffix: true,locale:vi })}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaPen size={10} />
              <span>{formatDistanceToNow(new Date(updatedTime), { addSuffix: true,locale:vi })}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUserClock size={13} />
              <span className="">{author}</span>
            </div>
          </div>

        </div>
      </div>
    </div>

  );
};

export default BookCard;
