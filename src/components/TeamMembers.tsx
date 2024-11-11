import React from 'react';
import { teamMembers } from '../data/teamMembers';
import { Phone, Mail, Building2 } from 'lucide-react';

export default function TeamMembers() {
  const departments = [...new Set(teamMembers.filter(m => m.role === 'member').map(m => m.department))];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Members</h2>
      
      {departments.map(department => (
        <div key={department} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-gray-500" />
            {department}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers
              .filter(member => member.department === department && member.role === 'member')
              .map(member => (
                <div
                  key={member.id}
                  className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{member.name}</h4>
                      <div className="mt-2 space-y-1">
                        <a
                          href={`mailto:${member.email}`}
                          className="text-sm text-gray-600 hover:text-blue-600 flex items-center"
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          {member.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}