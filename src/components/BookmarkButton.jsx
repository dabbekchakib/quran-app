import { memo } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useBookmark } from '../context/BookmarkContext';

const BookmarkButton = memo(({ surah, ayah, text }) => {
  const { isBookmarked, toggleBookmark } = useBookmark();
  const bookmarked = isBookmarked(surah, ayah);

  return (
    <button
      onClick={() => toggleBookmark(surah, ayah, text)}
      className={`p-2 rounded-lg transition-all duration-200 ${
        bookmarked
          ? 'text-amber-400 hover:text-amber-300 bg-amber-500/10'
          : 'text-slate-400 hover:text-amber-400 hover:bg-slate-700/50'
      }`}
      aria-label={bookmarked ? 'إزالة من المحفوظات' : 'إضافة إلى المحفوظات'}
      title={bookmarked ? 'إزالة من المحفوظات' : 'إضافة إلى المحفوظات'}
    >
      {bookmarked ? <FaBookmark size={14} /> : <FaRegBookmark size={14} />}
    </button>
  );
});

BookmarkButton.displayName = 'BookmarkButton';

export default BookmarkButton;
