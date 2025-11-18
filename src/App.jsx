import './App.css';
// import './index.css'


import React, { useState, useEffect, useMemo } from 'react';
import companiesData from './data/companies.json';

function App() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // NOTE: Changed searchItem back to searchTerm for consistency if you followed the previous guide, but searchItem is fine too.
  const [searchTerm, setSearchTerm] = useState(''); 
  const [locationFilter, setLocationFilter] = useState('All');
  const [sortCriteria, setSortCriteria] = useState('nameAsc');

  useEffect(() => {
    setTimeout(() => {
      try {
        setCompanies(companiesData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load company data.");
        setLoading(false);
      }
    }, 1000);
  }, []);

  // --- Rendering Loading/Error States (Before filtering/display) ---
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Loading companies...</h1>
        <p>This shows the required loading state.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        <h1>Error: {error}</h1>
      </div>
    );
  }

  const uniqueLocations = [...new Set(companies.map(c => c.location))];

  // --- FILTERING & SORTING LOGIC ---
  const filteredAndSortedCompanies = useMemo(() => {
    let list = companies;

    // 1. Filtering by Search Term
    if (searchTerm) {
      list = list.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // *** REMOVED THE INVALID LINE: value={searchItem} ***

    // 2. Filtering by Location
    if (locationFilter !== 'All') {
      list = list.filter(company => company.location === locationFilter)
    }

    // 3. Sorting
    const sortedList = list.slice().sort((a, b) => {
      switch (sortCriteria) {
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        case 'employeesDesc':
          return b.employees - a.employees;
        case 'employeesAsc':
          return a.employees - b.employees;
        default:
          return 0;
      }
    });
    return sortedList;
  }, [companies, searchTerm, locationFilter, sortCriteria]); // Dependencies

  return (
    <div className='container' style={{ backgroundColor:'white', border: '2px solid blue'}}>
      <h1>🏢 Companies Directory </h1>
      
      {/* --- Filter & Sort Controls --- */}
      <div className='filter-controls' style={{
        marginBottom: '20px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        
        {/* Search Input */}
        <input 
          type="text"
          placeholder="Search by Company name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', flexGrow: 1 }}
        />
        
        {/* Location Filter */}
        <select 
          value={locationFilter} 
          onChange={(e) => setLocationFilter(e.target.value)}
          style={{ padding: '8px' }}>
          <option value="All">Filter by Location (All)</option>
          {uniqueLocations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
        
        {/* Sort Controls */}
        <select 
          value={sortCriteria} 
          onChange={(e) => setSortCriteria(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="nameAsc">Sort By: Name (A-Z)</option>
          <option value="nameDesc">Sort By: Name (Z-A)</option>
          <option value="employeesDesc">Sort By: Employees (High to Low)</option>
          <option value="employeesAsc">Sort By: Employees (Low to High)</option> 
        </select>
      </div>
      
      <p>Showing <b>{filteredAndSortedCompanies.length}</b> company(s) out of {companies.length} total.</p>
      
    {  /* --- Company List Display --- */}
      <div className='companyList' style={{ marginTop: '20px' }}>
        {filteredAndSortedCompanies.map(company => (
          <div key={company.id} className='company-card' style={{
            border: '1px solid #ccc',
            padding: '15px',
            margin: '10px 0',
            borderRadius: '5px'
          }}>
            <h2>{company.name}</h2>
            <p><strong>Industry:</strong> {company.industry}</p>
            <p><strong>Location:</strong> {company.location}</p>
            <p><strong>Employees:</strong> {company.employees}</p>
          </div>
        ))}
        
        {/* Handle No Results Case */}
        {filteredAndSortedCompanies.length === 0 && (
          <p style={{ gridColumn: '1/-1', textAlign: 'center'}}>
            No Companies match your current filters.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;