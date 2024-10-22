import { CiStar } from "react-icons/ci";
import { FaPen } from "react-icons/fa";
import { FaBookBookmark,FaUserClock } from "react-icons/fa6";

interface BookCardProps {
  image: string;
  title: string;
  description: string;
  author: string;
  createdTime: string;
  updatedTime: string;
}

const BookCard: React.FC<BookCardProps> = ({ image, title, description, createdTime, updatedTime,author }) => {
  return (
    <div className="max-w-96 bg-white border border-gray-200 rounded-lg hover:shadow-lg group cursor-pointer">
      <div>
        <div className="relative">
          <img className="rounded-t-lg w-full h-48 object-cover" src={image} alt={title} />
          <div className="absolute bottom-0 left-0 p-2 z-10"><FaBookBookmark size={40} className="text-white" /></div>
          <div className="absolute inset-0 bg-blue-700 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-t-lg"></div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-center">
          <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        </div>
        <p className="mb-3 text-sm font-normal opacity-70 dark:text-gray-400">
          {description}
        </p>
        <div className="flex flex-col text-sm opacity-65 gap-1 mt-10">
          <span className="flex items-center gap-2"><CiStar /> {createdTime}</span>
          <span className="flex items-center gap-2"><FaPen size={10} /> {updatedTime}</span>
          <span className="flex items-center gap-2"><FaUserClock size={13} /> {author}</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
