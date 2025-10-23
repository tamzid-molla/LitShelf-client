import { FaUsers, FaBook, FaStar } from 'react-icons/fa';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const TotalStates = ({ allReview, allBook, allUser }) => {
  const stats = [
    {
      icon: FaUsers,
      title: 'Total Users',
      count: allUser || 0,
      description: 'Active community members',
      gradient: 'from-bgBtn to-hoverBtn',
      bgPattern: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
      iconBg: 'bg-bgBtn',
    },
    {
      icon: FaBook,
      title: 'Total Books',
      count: allBook || 0,
      description: 'Books in library',
      gradient: 'from-bgBtn to-hoverBtn',
      bgPattern: 'radial-gradient(circle at 90% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
      iconBg: 'bg-hoverBtn',
    },
    {
      icon: FaStar,
      title: 'Total Reviews',
      count: allReview || 0,
      description: 'User ratings & feedback',
      gradient: 'from-bgBtn to-hoverBtn',
      bgPattern: 'radial-gradient(circle at 50% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)',
      iconBg: 'bg-bgBtn',
    },
  ];

  return (
    <section className="w-11/12 mx-auto bg-base-secondary dark:bg-darkBase-secondary py-20 mb-28 rounded-3xl shadow-2xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-bgBtn">
          Our Community at a Glance
        </h2>
        <p className="text-sm sm:text-[16px] text-gray-600 md:text-lg dark:text-gray-300">
          Join thousands of readers in our growing community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`relative bg-gradient-to-br ${stat.gradient} rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}
          >
            {/* Background Pattern */}
            <div
              className="absolute inset-0 bg-opacity-30 bg-black rounded-2xl"
              style={{ backgroundImage: stat.bgPattern }}
            ></div>

            {/* Decorative Circle */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

            {/* Content */}
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className={`${stat.iconBg} bg-opacity-30 backdrop-blur-sm p-4 rounded-2xl shadow-lg`}>
                  <stat.icon className="text-4xl text-white drop-shadow-lg" />
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-semibold mb-1 opacity-90">{stat.title}</h3>
                  <p className="text-5xl font-black">
                    <CountUp
                      start={0}
                      end={stat.count}
                      delay={2}
                      duration={2.5}
                      enableScrollSpy={true}
                      scrollSpyDelay={2}
                    >
                      {({ countUpRef }) => <span ref={countUpRef} />}
                    </CountUp>
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-white/20 pt-4">
                <p className="text-sm opacity-90 font-medium">{stat.description}</p>
              </div>

              {/* Progress Bar Animation */}
              <div className="mt-4 bg-white/20 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: index * 0.2 + 0.5 }}
                  className="h-full bg-white/60 rounded-full"
                ></motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TotalStates;