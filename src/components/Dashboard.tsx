// Update the view state type in Dashboard.tsx
const [view, setView] = useState<'daily' | 'monthly' | 'yearly'>('daily');

// Add these buttons to the navigation section
<button 
  onClick={() => {
    setView('monthly');
    setShowTeamMembers(false);
  }}
  className={`flex items-center space-x-2 px-4 py-2 rounded-lg w-full ${
    view === 'monthly' && !showTeamMembers ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
  }`}
>
  <Calendar className="h-5 w-5" />
  <span>Monthly View</span>
</button>

<button 
  onClick={() => {
    setView('yearly');
    setShowTeamMembers(false);
  }}
  className={`flex items-center space-x-2 px-4 py-2 rounded-lg w-full ${
    view === 'yearly' && !showTeamMembers ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
  }`}
>
  <BarChart2 className="h-5 w-5" />
  <span>Yearly View</span>
</button>