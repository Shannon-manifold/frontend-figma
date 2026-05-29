import { motion } from 'motion/react';
import { Calendar, Clock, User, ArrowRight, Loader2, Edit3 } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Link } from 'react-router';
import { blogService } from '../services/blogService';
import { useState, useEffect } from 'react';

const weierstrassPortraitUrl =
  'https://commons.wikimedia.org/wiki/Special:FilePath/Karl_Weierstrass.jpg?width=900';

export function BlogPage() {
  const [blogList, setBlogList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getBlogs();
        if (Array.isArray(data)) {
          setBlogList(data);
        }
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const displayPosts = blogList;

  return (
    <div className="min-h-screen">
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-[300px_1fr] gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm"
            >
              <ImageWithFallback
                src={weierstrassPortraitUrl}
                alt="Karl Weierstrass portrait"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <blockquote className="border-l-4 border-indigo-500 pl-6 mb-8">
                <p className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-snug">
                  시인의 기질을 갖추지 못한 자는
                  <br />
                  결코 진정한 수학자가 될 수 없다.
                </p>
                <p className="mt-4 text-sm text-gray-400 italic leading-relaxed">
                  ... es ist wahr, ein Mathematiker, der nicht etwas Poet ist, wird nimmer ein vollkommener Mathematiker sein.
                </p>
              </blockquote>

              <div className="border-t border-gray-200 pt-5">
                <div className="font-semibold text-gray-900 mb-0.5">카를 바이어슈트라스</div>
                <div className="text-sm text-gray-500">Karl Weierstrass</div>
                <div className="text-sm text-indigo-600 mt-1">해석학의 아버지 · 1815–1897</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl font-semibold text-gray-900">블로그</h2>
              <span className="text-sm text-gray-500">{displayPosts.length}개 포스트</span>
            </div>
            <Link to="/blog/write">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                글 작성하기
              </motion.button>
            </Link>
          </div>

          {loading && blogList.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayPosts.map((post, index) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="block">
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                    whileHover={{ y: -6 }}
                    className="group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200 h-full"
                  >
                    <div className="relative h-44 overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={post.image || 'https://via.placeholder.com/400x200'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 bg-white/95 rounded text-xs font-medium text-gray-700">
                          {post.category || 'General'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className="text-base font-semibold mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{post.excerpt || post.summary}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <div className="flex items-center gap-1"><User className="w-3 h-3" /><span>{post.author || post.authorName}</span></div>
                          <div className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>{post.readTime || '5분'}</span></div>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
                          읽기 <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors font-medium"
            >
              더 많은 포스트 보기
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}
