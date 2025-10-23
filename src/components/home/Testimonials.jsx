import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Book Enthusiast',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      text: 'LitShelf has completely transformed my reading experience. The collection is vast and the community is incredibly supportive!',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Literature Professor',
      avatar: 'https://i.pravatar.cc/150?img=13',
      rating: 5,
      text: 'An exceptional platform for book lovers. The organization and ease of finding new books is outstanding.',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Avid Reader',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      text: 'I love how easy it is to discover new books and connect with other readers who share my interests.',
    },
  ];

  return (
    <section className="w-11/12 mx-auto my-28">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black mb-4 text-bgBtn">
          What Our Readers Say
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Hear from our amazing community of book lovers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ y: -8 }}
            className="relative bg-base-secondary dark:bg-darkBase-secondary rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-bgBtn/10 to-hoverBtn/10 rounded-full -mr-16 -mt-16"></div>
            <FaQuoteLeft className="absolute top-6 right-6 text-4xl text-bgBtn/20" />

            {/* Content */}
            <div className="relative">
              {/* Avatar and Info */}
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-bgBtn/20"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                "{testimonial.text}"
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
