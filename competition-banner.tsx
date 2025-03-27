import React from 'react';
import { Trophy, Calendar, MapPin, Phone } from 'lucide-react';

const CompetitionBanner = () => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-xl shadow-2xl overflow-hidden max-w-md mx-auto transform transition-all hover:scale-105">
      <div className="relative">
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          11 days left
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-extrabold mb-4 text-center uppercase tracking-wider">
            Sports Competition
          </h1>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-4">
              <Trophy className="text-yellow-300" size={32} />
              <div>
                <p className="font-semibold">Cash Prize</p>
                <p className="text-xl font-bold text-yellow-200">Exciting Rewards Await!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Calendar className="text-green-300" size={32} />
              <div>
                <p className="font-semibold">Event Date</p>
                <p>April 6, 2025 | 09:05 - 17:05</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <MapPin className="text-red-300" size={32} />
              <div>
                <p className="font-semibold">Venue</p>
                <p>Indra College, Erode</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Phone className="text-cyan-300" size={32} />
              <div>
                <p className="font-semibold">Contact</p>
                <p>+91 9999999999</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors">
              Download Brochure
            </button>
            <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors">
              Register Now
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white/10 py-2 text-center text-sm">
        Eligibility: Open to All
      </div>
    </div>
  );
};

export default CompetitionBanner;
