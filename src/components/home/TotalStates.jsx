import { FaUsers, FaBook, FaStar } from 'react-icons/fa';
import CountUp from 'react-countup';

const TotalStates = ({ allReview, allBook, allUser }) => {
  return (
    <section className='w-11/12 mx-auto bg-base-secondary dark:bg-darkBase-secondary py-16 mb-28 rounded-2xl'>
      <h2 className='text-4xl font-bold text-center mb-6'>
        Our Community at a Glance
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto">
        {/* Users Card */}
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-opacity-30 bg-black rounded-2xl" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)' }}></div>
          <div className="relative flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <FaUsers className="text-3xl text-bgBtn" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-3xl font-bold">
                <CountUp start={0} end={allUser || 0} delay={2} duration={2} enableScrollSpy={true} scrollSpyDelay={2} >
                {({ countUpRef }) => <span ref={countUpRef} />}
            </CountUp> 
              </p>
            </div>
          </div>
          <div className="mt-4 text-sm opacity-80">Active community members</div>
        </div>

        {/* Books Card */}
        <div className="relative bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-opacity-30 bg-black rounded-2xl" style={{ backgroundImage: 'radial-gradient(circle at 90% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)' }}></div>
          <div className="relative flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <FaBook className="text-3xl text-bgBtn" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Books</h3>
              <p className="text-3xl font-bold">
                <CountUp start={0} end={allBook} delay={2} duration={2} enableScrollSpy={true} scrollSpyDelay={2} >
                {({ countUpRef }) => <span ref={countUpRef} />}
            </CountUp> 
              </p>
            </div>
          </div>
          <div className="mt-4 text-sm opacity-80">Books in library</div>
        </div>

        {/* Reviews Card */}
        <div className="relative bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-opacity-30 bg-black rounded-2xl" style={{ backgroundImage: 'radial-gradient(circle at 50% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)' }}></div>
          <div className="relative flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <FaStar className="text-3xl text-bgBtn" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Reviews</h3>
              <p className="text-3xl font-bold">
                <CountUp start={0} end={allReview} delay={2} duration={2} enableScrollSpy={true} scrollSpyDelay={2} >
                {({ countUpRef }) => <span ref={countUpRef} />}
            </CountUp> 
              </p>
            </div>
          </div>
          <div className="mt-4 text-sm opacity-80">User ratings & feedback</div>
        </div>
      </div>
    </section>
  );
};

export default TotalStates;