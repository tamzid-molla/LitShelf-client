import React from "react";
import CountUp from "react-countup";

const StatsCard = ({ title, value, icon: Icon, gradient, iconBg }) => {
  return (
    <div className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300`}>
      {/* Decorative circle */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-4xl font-black">
            <CountUp end={value || 0} duration={2} enableScrollSpy={true} scrollSpyOnce={true} />
          </h3>
        </div>
        <div className={`${iconBg || 'bg-white/20'} p-4 rounded-xl`}>
          <Icon className="text-4xl" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
